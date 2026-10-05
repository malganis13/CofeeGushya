/* =====================================================================
   RITUAL — ритуал варки (4 шага), чтение гущи, предсказание
   ===================================================================== */
const CEZVE_SVG=`<svg class="cezve" viewBox="0 0 220 240" aria-hidden="true">
 <defs><linearGradient id="czg" x1="0" x2="1"><stop offset="0" stop-color="#6b3d14"/><stop offset=".45" stop-color="#f0c56a"/><stop offset="1" stop-color="#5e3410"/></linearGradient>
 <radialGradient id="flg" cx=".5" cy=".8" r=".7"><stop offset="0" stop-color="#fff3b0"/><stop offset=".45" stop-color="#ff9a3c"/><stop offset="1" stop-color="#c2185b" stop-opacity="0"/></radialGradient>
 <clipPath id="czc"><path d="M55 60 L165 60 L152 196 Q110 210 68 196 Z"/></clipPath></defs>
 <rect x="160" y="70" width="64" height="12" rx="6" fill="#3b1d10" stroke="#D4AF37" stroke-width="1" transform="rotate(-16 160 76)"/>
 <g clip-path="url(#czc)"><rect x="40" y="40" width="140" height="180" fill="#1a0c05"/><rect id="coffeeRect" x="40" y="164" width="140" height="80" fill="#3b1e0c"/><rect id="foamRect" x="40" y="150" width="140" height="16" fill="#c8945c"/></g>
 <path d="M55 60 L165 60 L152 196 Q110 210 68 196 Z" fill="none" stroke="url(#czg)" stroke-width="8" stroke-linejoin="round"/>
 <ellipse cx="110" cy="60" rx="56" ry="7" fill="none" stroke="#F3D98B" stroke-width="3"/>
 <path id="drips" d="M62 60 q-4 14 -2 28 M158 60 q4 12 2 24" stroke="#c8945c" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>
 <g class="flame" style="transform-box:fill-box"><ellipse cx="85" cy="222" rx="14" ry="20" fill="url(#flg)"/><ellipse cx="110" cy="220" rx="17" ry="24" fill="url(#flg)"/><ellipse cx="135" cy="222" rx="14" ry="20" fill="url(#flg)"/></g>
 <rect x="50" y="234" width="120" height="5" rx="2.5" fill="#2b1b2f" stroke="#D4AF37" stroke-width=".8"/></svg>`;
const CUP_SVG=`<svg class="flip-cup" id="flipCup" viewBox="0 0 170 150" aria-hidden="true"><defs><linearGradient id="cpg" x1="0" x2="1"><stop offset="0" stop-color="#cdb89c"/><stop offset=".4" stop-color="#fbf4ea"/><stop offset="1" stop-color="#b9a283"/></linearGradient></defs>
 <path d="M138 45 q34 4 26 34 q-6 22 -34 22" fill="none" stroke="#e8dac6" stroke-width="10" stroke-linecap="round"/>
 <path d="M18 20 L142 20 Q138 118 80 132 Q22 118 18 20 Z" fill="url(#cpg)" stroke="#D4AF37" stroke-width="3"/>
 <ellipse cx="80" cy="20" rx="62" ry="10" fill="#3b1e0c" stroke="#D4AF37" stroke-width="3"/>
 <path d="M40 60 q40 14 80 0" stroke="#D4AF37" stroke-width="2" fill="none" opacity=".7"/><text x="80" y="95" text-anchor="middle" font-size="20" fill="#9c7a1c">✦ ☾ ✦</text></svg>`;

const Ritual={step:1,sel:{bean:null,cup:'clay',spice:null,charm:null},brew:null,cur:null,raf:0,typeTok:0,hint:null,
  stepsHTML(){const names=['Зерно','Чаша','Варка','Переворот','Гадание'],idx={1:0,2:1,3:2,4:3,reading:4,fortune:4}[this.step];
    return `<div class="steps">${names.map((n,i)=>`${i?'<span class="stp-line"></span>':''}<div class="stp ${i===idx?'on':i<idx?'done':''}"><span class="n">${i<idx?'✓':i+1}</span><span class="l">${n}</span></div>`).join('')}</div>`;},
  luckBase(){const b=BEANS[this.sel.bean],c=CUPS[this.sel.cup],sp=SPICES[this.sel.spice];return 10+(b?b.luck:0)+(c?c.luck:0)+(sp?sp.luck:0)+Math.min(S.streak,7)+(b?Math.round(S.roastQ[this.sel.bean]||0):0)+3*tal('starluck');},
  greet(){const h=new Date().getHours(),n=esc(S.name||'Странница');return (h<5?'Доброй ночи':h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер')+', '+n+'.';},
  view(){cancelAnimationFrame(this.raf);const f={1:'v1',2:'v2',3:'v3',4:'v4',reading:'vReading',fortune:'vFortune'}[this.step];return this.stepsHTML()+this[f]();},
  mount(){if(this.step===3)this.mountBrew();if(this.step==='reading')this.mountReading();if(this.step==='fortune')this.mountFortune();},
  footer(back,next,nextLabel,enabled,extra=''){const est=clamp(this.luckBase(),1,99);
    return `<div class="glass ritual-panel" style="margin-top:14px"><div class="row"><div class="sp" style="min-width:200px"><div class="dim" style="font-size:12px">Сила будущего видения ≈ ${est}%</div><div class="luck-meter"><i style="width:${est}%"></i></div></div>
      ${back?`<button class="btn" data-act="rStep" data-s="${back}">‹ Назад</button>`:''}${extra}<button class="btn btn-gold" data-act="rStep" data-s="${next}" ${enabled?'':'disabled'}>${nextLabel} ›</button></div></div>`;},
  v1(){const ids=Object.keys(BEANS).filter(id=>S.inv.beans[id]>0);if(this.sel.bean&&!ids.includes(this.sel.bean))this.sel.bean=null;
    let h=Guests.bannerHTML()+`<div class="glass ritual-hero glow fade-in"><div style="font-size:46px">☕</div><h1 class="section-title">Ритуал Варки</h1><p class="subtitle" style="margin:8px auto 0">${this.greet()} Выберите зерно для гадания — чем оно реже, тем глубже видение и больше знаков проступит на дне чашки.</p></div>`;
    if(!ids.length)return h+`<div class="glass empty" style="margin-top:14px"><span class="big">🫙</span>Зёрна закончились. Обжарьте урожай плантаций или откройте сундучок.<div class="row" style="justify-content:center;margin-top:12px"><button class="btn btn-gold" data-act="tab" data-tab="shop" data-sub="roast">🔥 Обжарка</button><button class="btn btn-wine" data-act="tab" data-tab="cases">🎁 Сундучки</button></div></div>`;
    h+=`<h3 class="h3 gold" style="margin:16px 2px 10px">Ваши зёрна</h3><div class="grid g-items">`+ids.map(id=>{const b=BEANS[id];
      return `<div class="item click ${this.sel.bean===id?'sel':''}" data-act="rSel" data-k="bean" data-id="${id}"><span class="cnt">×${S.inv.beans[id]}</span>${itemIcon('bean',id,'lg')}${tierBadge(b.tier)}<div class="nm">${esc(b.name)}</div><div class="ds">${esc(b.desc)}</div><div class="gold" style="font-size:12px;font-weight:700">+${b.luck+Math.round(S.roastQ[id]||0)} удачи · ${b.eff==='chaos'?'3–6':symCount(id)} ${plural(symCount(id),['знак','знака','знаков'])}</div>${b.effName?`<div class="chip" style="font-size:11px;padding:2px 8px">✦ ${esc(b.effName)}</div>`:''}${S.roastQ[id]>=1?`<div class="dim" style="font-size:11px">🔥 обжарка +${Math.round(S.roastQ[id])}</div>`:''}</div>`;}).join('')+'</div>';
    return h+this.footer(0,2,'Далее',!!this.sel.bean);},
  v2(){if(!this.sel.bean){this.step=1;return this.v1();}if(!hasItem('cup',this.sel.cup))this.sel.cup='clay';if(this.sel.spice&&!hasItem('spice',this.sel.spice))this.sel.spice=null;if(this.sel.charm&&!hasItem('charm',this.sel.charm))this.sel.charm=null;
    const cups=Object.keys(CUPS).filter(id=>S.inv.cups[id]>0),sp=Object.keys(SPICES).filter(id=>S.inv.spices[id]>0),ch=Object.keys(CHARMS).filter(id=>S.inv.charms[id]>0);
    const none=(k,l,e)=>`<div class="item click ${!this.sel[k]?'sel':''}" data-act="rSel" data-k="${k}" data-id=""><span class="ii lg">${e}</span><div class="nm">${l}</div></div>`;
    let h=Guests.bannerHTML()+`<div class="glass ritual-hero fade-in" style="padding:18px"><h2 class="h2">Чаша и Пряность</h2><p class="muted" style="font-size:14px">Чаша остаётся с вами навсегда. Пряности и амулеты расходуются в ритуале и направляют предсказание.</p></div>`;
    h+=`<h3 class="h3 gold" style="margin:16px 2px 10px">Чаша</h3><div class="grid g-items">`+cups.map(id=>{const c=CUPS[id];return `<div class="item click ${this.sel.cup===id?'sel':''}" data-act="rSel" data-k="cup" data-id="${id}">${itemIcon('cup',id,'lg')}${tierBadge(c.tier)}<div class="nm">${esc(c.name)}</div><div class="ds">${esc(c.desc)}</div><div class="gold" style="font-size:12px;font-weight:700">+${c.luck} удачи</div></div>`;}).join('')+'</div>';
    h+=`<h3 class="h3 gold" style="margin:16px 2px 10px">Пряность</h3><div class="grid g-items">${none('spice','Без пряности','🚫')}`+sp.map(id=>{const s=SPICES[id];return `<div class="item click ${this.sel.spice===id?'sel':''}" data-act="rSel" data-k="spice" data-id="${id}"><span class="cnt">×${S.inv.spices[id]}</span>${itemIcon('spice',id,'lg')}${tierBadge(s.tier)}<div class="nm">${esc(s.name)}</div><div class="ds">${esc(s.desc)}</div></div>`;}).join('')+'</div>';
    h+=`<h3 class="h3 gold" style="margin:16px 2px 10px">Амулет</h3><div class="grid g-items">${none('charm','Без амулета','🚫')}`+ch.map(id=>{const s=CHARMS[id];return `<div class="item click ${this.sel.charm===id?'sel':''}" data-act="rSel" data-k="charm" data-id="${id}"><span class="cnt">×${S.inv.charms[id]}</span>${itemIcon('charm',id,'lg')}${tierBadge(s.tier)}<div class="nm">${esc(s.name)}</div><div class="ds">${esc(s.desc)}</div></div>`;}).join('')+'</div>';
    return h+this.footer(1,3,'Начать варку',true);},
  v3(){return `<div class="brew-wrap fade-in"><div class="glass stir-box glow"><h2 class="h2">1. Размешайте</h2><p class="muted" style="font-size:13px">Ведите пальцем или мышью по кругу внутри чашки — три полных оборота, загадывая желание.</p>
      <canvas id="stirCanvas" width="300" height="300"></canvas><div class="prog"><i id="stirProg"></i></div></div>
    <div class="glass heat-box locked" id="heatBox"><h2 class="h2">2. Нагрейте</h2><p class="muted" style="font-size:13px">Удерживайте кнопку. Отпустите, когда пенка поднимется к золотой черте — но не дайте кофе убежать!</p>
      <div class="cezve-area" id="cezveArea"><div class="cz-wrap"><canvas id="steamCv" width="200" height="200"></canvas>${CEZVE_SVG}</div><div class="gauge"><div class="zone"></div><div class="fill" id="gaugeFill"></div></div></div>
      <button class="btn btn-wine btn-lg hold-btn" id="heatBtn" style="min-width:250px">🔥 Удерживать огонь</button><div id="heatRes" class="gold serif" style="font-size:19px;min-height:26px"></div></div></div>
    <div class="glass ritual-panel" style="margin-top:14px"><div class="row"><div class="sp muted" style="font-size:13px">Варка кофе по-турецки — первая часть таинства.</div><button class="btn btn-gold" id="brewNext" data-act="rStep" data-s="4" disabled>К перевороту ›</button></div></div>`;},
  mountBrew(){Steam.parts=[];const b=this.brew={stir:0,heat:0,heating:false,heatDone:false,bonus:0,msg:''};const c=$('#stirCanvas');if(!c)return;const x=c.getContext('2d'),C=150;
    let ang=0,acc=0,last=0,down=false,drift=0,spoonA=-.8,lt=performance.now(),spark=[];
    const pos=e=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*300/r.width,y:(e.clientY-r.top)*300/r.height};};
    c.addEventListener('pointerdown',e=>{down=true;try{c.setPointerCapture(e.pointerId);}catch(_){}const p=pos(e);last=Math.atan2(p.y-C,p.x-C);SFX.ensure();});
    c.addEventListener('pointermove',e=>{if(!down||b.stir>=1)return;const p=pos(e);if(Math.hypot(p.x-C,p.y-C)<16)return;const a=Math.atan2(p.y-C,p.x-C);let d=a-last;
      if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;last=a;spoonA=a;acc+=Math.abs(d);ang+=d;b.stir=Math.min(1,acc/(Math.PI*6));$('#stirProg').style.width=b.stir*100+'%';
      if(Math.random()<.1){SFX.bubble();spark.push({x:p.x,y:p.y,l:30});}if(b.stir>=1){$('#heatBox').classList.remove('locked');SFX.chime();toast('☕ Кофе размешан. Теперь — огонь.','gold');}});
    const up=()=>{down=false;};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
    const hb=$('#heatBtn'),area=$('#cezveArea');
    const startH=e=>{e.preventDefault();if(b.heatDone||b.stir<1)return;try{hb.setPointerCapture(e.pointerId);}catch(_){}b.heating=true;area.classList.add('heating');hb.textContent='🔥 Греем…';};
    const stopH=()=>{if(!b.heating)return;b.heating=false;area.classList.remove('heating');if(b.heat<8){hb.textContent='🔥 Удерживать огонь';return;}this.evalHeat(false);};
    hb.addEventListener('pointerdown',startH);['pointerup','pointercancel','lostpointercapture'].forEach(ev=>hb.addEventListener(ev,stopH));
    hb.addEventListener('contextmenu',e=>e.preventDefault());
    const loop=t=>{if(!c.isConnected)return;const dt=Math.min(.05,(t-lt)/1000);lt=t;drift+=dt*.35;
      if(b.heating){b.heat+=dt*(26+b.heat*.32);if(Math.random()<.09)SFX.boil();if(b.heat>=100){b.heat=100;b.heating=false;area.classList.remove('heating');this.evalHeat(true);}}
      const fy=150-b.heat*.92;const fr=$('#foamRect'),cr=$('#coffeeRect');if(fr){fr.setAttribute('y',fy);cr.setAttribute('y',fy+14);}
      $('#gaugeFill').style.height=b.heat+'%';Steam.step($('#steamCv'),dt,b.heat,b.heating);
      x.clearRect(0,0,300,300);let g=x.createRadialGradient(C,C,100,C,C,148);g.addColorStop(0,'#e8dac6');g.addColorStop(1,'#a88c6c');x.fillStyle=g;x.beginPath();x.arc(C,C,146,0,7);x.fill();
      x.strokeStyle='#D4AF37';x.lineWidth=4;x.beginPath();x.arc(C,C,143,0,7);x.stroke();
      g=x.createRadialGradient(C-10,C-15,10,C,C,125);g.addColorStop(0,'#7a4a26');g.addColorStop(.6,'#4a2812');g.addColorStop(1,'#2a1408');x.fillStyle=g;x.beginPath();x.arc(C,C,124,0,7);x.fill();
      x.save();x.translate(C,C);x.rotate(ang+drift);for(let k=0;k<3;k++){x.rotate(2.094);x.strokeStyle=`rgba(214,170,120,${.22+b.stir*.4})`;x.lineWidth=3;x.beginPath();
        for(let q=0;q<1;q+=.02){const r=8+q*110,a=q*5.2;q?x.lineTo(Math.cos(a)*r,Math.sin(a)*r):x.moveTo(Math.cos(a)*r,Math.sin(a)*r);}x.stroke();}x.restore();
      x.strokeStyle='rgba(200,150,95,.45)';x.lineWidth=6;x.beginPath();x.arc(C,C,119,0,7);x.stroke();
      x.save();x.translate(C,C);x.rotate(spoonA);x.strokeStyle='#d8d8e2';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(60,0);x.lineTo(175,0);x.stroke();x.fillStyle='#c9c9d4';x.beginPath();x.ellipse(52,0,16,10,0,0,7);x.fill();x.restore();
      spark=spark.filter(s=>s.l-->0);for(const s of spark){x.fillStyle=`rgba(243,217,139,${s.l/30})`;x.font='14px serif';x.fillText('✦',s.x,s.y-(30-s.l));}
      if(b.stir>=1){x.fillStyle='rgba(243,217,139,.9)';x.font='600 22px "Cormorant Garamond",Georgia,serif';x.textAlign='center';x.fillText('✓ Готово',C,C+6);x.textAlign='left';}
      this.raf=requestAnimationFrame(loop);};
    this.raf=requestAnimationFrame(loop);},
  evalHeat(over){const b=this.brew,h=b.heat;b.heatDone=true;
    if(over){b.bonus=-5;b.msg='Кофе убежал! Но и в этом есть знак…';const d=$('#drips');if(d)d.setAttribute('opacity','1');SFX.error();}
    else if(h>=72&&h<=88){b.bonus=15;b.msg='Идеальная пенка! Духи кофе довольны (+15 к удаче).';SFX.magic();Confetti.burst(50);}
    else if((h>=62&&h<72)||h>88){b.bonus=7;b.msg='Хорошая пенка — видение будет ясным (+7).';SFX.chime();}
    else if(h>=40){b.bonus=2;b.msg='Пенка едва поднялась… (+2)';SFX.click();}
    else{b.bonus=0;b.msg='Кофе почти не нагрелся — видение будет туманным.';SFX.click();}
    $('#heatRes').textContent=b.msg;$('#heatBtn').disabled=true;$('#heatBtn').textContent='Огонь погашен';$('#brewNext').disabled=false;},
  v4(){return `<div class="glass ritual-panel glow fade-in" style="text-align:center"><h2 class="h2">Переворот чашки</h2><p class="muted" style="font-size:14px;max-width:460px;margin:0 auto">Сделайте последний глоток, оставив немного гущи. Задайте мысленно вопрос, накройте чашку блюдцем и переверните её от себя.</p>
     <div class="flip-stage"><div class="saucer"></div>${CUP_SVG}</div><div id="flipMsg" style="min-height:64px"></div>
     <button class="btn btn-gold btn-lg" data-act="rFlip" id="flipBtn">🔄 Перевернуть чашку</button></div>`;},
  startReading(){const sel=this.sel,bean=BEANS[sel.bean];if(!bean||!takeItem('bean',sel.bean)){toast('Зерно не найдено в запасах','bad');this.step=1;return App.render();}
    if(sel.spice){if(!takeItem('spice',sel.spice))sel.spice=null;else if(Math.random()<.12*tal('goldhands')){addItem('spice',sel.spice,1);setTimeout(()=>toast('✋ Золотые руки сберегли пряность!','gold'),400);}}
    if(sel.charm&&!takeItem('charm',sel.charm))sel.charm=null;
    const seed=(Math.random()*4294967296)>>>0,rng=mulberry32((seed^0xA5A5A5)>>>0),n=symCount(sel.bean,rng);
    const symbols=Grounds.chooseSymbols(rng,n,sel.spice,{rare:bean.eff==='rare',legend:bean.eff==='legend',love:bean.eff==='love'}),luck=clamp(Math.round(this.luckBase()+(this.brew?this.brew.bonus:0)+R.int(0,15)),1,99);
    this.cur={id:Date.now().toString(36),seed,ts:Date.now(),bean:sel.bean,cup:sel.cup,spice:sel.spice,charm:sel.charm,luck,symbols,found:[],hints:0,brewMsg:this.brew?this.brew.msg:''};
    S.pending=this.cur;this.step='reading';this.hint=null;save();App.render();App.updateHUD();},
  foundHTML(){const r=this.cur;return r.symbols.map((_,i)=>{const id=r.found[i];if(!id)return `<div class="found"><span class="si">❔</span><div><b>Скрытый знак</b><div class="dim" style="font-size:12px">Ищите очертания в гуще</div></div></div>`;
      const s=SYMBOLS[id];return `<div class="found ok"><span class="si">${s.icon}</span><div><b class="gold">${s.name}</b><div class="dim" style="font-size:12px">${s.meaning}</div></div></div>`;}).join('');},
  vReading(){const r=this.cur;return Guests.bannerHTML()+`<div class="reading-layout fade-in"><div class="glass cup-wrap glow"><canvas id="groundsCanvas" width="600" height="600"></canvas><div class="dim" style="font-size:12.5px">Коснитесь очертаний в гуще, чтобы раскрыть знак</div></div>
    <div class="glass reading-side"><div><h2 class="h2">Чтение гущи</h2><p class="muted" style="font-size:13px">${esc(r.brewMsg||'')} Сила видения: <b class="gold">${r.luck}%</b></p></div>
    <div>Найдено знаков: <b class="gold" id="foundCount">${r.found.length}</b> из ${r.symbols.length}</div><div class="found-list" id="foundList">${this.foundHTML()}</div>
    <button class="btn btn-block" data-act="rHint">💫 Подсказка Оракула · ${r.hints>=1+tal('eye')?'2 💎':'бесплатно · '+(1+tal('eye')-r.hints)}</button>
    <button class="btn btn-gold btn-lg btn-block" data-act="rInterpret" id="interpretBtn" ${r.found.length?'':'disabled'}>📜 Истолковать знаки</button>
    <p class="dim" style="font-size:11.5px;text-align:center">Найдите все знаки сами — получите бонус зоркости +30% к наградам.</p></div></div>`;},
  mountReading(){const r=this.cur,c=$('#groundsCanvas');if(!c)return;const base=document.createElement('canvas');base.width=base.height=600;const placed=Grounds.render(base,r.seed,r.symbols);
    const x=c.getContext('2d');let ripple=null;const glow={};r.found.forEach(id=>glow[id]=0);this._placed=placed;
    c.addEventListener('click',e=>{const rc=c.getBoundingClientRect(),px=(e.clientX-rc.left)*600/rc.width,py=(e.clientY-rc.top)*600/rc.height;
      const hit=placed.find(p=>!r.found.includes(p.id)&&Math.hypot(p.x-px,p.y-py)<p.s*.62);
      if(hit){r.found.push(hit.id);glow[hit.id]=performance.now();this.hint=null;SFX.find();const s=SYMBOLS[hit.id];toast(`${s.icon} Знак <b>${s.name}</b> — ${s.meaning}`,'gold');this.updateFound();save();
        if(r.found.length===r.symbols.length){Confetti.burst(80);toast('👁️ Все знаки раскрыты! Бонус зоркости +30%','gold');}}
      else{ripple={x:px,y:py,t:performance.now()};SFX.click();}});
    const loop=t=>{if(!c.isConnected)return;x.clearRect(0,0,600,600);x.drawImage(base,0,0);
      if(this.hint){const k=(t-this.hint.t)/3500;if(k>1)this.hint=null;else{const a=Math.sin(k*Math.PI)*(.55+.25*Math.sin(t/150));const g=x.createRadialGradient(this.hint.x,this.hint.y,0,this.hint.x,this.hint.y,95);
        g.addColorStop(0,`rgba(243,217,139,${a*.55})`);g.addColorStop(1,'rgba(243,217,139,0)');x.fillStyle=g;x.beginPath();x.arc(this.hint.x,this.hint.y,95,0,7);x.fill();}}
      for(const p of placed){if(!r.found.includes(p.id))continue;const k=Math.min(1,(t-(glow[p.id]||0))/500),rr=p.s*.62*(.6+.4*k);
        x.save();x.globalAlpha=k;x.shadowColor='#D4AF37';x.shadowBlur=18;x.strokeStyle='rgba(243,217,139,.95)';x.lineWidth=3;x.setLineDash([9,6]);x.lineDashOffset=-t/40;
        x.beginPath();x.arc(p.x,p.y,rr,0,7);x.stroke();x.setLineDash([]);x.shadowBlur=0;const s=SYMBOLS[p.id],lbl=s.icon+' '+s.name;x.font='700 22px "Cormorant Garamond",Georgia,serif';
        const w=x.measureText(lbl).width+20,ly=Math.min(575,p.y+rr+20);x.fillStyle='rgba(18,9,26,.82)';x.beginPath();x.roundRect?x.roundRect(p.x-w/2,ly-17,w,30,15):x.rect(p.x-w/2,ly-17,w,30);x.fill();
        x.strokeStyle='rgba(212,175,55,.7)';x.lineWidth=1;x.stroke();x.fillStyle='#F3D98B';x.textAlign='center';x.fillText(lbl,p.x,ly+5);x.restore();}
      if(ripple){const k=(t-ripple.t)/600;if(k>1)ripple=null;else{x.strokeStyle=`rgba(255,255,255,${.6*(1-k)})`;x.lineWidth=2;x.beginPath();x.arc(ripple.x,ripple.y,10+k*30,0,7);x.stroke();}}
      this.raf=requestAnimationFrame(loop);};
    this.raf=requestAnimationFrame(loop);},
  updateFound(){const r=this.cur;$('#foundList').innerHTML=this.foundHTML();$('#foundCount').textContent=r.found.length;$('#interpretBtn').disabled=!r.found.length;},
  vFortune(){const r=this.cur,t=r.texts,st=Math.round(r.luck/20),rw=r.rewards||{};
    return `<div class="glass fortune-head glow fade-in"><div class="dim" style="font-size:12.5px">${fmtDate(r.ts)}</div><div class="ttl">${esc(t.title)}</div>
      <div class="row" style="justify-content:center;margin:12px 0">${r.symbols.map(id=>`<span class="chip">${SYMBOLS[id].icon} ${SYMBOLS[id].name}</span>`).join('')}</div>
      <div>Индекс удачи: <b class="gold">${r.luck}%</b> <span class="stars5">${'★'.repeat(st)}${'☆'.repeat(5-st)}</span></div><div class="luck-meter" style="max-width:320px;margin:6px auto"><i style="width:${r.luck}%"></i></div>
      <div class="vn-oracle"><div class="oracle-ava">🔮</div><div class="serif" style="font-style:italic;font-size:19px;color:var(--text-2)">«Слушай же, ${esc(S.name||'Странница')}, что поведала гуща…»</div></div></div>
    <div class="fortune-grid">${SECTIONS.map(s=>`<div class="glass fcard f-${s.id}" data-sec="${s.id}" data-act="skipType"><h4>${s.icon} ${s.title}</h4><p></p></div>`).join('')}</div>
    ${Tarot.panelHTML(r)}<div class="glass reward-box"><b class="serif gold" style="font-size:20px">Дары Оракула:</b>${rw.legend?`<span class="chip" style="border-color:var(--tS)">🐉 Легендарный знак ×${rw.legend}</span>`:''}<span class="chip">🪙 +${fmt(rw.coins||0)}</span><span class="chip">⭐ +${rw.xp||0} опыта</span>${rw.crystals?`<span class="chip">💎 +${rw.crystals}</span>`:''}${rw.sharp?'<span class="chip">👁️ Зоркость +30%</span>':''}${rw.mult>1?`<span class="chip">${CHARMS[r.charm].icon} ×${rw.mult}</span>`:''}</div>
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn btn-gold btn-lg" data-act="share" data-id="${r.id}">🖼️ Карта для сторис</button><button class="btn btn-wine btn-lg" data-act="rNew">☕ Новое гадание</button><button class="btn btn-lg" data-act="tab" data-tab="grimoire">📜 Гримуар</button></div>`;},
  mountFortune(){const r=this.cur,tok=++this.typeTok;const cards=$$('.fcard');
    if(r._typed){cards.forEach(c=>c.querySelector('p').textContent=r.texts[c.dataset.sec]);return;}
    let i=0;const next=()=>{if(tok!==this.typeTok||i>=cards.length){r._typed=true;return;}const c=cards[i],txt=r.texts[c.dataset.sec],p=c.querySelector('p');c.classList.add('typing');let k=0;
      const step=()=>{if(tok!==this.typeTok){return;}if(c._skip){k=txt.length;}k=Math.min(txt.length,k+2);p.textContent=txt.slice(0,k);if(k<txt.length)setTimeout(step,16);else{c.classList.remove('typing');i++;setTimeout(next,250);}};step();};
    next();}
};
Views.ritual=()=>Ritual.view();
Actions.rSel=el=>{const k=el.dataset.k;Ritual.sel[k]=el.dataset.id||null;if(k==='bean')SFX.rustle();else if(k==='cup')SFX.porcelain();else SFX.click();App.render(true);};
Actions.rStep=el=>{const s=+el.dataset.s;if(s===2&&!Ritual.sel.bean)return;if(s===4&&!(Ritual.brew&&Ritual.brew.heatDone))return;Ritual.step=s;SFX.click();App.render();scrollTo({top:0,behavior:'smooth'});};
Actions.rFlip=el=>{el.disabled=true;$('#flipCup').classList.add('flipped');SFX.whoosh();let n=3;const m=$('#flipMsg');
  setTimeout(()=>{SFX.porcelain();const tick=()=>{if(!m.isConnected)return;if(n===0){Ritual.startReading();return;}m.innerHTML=`<div class="drip-count">${n}</div><div class="dim">Гуща стекает по стенкам…</div>`;SFX.bubble();n--;setTimeout(tick,900);};tick();},1300);};
Actions.rHint=()=>{const r=Ritual.cur,left=(Ritual._placed||[]).filter(p=>!r.found.includes(p.id));if(!left.length)return;if(r.hints>=1+tal('eye')){if(!pay({crystals:2})){SFX.error();return toast('Нужно 2 💎','bad');}}
  r.hints++;const p=left[Math.floor(Math.random()*left.length)];Ritual.hint={x:p.x+(Math.random()-.5)*50,y:p.y+(Math.random()-.5)*50,t:performance.now()};SFX.magic();
  const b=$('[data-act=rHint]');if(b)b.innerHTML='💫 Подсказка Оракула · '+(r.hints>=1+tal('eye')?'2 💎':'бесплатно · '+(1+tal('eye')-r.hints));App.updateHUD();};
Actions.rInterpret=()=>{const r=Ritual.cur;if(!r||!r.found.length)return;const sharp=r.found.length===r.symbols.length,bean=BEANS[r.bean]||{};
  r.texts=Fortune.generate(r);const mult=r.charm&&CHARMS[r.charm]?CHARMS[r.charm].mult:1,legend=r.symbols.filter(id=>SYMBOLS[id].r==='legendary').length;
  const coins=Math.round((40+r.luck*3)*mult*(sharp?1.3:1)*(bean.eff==='coins'?1.5:1)*(1+.25*legend)),xp=Math.round((25+r.luck*.6)*mult*(bean.eff==='xp'?1.5:1)),crystals=((r.luck>=75?R.int(2,4):(Math.random()<.35?1:0))+legend)*mult;
  r.rewards={coins,xp,crystals,mult,sharp,legend};addItem('coins',0,coins);S.crystals+=crystals;addXP(xp);
  S.stats.readings++;S.stats.bestLuck=Math.max(S.stats.bestLuck,r.luck);r.symbols.forEach(id=>S.stats.symbols[id]=(S.stats.symbols[id]||0)+1);
  const q=Guests.active(),entry={id:r.id,ts:r.ts,seed:r.seed,bean:r.bean,cup:r.cup,spice:r.spice,charm:r.charm,luck:r.luck,symbols:r.symbols,texts:r.texts,rewards:r.rewards};if(q)entry.guest=q.gid;
  S.history.unshift(entry);if(S.history.length>60)S.history.length=60;delete S.pending;Ritual.cur=Object.assign({},entry);Ritual.step='fortune';
  const gres=q?Guests.complete(entry):null;
  save();SFX.magic();SFX.porcelain();Confetti.burst(r.luck>=75?160:70);App.render();scrollTo({top:0,behavior:'smooth'});
  if(legend)setTimeout(()=>{screenFlash();toast('🐉 Легендарный знак! Награды увеличены','gold');},500);
  if(gres)setTimeout(()=>Guests.showResult(gres),1600);};
Actions.skipType=el=>{el._skip=true;};
Actions.rNew=()=>{Ritual.step=1;Ritual.cur=null;Ritual.brew=null;Ritual.typeTok++;SFX.click();App.render();scrollTo({top:0});};

function symCount(id,rng){const b=BEANS[id];if(!b)return 3;if(b.eff==='chaos')return rng?R.int(3,6,rng):4;return (b.tier==='S'?5:b.tier==='A'?4:3)+(b.eff==='extra'?1:0);}
