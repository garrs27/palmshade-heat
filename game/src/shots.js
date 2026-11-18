import { MISSIONS } from './missions.js';

export function setupShot(name,s,w){
  if(!name)return false;
  s.started=name!=='title';s.screen=name==='title'?'title':'play';s.x=1900;s.y=1510;s.health=100;s.cash=2450;s.weapon='pistol';s.ammo=24;s.stars=0;s.cars=s.makeCars(w);s.people=s.makePeople(w);s.car=null;s.completed=0;s.mission=-1;s.bust=0;s.banner='';s.bannerTime=0;
  if(name==='foot'||name==='mission'){
    s.x=1900;s.y=1500;
    if(name==='mission'||name==='foot'){
      s.startMission(s,0);s.mission=0;s.missionDef=MISSIONS[0];s.target=MISSIONS[0].point;s.timer=MISSIONS[0].time;
    }
    if(name==='foot'){
      const parked=s.cars[2];parked.x=1980;parked.y=1500;parked.speed=0;parked.traffic=false;
      s.cars[3].x=1795;s.cars[3].y=1534;s.cars[3].speed=1.1;s.cars[3].traffic=true;
      s.people[0].x=1850;s.people[0].y=1480;s.people[1].x=2030;s.people[1].y=1545;
      s.banner=MISSIONS[0].line;s.bannerTime=60;s.activeShot='foot';
    }else s.activeShot='mission';
  }
  if(name==='chase'){
    s.car=s.cars[3];s.car.x=1920;s.car.y=1500;s.car.angle=0;s.car.speed=7;s.x=s.car.x;s.y=s.car.y;s.carName='COVE RUNNER';s.stars=3;s.wanted=3;s.quiet=0;
    s.police=s.makePolice(w,3);
    s.police[0].x=1825;s.police[0].y=1475;s.police[0].angle=0;s.police[0].speed=1.1;
    s.police[1].x=1795;s.police[1].y=1530;s.police[1].angle=0;s.police[1].speed=1.3;
    s.police[2].x=1940;s.police[2].y=1580;s.police[2].angle=-Math.PI/2;s.police[2].speed=1;
    s.activeShot='chase';
  }
  if(name==='title'){s.x=1900;s.y=1500;s.activeShot='title'}
  return true;
}
