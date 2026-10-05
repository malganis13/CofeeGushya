/* =====================================================================
   SHOP — обжарка, рынок, лавка товаров, сундук (инвентарь)
   ===================================================================== */
const Shop={sub:'shop'};
Views.shop=()=>{const sub=Shop.sub;
  let h=`<div class="page-head fade-in"><div><h1 class="section-title">Лавка Алхимика</h1><p class="subtitle">Обжаривайте урожай, торгуйте на рынке и пополняйте запасы для ритуалов.</p></div>
  <div class="tabs">${[['shop','🛍️ Товары'],['roast','🔥 Обжарка'],['blend','⚗️ Тигель'],['market','⚖️ Рынок'],['inv','🎒 Запасы']].map(([k,l])=>`<button class="${sub===k?'on':''}" data-act="shopSub" data-sub="${k}">${l}</button>`).join('')}</div></div>`;
  if(sub==='shop'){h+=`<div class="grid g-items fade-in">`+SHOP.map((it,i)=>{const d=itemDef(it.t,it.id),own=S.inv[ITEM_GROUPS[it.t].bag][it.id]||0,perm=it.t==='cup'&&own>0;
      return `<div class="item">${own&&!perm?`<span class="cnt">×${own}</span>`:''}${itemIcon(it.t,it.id,'lg')}${tierBadge(d.tier)}<div class="nm">${esc(d.name)}</div><div class="ds">${esc(d.desc)}${d.luck?` <b class="gold">+${d.luck} удачи</b>`:''}</div>
        <button class="btn btn-sm ${perm?'':'btn-gold'} btn-block" data-act="buy" data-i="${i}" ${perm||!canPay(it.price)?'disabled':''}>${perm?'✓ В коллекции':priceHTML(it.price)}</button></div>`;}).join('')+'</div>';}
  if(sub==='roast'){h+=`<div class="glass ritual-panel fade-in" style="margin-bottom:14px"><div class="row"><div><b>Сырые зёрна на складе:</b> <span class="bean raw"></span> <span class="hud-raw gold">${fmt(S.raw)}</span></div></div>
     <p class="dim" style="font-size:12.5px;margin-top:4px">Каждая ваша плантация позволяет обжаривать свой сорт. Обжаренные зёрна используются в Ритуале Варки. Мини-игра «Обжарка» даёт бонус к удаче — «Быстро всё» обжаривает без бонуса.</p></div><div class="grid g-auto">`;
    for(const id in PLANTS){const d=PLANTS[id],b=BEANS[d.bean],own=S.plants[id].owned;
      h+=`<div class="glass ritual-panel fade-in ${own?'':'locked'}" style="${own?'':'opacity:.5'}"><div class="row">${itemIcon('bean',d.bean,'lg')}<div class="sp"><div>${tierBadge(b.tier)} <b>${esc(b.name)}</b></div>
        <div class="dim" style="font-size:12px">${own?`${fmt(d.roast)} сырых → 1 зерно · удача +${b.luck}`:'Купите плантацию «'+esc(d.name)+'»'}</div><div class="dim" style="font-size:12px">В запасах: ${S.inv.beans[d.bean]||0}${S.roastQ[d.bean]?` · качество обжарки <b class="gold">+${Math.round(S.roastQ[d.bean])}</b>`:''}</div></div></div>
        ${own?`<div class="row" style="margin-top:10px"><button class="btn btn-gold btn-sm sp" data-act="roastGame" data-id="${id}" data-n="1" ${S.raw>=d.roast?'':'disabled'}>🎯 Обжарить ×1</button><button class="btn btn-wine btn-sm sp" data-act="roastGame" data-id="${id}" data-n="5" ${S.raw>=d.roast*5?'':'disabled'}>×5</button><button class="btn btn-sm sp" data-act="roast" data-id="${id}" data-n="max" ${S.raw>=d.roast?'':'disabled'}>Быстро всё</button></div>`:''}</div>`;}
    h+='</div>';}
  if(sub==='market'){h+=`<div class="grid g-auto fade-in"><div class="glass ritual-panel"><h3 class="h3 gold">⚖️ Продажа урожая</h3><p class="muted" style="font-size:13px;margin:6px 0 12px">Купцы платят ${String(rawPrice()).replace('.',',')} 🪙 за каждое сырое зерно.</p>
      <div style="font-size:22px;font-weight:800;margin-bottom:10px"><span class="bean raw"></span> <span class="hud-raw">${fmt(S.raw)}</span></div>
      <div class="row"><button class="btn btn-gold sp" data-act="sellRaw" data-f="1">Продать всё</button><button class="btn sp" data-act="sellRaw" data-f="0.5">Половину</button></div></div>
      <div class="glass ritual-panel"><h3 class="h3 gold">💎 Обмен у звездочёта</h3><p class="muted" style="font-size:13px;margin:6px 0 12px">Превратите золото в астральные кристаллы.</p>
      <div class="row"><button class="btn btn-gold sp" data-act="exchange" data-n="1" ${S.coins>=2500?'':'disabled'}>2 500 🪙 → 5 💎</button><button class="btn btn-wine sp" data-act="exchange" data-n="5" ${S.coins>=11500?'':'disabled'}>11 500 🪙 → 25 💎</button></div></div></div>`;}
  if(sub==='inv'){const groups=[['bean','Зёрна и купажи'],['cup','Чаши'],['spice','Пряности'],['charm','Амулеты']];
    for(const[t,l]of groups){const bag=S.inv[ITEM_GROUPS[t].bag],ids=Object.keys(ITEM_GROUPS[t].db).filter(id=>bag[id]>0);
      h+=`<h3 class="h3 gold fade-in" style="margin:14px 2px 10px">${l}</h3>`;
      h+=ids.length?`<div class="grid g-items fade-in">${ids.map(id=>{const d=itemDef(t,id);return `<div class="item">${t!=='cup'?`<span class="cnt">×${bag[id]}</span>`:''}${itemIcon(t,id,'lg')}${tierBadge(d.tier)}<div class="nm">${esc(d.name)}</div><div class="ds">${esc(d.desc)}</div></div>`;}).join('')}</div>`
        :`<div class="glass empty">Пусто. Загляните в сундучки или лавку.</div>`;}}
  if(sub==='blend')h+=Blend.view();
  return h;};
Actions.shopSub=el=>{Shop.sub=el.dataset.sub;SFX.click();App.render();};
Actions.buy=el=>{const it=SHOP[+el.dataset.i],d=itemDef(it.t,it.id);if(it.t==='cup'&&hasItem('cup',it.id))return;if(!pay(it.price)){SFX.error();return toast('Недостаточно средств','bad');}
  addItem(it.t,it.id,1);addXP(2);SFX.coin();toast(`Куплено: ${d.name}`,'good');App.render();};
Actions.roast=el=>{const id=el.dataset.id,d=PLANTS[id];let n=el.dataset.n==='max'?Math.floor(S.raw/d.roast):+el.dataset.n;n=Math.min(n,Math.floor(S.raw/d.roast));if(n<1)return;
  S.raw-=n*d.roast;{const had=S.inv.beans[d.bean]||0;S.roastQ[d.bean]=(S.roastQ[d.bean]||0)*had/(had+n);}addItem('bean',d.bean,n);addXP(2*n);SFX.chime();toast(`🔥 Обжарено: ${BEANS[d.bean].name} ×${n}`,'gold');App.render();};
Actions.exchange=el=>{const n=+el.dataset.n,c=n===5?11500:2500,g=n===5?25:5;if(!pay({coins:c})){SFX.error();return;}S.crystals+=g;SFX.magic();toast(`+${g} 💎 астральных кристаллов`,'gold');App.render();};
