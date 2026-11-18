import{WORLD,COLORS}from'./config.js';
export function drawHud(ctx,s,w,view){
  const W=innerWidth,H=innerHeight;ctx.save();ctx.setTransform(1,0,0,1,0,0);
  const panel=(x,y,a,b)=>{ctx.fillStyle='rgba(20,31,35,.86)';ctx.fillRect(x,y,a,b)};
  panel(20,18,245,126);ctx.fillStyle='#f2c991';ctx.font='700 18px system-ui';ctx.fillText('PALMSHADE  /  '+s.cash+'$',34,44);ctx.fillStyle='#eee';ctx.font='14px system-ui';ctx.fillText('HEALTH',34,70);ctx.fillStyle='#492f2b';ctx.fillRect(95,58,150,14);ctx.fillStyle=s.health<30?'#ed6655':'#8bc785';ctx.fillRect(95,58,150*Math.max(0,s.health)/100,14);ctx.fillStyle='#fff';ctx.font='22px system-ui';ctx.fillText('★'.repeat(s.stars)+'☆'.repeat(5-s.stars),34,103);ctx.font='14px system-ui';ctx.fillText(s.weapon==='pistol'?`PISTOL  ${s.ammo} / ∞`:'UNARMED  ·  E steal / enter',34,135);
  if(s.car){panel(W-220,H-84,198,62);ctx.fillStyle='#fff';ctx.font='700 15px system-ui';ctx.fillText((s.carName||'VEHICLE').toUpperCase(),W-205,H-57);ctx.font='20px system-ui';ctx.fillText(`${Math.round(Math.abs(s.car.speed)*13)} KM/H`,W-205,H-32)}
  if(s.mission>=0){const m=s.missionDef;panel(W/2-255,18,510,77);ctx.textAlign='center';ctx.fillStyle='#f6c478';ctx.font='700 12px system-ui';ctx.fillText(`CONTACT  ${s.contact}`,W/2,40);ctx.fillStyle='#fff';ctx.font='700 18px system-ui';ctx.fillText(`${m.name} · ${m.goal}`,W/2,64);ctx.font='13px system-ui';ctx.fillText(`${Math.round(s.distance)} m  ·  ${Math.ceil(s.timer)}s`,W/2,85);ctx.textAlign='left'}
  if(s.bannerTime>0){ctx.fillStyle='rgba(18,28,32,.88)';ctx.fillRect(W/2-280,H-100,560,48);ctx.textAlign='center';ctx.fillStyle='#ffce87';ctx.font='16px system-ui';ctx.fillText(s.banner,W/2,H-70);ctx.textAlign='left'}
  const size=164,x=W-size-22,y=H-size-22;panel(x-5,y-5,size+10,size+10);ctx.save();ctx.beginPath();ctx.rect(x,y,size,size);ctx.clip();ctx.fillStyle='#27363a';ctx.fillRect(x,y,size,size);
  ctx.translate(x,y);ctx.scale(size/WORLD.w,size/WORLD.h);
  ctx.fillStyle='#267b8a';ctx.fillRect(WORLD.w-490,0,490,WORLD.h);ctx.fillStyle='#b9a57f';ctx.fillRect(WORLD.w-520,0,30,WORLD.h);
  ctx.strokeStyle='#84918d';ctx.lineWidth=34;ctx.lineCap='butt';for(const rx of w.roadsX){ctx.beginPath();ctx.moveTo(rx,0);ctx.lineTo(rx,WORLD.h);ctx.stroke()}for(const ry of w.roadsY){ctx.beginPath();ctx.moveTo(0,ry);ctx.lineTo(WORLD.w,ry);ctx.stroke()}
  ctx.strokeStyle='rgba(209,194,145,.45)';ctx.lineWidth=2;for(const rx of w.roadsX){ctx.beginPath();ctx.moveTo(rx,0);ctx.lineTo(rx,WORLD.h);ctx.stroke()}for(const ry of w.roadsY){ctx.beginPath();ctx.moveTo(0,ry);ctx.lineTo(WORLD.w,ry);ctx.stroke()}
  if(s.mission>=0){ctx.fillStyle='#f4c866';ctx.beginPath();ctx.arc(s.target.x,s.target.y,76,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8f642c';ctx.beginPath();ctx.arc(s.target.x,s.target.y,35,0,Math.PI*2);ctx.fill()}
  if(s.stars>0)for(const c of (s.police||[])){ctx.fillStyle='#e84f4a';ctx.beginPath();ctx.arc(c.x,c.y,48,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5195d0';ctx.beginPath();ctx.arc(c.x-28,c.y,31,0,Math.PI*2);ctx.fill()}
  ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.angle||0);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(0,-105);ctx.lineTo(63,70);ctx.lineTo(0,42);ctx.lineTo(-63,70);ctx.closePath();ctx.fill();ctx.restore();ctx.restore();ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.fillText('PALMSHADE · COAST DISTRICT',x,y-8);ctx.restore()
}
