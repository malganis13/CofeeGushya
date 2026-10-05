/* =====================================================================
   ALCHEMY — мини-игра «Обжарка зёрен» и купажирование в тигле
   ===================================================================== */
const Roast={
  open(pid,n){const d=PLANTS[pid];if(S.raw<d.roast*n){SFX.error();return toast('Не хватает сырых зёрен','bad');}
    const w=Modal.open(`<h2 class="h2">🔥 Обжарка: ${esc(BEANS[d.bean].name)}</h2><p class="muted" style="font-size:13px">Партия: ${n} × ${fmt(d.roast)} сырых зёрен. Выберите степень обжарки — чем темнее, тем уже зона и выше бонус к удаче.</p>
      <div class="roast-levels">${ROAST_LEVELS.map((l,i)=>`<button class="item click" data-act="roastPick" data-i="${i}"><span class="ii lg">${l.icon}</span><div class="nm">${l.name}</div><div class="ds">${l.desc}</div><div class="gold" style="font-size:12px;font-weight:700">до +${l.max} удачи</div></button>`).join('')}</div>`,{cls:'wide'});
    w._roast={pid,n};},
  start(w,li){const L=ROAST_LEVELS[li],{pid,n}=w._roast,d=PLANTS[pid];const half=L.h*(1+.15*tal('roaster'));
    w.querySelector('.modal-body').innerHTML=`<h2 class="h2">${L.icon} ${L.name} обжарка</h2><p class="muted" style="font-size:13px">Стрелка ходит по шкале температуры. Нажмите «Снять с огня», когда она окажется в золотой зоне.</p>
      <canvas id="drumCv" width="560" height="300" style="width:100%;border-radius:16px;margin:10px 0"></canvas>
      <div class="roast-scale"><div class="rz" style="left:${(L.c-half)*100}%;width:${half*200}%"></div><div class="needle" id="needle"></div><span>180°</span><span>205°</span><span>230°</span><span>250°</span></div>
      <div id="roastRes" class="serif gold" style="font-size:20px;min-height:28px;text-align:center;margin:8px 0"></div>
      <button class="btn btn-gold btn-lg btn-block" id="roastStop">🧤 Снять с огня!</button>`;
    const cv=w.querySelector('#drumCv'),x=cv.getContext('2d'),nd=w.querySelector('#needle');let t0=performance.now(),pos=0,done=false,ang=0,lt=t0,lastR=0;
    const beans=Array.from({length:46},()=>({a:Math.random()*6.28,r:30+Math.random()*80,s:.7+Math.random()*.6,rot:Math.random()*6}));const sparks=[];
    const col=p=>{const st=[[0,[150,165,80]],[.3,[196,140,74]],[.55,[120,66,30]],[.78,[50,26,12]],[1,[70,30,110]]];let a=st[0],b=st[st.length-1];for(let i=0;i<st.length-1;i++)if(p>=st[i][0]&&p<=st[i+1][0]){a=st[i];b=st[i+1];}
      const k=(p-a[0])/((b[0]-a[0])||1);return a[1].map((v,i)=>Math.round(v+(b[1][i]-v)*k));};
    const loop=t=>{if(!cv.isConnected)return;const dt=(t-lt)/1000;lt=t;if(!done){const e=(t-t0)/1000;pos=(1-Math.cos(e*L.speed))/2;nd.style.left=pos*100+'%';ang+=dt*2.2;
        if(t-lastR>420){SFX.rustle();lastR=t;}}
      x.clearRect(0,0,560,300);let g=x.createRadialGradient(280,150,20,280,150,150);g.addColorStop(0,'#3a2418');g.addColorStop(1,'#120a10');x.fillStyle=g;x.beginPath();x.arc(280,150,135,0,7);x.fill();
      x.strokeStyle='#D4AF37';x.lineWidth=5;x.beginPath();x.arc(280,150,138,0,7);x.stroke();
      g=x.createRadialGradient(280,280,10,280,280,170);g.addColorStop(0,`rgba(255,140,50,${.15+pos*.4})`);g.addColorStop(1,'rgba(255,80,40,0)');x.fillStyle=g;x.fillRect(0,0,560,300);
      const c=col(pos);for(const b of beans){const a=b.a+ang*(b.r<70?1.1:.8),bx=280+Math.cos(a)*b.r,by=150+Math.sin(a)*b.r*.85+Math.sin(ang*3+b.rot)*4;
        x.save();x.translate(bx,by);x.rotate(b.rot+ang);x.fillStyle=`rgb(${c})`;x.beginPath();x.ellipse(0,0,9*b.s,6*b.s,0,0,7);x.fill();x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=1.2;x.beginPath();x.moveTo(-6*b.s,0);x.quadraticCurveTo(0,2,6*b.s,0);x.stroke();
        if(pos>.82){x.shadowColor='#c39bff';x.shadowBlur=10;x.fillStyle='rgba(195,155,255,.35)';x.beginPath();x.ellipse(0,0,9*b.s,6*b.s,0,0,7);x.fill();}x.restore();}
      if(pos>.5&&Math.random()<pos*.5)sparks.push({x:280+(Math.random()-.5)*200,y:240,vy:-1-Math.random()*2,l:40});
      for(const s of sparks){s.y+=s.vy;s.l--;x.fillStyle=`rgba(255,${180+Math.random()*60|0},90,${s.l/40})`;x.fillRect(s.x,s.y,2,2);}for(let i=sparks.length-1;i>=0;i--)if(sparks[i].l<=0)sparks.splice(i,1);
      x.fillStyle='#F3D98B';x.font='700 26px "Cormorant Garamond",Georgia,serif';x.textAlign='center';x.fillText(Math.round(180+pos*70)+'°C',280,40);
      requestAnimationFrame(loop);};requestAnimationFrame(loop);
    const stop=()=>{if(done)return;done=true;const dist=Math.abs(pos-L.c);const inZ=dist<=half;const p=inZ?1-dist/half:0;let bonus=0,msg,extra=0;
      if(inZ){bonus=Math.max(1,Math.round(L.max*(.4+.6*p)));if(p>.85){msg=`✨ Идеальная ${L.name.toLowerCase()} обжарка! +${bonus} к удаче`;extra=L.id==='oracle'||L.id==='dark'?1:0;Confetti.burst(90);SFX.magic();}else{msg=`Хорошая обжарка: +${bonus} к удаче`;SFX.chime();}}
      else{msg=pos>L.c?'🔥 Пережарено… зёрна горчат, бонуса нет':'🌱 Недожарено… бонуса нет';SFX.error();}
      if(S.raw<d.roast*n){toast('Сырые зёрна закончились','bad');return;}S.raw-=d.roast*n;const id=d.bean,had=S.inv.beans[id]||0,got=n+extra;
      S.roastQ[id]=Math.min(15,((S.roastQ[id]||0)*had+bonus*got)/(had+got));addItem('bean',id,got);addXP(3*n+bonus);S.stats.roasts=(S.stats.roasts||0)+1;save();App.updateHUD();
      w.querySelector('#roastRes').textContent=msg+(extra?' · +1 зерно в подарок':'');const b=w.querySelector('#roastStop');b.textContent='Готово — забрать зёрна';b.onclick=()=>{Modal.close(w);App.render();};};
    w.querySelector('#roastStop').onclick=stop;w._key=e=>{if(e.code==='Space'){e.preventDefault();stop();}};document.addEventListener('keydown',w._key);w._onClose=()=>{document.removeEventListener('keydown',w._key);App.render();};SFX.whoosh();}
};
Actions.roastGame=el=>Roast.open(el.dataset.id,+el.dataset.n||1);
Actions.roastPick=el=>Roast.start(el.closest('.modal-wrap'),+el.dataset.i);

const Blend={slots:[],
  view(){this.slots=this.slots.filter(id=>(S.inv.beans[id]||0)>0);const ids=Object.keys(BEANS).filter(id=>!BEANS[id].blend&&(S.inv.beans[id]||0)>0);
    let h=`<div class="blend-wrap fade-in"><div class="glass ritual-panel glow" style="text-align:center"><h3 class="h3 gold">⚗️ Алхимический тигель</h3><p class="muted" style="font-size:13px;margin:4px 0 10px">Положите 2–3 разных сорта зерна. Верный рецепт рождает редкий купаж с особой силой.</p>
      <div class="cauldron ${this.slots.length>=2?'ready':''}"><div class="cauldron-glow"></div><span class="cauldron-ic">⚗️</span><div class="bubbles"><i></i><i></i><i></i><i></i></div></div>
      <div class="row" style="justify-content:center;gap:10px;margin:12px 0">${[0,1,2].map(i=>{const id=this.slots[i];return id?`<button class="slot full" data-act="blendRm" data-i="${i}">${itemIcon('bean',id)}<span>${esc(BEANS[id].name)}</span></button>`:`<div class="slot">＋</div>`;}).join('')}</div>
      <button class="btn btn-gold btn-lg" data-act="blendGo" ${this.slots.length>=2?'':'disabled'}>🔥 Сплавить в тигле · 50 🪙</button></div>
      <div class="glass ritual-panel"><h3 class="h3 gold" style="margin-bottom:8px">Ваши зёрна</h3>${ids.length?`<div class="grid g-items">${ids.map(id=>{const b=BEANS[id],inS=this.slots.includes(id);
        return `<div class="item click ${inS?'sel':''}" data-act="blendAdd" data-id="${id}"><span class="cnt">×${S.inv.beans[id]}</span>${itemIcon('bean',id,'lg')}${tierBadge(b.tier)}<div class="nm">${esc(b.name)}</div></div>`;}).join('')}</div>`:'<div class="empty">Нет зёрен для купажа.</div>'}</div></div>`;
    h+=`<div class="glass ritual-panel fade-in" style="margin-top:14px"><h3 class="h3 gold" style="margin-bottom:8px">📖 Книга рецептов · ${S.blendsKnown.length}/${BLENDS.length}</h3><div class="grid g-auto">${BLENDS.map(r=>{const k=S.blendsKnown.includes(r.out),b=BEANS[r.out];
      return `<div class="recipe ${k?'':'locked'}">${k?itemIcon('bean',r.out):'<span class="ii">❔</span>'}<div class="sp"><b>${k?esc(b.name):'Неизвестный купаж'}</b> ${k?tierBadge(b.tier):''}<div class="dim" style="font-size:12px">${k?r.in.map(i=>esc(BEANS[i].name)).join(' + ')+'<br><span class="gold">✦ '+esc(b.effName)+'</span>':esc(r.hint)}</div></div></div>`;}).join('')}</div></div>`;
    return h;}
};
Actions.blendAdd=el=>{const id=el.dataset.id,s=Blend.slots;if(s.includes(id))s.splice(s.indexOf(id),1);else if(s.length<3)s.push(id);else{SFX.error();return toast('В тигле только три места','bad');}SFX.rustle();App.render();};
Actions.blendRm=el=>{Blend.slots.splice(+el.dataset.i,1);SFX.click();App.render();};
Actions.blendGo=()=>{const s=Blend.slots;if(s.length<2)return;if(!s.every(id=>(S.inv.beans[id]||0)>0))return App.render();if(!pay({coins:50})){SFX.error();return toast('Нужно 50 🪙','bad');}
  s.forEach(id=>takeItem('bean',id));const rec=BLENDS.find(r=>blendKey(r.in)===blendKey(s)),out=rec?rec.out:'b_chaos',q=rec?rec.q:1,isNew=rec&&!S.blendsKnown.includes(out);
  if(isNew)S.blendsKnown.push(out);addItem('bean',out,q);addXP(rec?25:8);Blend.slots=[];save();
  const cd=$('.cauldron');if(cd)cd.classList.add('boom');SFX.boil();SFX.whoosh();
  setTimeout(()=>{const b=BEANS[out];Modal.open(`<div style="text-align:center"><div class="burst"></div><div style="font-size:14px" class="dim">${rec?(isNew?'✨ Открыт новый рецепт!':'Купаж удался'):'Тигель забурлил и выплюнул…'}</div>
    <div style="margin:14px auto">${itemIcon('bean',out,'lg')}</div><h2 class="h2">${esc(b.name)} ×${q}</h2>${tierBadge(b.tier)}<p class="muted" style="margin:8px 0">${esc(b.desc)}</p><div class="chip" style="border-color:var(--gold)">✦ ${esc(b.effName)} · +${b.luck} удачи</div>
    <button class="btn btn-gold btn-block" data-act="closeModal" style="margin-top:16px">Чудесно</button></div>`);
    if(rec){Confetti.burst(isNew?150:70);SFX.magic();}else SFX.chime();App.render();},700);};
