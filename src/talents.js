/* =====================================================================
   TALENTS & PROFILE — древо навыков Оракула, аватары, рамки, титулы
   ===================================================================== */
function tal(id){return (S.talents&&S.talents[id])||0;}
function tpSpent(){return Object.values(S.talents||{}).reduce((a,b)=>a+b,0);}
function tpFree(){return Math.max(0,S.level-1-tpSpent());}
function rawPrice(){return RAW_PRICE*(1+.1*tal('trader'));}
function talDef(id){for(const b of TALENTS)for(const t of b.items)if(t.id===id)return t;return null;}
function curTitle(){const t=TITLES.find(x=>x.id===S.profile.title&&x.ok());return t?t.name:TITLES[0].name;}
function avatarGlyph(){const z=ZODIAC.find(q=>q.id===S.zodiac);return S.profile.avatar&&S.profile.avatar!=='zodiac'?S.profile.avatar:(z?z.i:'🔮');}
const Profile={tab:'main',
  html(){const tabs=[['main','👤 Профиль'],['tree',`🌳 Древо навыков${tpFree()?' · '+tpFree():''}`],['look','🎭 Облик']];
    return `<div class="tabs" style="margin-bottom:14px">${tabs.map(([k,l])=>`<button class="${this.tab===k?'on':''}" data-act="pTab" data-t="${k}">${l}</button>`).join('')}</div>`+this[this.tab]();},
  main(){const z=ZODIAC.find(q=>q.id===S.zodiac);
    return `<div class="row"><span class="ava-big fr-${S.profile.frame}">${avatarGlyph()}</span><div><div class="dim" style="font-size:12px">${esc(curTitle())}</div><h2 class="h2" style="margin:0">${esc(S.name||'Странница')}</h2><div class="dim" style="font-size:13px">${z?z.name:'Знак не выбран'} · уровень ${S.level} · ${repRank().name}</div></div></div>
    <div class="luck-meter" style="margin:12px 0 4px"><i style="width:${S.xp/xpNeed(S.level)*100}%"></i></div><div class="dim" style="font-size:12px">Опыт: ${fmt(S.xp)} / ${fmt(xpNeed(S.level))}</div>
    <div class="stat-grid" style="margin:14px 0"><div><b>${S.stats.readings}</b>гаданий</div><div><b>${S.guests.served}</b>гостей принято</div><div><b>🏅 ${fmt(S.rep)}</b>репутация</div><div><b>${S.stats.cases}</b>сундучков открыто</div>
    <div><b>${fmt(S.stats.rawTotal)}</b>зёрен собрано</div><div><b>${S.streak} 🔥</b>серия дней</div><div><b>${S.stats.bestLuck}%</b>лучшая удача</div><div><b>${Object.keys(S.stats.symbols).length}/${Object.keys(SYMBOLS).length}</b>знаков в атласе</div></div>
    <div class="divider"></div><label class="dim" style="font-size:12px">Имя</label><input class="field" id="pfName" maxlength="24" value="${esc(S.name)}" style="margin:6px 0 12px">
    <label class="dim" style="font-size:12px">Знак зодиака</label><div style="margin:6px 0 14px">${zodiacGrid(S.zodiac)}</div>
    <div class="row" style="margin-bottom:14px"><span class="sp">🔊 Звуки</span><button class="switch ${S.settings.sound?'on':''}" data-act="toggleSound" aria-label="Звук"></button></div>
    <div class="row"><button class="btn btn-gold sp" data-act="pfSave">Сохранить</button><button class="btn" data-act="daily">🎁 Ежедневные дары</button></div>
    <div class="row" style="margin-top:10px"><button class="btn btn-sm sp" data-act="exportSave">⬇️ Экспорт</button><button class="btn btn-sm sp" data-act="importSave">⬆️ Импорт</button><button class="btn btn-sm sp" data-act="resetSave" style="color:#ff8fb0">Сбросить прогресс</button></div>
    <p class="dim" style="font-size:11px;text-align:center;margin-top:12px">Кофейный Оракул v${VERSION}</p>`;},
  tree(){const free=tpFree();
    return `<div class="row" style="margin-bottom:12px"><div class="sp"><b class="gold serif" style="font-size:22px">Очки навыков: ${free}</b><div class="dim" style="font-size:12px">1 очко за каждый новый уровень. Потрачено: ${tpSpent()}</div></div><button class="btn btn-sm" data-act="talReset" ${tpSpent()?'':'disabled'}>↺ Сбросить · 20 💎</button></div>
    <div class="tal-tree">${TALENTS.map(b=>`<div class="tal-branch"><div class="tal-head">${b.icon} ${b.branch}</div>${b.items.map((t,i)=>{const lv=tal(t.id),lock=t.req&&tal(t.req)<1,max=lv>=t.max;
      return `${i?'<div class="tal-link '+(lock?'':'on')+'"></div>':''}<div class="tal-node ${lv?'has':''} ${lock?'lock':''}"><span class="tal-ic">${t.icon}</span><b>${t.name}</b><span class="lvl-dots">${'◆'.repeat(lv)}${'◇'.repeat(t.max-lv)}</span>
        <div class="dim" style="font-size:11.5px;min-height:30px">${t.desc(Math.max(1,lv))}</div>${lock?`<div class="dim" style="font-size:11px">🔒 Нужно: ${talDef(t.req).name}</div>`:`<button class="btn btn-sm ${max?'':'btn-gold'}" data-act="talUp" data-id="${t.id}" ${max||!free?'disabled':''}>${max?'Максимум':'＋ Изучить'}</button>`}</div>`;}).join('')}</div>`).join('')}</div>`;},
  look(){return `<h3 class="h3 gold" style="margin-bottom:8px">Аватар</h3><div class="look-grid">${AVATARS.map(([a,l])=>{const ok=S.level>=l,g=a==='zodiac'?(ZODIAC.find(q=>q.id===S.zodiac)||{i:'♈'}).i:a,on=S.profile.avatar===a;
      return `<button class="look-it ${on?'on':''} ${ok?'':'lock'}" data-act="lookSet" data-k="avatar" data-v="${a}" ${ok?'':'disabled'} title="${ok?'':'Уровень '+l}"><span style="font-size:26px">${ok?g:'🔒'}</span><small>${ok?(a==='zodiac'?'Знак':'​'):'ур. '+l}</small></button>`;}).join('')}</div>
    <h3 class="h3 gold" style="margin:16px 0 8px">Рамка</h3><div class="look-grid">${FRAMES.map(f=>{const ok=f.ok();return `<button class="look-it ${S.profile.frame===f.id?'on':''} ${ok?'':'lock'}" data-act="lookSet" data-k="frame" data-v="${f.id}" ${ok?'':'disabled'}><span class="ava-mini fr-${f.id}">${avatarGlyph()}</span><small>${ok?f.name:'🔒 '+f.req}</small></button>`;}).join('')}</div>
    <h3 class="h3 gold" style="margin:16px 0 8px">Титул</h3><div class="title-list">${TITLES.map(t=>{const ok=t.ok();return `<button class="title-it ${S.profile.title===t.id?'on':''} ${ok?'':'lock'}" data-act="lookSet" data-k="title" data-v="${t.id}" ${ok?'':'disabled'}><b class="serif">${ok?'':'🔒 '}«${t.name}»</b><small>${t.req}</small></button>`;}).join('')}</div>`;},
  open(tab){if(tab)this.tab=tab;const w=Modal.open(this.html(),{cls:'wide'});w.querySelector('.modal')._z=S.zodiac;w.classList.add('profile-modal');},
  refresh(){const w=$('.profile-modal');if(!w)return;w.querySelector('.modal-body').innerHTML=this.html();w.querySelector('.modal')._z=S.zodiac;}
};
Actions.profile=()=>Profile.open('main');
Actions.pTab=el=>{Profile.tab=el.dataset.t;SFX.click();Profile.refresh();};
Actions.talUp=el=>{const t=talDef(el.dataset.id);if(!t||tpFree()<1||tal(t.id)>=t.max||(t.req&&tal(t.req)<1))return;S.talents[t.id]=tal(t.id)+1;save();SFX.magic();toast(`${t.icon} ${t.name}: уровень ${tal(t.id)}`,'gold');Profile.refresh();App.updateHUD();};
Actions.talReset=()=>{if(!confirm('Сбросить все навыки за 20 💎?'))return;if(!pay({crystals:20})){SFX.error();return toast('Нужно 20 💎','bad');}S.talents={};save();SFX.whoosh();Profile.refresh();App.updateHUD();};
Actions.lookSet=el=>{S.profile[el.dataset.k]=el.dataset.v;save();SFX.porcelain();Profile.refresh();App.updateHUD();};
