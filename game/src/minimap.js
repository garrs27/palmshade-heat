import { ROADS, W, H } from './config.js';

export function minimap(context, player, cars, people, police, target) {
  const left = 1040;
  const top = 510;
  const width = 210;
  const height = 165;

  context.fillStyle = '#102e34';
  context.fillRect(left, top, width, height);
  context.save();
  context.beginPath();
  context.rect(left, top, width, height);
  context.clip();
  context.fillStyle = '#607073';
  for (const road of ROADS) {
    context.fillRect(left + road / W * width - 2, top, 4, height);
    context.fillRect(left, top + road / H * height - 2, width, 4);
  }
  for (const car of cars.concat(police)) {
    context.fillStyle = car.police ? '#ed5550' : '#ead078';
    context.fillRect(left + car.x / W * width - 1, top + car.y / H * height - 1, 3, 3);
  }
  context.fillStyle = '#eee';
  context.beginPath();
  context.arc(left + player.x / W * width, top + player.y / H * height, 4, 0, Math.PI * 2);
  context.fill();
  if (target) {
    context.fillStyle = '#f65';
    context.beginPath();
    context.arc(left + target.x / W * width, top + target.y / H * height, 4, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
  context.strokeStyle = '#f0d593';
  context.strokeRect(left, top, width, height);
}
