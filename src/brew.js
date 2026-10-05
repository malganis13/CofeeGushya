/* =====================================================================
   BREW v2.1 — медитативная варка: спокойное помешивание со следом,
   плавный контроль пламени и температуры, три подъёма пенки
   ===================================================================== */
const CEZVE21=CEZVE_SVG.replace('<g class="flame"','<g id="flameG"><g class="flame"').replace('<rect x="50" y="234"','</g><rect x="50" y="234"')
  .replace('</svg>','<line x1="58" x2="162" y1="74" y2="74" stroke="#F3D98B" stroke-width="1.6" stroke-dasharray="5 4" opacity=".75"/><text x="168" y="78" font-size="11" fill="#F3D98B" opacity=".8">✦</text></svg>');
const BREW={zoneLo:86,zoneHi:96,rises:3};
Object.assign(Ritual,{
  v3(){return `<div class="brew-wrap brew21 fade-in"><div class="glass stir-box glow" id="stirBox"><h2 class="h2" id="stirTitle">1. Размешайте</h2>
      <p class="muted" style="font-size:13px" id="stirHint">Медленно ведите пальцем или мышью по кругу — три спокойных оборота. Следуйте дыханию светящегося кольца.</p>
      <canvas id="stirCanvas" width="300" height="300"></canvas><div class="prog"><i id="stirProg"></i></div><div id="stirMsg" class="brew-msg">Вдох… и плавное движение ложечкой</div></div>
    <div class="glass heat-box locked" id="heatBox"><h2 class="h2">2. Томите на огне</h2><p class="muted" style="font-size:13px">Плавно ведите ползунок пламени. Держите температуру в золотой зоне — пенка поднимется к черте. Поднимите её трижды и не дайте кофе убежать.</p>
      <div class="cezve-area cz21" id="cezveArea"><div class="cz-wrap"><canvas id="steamCv" width="200" height="200"></canvas>${CEZVE21}</div>
        <div class="thermo"><div class="zone"></div><div class="fill" id="thermoFill"></div><span class="tv" id="thermoVal">20°</span></div></div>
      <div class="rises" id="rises">${'<i>☕</i>'.repeat(BREW.rises)}</div>
      <label class="flame-ctl"><span title="Слабый огонь">🕯️</span><input type="range" id="flameIn" min="0" max="100" value="0" aria-label="Сила пламени"><span title="Сильный огонь">🔥</span></label>
      <div id="heatRes" class="brew-msg serif gold" style="font-size:18px">Пламя погашено</div>
      <button class="btn btn-sm" id="heatStop" disabled>🧤 Снять турку с огня</button></div></div>
    <div class="glass ritual-panel" style="margin-top:14px"><div class="row"><div class="sp muted" style="font-size:13px">Не спешите: в кофе по-турецки важна тишина и терпение.</div><button class="btn btn-gold" id="brewNext" data-act="rStep" data-s="4" disabled>К перевороту ›</button></div></div>`;},
  mountBrew(){Steam.parts=[];const b=this.brew={stir:0,heat:0,heatDone:false,bonus:0,msg:'',T:22,F:0,flame:0,risesDone:0,ready:true,spills:0,zoneT:0,hotT:0,overT:0};
    const c=$('#stirCanvas');if(!c)return;const x=c.getContext('2d'),C=150;
    let last=0,down=false,spoonA=-.8,lt=performance.now(),spin=0,rot=0,omega=0,trail=[],calmMsgT=0,breathT=0,lastBub=0,foamRot=0;
    const specks=Array.from({length:70},()=>({a:Math.random()*6.283,r:14+Math.random()*102,s:.6+Math.random()*1.6,o:.25+Math.random()*.5}));
    const pos=e=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*300/r.width,y:(e.clientY-r.top)*300/r.height};};
    const msg=t=>{const m=$('#stirMsg');if(m&&m.textContent!==t)m.textContent=t;};
    c.addEventListener('pointerdown',e=>{if(b.stir>=1)return;down=true;try{c.setPointerCapture(e.pointerId);}catch(_){}const p=pos(e);last=Math.atan2(p.y-C,p.x-C);lt2=performance.now();SFX.ensure();});
    let lt2=0;
    c.addEventListener('pointermove',e=>{if(!down||b.stir>=1)return;const p=pos(e),now=performance.now();if(Math.hypot(p.x-C,p.y-C)<18)return;const a=Math.atan2(p.y-C,p.x-C);let d=a-last;
      if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;last=a;spoonA=a;const dtp=Math.max(.008,(now-lt2)/1000);lt2=now;
      omega=omega*.8+(d/dtp)*.2;const w=Math.abs(omega);let k=1;
      if(w>10.5){k=.3;if(now-calmMsgT>1500){calmMsgT=now;msg('Тише… медленнее, в ритме дыхания');}}else if(w>1.2&&now-calmMsgT>2500)msg('Да, вот так — плавно и спокойно ✦');
      spin+=d*.6;b.stir=Math.min(1,b.stir+Math.abs(d)*k/(Math.PI*6));$('#stirProg').style.width=b.stir*100+'%';
      trail.push({x:p.x,y:p.y,t:now});if(Math.random()<.05)SFX.bubble();
      if(b.stir>=1){down=false;$('#heatBox').classList.remove('locked');$('#stirTitle').textContent='Поверхность кофе';$('#stirHint').textContent='Следите, как под пламенем собирается и закручивается нежная пенка.';
        msg('✓ Кофе размешан. Теперь — мягкий огонь.');SFX.crystal();toast('☕ Кофе размешан. Медленно прибавьте огонь.','gold');}});
    const up=()=>{down=false;};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
    const fin=$('#flameIn'),stopB=$('#heatStop'),area=$('#cezveArea'),fg=$('#flameG');
    fin.addEventListener('input',()=>{b.flame=+fin.value/100;});
    stopB.addEventListener('click',()=>this.evalHeat(false));
    const res=t=>{const r=$('#heatRes');if(r&&r.textContent!==t)r.textContent=t;};
    const loop=t=>{if(!c.isConnected){SFX.hiss(0);return;}const dt=Math.min(.05,(t-lt)/1000);lt=t;
      /* ---- физика турки ---- */
      if(b.stir>=1&&!b.heatDone){const tgt=22+b.flame*86;b.T+=(tgt-b.T)*dt*.5;
        if(b.T>84)b.F+=(b.T-84)*dt*2.2*(1+b.flame*.3);else b.F=Math.max(0,b.F-dt*(b.T<70?16:9));
        if(b.T>=BREW.zoneLo&&b.T<=BREW.zoneHi){b.zoneT+=dt;}if(b.T>80)b.hotT+=dt;
        if(!b.ready&&b.F<45){b.ready=true;res('Пенка осела. Можно снова прибавить огонь.');SFX.bubble();}
        if(b.ready&&b.F>=90){b.ready=false;b.risesDone++;$$('#rises i').forEach((el,i)=>el.classList.toggle('on',i<b.risesDone));SFX.bellNote(PENTA[4+b.risesDone],.03,0,2,.6);
          if(b.risesDone>=BREW.rises){this.evalHeat(false);}else{res(`✨ Подъём ${b.risesDone} из ${BREW.rises}! Убавьте огонь — дайте пенке осесть.`);stopB.disabled=false;}}
        else if(b.F>=112){b.spills++;b.F=38;b.ready=true;const d=$('#drips');if(d)d.setAttribute('opacity','1');SFX.error();res('Ой! Кофе убежал через край… убавьте огонь.');shakeEl(area,'nudge');setTimeout(()=>{const d=$('#drips');if(d)d.setAttribute('opacity','0');},2200);}
        else if(b.ready&&b.T>BREW.zoneHi+4)res('Слишком жарко — пенка бежит! Тише огонь…');
        else if(b.ready&&b.T>=BREW.zoneLo)res('Золотая зона… пенка медленно поднимается');
        else if(b.ready&&b.flame>0&&b.T<BREW.zoneLo&&b.F<10)res('Турка согревается…');
        SFX.hiss(clamp((b.T-35)/70,0,1));if(b.T>78&&t-lastBub>Math.max(120,900-(b.T-78)*30)&&Math.random()<.5){lastBub=t;SFX.bubble();}}
      else SFX.hiss(0);
      b.heat=clamp(b.F,0,100);
      const fy=150-Math.min(115,b.F)*.85,fr=$('#foamRect'),cr=$('#coffeeRect');if(fr){fr.setAttribute('y',fy);fr.setAttribute('height',10+b.F*.08);cr.setAttribute('y',fy+12);}
      if(fg){const s=.25+b.flame*.95;fg.setAttribute('transform',`translate(110 240) scale(${(.6+b.flame*.5).toFixed(3)} ${s.toFixed(3)}) translate(-110 -240)`);fg.style.opacity=b.heatDone?.12:(.15+b.flame*.85);}
      area.classList.toggle('heating',b.flame>.05&&!b.heatDone);
      const tf=$('#thermoFill');if(tf){const p=clamp((b.T-20)/90,0,1)*100;tf.style.height=p+'%';$('#thermoVal').textContent=Math.round(b.T)+'°';}
      Steam.step($('#steamCv'),dt,clamp((b.T-30)*1.2,0,100),b.flame>.3&&!b.heatDone);
      /* ---- чашка сверху ---- */
      spin*=Math.pow(.35,dt);rot+=spin*dt*3+dt*.12;foamRot+=dt*(.25+b.flame*.4);
      x.clearRect(0,0,300,300);let g=x.createRadialGradient(C,C,100,C,C,148);g.addColorStop(0,'#efe3d2');g.addColorStop(1,'#a88c6c');x.fillStyle=g;x.beginPath();x.arc(C,C,146,0,7);x.fill();
      x.strokeStyle='#D4AF37';x.lineWidth=3;x.beginPath();x.arc(C,C,143,0,7);x.stroke();
      const warm=clamp((b.T-22)/80,0,1);g=x.createRadialGradient(C-14,C-18,8,C,C,126);g.addColorStop(0,`rgb(${122+warm*20},${74+warm*10},38)`);g.addColorStop(.6,'#4a2812');g.addColorStop(1,'#2a1408');
      x.fillStyle=g;x.beginPath();x.arc(C,C,124,0,7);x.fill();
      x.save();x.beginPath();x.arc(C,C,124,0,7);x.clip();x.translate(C,C);
      // спираль-завиток
      x.save();x.rotate(rot);for(let k=0;k<3;k++){x.rotate(2.094);x.strokeStyle=`rgba(226,184,132,${.16+b.stir*.3})`;x.lineWidth=2.5;x.beginPath();
        for(let q=0;q<=1;q+=.02){const r=6+q*112,a=q*5.4;q?x.lineTo(Math.cos(a)*r,Math.sin(a)*r):x.moveTo(Math.cos(a)*r,Math.sin(a)*r);}x.stroke();}x.restore();
      // крупинки гущи кружатся вместе с жидкостью
      for(const s of specks){s.a+=(spin*3+.12)*dt*(1.2-s.r/140);x.fillStyle=`rgba(30,14,6,${s.o})`;x.beginPath();x.arc(Math.cos(s.a)*s.r,Math.sin(s.a)*s.r,s.s,0,7);x.fill();}
      // пенка: кольцо крема, нарастающее от края к центру
      const cov=clamp(b.F/100,0,1.15);if(cov>.02){const inner=Math.max(0,124*(1-cov));for(let k=0;k<26;k++){const a=k/26*6.283+foamRot+Math.sin(t/2400+k)*.12,rr=inner+(124-inner)*(.35+.5*((k*37)%10)/10);
          const gg=x.createRadialGradient(Math.cos(a)*rr,Math.sin(a)*rr,0,Math.cos(a)*rr,Math.sin(a)*rr,26+cov*18);gg.addColorStop(0,`rgba(214,166,108,${.22+cov*.3})`);gg.addColorStop(1,'rgba(214,166,108,0)');x.fillStyle=gg;x.beginPath();x.arc(Math.cos(a)*rr,Math.sin(a)*rr,26+cov*18,0,7);x.fill();}
        x.strokeStyle=`rgba(240,210,160,${.18+cov*.25})`;x.lineWidth=1.4;x.beginPath();for(let q=0;q<=1;q+=.01){const a=q*6.283*2+foamRot*1.4,r=inner+8+q*(124-inner-8);q?x.lineTo(Math.cos(a)*r,Math.sin(a)*r):x.moveTo(Math.cos(a)*r,Math.sin(a)*r);}x.stroke();
        if(b.T>84&&!b.heatDone)for(let k=0;k<3;k++){const a=Math.random()*6.283,r=inner+Math.random()*(124-inner);x.strokeStyle='rgba(255,240,215,.35)';x.lineWidth=1;x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,1+Math.random()*2.5,0,7);x.stroke();}}
      x.restore();
      // светящийся след ложечки
      trail=trail.filter(p=>t-p.t<900);if(trail.length>1){x.lineCap='round';x.lineJoin='round';for(let i=1;i<trail.length;i++){const p0=trail[i-1],p1=trail[i],k=1-(t-p1.t)/900;
          x.strokeStyle=`rgba(243,217,139,${k*.55})`;x.lineWidth=2+k*7;x.shadowColor='rgba(243,217,139,.6)';x.shadowBlur=10*k;x.beginPath();x.moveTo(p0.x,p0.y);x.lineTo(p1.x,p1.y);x.stroke();}x.shadowBlur=0;}
      // дыхательное кольцо (8 с: вдох 4 с, выдох 4 с)
      if(b.stir<1){const ph=(t/8000)%1,br=ph<.5?ph*2:2-ph*2,ease=.5-.5*Math.cos(br*Math.PI);x.strokeStyle=`rgba(195,155,255,${.25+ease*.35})`;x.lineWidth=2+ease*2;x.beginPath();x.arc(C,C,108+ease*14,0,7);x.stroke();
        x.fillStyle='rgba(243,217,139,.7)';x.font='italic 15px "Cormorant Garamond",Georgia,serif';x.textAlign='center';x.fillText(ph<.5?'вдох…':'выдох…',C,C+4);x.textAlign='left';
        if(down&&t-breathT>7900){breathT=t;SFX.breath();}}
      // ложечка
      if(b.stir<1){x.save();x.translate(C,C);x.rotate(spoonA);x.strokeStyle='#d8d8e2';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(60,0);x.lineTo(175,0);x.stroke();x.fillStyle='#c9c9d4';x.beginPath();x.ellipse(52,0,15,9,0,0,7);x.fill();x.restore();}
      this.raf=requestAnimationFrame(loop);};
    this.raf=requestAnimationFrame(loop);},
  evalHeat(){const b=this.brew;if(!b||b.heatDone)return;b.heatDone=true;b.flame=0;const fin=$('#flameIn');if(fin){fin.value=0;fin.disabled=true;}SFX.hiss(0);
    const zr=b.hotT?clamp(b.zoneT/b.hotT,0,1):0,n=b.risesDone;let bonus=n*4+Math.round(zr*3)-b.spills*4+(n>=BREW.rises&&!b.spills?3:0);bonus=clamp(bonus,-5,15);b.bonus=bonus;
    if(n>=BREW.rises&&!b.spills){b.msg=`Три безупречных подъёма пенки. Духи кофе довольны (+${bonus} к удаче).`;SFX.magic();Confetti.burst(50);}
    else if(n>=2){b.msg=`Бархатная пенка — видение будет ясным (${bonus>=0?'+':''}${bonus}).`;SFX.crystal();}
    else if(n===1){b.msg=`Пенка поднялась лишь раз… (${bonus>=0?'+':''}${bonus})`;SFX.chime();}
    else{b.msg=b.spills?'Кофе убегал — но и в этом есть знак…':'Кофе едва согрелся — видение будет туманным.';SFX.click();}
    const r=$('#heatRes');if(r)r.textContent=b.msg;const s=$('#heatStop');if(s){s.disabled=true;s.textContent='Огонь погашен';}const nx=$('#brewNext');if(nx)nx.disabled=false;}
});
/* пэд-атмосфера во время гадания и тишина вне ритуала */
{const _r=App.render.bind(App);App.render=function(...a){_r(...a);const st=Ritual.step;SFX.ambience(this.tab==='ritual'&&(st==='reading'||st==='fortune'||st===4));if(!(this.tab==='ritual'&&st===3))SFX.hiss(0);};}

/* настройки звука: мгновенно гасим/включаем атмосферу */
App.syncAmbience=function(){const st=Ritual.step;SFX.ambience(this.tab==='ritual'&&(st==='reading'||st==='fortune'||st===4));if(!S.settings.sound)SFX.hiss(0);};
Actions.toggleSound=el=>{S.settings.sound=!S.settings.sound;el.classList.toggle('on',S.settings.sound);save();if(S.settings.sound)SFX.chime();App.syncAmbience();};
Actions.togglePad=el=>{S.settings.pad=S.settings.pad===false;el.classList.toggle('on',S.settings.pad);save();App.syncAmbience();};
