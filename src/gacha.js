/* =====================================================================
   CHESTS — волшебные сундучки, содержимое, анимация открытия
   ===================================================================== */
const Gacha={
  tierOf(e){return e.tier||(itemDef(e.t,e.id)||{}).tier||'C';},
  nameOf(e){if(e.t==='coins')return fmt(e.q)+' монет';if(e.t==='crystals')return e.q+' кристаллов';const d=itemDef(e.t,e.id);return d.name+(e.q>1?' ×'+e.q:'');},
  roll(cid){return R.weighted(CASES[cid].loot);},
  grant(e){if(e.t==='cup'&&hasItem('cup',e.id)){const cr={C:2,B:5,A:12,S:30}[this.tierOf(e)];S.crystals+=cr;return `Дубликат → +${cr} 💎`;}
    addItem(e.t,e.id,e.q);return '';}
};
Views.cases=()=>{let h=`<div class="page-head fade-in"><div><h1 class="section-title">Сундучки Судьбы</h1><p class="subtitle">Подарочные сундучки древних богинь с ингредиентами для ритуалов: зёрна, чаши, пряности и амулеты. Ничего не нужно ставить на кон — каждый сундучок дарит что-то полезное. Открыто сундучков: <b class="gold">${S.stats.cases}</b>.${caseStage()?` · Ступень ценности: <b class="gold">${caseStage()+1}/4</b> (растёт с уровнем Оракула)`:''}</p></div></div><div class="grid g-auto">`;
  for(const cid in CASES){const c=CASES[cid],p1=casePrice(cid,1),p5=casePrice(cid,5);
    h+=`<div class="glass case-card glow fade-in" style="--cc:${c.cc}"><div class="orb" style="--oc:${c.oc};--og:${c.og}">${c.icon}</div>
      <h3 class="h3 gold" style="font-size:26px">«${esc(c.name)}»</h3><p class="muted" style="font-size:13px;max-width:280px">${esc(c.desc)}</p>
      <div class="row" style="justify-content:center"><button class="btn btn-gold" data-act="openCase" data-id="${cid}" data-n="1" ${canPay(p1)?'':'disabled'}>Открыть · ${priceHTML(p1)}</button>
      <button class="btn btn-wine" data-act="openCase" data-id="${cid}" data-n="5" ${canPay(p5)?'':'disabled'}>×5 · ${priceHTML(p5)}</button></div>
      <button class="btn btn-sm" data-act="odds" data-id="${cid}">🔍 Что внутри</button></div>`;}
  return h+`</div><p class="dim" style="text-align:center;font-size:12px;margin-top:16px">Внутри каждого сундучка — гарантированный подарок. Повторная чаша превращается в кристаллы. Набор ×5 — скидка 10%.</p>`;};
Actions.odds=el=>{const c=CASES[el.dataset.id],tot=c.loot.reduce((s,x)=>s+x.w,0),byT={C:0,B:0,A:0,S:0};c.loot.forEach(e=>byT[Gacha.tierOf(e)]+=e.w);
  const rows=[...c.loot].sort((a,b)=>TIER_ORDER[Gacha.tierOf(b)]-TIER_ORDER[Gacha.tierOf(a)]||a.w-b.w).map(e=>`<div class="odds-row">${itemIcon(e.t,e.id,'sm')}${tierBadge(Gacha.tierOf(e))}<span>${esc(Gacha.nameOf(e))}</span><span class="pc">${(e.w/tot*100).toFixed(e.w/tot<.01?2:1).replace('.',',')}%</span></div>`).join('');
  Modal.open(`<h2 class="h2">Что внутри: «${esc(c.name)}»</h2><div class="tier-bar">${['S','A','B','C'].map(t=>`<i style="width:${byT[t]/tot*100}%;background:${TIERS[t].col}"></i>`).join('')}</div>
    <div class="row" style="gap:8px;margin-bottom:10px">${['S','A','B','C'].map(t=>`<span class="chip">${tierBadge(t)} ${TIERS[t].name}: ${(byT[t]/tot*100).toFixed(1).replace('.',',')}%</span>`).join('')}</div>${rows}`);};
Actions.openCase=el=>{const cid=el.dataset.id,n=+el.dataset.n||1,c=CASES[cid],price=casePrice(cid,n);
  if(!pay(price)){SFX.error();return toast('Недостаточно средств','bad');}
  if(el.dataset.again)Modal.close(el.closest('.modal-wrap'));
  const res=[];for(let i=0;i<n;i++){const e=Gacha.roll(cid);res.push({e,note:Gacha.grant(e)});}S.stats.cases+=n;addXP(5*n);save();App.updateHUD();
  const w=Modal.open(`<div class="case-open"><div class="orb big shake ch-orb" style="--oc:${c.oc};--og:${c.og}">${c.icon}</div><p class="serif gold" style="font-size:22px">Печати «${esc(c.name)}» снимаются…</p></div>`,{noClose:true,cls:'wide'});
  SFX.whoosh();SFX.rustle();let k=0;const bub=setInterval(()=>{SFX.bubble();if(k===6){const o=w.querySelector('.ch-orb');if(o)o.classList.add('shake-hard');}if(++k>9)clearInterval(bub);},140);
  setTimeout(()=>{const best=res.reduce((m,r)=>Math.max(m,TIER_ORDER[Gacha.tierOf(r.e)]),0),bt=['C','B','A','S'][best];
    const body=w.querySelector('.modal-body');body.style.position='relative';screenFlash(bt==='S'?'rgba(255,236,170,.95)':bt==='A'?'rgba(220,190,255,.9)':'rgba(255,246,220,.75)');shakeEl(w.querySelector('.modal'));SFX.porcelain();
    body.innerHTML=`<div class="burst"></div><div class="case-open" style="min-height:0"><h2 class="h2">${bt==='S'?'✨ Легендарная удача! ✨':bt==='A'?'Эпическая находка!':'Дары богини'}</h2>
      <div class="loot-grid">${res.map((r,i)=>{const t=Gacha.tierOf(r.e);return `<div class="loot t-${t}" style="animation-delay:${i*.12}s">${itemIcon(r.e.t,r.e.id,'lg')}${tierBadge(t)}<div class="nm">${esc(Gacha.nameOf(r.e))}</div>${r.note?`<div class="dim" style="font-size:11px">${r.note}</div>`:''}</div>`;}).join('')}</div>
      <div class="row" style="justify-content:center;margin-top:8px"><button class="btn btn-gold" data-act="closeModal">Забрать</button>
      <button class="btn btn-wine" data-act="openCase" data-id="${cid}" data-n="${n}" data-again="1">Открыть ещё</button></div></div>`;
    if(best>=2){Confetti.burst(best===3?200:110);SFX.magic();}else SFX.chime();App.render();},1500);};

/* v2.1: цена сундучка = База × 1,8^ступень (ступень растёт каждые 6 уровней, максимум 3) */
function caseStage(){return Math.min(3,Math.floor((S.level-1)/6));}
function casePrice(cid,n=1){const c=CASES[cid],m=Math.pow(1.8,caseStage()),p={};for(const k in c.price)p[k]=Math.ceil(c.price[k]*m*(n>1?n*.9:1));return p;}
