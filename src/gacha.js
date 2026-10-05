/* =====================================================================
   GACHA — кейсы, шансы выпадения, анимация открытия
   ===================================================================== */
const Gacha={
  tierOf(e){return e.tier||(itemDef(e.t,e.id)||{}).tier||'C';},
  nameOf(e){if(e.t==='coins')return fmt(e.q)+' монет';if(e.t==='crystals')return e.q+' кристаллов';const d=itemDef(e.t,e.id);return d.name+(e.q>1?' ×'+e.q:'');},
  roll(cid){return R.weighted(CASES[cid].loot);},
  grant(e){if(e.t==='cup'&&hasItem('cup',e.id)){const cr={C:2,B:5,A:12,S:30}[this.tierOf(e)];S.crystals+=cr;return `Дубликат → +${cr} 💎`;}
    addItem(e.t,e.id,e.q);return '';}
};
Views.cases=()=>{let h=`<div class="page-head fade-in"><div><h1 class="section-title">Кейсы Судьбы</h1><p class="subtitle">Сокровищницы древних богинь. Внутри — редкие зёрна, чаши, пряности и амулеты. Открыто кейсов: <b class="gold">${S.stats.cases}</b>.</p></div></div><div class="grid g-auto">`;
  for(const cid in CASES){const c=CASES[cid],p5={};for(const k in c.price)p5[k]=Math.ceil(c.price[k]*5*.9);
    h+=`<div class="glass case-card glow fade-in" style="--cc:${c.cc}"><div class="orb" style="--oc:${c.oc};--og:${c.og}">${c.icon}</div>
      <h3 class="h3 gold" style="font-size:26px">«${esc(c.name)}»</h3><p class="muted" style="font-size:13px;max-width:280px">${esc(c.desc)}</p>
      <div class="row" style="justify-content:center"><button class="btn btn-gold" data-act="openCase" data-id="${cid}" data-n="1" ${canPay(c.price)?'':'disabled'}>Открыть · ${priceHTML(c.price)}</button>
      <button class="btn btn-wine" data-act="openCase" data-id="${cid}" data-n="5" ${canPay(p5)?'':'disabled'}>×5 · ${priceHTML(p5)}</button></div>
      <button class="btn btn-sm" data-act="odds" data-id="${cid}">📊 Шансы выпадения</button></div>`;}
  return h+`</div><p class="dim" style="text-align:center;font-size:12px;margin-top:16px">Повторная чаша превращается в кристаллы. Открытие ×5 — скидка 10%.</p>`;};
Actions.odds=el=>{const c=CASES[el.dataset.id],tot=c.loot.reduce((s,x)=>s+x.w,0),byT={C:0,B:0,A:0,S:0};c.loot.forEach(e=>byT[Gacha.tierOf(e)]+=e.w);
  const rows=[...c.loot].sort((a,b)=>TIER_ORDER[Gacha.tierOf(b)]-TIER_ORDER[Gacha.tierOf(a)]||a.w-b.w).map(e=>`<div class="odds-row">${itemIcon(e.t,e.id,'sm')}${tierBadge(Gacha.tierOf(e))}<span>${esc(Gacha.nameOf(e))}</span><span class="pc">${(e.w/tot*100).toFixed(e.w/tot<.01?2:1).replace('.',',')}%</span></div>`).join('');
  Modal.open(`<h2 class="h2">Шансы: «${esc(c.name)}»</h2><div class="tier-bar">${['S','A','B','C'].map(t=>`<i style="width:${byT[t]/tot*100}%;background:${TIERS[t].col}"></i>`).join('')}</div>
    <div class="row" style="gap:8px;margin-bottom:10px">${['S','A','B','C'].map(t=>`<span class="chip">${tierBadge(t)} ${TIERS[t].name}: ${(byT[t]/tot*100).toFixed(1).replace('.',',')}%</span>`).join('')}</div>${rows}`);};
Actions.openCase=el=>{const cid=el.dataset.id,n=+el.dataset.n||1,c=CASES[cid],price={};for(const k in c.price)price[k]=n>1?Math.ceil(c.price[k]*n*.9):c.price[k];
  if(!pay(price)){SFX.error();return toast('Недостаточно средств','bad');}
  if(el.dataset.again)Modal.close(el.closest('.modal-wrap'));
  const res=[];for(let i=0;i<n;i++){const e=Gacha.roll(cid);res.push({e,note:Gacha.grant(e)});}S.stats.cases+=n;addXP(5*n);save();App.updateHUD();
  const w=Modal.open(`<div class="case-open"><div class="orb big shake" style="--oc:${c.oc};--og:${c.og}">${c.icon}</div><p class="serif gold" style="font-size:22px">Печати «${esc(c.name)}» снимаются…</p></div>`,{noClose:true,cls:'wide'});
  SFX.whoosh();let k=0;const bub=setInterval(()=>{SFX.bubble();if(++k>8)clearInterval(bub);},140);
  setTimeout(()=>{const best=res.reduce((m,r)=>Math.max(m,TIER_ORDER[Gacha.tierOf(r.e)]),0),bt=['C','B','A','S'][best];
    const body=w.querySelector('.modal-body');body.style.position='relative';
    body.innerHTML=`<div class="burst"></div><div class="case-open" style="min-height:0"><h2 class="h2">${bt==='S'?'✨ Легендарная удача! ✨':bt==='A'?'Эпическая находка!':'Дары богини'}</h2>
      <div class="loot-grid">${res.map((r,i)=>{const t=Gacha.tierOf(r.e);return `<div class="loot t-${t}" style="animation-delay:${i*.12}s">${itemIcon(r.e.t,r.e.id,'lg')}${tierBadge(t)}<div class="nm">${esc(Gacha.nameOf(r.e))}</div>${r.note?`<div class="dim" style="font-size:11px">${r.note}</div>`:''}</div>`;}).join('')}</div>
      <div class="row" style="justify-content:center;margin-top:8px"><button class="btn btn-gold" data-act="closeModal">Забрать</button>
      <button class="btn btn-wine" data-act="openCase" data-id="${cid}" data-n="${n}" data-again="1">Ещё раз</button></div></div>`;
    if(best>=2){Confetti.burst(best===3?200:110);SFX.magic();}else SFX.chime();App.render();},1500);};
