import { MISSIONS } from './config.js';
import { createRandom } from './random.js';
import { createWorld } from './world.js';
import { createTraffic, drive, updateTraffic } from './traffic.js';
import { createPeople, createPolice, updatePeople, updatePolice } from './entities.js';
import { missionState, advanceMission } from './missions.js';
import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { tone, mute } from './audio.js';

const query = new URLSearchParams(location.search);
const seed = Number.parseInt(query.get('seed') || '1', 10) || 1;
const worldRandom = createRandom(seed);
const canvas = document.querySelector('#game');
const input = createInput(canvas);
const render = createRenderer(canvas);
const world = createWorld(worldRandom);
let saved = null;
try {
  saved = JSON.parse(localStorage.getItem('palmshade-save'));
} catch {
  saved = null;
}

const game = {
  world,
  player: { name: 'Rae Solis', x: 980, y: 620, a: 0, aim: 0, car: null },
  camera: { x: 980, y: 620 },
  cars: createTraffic(worldRandom),
  people: createPeople(worldRandom, world),
  police: createPolice(),
  wanted: 0,
  crimeFreeTime: 0,
  health: 100,
  money: 0,
  earned: 0,
  mission: missionState(),
  target: MISSIONS[0],
  time: 0,
  toast: '',
  screen: 'title',
  hasSave: Boolean(saved),
  attackCooldown: 0,
  attack: false,
  catchTime: 0,
  muted: false
};

function commitCrime(amount = 1) {
  game.wanted = Math.min(5, game.wanted + amount);
  game.crimeFreeTime = 0;
}

function saveGame() {
  try {
    localStorage.setItem('palmshade-save', JSON.stringify({
      money: game.money,
      earned: game.earned,
      index: game.mission.index,
      x: game.player.x,
      y: game.player.y
    }));
    game.toast = 'Saved';
    game.hasSave = true;
  } catch {
    game.toast = 'Save unavailable';
  }
}

function startGame(continueStory = false) {
  if (continueStory && saved) {
    game.money = saved.money;
    game.earned = saved.earned;
    game.mission = missionState(saved.index);
    game.player.x = saved.x;
    game.player.y = saved.y;
  } else {
    game.money = 0;
    game.earned = 0;
    game.mission = missionState();
    game.player.x = 980;
    game.player.y = 620;
  }
  game.player.car = null;
  game.target = MISSIONS[game.mission.index] || null;
  game.screen = 'play';
  game.crimeFreeTime = 0;
}

const shotName = query.get('shot');
if (shotName) {
  stageShot(shotName, game);
  let paintedFrames = 0;
  const paintShot = () => {
    render(game, game.screen);
    paintedFrames++;
    if (paintedFrames < 3) requestAnimationFrame(paintShot);
    else window.__shotReady = true;
  };
  requestAnimationFrame(paintShot);
} else {
  let previousFrame = performance.now();
  function gameLoop(now) {
    const delta = Math.min(0.05, (now - previousFrame) / 1000);
    previousFrame = now;
    game.time += delta;
    const pressed = (code) => input.was(code);

    if (game.screen === 'title') {
      if (pressed('Enter') || pressed('Space') || input.mouse.down) startGame(false);
      if (pressed('KeyC')) startGame(true);
    } else if (game.screen === 'paused') {
      if (pressed('Escape') || pressed('KeyP') || pressed('Enter')) game.screen = 'play';
    } else if (game.screen === 'wasted' || game.screen === 'busted') {
      if (pressed('Enter')) startGame(false);
    } else if (game.screen === 'play') {
      updateGame(delta, pressed);
    }

    render(game, game.screen);
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

function updateGame(delta, pressed) {
  const player = game.player;
  if (pressed('Escape') || pressed('KeyP')) {
    game.screen = 'paused';
    return;
  }
  if (pressed('KeyM')) {
    game.muted = !game.muted;
    mute(game.muted);
  }
  if (pressed('F2')) saveGame();

  updatePlayer(delta, pressed);
  updateTraffic(game.cars, delta);
  updatePolice(game.police, delta, player, game.wanted);
  updateWanted(delta);
  updateCapture(delta);
  updateMission(delta);
  updateCamera(delta);
  if (game.health <= 0) game.screen = 'wasted';
}

function updatePlayer(delta, pressed) {
  const player = game.player;
  if (player.car) {
    updateDrivingPlayer(delta, pressed);
  } else {
    updateWalkingPlayer(delta, pressed);
  }
  game.attackCooldown = Math.max(0, game.attackCooldown - delta);
}

function updateDrivingPlayer(delta, pressed) {
  const player = game.player;
  const car = player.car;
  if (pressed('KeyE')) {
    // Put the player beside the car and return the stopped vehicle to traffic.
    player.x = car.x + Math.cos(car.a + Math.PI / 2) * 34;
    player.y = car.y + Math.sin(car.a + Math.PI / 2) * 34;
    world.clamp(player);
    car.ai = false;
    car.speed = 0;
    car.parked = true;
    game.cars.push(car);
    player.car = null;
    return;
  }

  drive(car, delta, input);
  player.x = car.x;
  player.y = car.y;
  if (world.collides(player.x, player.y, 18)) {
    game.health -= delta * 20;
    tone('thud');
    car.speed *= -0.3;
  }
  if (Math.abs(car.speed) > 180 && Math.random() < delta * 0.1) commitCrime();
}

function updateWalkingPlayer(delta, pressed) {
  const player = game.player;
  const horizontal = Number(input.keys.has('KeyD') || input.keys.has('ArrowRight')) - Number(input.keys.has('KeyA') || input.keys.has('ArrowLeft'));
  const vertical = Number(input.keys.has('KeyS') || input.keys.has('ArrowDown')) - Number(input.keys.has('KeyW') || input.keys.has('ArrowUp'));
  const movementLength = Math.hypot(horizontal, vertical) || 1;
  player.aim = Math.atan2(input.mouse.y - 360, input.mouse.x - 640);
  const nextX = player.x + horizontal / movementLength * 150 * delta;
  const nextY = player.y + vertical / movementLength * 150 * delta;
  if (!world.collides(nextX, nextY)) {
    player.x = nextX;
    player.y = nextY;
  }
  world.clamp(player);

  if (pressed('KeyE')) enterNearestCar();
  updatePeople(game.people, delta, player, { hit: false });
  if ((pressed('KeyF') || input.mouse.down) && game.attackCooldown === 0) attackNearbyPerson();
}

function enterNearestCar() {
  const player = game.player;
  let nearestCar = null;
  let nearestDistance = 50;
  for (const car of game.cars) {
    const distance = Math.hypot(car.x - player.x, car.y - player.y);
    if (distance < nearestDistance) {
      nearestCar = car;
      nearestDistance = distance;
    }
  }
  if (!nearestCar) return;
  player.car = nearestCar;
  game.cars.splice(game.cars.indexOf(nearestCar), 1);
  if (!nearestCar.parked) commitCrime();
  nearestCar.ai = false;
}

function attackNearbyPerson() {
  game.attackCooldown = 0.4;
  game.attack = true;
  tone('thud');
  commitCrime();
  const target = game.people.find((person) =>
    person.down === 0 && Math.hypot(person.x - game.player.x, person.y - game.player.y) < 62
  );
  if (target) target.down = 8;
  game.attack = false;
}

function updateWanted(delta) {
  if (game.wanted === 0) return;
  game.crimeFreeTime += delta;
  if (game.crimeFreeTime >= 18) {
    game.wanted = Math.max(0, game.wanted - 1);
    game.crimeFreeTime = 0;
    tone('siren');
  }
}

function updateCapture(delta) {
  const player = game.player;
  const nearbyPolice = game.police.filter((car) => Math.hypot(car.x - player.x, car.y - player.y) < (player.car ? 55 : 25));
  const canCatchOnFoot = !player.car && nearbyPolice.length > 0;
  const canCatchInCar = player.car && nearbyPolice.length >= 2 && Math.abs(player.car.speed) < 4;
  if (canCatchOnFoot || canCatchInCar) {
    game.catchTime += delta;
    const limit = player.car ? 3 : 1.8;
    if (game.catchTime > limit) {
      game.money = Math.max(0, game.money - 150);
      game.screen = 'busted';
      player.x = 260;
      player.y = 260;
      player.car = null;
    }
  } else {
    game.catchTime = 0;
  }
}

function updateMission(delta) {
  const mission = MISSIONS[game.mission.index];
  game.target = mission || null;
  if (!mission) return;
  game.mission.elapsed += delta;
  if (mission.timer && game.mission.elapsed > mission.timer) game.health -= 0.1;
  const distance = Math.hypot(game.player.x - mission.x, game.player.y - mission.y);
  const complete = mission.fight
    ? game.people.filter((person) => person.kind === 'trouble' && person.down > 0).length >= 3
    : mission.getaway
      ? game.wanted >= 2 && distance < 80
      : distance < 85;
  if (!complete) return;

  game.money += mission.reward;
  game.earned += mission.reward;
  advanceMission(game.mission);
  game.target = MISSIONS[game.mission.index] || null;
  saveGame();
  tone('success');
  game.toast = `Mission complete  +$${mission.reward}`;
  setTimeout(() => { game.toast = ''; }, 2200);
}

function updateCamera(delta) {
  const follow = Math.min(1, delta * 5);
  game.camera.x += (game.player.x - game.camera.x) * follow;
  game.camera.y += (game.player.y - game.camera.y) * follow;
}
