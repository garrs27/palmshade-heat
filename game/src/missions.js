import { MISSIONS } from './config.js';

// Mission progress is intentionally kept separate from the mission definitions.
export function missionState(index = 0) {
  return { index, elapsed: 0, kos: 0, complete: index >= MISSIONS.length };
}

export function currentMission(mission) {
  return mission.complete ? null : MISSIONS[mission.index];
}

export function advanceMission(mission) {
  mission.index++;
  mission.elapsed = 0;
  mission.kos = 0;
  mission.complete = mission.index >= MISSIONS.length;
}
