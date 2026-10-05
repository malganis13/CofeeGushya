/* =====================================================================
   APP — навигация, HUD, игровой цикл, запуск
   ===================================================================== */
const App={tab:'ritual',
  render(){const v=$('#view');v.innerHTML=Views[this.tab]();$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===this.tab));if(this.tab==='ritual')Ritual.mount();this.updateHUD();},
  go(tab){if(!Views[tab])return;if(this.tab==='ritual'&&tab!=='ritual')cancelAnimationFrame(Ritual.raf);this.tab=tab;SFX.click();this.render();scrollTo({top:0});},
  updateHUD(){$('#hud-coins').textContent=fmt(S.coins);$('#hud-crystals').textContent=fmt(S.crystals);$$('.hud-raw').forEach(e=>e.textContent=fmt(S.raw));
    $('#hud-lvl').textContent=S.level;$('#hud-xp').style.width=Math.min(100,S.xp/xpNeed(S.level)*100)+'%';const z=ZODIAC.find(q=>q.id===S.zodiac);$('#hud-ava').textContent=z?z.i:'🔮';
    const can=Object.keys(PLANTS).some(id=>S.plants[id].owned&&S.raw>=PLANTS[id].roast);$('#shop-dot').classList.toggle('on',can);}
};
Actions.tab=el=>{if(el.dataset.sub)Shop.sub=el.dataset.sub;Modal.closeAll();App.go(el.dataset.tab);};
Actions.closeModal=el=>Modal.close(el.closest('.modal-wrap'));
document.addEventListener('click',e=>{const n=e.target.closest('[data-tab]:not([data-act])');if(n&&n.classList.contains('nav-btn')){App.go(n.dataset.tab);return;}
  const a=e.target.closest('[data-act]');if(!a||a.disabled)return;const f=Actions[a.dataset.act];if(f){e.preventDefault();f(a,e);}});
let lastFloat=0;
function gameLoop(){const now=Date.now(),dt=(now-S.lastTick)/1000;if(dt>60){showOffline(Plant.offline());App.updateHUD();return;}
  if(dt<=0)return;S.lastTick=now;Plant.tick(dt);App.updateHUD();
  if(App.tab==='plant'){const fl=now-lastFloat>1000;if(fl)lastFloat=now;Plant.liveUpdate(fl);}}
function boot(){Stars.init();
  if(S.pending&&S.pending.symbols){Ritual.cur=S.pending;Ritual.step='reading';Ritual.sel.bean=S.pending.bean;}
  const off=Plant.offline();App.render();
  if(!S.onboarded)Onboard.show();else{if(off)showOffline(off);setTimeout(()=>Daily.check(),off?400:200);}
  setInterval(gameLoop,250);setInterval(save,5000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});addEventListener('pagehide',save);addEventListener('beforeunload',save);
  document.addEventListener('pointerdown',()=>SFX.ensure(),{once:true});}
