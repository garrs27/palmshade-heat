import { MISSIONS } from './config.js';

export function stageShot(name, game) {
  const player = game.player;
  player.x = 980;
  player.y = 620;
  player.aim = 0;
  game.camera = { x: player.x, y: player.y };
  game.mission.index = name === 'mission' ? 1 : 0;
  game.mission.elapsed = 21;
  game.mission.complete = false;
  game.wanted = name === 'chase' ? 3 : 0;
  game.police.length = 0;
  player.car = name === 'chase'
    ? { x: player.x, y: player.y, a: 0, speed: 146, color: '#d64d45' }
    : null;

  if (name === 'chase') {
    // Frame three cruisers behind the player and angled toward the getaway car.
    const positions = [[-145, -55], [-155, 0], [-145, 55]];
    for (const [offsetX, offsetY] of positions) {
      const x = player.x + offsetX;
      const y = player.y + offsetY;
      game.police.push({ x, y, a: Math.atan2(player.y - y, player.x - x), speed: 141, police: true });
    }
  }

  if (name === 'foot') {
    game.cars.slice(0, 2).forEach((car, index) => {
      car.x = 930 + index * 90;
      car.y = 620;
      car.ai = false;
      car.speed = 0;
    });
    game.people.slice(0, 8).forEach((person, index) => {
      person.x = 900 + index * 22;
      person.y = 570 + (index % 3) * 35;
      person.down = 0;
    });
  }

  game.target = MISSIONS[game.mission.index];
  game.screen = name === 'title' ? 'title' : 'play';
  game.money = 1280;
  game.earned = 1280;
  game.toast = '';
  return game;
}
