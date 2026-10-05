/* =====================================================================
   JUICE — расширенный звук (Web Audio), пар с искрами, вспышки, сбор урожая
   ===================================================================== */
Object.assign(SFX,{
  // шуршание зёрен: серия коротких высокочастотных щелчков
  rustle(){if(!S.settings.sound)return;const c=this.ensure();if(!c)return;for(let i=0;i<7;i++){const t=c.currentTime+i*.025+Math.random()*.02,len=Math.floor(c.sampleRate*.03),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);
    for(let k=0;k<len;k++)d[k]=(Math.random()*2-1)*Math.pow(1-k/len,3);const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=2500+Math.random()*2500;const g=c.createGain();g.gain.value=.05;s.connect(f);f.connect(g);g.connect(c.destination);s.start(t);}},
  // закипание: низкие булькающие пузыри
  boil(){if(!S.settings.sound)return;const c=this.ensure();if(!c)return;for(let i=0;i<3;i++){const t=c.currentTime+i*.06+Math.random()*.05,o=c.createOscillator(),g=c.createGain();o.type='sine';const f=140+Math.random()*160;
    o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*2.4,t+.07);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.09);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.1);}
    this.noise(.12,.015,500);},
  // звон фарфора: негармонические обертоны с быстрым затуханием
  porcelain(){[2350,3720,5180].forEach((f,i)=>this.tone(f*(1+Math.random()*.01),.5-i*.12,'sine',.035-i*.008));this.tone(1180,.25,'triangle',.012);},
  // шуршание карт: короткие шумовые «шлепки»
  shuffle(){for(let i=0;i<9;i++)setTimeout(()=>this.noise(.05,.06,3000+Math.random()*2000),i*55);},
  cardFlip(){this.noise(.08,.07,2200);this.tone(660,.12,'triangle',.03,.05);},
  bell(){[1568,2093,2637].forEach((f,i)=>this.tone(f,.9,'sine',.04,i*.12));},
  harvest(){this.rustle();[523,784].forEach((f,i)=>this.tone(f,.3,'triangle',.035,.05+i*.07));}
});
/* ---------- Пар с искорками над джезвой ---------- */
const Steam={parts:[],
  step(cv,dt,heat,heating){if(!cv)return;const x=cv.getContext('2d'),W=cv.width,H=cv.height;const rate=(.25+heat/100*1.4+(heating?.6:0))*dt*60;
    for(let i=0;i<rate;i++){if(Math.random()<.78)this.parts.push({k:0,x:W/2+(Math.random()-.5)*90,y:H-8,vx:(Math.random()-.5)*.25,vy:-(.5+Math.random()*.7+heat/120),r:6+Math.random()*8,l:1,ph:Math.random()*6});
      else this.parts.push({k:1,x:W/2+(Math.random()-.5)*70,y:H-10,vx:(Math.random()-.5)*.6,vy:-(1.2+Math.random()*1.4),r:1+Math.random()*1.8,l:1,ph:Math.random()*6});}
    x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
    for(const p of this.parts){p.ph+=dt*3;p.x+=p.vx+Math.sin(p.ph)*(p.k?.3:.45);p.y+=p.vy;p.l-=dt*(p.k?.7:.42);if(!p.k)p.r+=dt*14;
      if(p.k){const a=Math.max(0,p.l)*(.6+.4*Math.sin(p.ph*4));x.fillStyle=`rgba(243,217,139,${a})`;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();if(a>.5){x.fillStyle=`rgba(255,255,255,${a*.6})`;x.fillRect(p.x-.5,p.y-p.r*2.5,1,p.r*5);x.fillRect(p.x-p.r*2.5,p.y-.5,p.r*5,1);}}
      else{const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(255,240,225,${Math.max(0,p.l)*.16})`);g.addColorStop(1,'rgba(255,240,225,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();}}
    x.globalCompositeOperation='source-over';this.parts=this.parts.filter(p=>p.l>0&&p.y>-30);if(this.parts.length>420)this.parts.splice(0,this.parts.length-420);}
};
/* ---------- Вспышка экрана ---------- */
function screenFlash(col='rgba(255,246,220,.9)'){const f=document.createElement('div');f.className='flash';f.style.background=`radial-gradient(circle,${col},rgba(212,175,55,.25) 60%,transparent)`;document.body.appendChild(f);setTimeout(()=>f.remove(),700);}
function shakeEl(el,cls='jolt'){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),600);}
/* ---------- Ручной сбор урожая (мягкое свечение) ---------- */
const HARVEST_CD=20000;
function harvestReady(id){return Date.now()-((S.harvestAt||{})[id]||0)>=HARVEST_CD;}
Actions.harvest=el=>{const id=el.dataset.id;if(!S.plants[id].owned)return;const card=el.closest('.plant-card');
  if(!harvestReady(id)){shakeEl(el,'nudge');return;}const g=Plant.rate(id)*20;S.raw+=g;S.stats.rawTotal+=g;S.harvestAt[id]=Date.now();
  card.classList.remove('harvest-glow');void card.offsetWidth;card.classList.add('harvest-glow');SFX.harvest();
  const r=el.getBoundingClientRect();for(let i=0;i<6;i++)setTimeout(()=>floatNum(el,i?'✦':'+'+fmt(g),20+Math.random()*(r.width-60),40+Math.random()*40),i*70);App.updateHUD();Plant.liveUpdate(false);};
