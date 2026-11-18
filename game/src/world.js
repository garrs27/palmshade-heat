import { W, H, ROADS } from './config.js';

export function createWorld(random) {
  const buildings = [];
  const palms = [];
  const buildingColors = ['#e89a6c', '#f0c778', '#da8064', '#e1b26c'];

  // Fill the blocks between streets with a small, deterministic building grid.
  for (let column = 0; column < ROADS.length - 1; column++) {
    for (let row = 0; row < ROADS.length - 1; row++) {
      const x = ROADS[column] + 42;
      const y = ROADS[row] + 42;
      if (x + 250 < ROADS[column + 1] - 35 && y + 250 < ROADS[row + 1] - 35) {
        buildings.push({ x, y, w: 250, h: 250, color: buildingColors[Math.floor(random() * buildingColors.length)] });
      }
    }
  }
  for (let y = 50; y < H; y += 145) {
    palms.push({ x: W - 85 + Math.sin(y) * 12, y });
  }

  return {
    buildings,
    palms,
    collides(x, y, radius = 18) {
      return buildings.some((building) =>
        x + radius > building.x && x - radius < building.x + building.w &&
        y + radius > building.y && y - radius < building.y + building.h
      );
    },
    clamp(point) {
      point.x = Math.max(25, Math.min(W - 25, point.x));
      point.y = Math.max(25, Math.min(H - 25, point.y));
    }
  };
}
