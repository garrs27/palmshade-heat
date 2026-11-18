import { ROADS, W, H, COLORS, MISSIONS } from './config.js';
import { minimap } from './minimap.js';

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  return function draw(game, screen) {
    context.fillStyle = COLORS.water;
    context.fillRect(0, 0, 1280, 720);
    context.save();
    context.translate(640 - game.camera.x, 360 - game.camera.y);
    drawGround(context);
    drawRoads(context);
    drawBuildings(context, game.world.buildings);
    drawPalms(context, game.world.palms);
    drawPeople(context, game.people);
    drawCars(context, game.cars, game.police, game.player.car);
    drawPlayer(context, game.player);
    drawTarget(context, game.target, game.time);
    context.restore();
    drawHud(context, game);
    drawOverlay(context, game, screen);
  };
}

function drawGround(context) {
  context.fillStyle = COLORS.sand;
  context.fillRect(0, 0, W - 135, H);
  context.fillStyle = '#d8c28e';
  context.fillRect(W - 135, 0, 15, H);
  context.fillStyle = '#86bcb0';
  context.fillRect(W - 120, 0, 120, H);
}

function drawRoads(context) {
  for (const road of ROADS) {
    context.fillStyle = COLORS.road;
    context.fillRect(road - 39, 0, 78, H);
    context.fillRect(0, road - 39, W, 78);
    context.strokeStyle = '#d5c493';
    context.setLineDash([18, 18]);
    context.beginPath();
    context.moveTo(road, 0);
    context.lineTo(road, H);
    context.moveTo(0, road);
    context.lineTo(W, road);
    context.stroke();
  }
  context.setLineDash([]);
}

function drawBuildings(context, buildings) {
  for (const building of buildings) {
    context.fillStyle = '#a85e48';
    context.fillRect(building.x + 7, building.y + 10, building.w, building.h);
    context.fillStyle = building.color;
    context.fillRect(building.x, building.y, building.w, building.h);
    context.fillStyle = '#f6d291';
    context.fillRect(building.x + 12, building.y + 12, building.w - 24, 12);
    context.fillStyle = '#65a6a5';
    for (let windowX = building.x + 22; windowX < building.x + building.w - 18; windowX += 45) {
      for (let windowY = building.y + 45; windowY < building.y + building.h - 12; windowY += 55) {
        context.fillRect(windowX, windowY, 20, 20);
      }
    }
  }
}

function drawPalms(context, palms) {
  for (const palm of palms) {
    context.fillStyle = '#81583c';
    context.fillRect(palm.x - 4, palm.y - 24, 8, 42);
    context.fillStyle = '#397351';
    for (let frond = 0; frond < 6; frond++) {
      context.beginPath();
      context.ellipse(palm.x + Math.cos(frond) * 19, palm.y - 27 + Math.sin(frond) * 12, 22, 5, frond, 0, Math.PI * 2);
      context.fill();
    }
  }
}

function drawPeople(context, people) {
  for (const person of people) {
    context.save();
    context.translate(person.x, person.y);
    if (person.down > 0) {
      // A knocked down person remains visible as a dim, horizontal silhouette.
      context.rotate(person.a);
      context.fillStyle = person.kind === 'trouble' ? '#784640' : '#9c927c';
      context.beginPath();
      context.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
      continue;
    }
    context.fillStyle = person.kind === 'trouble' ? '#ad453b' : '#f4e5bf';
    context.beginPath();
    context.arc(0, 0, 9, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

function drawCars(context, cars, police, playerCar) {
  const visibleCars = [...cars, ...police, playerCar].filter(Boolean);
  for (const car of visibleCars) {
    context.save();
    context.translate(car.x, car.y);
    context.rotate(car.a);
    context.fillStyle = car.police ? '#f1eee3' : car.color;
    context.fillRect(-22, -12, 44, 24);
    context.fillStyle = car.police ? '#283e49' : '#547e83';
    context.fillRect(-7, -9, 15, 18);
    if (car.police) {
      context.fillStyle = '#d9413c';
      context.fillRect(-4, -14, 8, 4);
    }
    context.restore();
  }
}

function drawPlayer(context, player) {
  if (player.car) return;
  context.fillStyle = '#f5e2ba';
  context.beginPath();
  context.arc(player.x, player.y, 12, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#213d45';
  context.beginPath();
  context.moveTo(player.x, player.y);
  context.lineTo(player.x + Math.cos(player.aim) * 25, player.y + Math.sin(player.aim) * 25);
  context.stroke();
}

function drawTarget(context, target, time) {
  if (!target) return;
  context.strokeStyle = '#ffe17a';
  context.lineWidth = 4;
  context.beginPath();
  context.arc(target.x, target.y, 28 + Math.sin(time * 4) * 5, 0, Math.PI * 2);
  context.stroke();
}

function drawHud(context, game) {
  context.fillStyle = '#082d35d9';
  context.fillRect(20, 18, 420, 142);
  context.fillStyle = '#f7dfaa';
  context.font = 'bold 18px system-ui';
  context.fillText(`PALMSHADE  /  ${game.player.name}`, 36, 45);
  context.fillStyle = '#ddd';
  context.font = '15px system-ui';
  context.fillText(`$${game.money}     HEALTH`, 36, 71);
  context.fillStyle = '#352f31';
  context.fillRect(36, 82, 160, 12);
  context.fillStyle = '#df705d';
  context.fillRect(36, 82, 160 * Math.max(0, game.health) / 100, 12);
  context.fillStyle = '#f8cc65';
  context.fillText('★'.repeat(game.wanted) + '☆'.repeat(5 - game.wanted), 220, 94);

  const mission = MISSIONS[game.mission.index];
  context.fillStyle = '#fff';
  context.font = 'bold 15px system-ui';
  context.fillText(mission ? mission.name : 'STORY COMPLETE', 36, 120);
  context.font = '13px system-ui';
  context.fillText(mission ? mission.objective : `Free roam · total earnings $${game.earned}`, 36, 143);
  if (mission?.timer) {
    context.fillText(`TIME ${Math.max(0, Math.ceil(mission.timer - game.mission.elapsed))}`, 340, 143);
  }
  if (game.player.car) {
    context.font = 'bold 22px system-ui';
    context.fillText(`${Math.round(Math.abs(game.player.car.speed))} km/h`, 890, 52);
  }
  context.textAlign = 'right';
  context.font = '18px system-ui';
  context.fillText('✦'.repeat(game.wanted) + '☆'.repeat(5 - game.wanted), 1245, 38);
  context.textAlign = 'left';
  minimap(context, game.player, game.cars, game.people, game.police, game.target);
  if (game.toast) {
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.fillText(game.toast, 640, 690);
    context.textAlign = 'left';
  }
}

function drawOverlay(context, game, screen) {
  if (!['title', 'paused', 'wasted', 'busted'].includes(screen)) return;
  context.fillStyle = '#062b34dd';
  context.fillRect(0, 0, 1280, 720);
  context.textAlign = 'center';
  context.fillStyle = '#f6d58b';
  context.font = 'bold 58px system-ui';
  context.fillText(screen === 'title' ? 'PALMSHADE HEAT' : screen === 'paused' ? 'PAUSED' : screen.toUpperCase(), 640, 240);
  context.fillStyle = 'white';
  context.font = '19px system-ui';
  if (screen === 'title') {
    context.fillText('A sunburned city. One last chance to disappear.', 640, 292);
    context.fillText('WASD/arrows move & drive · E enter/exit car · mouse/F attack', 640, 340);
    context.fillText('Space handbrake · F2 save · P/Esc pause · M mute', 640, 373);
    context.fillText('Press Enter or click to begin', 640, 418);
    if (game.hasSave) context.fillText('Press C to continue your saved story', 640, 454);
  } else {
    context.fillText('Press Enter to continue', 640, 350);
  }
  context.textAlign = 'left';
}
