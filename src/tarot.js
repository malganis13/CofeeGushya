/* =====================================================================
   TAROT — Карта Дня после гадания на кофе
   ===================================================================== */
const Tarot={
  faceHTML(t,cls=''){const c=TAROT[t.c];return `<div class="tcard face ${t.rev?'rev':''} ${cls}"><div class="tn">${c.n}</div><div class="te">${c.icon}</div><div class="tt">${c.name}</div></div>`;},
  text(e){const c=TAROT[e.tarot.c],s=SYMBOLS[e.symbols[0]];return `${e.tarot.rev?'Перевёрнутая':'Прямая'} карта «${c.name}»: ${e.tarot.rev?c.rev:c.up} `+TAROT_LINKS[e.seed%TAROT_LINKS.length].replace('{s}',s.name).replace('{m}',s.meaning);},
  panelHTML(e){return `<div class="glass tarot-panel fade-in" id="tarotPanel">${this.inner(e)}</div>`;},
  inner(e){if(e.tarot)return `<div class="tarot-res">${this.faceHTML(e.tarot)}<div class="sp"><h4 class="serif gold" style="font-size:23px">🃏 Карта Дня</h4><p style="font-size:14.5px;line-height:1.6">${esc(this.text(e))}</p></div></div>`;
    return `<div style="text-align:center"><h4 class="serif gold" style="font-size:23px">🃏 Карта Дня</h4><p class="muted" style="font-size:13px;margin:4px 0 12px">Уточните предсказание: вытяните одну из Старших Арканов.</p><button class="btn btn-wine" data-act="tarotFan" data-id="${e.id}">✋ Перетасовать колоду</button></div>`;},
  find(id){return S.history.find(h=>h.id===id)||(Ritual.cur&&Ritual.cur.id===id?Ritual.cur:null);}
};
Actions.tarotFan=el=>{const id=el.dataset.id,p=$('#tarotPanel');if(!p)return;SFX.shuffle();
  p.innerHTML=`<div style="text-align:center"><h4 class="serif gold" style="font-size:23px">Выберите карту сердцем</h4><div class="tarot-fan">${[0,1,2,3,4].map(i=>`<button class="tcard back" style="--i:${i-2}" data-act="tarotPick" data-id="${id}" data-i="${i}"><span>✦</span></button>`).join('')}</div></div>`;};
Actions.tarotPick=el=>{const e=Tarot.find(el.dataset.id);if(!e||e.tarot)return;const rng=mulberry32((e.seed^((+el.dataset.i+1)*7919))>>>0);const t={c:Math.floor(rng()*TAROT.length),rev:rng()<.3};
  e.tarot=t;const h=S.history.find(x=>x.id===e.id);if(h)h.tarot=t;if(Ritual.cur&&Ritual.cur.id===e.id)Ritual.cur.tarot=t;
  let bonus='';addXP(5);if(!t.rev&&TAROT_LUCKY.includes(t.c)){S.crystals+=2;bonus=' · +2 💎';}S.stats.tarot=(S.stats.tarot||0)+1;save();App.updateHUD();
  $$('.tarot-fan .tcard').forEach(b=>{if(b!==el)b.classList.add('gone');});el.classList.add('pick');SFX.cardFlip();
  setTimeout(()=>{el.outerHTML=Tarot.faceHTML(t,'flipin');SFX.magic();},450);
  setTimeout(()=>{const p=$('#tarotPanel');if(p)p.innerHTML=Tarot.inner(e);toast(`🃏 Вам выпала карта «${TAROT[t.c].name}»${bonus}`,'gold');},1500);};
