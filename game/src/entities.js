export function createPeople(random, world) {
  const people = [];
  for (let index = 0; index < 46; index++) {
    let x = 0;
    let y = 0;
    // Keep sampling until the spawn point is clear of every building.
    do {
      x = 80 + random() * 2040;
      y = 80 + random() * 1440;
    } while (world?.collides(x, y, 18));
    people.push({ x, y, a: random() * Math.PI * 2, s: 10 + random() * 18, down: 0, kind: index < 3 ? 'trouble' : 'civilian' });
  }
  return people;
}

export function createPolice() {
  return [];
}

export function updatePeople(people, delta, player, attack) {
  for (const person of people) {
    if (person.down > 0) {
      person.down = Math.max(0, person.down - delta);
      continue;
    }
    // A slow, stable drift gives pedestrians life without a pathfinding system.
    person.a += Math.sin((person.x + person.y) * 0.01) * delta * 0.3;
    person.x += Math.cos(person.a) * person.s * delta;
    person.y += Math.sin(person.a) * person.s * delta;
  }
}

export function updatePolice(police, delta, player, wanted, random = Math.random) {
  while (police.length < wanted) {
    const angle = random() * Math.PI * 2;
    const distance = 380 + random() * 140;
    police.push({ x: player.x + Math.cos(angle) * distance, y: player.y + Math.sin(angle) * distance, a: angle + Math.PI, speed: 105 + wanted * 12, police: true });
  }
  police.length = Math.min(police.length, wanted);
  for (const car of police) {
    car.speed = 105 + wanted * 12;
    car.a = Math.atan2(player.y - car.y, player.x - car.x);
    car.x += Math.cos(car.a) * car.speed * delta;
    car.y += Math.sin(car.a) * car.speed * delta;
  }
}
