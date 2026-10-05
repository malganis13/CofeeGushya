/* =====================================================================
   SHARE — карта-предсказание в стиле Таро (PNG 1080×1920 для сторис)
   ===================================================================== */
const Share={
  wrap(x,text,maxW,maxLines){const words=text.split(/\s+/),lines=[];let cur='';
    for(const w of words){const t=cur?cur+' '+w:w;if(x.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;if(lines.length===maxLines)break;}else cur=t;}
    if(lines.length<maxLines&&cur)lines.push(cur);
    if(lines.length===maxLines&&lines.join(' ').length<text.length-1){let l=lines[maxLines-1];while(x.measureText(l+'…').width>maxW&&l.length)l=l.slice(0,-1);lines[maxLines-1]=l.replace(/[\s,.;:—-]+$/,'')+'…';}
    return lines;},
  async make(e){try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;}catch(_){}
    const W=1080,H=1920,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),rng=mulberry32(e.seed);
    let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2b1242');g.addColorStop(.45,'#12091A');g.addColorStop(1,'#0A050E');x.fillStyle=g;x.fillRect(0,0,W,H);
    g=x.createRadialGradient(W/2,560,50,W/2,560,700);g.addColorStop(0,'rgba(143,42,85,.45)');g.addColorStop(1,'rgba(143,42,85,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(let i=0;i<320;i++){x.globalAlpha=.2+rng()*.8;x.fillStyle=rng()<.2?'#F3D98B':'#fff';x.beginPath();x.arc(rng()*W,rng()*H,rng()*2.2,0,7);x.fill();}x.globalAlpha=1;
    const gold=x.createLinearGradient(0,0,W,H);gold.addColorStop(0,'#f6e0a0');gold.addColorStop(.5,'#D4AF37');gold.addColorStop(1,'#9c7a1c');
    x.strokeStyle=gold;x.lineWidth=5;x.strokeRect(40,40,W-80,H-80);x.lineWidth=1.6;x.strokeRect(60,60,W-120,H-120);
    for(const[cx,cy]of[[60,60],[W-60,60],[60,H-60],[W-60,H-60]]){x.fillStyle='#12091A';x.beginPath();x.arc(cx,cy,22,0,7);x.fill();x.stroke();x.fillStyle=gold;x.font='30px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('✦',cx,cy+1);}
    x.textBaseline='alphabetic';x.textAlign='center';
    x.fillStyle=gold;x.font='700 84px "Cormorant Garamond",Georgia,serif';x.fillText('Кофейный Оракул',W/2,170);
    x.fillStyle='rgba(244,236,247,.75)';x.font='500 30px Manrope,"Segoe UI",Arial,sans-serif';x.fillText(`${S.name||'Странница'} · ${new Date(e.ts).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}`,W/2,222);
    x.strokeStyle='rgba(212,175,55,.6)';x.lineWidth=1.5;x.beginPath();x.moveTo(180,258);x.lineTo(500,258);x.moveTo(580,258);x.lineTo(900,258);x.stroke();x.fillStyle=gold;x.font='26px serif';x.fillText('✦ ✦ ✦',W/2,268);
    const gc=document.createElement('canvas');gc.width=gc.height=600;const placed=Grounds.render(gc,e.seed,e.symbols);
    const R0=255,CX=W/2,CY=545;x.save();x.shadowColor='rgba(212,175,55,.6)';x.shadowBlur=50;x.fillStyle='#000';x.beginPath();x.arc(CX,CY,R0,0,7);x.fill();x.restore();
    x.save();x.beginPath();x.arc(CX,CY,R0,0,7);x.clip();x.drawImage(gc,CX-R0*1.035,CY-R0*1.035,R0*2.07,R0*2.07);
    const sc=R0*2.07/600;for(const p of placed){x.strokeStyle='rgba(243,217,139,.9)';x.lineWidth=3;x.setLineDash([10,7]);x.beginPath();x.arc(CX-R0*1.035+p.x*sc,CY-R0*1.035+p.y*sc,p.s*.6*sc,0,7);x.stroke();}x.setLineDash([]);x.restore();
    x.strokeStyle=gold;x.lineWidth=6;x.beginPath();x.arc(CX,CY,R0+4,0,7);x.stroke();x.lineWidth=1.5;x.beginPath();x.arc(CX,CY,R0+20,0,7);x.stroke();
    x.fillStyle='#F3D98B';x.font='600 36px "Cormorant Garamond",Georgia,serif';x.fillText(e.symbols.map(id=>SYMBOLS[id].icon+' '+SYMBOLS[id].name).join('   '),W/2,875);
    x.fillStyle='#fff';x.font='italic 600 44px "Cormorant Garamond",Georgia,serif';x.fillText(this.wrap(x,e.texts.title,900,1)[0],W/2,935);
    let y=1005;
    for(const s of SECTIONS){x.textAlign='left';x.fillStyle='#F3D98B';x.font='700 38px "Cormorant Garamond",Georgia,serif';x.fillText(s.icon+' '+s.title,110,y);y+=44;
      x.fillStyle='rgba(244,236,247,.9)';x.font='500 27px Manrope,"Segoe UI",Arial,sans-serif';const body=e.texts[s.id].split('. ').slice(1).join('. ')||e.texts[s.id];
      for(const l of this.wrap(x,body,860,3)){x.fillText(l,110,y);y+=37;}y+=26;}
    x.textAlign='center';const st=Math.round(e.luck/20);x.fillStyle=gold;x.font='700 40px "Cormorant Garamond",Georgia,serif';x.fillText(`Индекс удачи: ${e.luck}%   ${'★'.repeat(st)}${'☆'.repeat(5-st)}`,W/2,H-170);
    x.fillStyle='rgba(244,236,247,.55)';x.font='500 26px Manrope,"Segoe UI",Arial,sans-serif';x.fillText('☕ Кофейный Оракул · CofeeGushya',W/2,H-110);
    return c;},
  async open(e){const w=Modal.open(`<h2 class="h2">Карта предсказания</h2><p class="muted" style="font-size:13px;margin-bottom:10px">Готово для Telegram и Instagram Stories (1080×1920).</p><div class="empty" id="sharePrev">✨ Оракул рисует карту…</div>`,{cls:'wide'});
    const c=await this.make(e),url=c.toDataURL('image/png'),name=`kofeyny-orakul-${todayStr(new Date(e.ts))}.png`;const box=w.querySelector('#sharePrev');if(!box)return;
    box.outerHTML=`<img class="share-preview" src="${url}" alt="Карта предсказания"><div class="row" style="justify-content:center;margin-top:12px"><a class="btn btn-gold" href="${url}" download="${name}">⬇️ Скачать PNG</a><button class="btn btn-wine" id="nativeShare">📤 Поделиться</button></div>`;
    w.querySelector('#nativeShare').onclick=()=>{c.toBlob(async b=>{const f=new File([b],name,{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'Кофейный Оракул',text:e.texts.title});}catch(_){} }
      else{toast('Ваш браузер не поддерживает «Поделиться» — скачайте PNG','bad');}},'image/png');};SFX.chime();}
};
Actions.share=el=>{const id=el.dataset.id,e=S.history.find(h=>h.id===id)||Ritual.cur;if(e&&e.texts)Share.open(e);};

/* =====================================================================
   GRIMOIRE — история гаданий и атлас знаков
   ===================================================================== */
Views.grimoire=()=>{let h=`<div class="page-head fade-in"><div><h1 class="section-title">Гримуар</h1><p class="subtitle">Книга ваших предсказаний. Каждый узор гущи сохранён — его можно открыть снова и поделиться.</p></div></div>`;
  h+=`<div class="glass ritual-panel fade-in" style="margin-bottom:14px"><h3 class="h3 gold" style="margin-bottom:10px">Атлас знаков</h3><div class="atlas">${Object.keys(SYMBOLS).map(id=>{const n=S.stats.symbols[id]||0,s=SYMBOLS[id];
    return `<div class="sym ${n?'':'lock'}"><span class="e">${n?s.icon:'❔'}</span><b>${n?s.name:'???'}</b><div class="dim">${n?'встречен ×'+n:'не встречен'}</div></div>`;}).join('')}</div></div>`;
  if(!S.history.length)return h+`<div class="glass empty"><span class="big">📜</span>Страницы пока пусты. Проведите первый ритуал, и гуща оставит здесь свой след.<div style="margin-top:12px"><button class="btn btn-gold" data-act="tab" data-tab="ritual">☕ К ритуалу</button></div></div>`;
  return h+`<div class="grid g-auto">${S.history.map(e=>`<div class="glass hist-item fade-in" data-act="gOpen" data-id="${e.id}"><div class="hist-ic">${e.symbols.map(id=>SYMBOLS[id].icon).join('')}</div>
    <div class="sp" style="min-width:0"><b class="serif gold" style="font-size:19px;line-height:1.15;display:block">${esc(e.texts.title)}</b><div class="dim" style="font-size:12px">${fmtDate(e.ts)}</div>
    <div style="font-size:12px;margin-top:4px">${tierBadge(BEANS[e.bean].tier)} ${esc(BEANS[e.bean].name)} · удача <b class="gold">${e.luck}%</b></div></div></div>`).join('')}</div>`;};
Actions.gOpen=el=>{const e=S.history.find(h=>h.id===el.dataset.id);if(!e)return;
  const w=Modal.open(`<div style="text-align:center"><div class="dim" style="font-size:12px">${fmtDate(e.ts)}</div><h2 class="h2" style="font-size:30px">${esc(e.texts.title)}</h2>
    <canvas width="600" height="600" style="width:min(100%,300px);aspect-ratio:1;margin:8px auto;display:block" id="histCv"></canvas><div class="row" style="justify-content:center">${e.symbols.map(id=>`<span class="chip">${SYMBOLS[id].icon} ${SYMBOLS[id].name}</span>`).join('')}</div>
    <div style="margin-top:8px">Индекс удачи: <b class="gold">${e.luck}%</b></div></div>
    ${SECTIONS.map(s=>`<div class="glass fcard f-${s.id}" style="margin-top:12px;min-height:0;cursor:default"><h4>${s.icon} ${s.title}</h4><p>${esc(e.texts[s.id])}</p></div>`).join('')}
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn btn-gold" data-act="share" data-id="${e.id}">🖼️ Карта для сторис</button><button class="btn" data-act="gDel" data-id="${e.id}">🗑️ Удалить</button></div>`,{cls:'wide'});
  Grounds.render(w.querySelector('#histCv'),e.seed,e.symbols);};
Actions.gDel=el=>{if(!confirm('Удалить это предсказание из Гримуара?'))return;S.history=S.history.filter(h=>h.id!==el.dataset.id);save();Modal.close(el.closest('.modal-wrap'));App.render();};

/* =====================================================================
   PROFILE / ONBOARDING / DAILY
   ===================================================================== */
const zodiacGrid=sel=>`<div class="zodiac">${ZODIAC.map(z=>`<button class="${sel===z.id?'on':''}" data-act="pickZodiac" data-id="${z.id}"><span class="zi">${z.i}</span>${z.name}</button>`).join('')}</div>`;
Actions.pickZodiac=el=>{$$('.zodiac button',el.closest('.modal')).forEach(b=>b.classList.toggle('on',b===el));el.closest('.modal')._z=el.dataset.id;SFX.click();};
const Onboard={show(){const w=Modal.open(`<div style="text-align:center"><div style="font-size:56px;filter:drop-shadow(0 0 20px rgba(212,175,55,.6))">☕</div><h2 class="h2" style="font-size:32px">Кофейный Оракул</h2>
  <p class="muted" style="font-size:14px">Добро пожаловать в тайную кофейню, где судьбу читают по гуще. Выращивайте зёрна, открывайте сокровища богинь и узнайте, что звёзды приготовили для вашего сердца.</p></div>
  <div class="divider star"></div><label class="dim" style="font-size:12px">Как вас называть?</label><input class="field" id="obName" maxlength="24" placeholder="Например, Алиса" style="margin:6px 0 14px">
  <label class="dim" style="font-size:12px">Ваш знак зодиака</label><div style="margin:6px 0 16px">${zodiacGrid('')}</div>
  <button class="btn btn-gold btn-lg btn-block" data-act="obDone">✨ Войти в кофейню</button>`,{noClose:true});setTimeout(()=>{const i=w.querySelector('#obName');if(i)i.focus();},300);}};
Actions.obDone=el=>{const m=el.closest('.modal'),name=m.querySelector('#obName').value.trim();if(!name){m.querySelector('#obName').focus();SFX.error();return toast('Назовите своё имя Оракулу','bad');}
  if(!m._z){SFX.error();return toast('Выберите знак зодиака','bad');}S.name=name;S.zodiac=m._z;S.onboarded=true;save();Modal.close(el.closest('.modal-wrap'));SFX.magic();Confetti.burst(100);App.updateHUD();App.render();setTimeout(()=>Daily.check(),500);};
const Daily={
  status(){const t=todayStr();if(S.lastDaily===t)return{claimed:true,day:S.streak};const cont=S.lastDaily&&dayDiff(S.lastDaily,t)===1;return{claimed:false,day:cont?S.streak+1:1};},
  check(){const st=this.status();if(!st.claimed)this.show();},
  show(){const st=this.status(),cur=((st.day-1)%7);
    Modal.open(`<div style="text-align:center"><div style="font-size:48px">🎁</div><h2 class="h2">Дары нового дня</h2><p class="muted" style="font-size:13.5px">Серия посещений: <b class="gold">${st.day} ${plural(st.day,['день','дня','дней'])}</b>. Не пропускайте дни — награды растут, а удача в гаданиях повышается.</p></div>
      <div class="daily-grid">${DAILY.map((d,i)=>`<div class="dday ${i<cur||(st.claimed&&i===cur)?'past':i===cur?'now':''}"><b>День ${i+1}</b><span class="e">${d.e}</span>${d.label}</div>`).join('')}</div>
      <button class="btn btn-gold btn-lg btn-block" data-act="dailyClaim" ${st.claimed?'disabled':''}>${st.claimed?'Уже получено сегодня':'Получить дары'}</button>`);},
  claim(){const st=this.status();if(st.claimed)return;const d=DAILY[(st.day-1)%7];S.streak=st.day;S.lastDaily=todayStr();if(d.coins)addItem('coins',0,d.coins);if(d.crystals)S.crystals+=d.crystals;(d.items||[]).forEach(([t,id,q])=>addItem(t,id,q));
    addXP(15);save();SFX.magic();Confetti.burst(120);toast(`🎁 Получено: ${d.label}`,'gold');App.updateHUD();App.render();}
};
Actions.dailyClaim=el=>{Daily.claim();Modal.close(el.closest('.modal-wrap'));};
Actions.daily=()=>Daily.show();
Actions.profile=()=>{const z=ZODIAC.find(q=>q.id===S.zodiac);const w=Modal.open(`<div class="row"><span class="ii lg" style="border-radius:50%">${z?z.i:'🔮'}</span><div><h2 class="h2" style="margin:0">${esc(S.name||'Странница')}</h2><div class="dim" style="font-size:13px">${z?z.name:'Знак не выбран'} · уровень ${S.level}</div></div></div>
  <div class="luck-meter" style="margin:12px 0 4px"><i style="width:${S.xp/xpNeed(S.level)*100}%"></i></div><div class="dim" style="font-size:12px">Опыт: ${fmt(S.xp)} / ${fmt(xpNeed(S.level))}</div>
  <div class="stat-grid" style="margin:14px 0"><div><b>${S.stats.readings}</b>гаданий</div><div><b>${S.stats.cases}</b>кейсов открыто</div><div><b>${fmt(S.stats.rawTotal)}</b>зёрен собрано</div><div><b>${S.streak} 🔥</b>серия дней</div><div><b>${S.stats.bestLuck}%</b>лучшая удача</div><div><b>${Object.keys(S.stats.symbols).length}/9</b>знаков в атласе</div></div>
  <div class="divider"></div><label class="dim" style="font-size:12px">Имя</label><input class="field" id="pfName" maxlength="24" value="${esc(S.name)}" style="margin:6px 0 12px">
  <label class="dim" style="font-size:12px">Знак зодиака</label><div style="margin:6px 0 14px">${zodiacGrid(S.zodiac)}</div>
  <div class="row" style="margin-bottom:14px"><span class="sp">🔊 Звуки</span><button class="switch ${S.settings.sound?'on':''}" data-act="toggleSound" aria-label="Звук"></button></div>
  <div class="row"><button class="btn btn-gold sp" data-act="pfSave">Сохранить</button><button class="btn" data-act="daily">🎁 Ежедневные дары</button></div>
  <div class="row" style="margin-top:10px"><button class="btn btn-sm sp" data-act="exportSave">⬇️ Экспорт сохранения</button><button class="btn btn-sm sp" data-act="importSave">⬆️ Импорт</button><button class="btn btn-sm sp" data-act="resetSave" style="color:#ff8fb0">Сбросить прогресс</button></div>`);
  w.querySelector('.modal')._z=S.zodiac;};
Actions.toggleSound=el=>{S.settings.sound=!S.settings.sound;el.classList.toggle('on',S.settings.sound);save();SFX.click();};
Actions.pfSave=el=>{const m=el.closest('.modal'),n=m.querySelector('#pfName').value.trim();if(n)S.name=n;if(m._z)S.zodiac=m._z;save();Modal.close(el.closest('.modal-wrap'));toast('Профиль сохранён','good');App.updateHUD();App.render();};
Actions.exportSave=()=>{const b=new Blob([JSON.stringify(S)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='kofeyny-orakul-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);};
Actions.importSave=()=>{const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=()=>{const f=i.files[0];if(!f)return;f.text().then(t=>{try{const d=JSON.parse(t);if(!d||typeof d!=='object'||!d.plants)throw 0;
  S=deepMerge(newState(),d);S.lastTick=Date.now();save();location.reload();}catch(_){toast('Файл сохранения повреждён','bad');}});};i.click();};
Actions.resetSave=()=>{if(!confirm('Сбросить весь прогресс? Это действие необратимо.'))return;localStorage.removeItem(SAVE_KEY);S=newState();save();location.reload();};
