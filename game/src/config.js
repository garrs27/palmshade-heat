export const W = 2200;
export const H = 1600;
export const STEP = 1 / 60;

// Roads are shared by world generation, traffic, rendering, and the map.
export const ROADS = [260, 620, 980, 1340, 1700, 2060];

export const MISSIONS = [
  { name: 'A Long Way Home', story: 'Mara Venn needs a ride across Palmshade. Reach the marina marker.', objective: 'Drive to the marina marker.', x: 1700, y: 260, reward: 250 },
  { name: 'Saltwater Parcel', story: 'A sealed parcel has to reach the boardwalk before the tide turns.', objective: 'Deliver the package before time runs out.', x: 2060, y: 980, reward: 400, timer: 55 },
  { name: 'Boardwalk Business', story: 'Three dockside bruisers are leaning on the night crew. Clear the marked spot.', objective: 'Knock out 3 troublemakers.', x: 1340, y: 1340, reward: 550, fight: 3 },
  { name: 'No Easy Shore', story: 'The heat is on. Reach the safehouse with at least two stars.', objective: 'Reach the safehouse while wanted is 2+.', x: 260, y: 260, getaway: true, reward: 900 }
];

export const COLORS = {
  ink: '#122a31',
  sand: '#e6c98e',
  water: '#41a9ad',
  road: '#566166',
  building: '#dc8960'
};
