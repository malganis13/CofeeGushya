/* =====================================================================
   PLANTATIONS — идл-плантации, офлайн-доход, улучшения
   ===================================================================== */
const Views={},Actions={};
const Plant={
  rate(id){const p=S.plants[id],d=PLANTS[id];if(!p||!p.owned)return 0;return d.base*(1+.35*p.irr)*Math.pow(1.3,p.fert)*(1+.25*p.bar)*(1+.03*(S.level-1));},
  total(){return Object.keys(PLANTS).reduce((s,id)=>s+this.rate(id),0);},
  capH(id){return 4+2*S.plants[id].bar;},
  upCost(id,u){return Math.ceil(PLANTS[id].up*UPG[u].k*Math.pow(UPG[u].g,S.plants[id][u]));},
  tick(dt){const r=this.total()*dt;S.raw+=r;S.stats.rawTotal+=r;},
  offline(){const now=Date.now(),dt=now-(S.lastTick||now);S.lastTick=now;if(dt<60000)return null;let gain=0;
    for(const id in PLANTS)gain+=this.rate(id)*Math.min(dt/1000,this.capH(id)*3600);S.raw+=gain;S.stats.rawTotal+=gain;return gain>0?{dt,gain}:null;}
};
function showOffline(o){if(!o)return;Modal.open(`<div style="text-align:center">
  <div style="font-size:54px">🌙</div><h2 class="h2">Пока вас не было</h2>
  <p class="muted">Прошло ${fmtDur(o.dt)}. Мистические бариста трудились на плантациях и собрали:</p>
  <div style="font-size:30px;font-weight:800;color:var(--gold-2);margin:14px 0"><span class="bean raw"></span> ${fmt(o.gain)} сырых зёрен</div>
  <p class="dim" style="font-size:12px">Офлайн-сбор ограничен 4 ч (+2 ч за каждого бариста).</p>
  <button class="btn btn-gold btn-block" data-act="closeModal" style="margin-top:14px">Чудесно!</button></div>`);SFX.chime();}

Views.plant=()=>{const rate=Plant.total();
  let h=`<div class="page-head fade-in"><div><h1 class="section-title">Плантации</h1><p class="subtitle">Ваши земли растят зёрна даже когда вы спите. Продавайте урожай в Лавке или обжаривайте его для ритуалов.</p></div>
  <div class="glass stat-box glow"><div class="row"><div><div class="dim" style="font-size:12px">Урожай в секунду</div><div class="big" id="pl-rate">${fmt1(rate)}</div></div><div class="sp"></div>
  <div style="text-align:right"><div class="dim" style="font-size:12px">На складе</div><div class="big"><span class="bean raw"></span> <span class="hud-raw">${fmt(S.raw)}</span></div></div></div>
  <div class="row"><button class="btn btn-gold btn-sm sp" data-act="sellRaw" data-f="1">Продать всё · <span id="sell-val">${fmt(S.raw*RAW_PRICE)}</span> 🪙</button><button class="btn btn-wine btn-sm" data-act="tab" data-tab="shop" data-sub="roast">🔥 Обжарка</button></div></div></div>
  <div class="grid g-auto">`;
  for(const id in PLANTS){const d=PLANTS[id],p=S.plants[id],bean=BEANS[d.bean];
    h+=`<div class="glass plant-card fade-in ${p.owned?'':'locked'}" data-plant="${id}">
      <div class="plant-banner" style="background:${d.grad}"><div class="hills"></div><div class="hills h2"></div><span class="pic">${d.icon}</span>
        <span class="tag">${tierBadge(bean.tier)} <span class="chip" style="font-size:11px;padding:1px 8px">${esc(bean.name)}</span></span>
        <div class="bushes">${(d.bush+' ').repeat(p.owned?Math.min(5,1+Math.floor((p.irr+p.fert+p.bar)/4)):1).trim().split(' ').map(b=>`<span class="bush">${b}</span>`).join('')}</div></div>
      <div class="plant-body"><div><h3 class="h3">${esc(d.name)}</h3><p class="dim" style="font-size:12.5px">${esc(d.sub)}</p></div>`;
    if(p.owned){h+=`<div class="plant-stats"><span class="chip">⚡ <b data-rate="${id}">${fmt1(Plant.rate(id))}</b>/сек</span><span class="chip">🌙 офлайн до ${Plant.capH(id)} ч</span></div>`;
      for(const u in UPG){const U=UPG[u],lv=p[u],max=lv>=U.max,cost=Plant.upCost(id,u);
        h+=`<div class="upg"><span class="ui">${U.icon}</span><div class="ut"><b>${U.name}</b> <span class="lvl-dots">ур. ${lv}/${U.max}</span><div>${U.desc}</div></div>
          <button class="btn btn-sm ${max?'':'btn-gold'}" data-act="upgrade" data-id="${id}" data-u="${u}" ${max||S.coins<cost?'disabled':''} data-cost="${cost}">${max?'Макс.':fmt(cost)+' 🪙'}</button></div>`;}
    }else{const lvlOk=!d.minLevel||S.level>=d.minLevel;
      h+=`<div class="lock-box"><div style="font-size:13px">Базовый урожай: <b>${d.base}</b> зёрен/сек</div>${d.minLevel?`<div class="dim" style="font-size:12px">Требуется уровень ${d.minLevel}</div>`:''}
        <button class="btn btn-gold" data-act="buyPlant" data-id="${id}" ${lvlOk&&canPay(d.price)?'':'disabled'}>Купить земли · ${priceHTML(d.price)}</button></div>`;}
    h+=`</div></div>`;}
  return h+'</div>';
};
Actions.buyPlant=el=>{const id=el.dataset.id,d=PLANTS[id];if(d.minLevel&&S.level<d.minLevel)return;if(!pay(d.price)){SFX.error();return toast('Недостаточно средств','bad');}
  S.plants[id].owned=true;addXP(40);SFX.magic();Confetti.burst(80);toast(`🌱 Вы приобрели земли «${d.name}»!`,'gold');App.render();};
Actions.upgrade=el=>{const {id,u}=el.dataset,p=S.plants[id];if(p[u]>=UPG[u].max)return;const c=Plant.upCost(id,u);if(!pay({coins:c})){SFX.error();return;}
  p[u]++;addXP(3+p[u]);SFX.coin();toast(`${UPG[u].icon} ${UPG[u].name}: уровень ${p[u]}`,'good');App.render();};
Actions.sellRaw=el=>{const f=+el.dataset.f||1,q=Math.floor(S.raw*f),c=Math.floor(q*RAW_PRICE);if(c<1){SFX.error();return toast('На складе пока пусто','bad');}
  S.raw-=q;addItem('coins',0,c);SFX.coin();toast(`Продано ${fmt(q)} зёрен за ${fmt(c)} 🪙`,'good');App.render();};
// Живое обновление цифр на вкладке плантаций
Plant.liveUpdate=(fl)=>{const r=$('#pl-rate');if(r)r.textContent=fmt1(Plant.total());const sv=$('#sell-val');if(sv)sv.textContent=fmt(S.raw*RAW_PRICE);
  $$('[data-act=upgrade]').forEach(b=>{if(b.textContent!=='Макс.')b.disabled=S.coins<+b.dataset.cost;});
  if(fl)$$('.plant-card[data-plant]').forEach(c=>{const id=c.dataset.plant,rt=Plant.rate(id);if(rt>0){const bn=c.querySelector('.plant-banner');floatNum(bn,'+'+fmt1(rt),30+Math.random()*120,50);}});};
