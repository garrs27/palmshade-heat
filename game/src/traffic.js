import { ROADS, W, H } from './config.js';

const carColors = ['#d64d45', '#e9cf78', '#4e9ba2', '#e8e5d7', '#7c6fa4'];

export function createTraffic(random) {
  const cars = [];
  for (let index = 0; index < 22; index++) {
    const horizontal = random() > 0.5;
    const road = ROADS[Math.floor(random() * ROADS.length)];
    const position = random() * (horizontal ? W : H);
    cars.push({
      x: horizontal ? position : road,
      y: horizontal ? road : position,
      a: horizontal ? 0 : Math.PI / 2,
      speed: 35 + random() * 42,
      color: carColors[index % carColors.length],
      police: false,
      ai: true,
      turnChecked: false,
      turnChance: random(),
      horizontal
    });
  }
  return cars;
}

export function drive(car, delta, input) {
  const accelerating = input.keys.has('ArrowUp') || input.keys.has('KeyW');
  const braking = input.keys.has('ArrowDown') || input.keys.has('KeyS');
  const handbrake = input.keys.has('Space');
  const turnRight = input.keys.has('ArrowRight') || input.keys.has('KeyD');
  const turnLeft = input.keys.has('ArrowLeft') || input.keys.has('KeyA');
  const steering = (turnRight ? 1 : 0) - (turnLeft ? 1 : 0);

  car.speed += (accelerating ? 190 : 0) * delta;
  car.speed -= (braking ? 230 : accelerating ? 0 : 48) * delta;
  car.speed = Math.max(-80, Math.min(230, car.speed));
  car.a += steering * delta * (0.9 + Math.abs(car.speed) / 100) * (handbrake ? 1.8 : 1);
  car.x += Math.cos(car.a) * car.speed * delta;
  car.y += Math.sin(car.a) * car.speed * delta;
  car.x = Math.max(25, Math.min(W - 25, car.x));
  car.y = Math.max(25, Math.min(H - 25, car.y));
}

export function updateTraffic(cars, delta) {
  for (const car of cars) {
    if (!car.ai) continue;
    const roadCoordinate = car.horizontal ? car.y : car.x;
    const crossing = ROADS.find((road) => Math.abs(roadCoordinate - road) < 2);
    const forwardCoordinate = car.horizontal ? car.x : car.y;
    const nearestCrossing = ROADS.find((road) => Math.abs(forwardCoordinate - road) < 2);
    if (nearestCrossing !== undefined && !car.turnChecked) {
      car.turnChecked = true;
      if (car.turnChance < 0.18) {
        car.horizontal = !car.horizontal;
        car.a = car.horizontal ? (car.a > Math.PI / 2 ? Math.PI : 0) : Math.PI / 2;
        car.x = nearestCrossing;
        car.y = crossing ?? roadCoordinate;
      }
    } else if (nearestCrossing === undefined) {
      car.turnChecked = false;
    }
    car.x += Math.cos(car.a) * car.speed * delta;
    car.y += Math.sin(car.a) * car.speed * delta;
    if (car.x < 0) car.x = W;
    if (car.x > W) car.x = 0;
    if (car.y < 0) car.y = H;
    if (car.y > H) car.y = 0;
  }
}
