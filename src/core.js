'use strict';
/* =====================================================================
   CORE — утилиты, данные игры, хранилище (localStorage), звук, эффекты
   ===================================================================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fmt(n){n=Math.floor(n||0);const a=Math.abs(n);if(a<100000)return n.toLocaleString('ru-RU');
  for(const[v,s]of[[1e12,'T'],[1e9,'B'],[1e6,'M'],[1e3,'K']])if(a>=v)return (n/v).toFixed(a/v<100?1:0).replace('.',',')+s;return String(n);}
const fmt1=n=>n<10?n.toFixed(1).replace('.',','):fmt(n);
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const R={
  pick:(arr,r=Math.random)=>arr[Math.floor(r()*arr.length)],
  int:(a,b,r=Math.random)=>a+Math.floor(r()*(b-a+1)),
  weighted(list,r=Math.random){const tot=list.reduce((s,x)=>s+x.w,0);let v=r()*tot;for(const x of list){v-=x.w;if(v<=0)return x;}return list[list.length-1];}
};
const todayStr=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const dayDiff=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
function plural(n,f){n=Math.abs(Math.floor(n))%100;const n1=n%10;if(n>10&&n<20)return f[2];if(n1>1&&n1<5)return f[1];if(n1===1)return f[0];return f[2];}
function fmtDur(ms){const m=Math.floor(ms/60000),h=Math.floor(m/60),d=Math.floor(h/24);if(d>0)return d+' д '+(h%24)+' ч';if(h>0)return h+' ч '+(m%60)+' мин';return Math.max(1,m)+' мин';}
function fmtDate(ts){return new Date(ts).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+', '+new Date(ts).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});}

/* ============================ ДАННЫЕ ============================ */
const TIERS={C:{name:'Обычное',col:'#a9b8c9'},B:{name:'Редкое',col:'#6fd3a5'},A:{name:'Эпическое',col:'#c39bff'},S:{name:'Легендарное',col:'#f1c75b'}};
const TIER_ORDER={C:0,B:1,A:2,S:3};

const BEANS={
  arabica:{name:'Арабика Иргачеффе',tier:'C',luck:5,desc:'Цветочные ноты эфиопских холмов.'},
  robusta:{name:'Робуста Сумрака',tier:'C',luck:4,desc:'Крепкое зерно для честных ответов.'},
  supremo:{name:'Колумбия Супремо',tier:'B',luck:12,desc:'Карамель и туман Анд — ясное видение.'},
  moka:{name:'Мокко Бархатной Ночи',tier:'B',luck:14,desc:'Шоколадная тьма, любимая гадалками Йемена.'},
  bluemount:{name:'Ямайка Блю Маунтин',tier:'A',luck:22,desc:'Редчайшее зерно Синих гор. Раскрывает скрытое.'},
  kopi:{name:'Копи Лювак Тайн',tier:'A',luck:25,desc:'Зерно, прошедшее путь сквозь ночь джунглей.'},
  astral:{name:'Астральное Зерно Оракула',tier:'S',luck:38,desc:'Светится во тьме. Видит на месяцы вперёд.'},
  aphro:{name:'Зерно Афродиты',tier:'S',luck:42,desc:'Благословлено богиней любви. Сердечные тайны как на ладони.'}
};
const CUPS={
  clay:{name:'Глиняная чашка Странницы',tier:'C',luck:0,icon:'☕',desc:'Простая, тёплая, честная.'},
  porcelain:{name:'Фарфор с золотой каймой',tier:'B',luck:5,icon:'🍵',desc:'Гуща ложится тоньше и чище.'},
  moon:{name:'Серебряная чаша Луны',tier:'A',luck:10,icon:'🌙',desc:'Усиливает интуицию в ночные часы.'},
  ceremonial:{name:'Церемониальная чаша Исиды',tier:'A',luck:14,icon:'🏺',desc:'Древняя чаша жриц Нила.'},
  aphroditeCup:{name:'Хрустальный кубок Афродиты',tier:'S',luck:20,icon:'🥂',desc:'Каждый знак в нём сияет страстью.'}
};
const SPICES={
  cinnamon:{name:'Корица',tier:'C',icon:'🍂',focus:'wealth',luck:3,desc:'Притягивает деньги и успех.'},
  cardamom:{name:'Кардамон',tier:'C',icon:'🌿',focus:'secrets',luck:3,desc:'Обнажает тайны и интриги.'},
  rose:{name:'Лепестки Роз',tier:'B',icon:'🌹',focus:'love',luck:5,desc:'Усилитель романтических предсказаний.'},
  star:{name:'Звёздный Бадьян',tier:'B',icon:'✴️',focus:'advice',luck:5,desc:'Делает советы кофе точнее.'},
  gold:{name:'Золотые Хлопья',tier:'A',icon:'✨',focus:'all',luck:10,desc:'+10 к удаче во всех сферах.'}
};
const CHARMS={
  mult2:{name:'Амулет Фортуны ×2',tier:'A',icon:'🧿',mult:2,desc:'Удваивает награды за гадание.'},
  mult3:{name:'Слеза Феникса ×3',tier:'S',icon:'🔥',mult:3,desc:'Утраивает награды за гадание.'}
};
const ITEM_GROUPS={bean:{bag:'beans',db:BEANS},cup:{bag:'cups',db:CUPS},spice:{bag:'spices',db:SPICES},charm:{bag:'charms',db:CHARMS}};
function itemDef(t,id){return ITEM_GROUPS[t]&&ITEM_GROUPS[t].db[id];}
function itemIcon(t,id,size=''){
  if(t==='coins')return `<span class="ii ${size} t-C">🪙</span>`;
  if(t==='crystals')return `<span class="ii ${size} t-A">💎</span>`;
  const d=itemDef(t,id);if(!d)return '';
  const inner=t==='bean'?`<span class="bean t-${d.tier}${d.blend?' blend':''}"></span>`:d.icon;
  return `<span class="ii ${size} t-${d.tier}">${inner}</span>`;
}
const tierBadge=t=>`<span class="tier tier-${t}">${t}</span>`;

const PLANTS={
  eth:{name:'Эфиопия Иргачеффе',sub:'Колыбель кофе, где пастух Калди нашёл волшебные ягоды.',base:1,price:{coins:0},up:40,bean:'arabica',roast:60,icon:'⛰️',bush:'🌿',grad:'linear-gradient(135deg,#4a6b2a,#1f3214 60%,#12091a)'},
  col:{name:'Колумбия Супремо',sub:'Склоны Анд в утреннем тумане и песнях сборщиц.',base:5,price:{coins:600},up:320,bean:'supremo',roast:240,icon:'🌄',bush:'🌱',grad:'linear-gradient(135deg,#a4572a,#4b2414 60%,#12091a)'},
  jam:{name:'Ямайка Блю Маунтин',sub:'Синие горы, окутанные легендами и морским бризом.',base:22,price:{coins:6000},up:2800,bean:'bluemount',roast:900,icon:'🏝️',bush:'🌴',grad:'linear-gradient(135deg,#2a6a9a,#173556 60%,#12091a)'},
  astral:{name:'Астральный Сад Оракула',sub:'Сад меж звёзд, где зёрна светятся во тьме.',base:90,price:{crystals:80},minLevel:6,up:15000,bean:'astral',roast:3200,icon:'🌌',bush:'💫',grad:'linear-gradient(135deg,#6b2ca8,#2b1450 60%,#0a050e)'}
};
const UPG={
  irr:{name:'Полив',icon:'💧',k:1,g:1.55,max:30,desc:'+35% к урожаю за уровень'},
  fert:{name:'Магические Удобрения',icon:'🧪',k:2.6,g:1.72,max:20,desc:'×1,3 к урожаю за уровень'},
  bar:{name:'Мистические Бариста',icon:'🧙‍♀️',k:5,g:2.1,max:10,desc:'+25% урожая и +2 ч офлайн-сбора'}
};
const RAW_PRICE=0.5;

const CASES={
  isis:{name:'Ларчик Исиды',desc:'Шкатулка египетской богини: простые дары и редкие сюрпризы.',price:{coins:300},icon:'⚱️',oc:'#7a4a1e',og:'rgba(212,175,55,.45)',cc:'rgba(212,175,55,.18)',
    loot:[{t:'bean',id:'arabica',q:2,w:20},{t:'bean',id:'robusta',q:2,w:17},{t:'spice',id:'cinnamon',q:2,w:12},{t:'spice',id:'cardamom',q:2,w:10},{t:'coins',q:450,w:8,tier:'C'},
      {t:'bean',id:'supremo',q:1,w:11},{t:'bean',id:'moka',q:1,w:8},{t:'spice',id:'rose',q:1,w:7},{t:'cup',id:'porcelain',q:1,w:3},{t:'crystals',q:5,w:2,tier:'B'},
      {t:'bean',id:'bluemount',q:1,w:1.5},{t:'charm',id:'mult2',q:1,w:1.2},{t:'bean',id:'astral',q:1,w:.3}]},
  tarot:{name:'Шёпот Таро',desc:'Колода, что знает ответы. Эпические зёрна и чаши.',price:{crystals:15},icon:'🃏',oc:'#3b1d78',og:'rgba(195,155,255,.5)',cc:'rgba(195,155,255,.2)',
    loot:[{t:'bean',id:'supremo',q:2,w:16},{t:'bean',id:'moka',q:2,w:14},{t:'spice',id:'rose',q:2,w:12},{t:'spice',id:'star',q:2,w:10},{t:'bean',id:'bluemount',q:1,w:11},
      {t:'bean',id:'kopi',q:1,w:8},{t:'spice',id:'gold',q:1,w:7},{t:'coins',q:1500,w:6,tier:'B'},{t:'cup',id:'moon',q:1,w:5},{t:'charm',id:'mult2',q:1,w:6},
      {t:'cup',id:'ceremonial',q:1,w:2.5},{t:'charm',id:'mult3',q:1,w:1.5},{t:'bean',id:'astral',q:1,w:2},{t:'bean',id:'aphro',q:1,w:1}]},
  aphro:{name:'Эликсир Афродиты',desc:'Флакон богини любви. Легендарные дары для избранных.',price:{crystals:45},icon:'🧪',oc:'#8f2a55',og:'rgba(255,120,170,.5)',cc:'rgba(255,120,170,.2)',
    loot:[{t:'bean',id:'bluemount',q:2,w:16},{t:'bean',id:'kopi',q:2,w:14},{t:'spice',id:'rose',q:4,w:12},{t:'spice',id:'gold',q:2,w:11},{t:'charm',id:'mult2',q:2,w:10},
      {t:'bean',id:'astral',q:1,w:10},{t:'bean',id:'aphro',q:1,w:8},{t:'cup',id:'ceremonial',q:1,w:6},{t:'charm',id:'mult3',q:1,w:6},{t:'cup',id:'aphroditeCup',q:1,w:4},{t:'crystals',q:50,w:3,tier:'S'}]}
};
const SHOP=[
  {t:'bean',id:'arabica',price:{coins:45}},{t:'bean',id:'robusta',price:{coins:40}},{t:'bean',id:'supremo',price:{coins:180}},
  {t:'spice',id:'cinnamon',price:{coins:70}},{t:'spice',id:'cardamom',price:{coins:90}},{t:'spice',id:'rose',price:{coins:140}},{t:'spice',id:'star',price:{coins:160}},{t:'spice',id:'gold',price:{crystals:6}},
  {t:'cup',id:'porcelain',price:{coins:900}},{t:'cup',id:'moon',price:{crystals:30}},{t:'cup',id:'ceremonial',price:{crystals:70}},
  {t:'charm',id:'mult2',price:{crystals:18}}
];

const SYMBOLS={
  heart:{name:'Сердце',gen:'Сердца',icon:'❤️',meaning:'любовь и новые чувства'},
  key:{name:'Ключ',gen:'Ключа',icon:'🗝️',meaning:'разгадка и новые двери'},
  ring:{name:'Кольцо',gen:'Кольца',icon:'💍',meaning:'союз и обещание'},
  crown:{name:'Корона',gen:'Короны',icon:'👑',meaning:'успех и признание'},
  snake:{name:'Змея',gen:'Змеи',icon:'🐍',meaning:'искушение и мудрость'},
  tower:{name:'Башня',gen:'Башни',icon:'🏰',meaning:'амбиции и внезапные перемены'},
  bird:{name:'Птица',gen:'Птицы',icon:'🕊️',meaning:'вести, дорога и свобода'},
  crescent:{name:'Полумесяц',gen:'Полумесяца',icon:'🌙',meaning:'интуиция и тайна'},
  wolf:{name:'Волк',gen:'Волка',icon:'🐺',meaning:'верность, защита и страсть'}
};
const SPICE_BIAS={rose:['heart','ring','bird'],cinnamon:['crown','key','tower'],cardamom:['snake','wolf','crescent'],star:['bird','crescent','key'],gold:['crown','ring','heart']};
const ZODIAC=[
  {id:'aries',name:'Овен',i:'♈',el:'fire'},{id:'taurus',name:'Телец',i:'♉',el:'earth'},{id:'gemini',name:'Близнецы',i:'♊',el:'air'},{id:'cancer',name:'Рак',i:'♋',el:'water'},
  {id:'leo',name:'Лев',i:'♌',el:'fire'},{id:'virgo',name:'Дева',i:'♍',el:'earth'},{id:'libra',name:'Весы',i:'♎',el:'air'},{id:'scorpio',name:'Скорпион',i:'♏',el:'water'},
  {id:'sagittarius',name:'Стрелец',i:'♐',el:'fire'},{id:'capricorn',name:'Козерог',i:'♑',el:'earth'},{id:'aquarius',name:'Водолей',i:'♒',el:'air'},{id:'pisces',name:'Рыбы',i:'♓',el:'water'}
];
const DAILY=[
  {coins:100,label:'100 🪙',e:'🪙'},
  {coins:150,crystals:2,label:'150 🪙 + 2 💎',e:'💎'},
  {coins:200,items:[['spice','rose',1]],label:'200 🪙 + 🌹',e:'🌹'},
  {coins:250,crystals:4,label:'250 🪙 + 4 💎',e:'💎'},
  {coins:300,items:[['bean','supremo',2]],label:'300 🪙 + 2 зерна B',e:'☕'},
  {coins:400,crystals:6,items:[['spice','gold',1]],label:'6 💎 + ✨',e:'✨'},
  {coins:600,crystals:12,items:[['bean','bluemount',1],['charm','mult2',1]],label:'12 💎 + зерно A + 🧿',e:'👑'}
];

/* ============================ СОСТОЯНИЕ ============================ */
const SAVE_KEY='coffeeOracle.save.v1';
function newState(){return{v:1,created:Date.now(),onboarded:false,name:'',zodiac:'',
  coins:300,crystals:20,raw:0,level:1,xp:0,streak:0,lastDaily:null,lastTick:Date.now(),
  plants:{eth:{owned:true,irr:0,fert:0,bar:0},col:{owned:false,irr:0,fert:0,bar:0},jam:{owned:false,irr:0,fert:0,bar:0},astral:{owned:false,irr:0,fert:0,bar:0}},
  inv:{beans:{arabica:3,robusta:0,supremo:1,moka:0,bluemount:0,kopi:0,astral:0,aphro:0},cups:{clay:1,porcelain:0,moon:0,ceremonial:0,aphroditeCup:0},
       spices:{cinnamon:1,cardamom:0,rose:1,star:0,gold:0},charms:{mult2:0,mult3:0}},
  history:[],stats:{readings:0,cases:0,rawTotal:0,coinsEarned:0,symbols:{},bestLuck:0,roasts:0,tarot:0},settings:{sound:true},
  /* v2.0 */ rep:0,guests:{queue:[],nextAt:0,done:{},stories:{},active:null,served:0},talents:{},profile:{avatar:'zodiac',frame:'gold',title:'apprentice'},roastQ:{},blendsKnown:[],harvestAt:{}};}
function deepMerge(base,src){for(const k in src){const v=src[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&base[k]&&typeof base[k]==='object'&&!Array.isArray(base[k]))deepMerge(base[k],v);else base[k]=v;}return base;}
function loadState(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return newState();return deepMerge(newState(),JSON.parse(raw));}catch(e){console.warn('save broken',e);return newState();}}
let S=loadState();
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){console.warn(e);}}

const canPay=p=>(p.coins||0)<=S.coins&&(p.crystals||0)<=S.crystals;
function pay(p){if(!canPay(p))return false;S.coins-=p.coins||0;S.crystals-=p.crystals||0;return true;}
function priceHTML(p,mul=1){const a=[];if(p.coins)a.push(fmt(p.coins*mul)+' 🪙');if(p.crystals)a.push(fmt(p.crystals*mul)+' 💎');return a.join(' + ')||'Бесплатно';}
function addItem(t,id,q=1){if(t==='coins'){S.coins+=q;S.stats.coinsEarned+=q;return;}if(t==='crystals'){S.crystals+=q;return;}const g=ITEM_GROUPS[t];if(!g)return;S.inv[g.bag][id]=(S.inv[g.bag][id]||0)+q;}
function hasItem(t,id){return (S.inv[ITEM_GROUPS[t].bag][id]||0)>0;}
function takeItem(t,id,q=1){const b=S.inv[ITEM_GROUPS[t].bag];if((b[id]||0)<q)return false;b[id]-=q;return true;}
const xpNeed=l=>Math.round(100*Math.pow(l,1.45));
function addXP(n){S.xp+=Math.round(n);while(S.xp>=xpNeed(S.level)){S.xp-=xpNeed(S.level);S.level++;const c=100*S.level;S.coins+=c;S.crystals+=5;
  setTimeout(()=>{toast(`✨ Новый уровень ${S.level}! +${fmt(c)} 🪙 и +5 💎`,'gold');SFX.magic();Confetti.burst(90);},300);}}

/* ============================ ЗВУК ============================ */
const SFX={ctx:null,
  ensure(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(A)try{this.ctx=new A();}catch(e){}}if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},
  tone(f,d=.15,type='sine',v=.08,delay=0){if(!S.settings.sound)return;const c=this.ensure();if(!c)return;const t=c.currentTime+delay;const o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.03);},
  noise(d=.4,v=.05,f=1200){if(!S.settings.sound)return;const c=this.ensure();if(!c)return;const len=Math.floor(c.sampleRate*d),b=c.createBuffer(1,len,c.sampleRate),ch=b.getChannelData(0);
    for(let i=0;i<len;i++)ch[i]=(Math.random()*2-1)*(1-i/len);const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f;const g=c.createGain();g.gain.value=v;s.connect(fl);fl.connect(g);g.connect(c.destination);s.start();},
  click(){this.tone(720,.06,'triangle',.035);},
  coin(){this.tone(988,.08,'square',.025);this.tone(1319,.14,'square',.025,.06);},
  chime(){[523,659,784,1047].forEach((f,i)=>this.tone(f,.6,'sine',.06,i*.09));},
  magic(){[392,494,587,740,880,1175].forEach((f,i)=>this.tone(f,.7,'triangle',.04,i*.07));},
  find(){this.tone(880,.25,'sine',.06);this.tone(1320,.4,'sine',.05,.08);},
  error(){this.tone(180,.22,'sawtooth',.03);},
  whoosh(){this.noise(.5,.08,900);},
  bubble(){this.tone(300+Math.random()*300,.05,'sine',.03);}
};

/* ============================ UI-ХЕЛПЕРЫ ============================ */
function toast(msg,kind=''){const el=document.createElement('div');el.className='toast '+kind;el.innerHTML=msg;$('#toasts').appendChild(el);
  setTimeout(()=>el.classList.add('out'),2800);setTimeout(()=>el.remove(),3200);}
const Modal={
  open(html,o={}){const w=document.createElement('div');w.className='modal-wrap';
    w.innerHTML=`<div class="modal glass ${o.cls||''}">${o.noClose?'':'<button class="modal-x" data-act="closeModal" aria-label="Закрыть">✕</button>'}<div class="modal-body">${html}</div></div>`;
    $('#modals').appendChild(w);requestAnimationFrame(()=>w.classList.add('show'));
    if(!o.noClose)w.addEventListener('pointerdown',e=>{if(e.target===w)Modal.close(w);});w._onClose=o.onClose;return w;},
  close(w){w=w||$$('.modal-wrap').pop();if(!w||w._closing)return;w._closing=true;w.classList.remove('show');setTimeout(()=>w.remove(),260);if(w._onClose)w._onClose();},
  closeAll(){$$('.modal-wrap').forEach(w=>this.close(w));}
};
function floatNum(parent,text,x,y){if(!parent)return;const el=document.createElement('div');el.className='float-num';el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';parent.appendChild(el);setTimeout(()=>el.remove(),1500);}

/* ============================ КОНФЕТТИ ============================ */
const Confetti={parts:[],running:false,
  burst(n=120,colors=['#D4AF37','#F3D98B','#ff7fb0','#c39bff','#ffffff','#8f2a55']){const c=$('#confetti'),dpr=Math.min(2,window.devicePixelRatio||1);
    c.width=innerWidth*dpr;c.height=innerHeight*dpr;const W=innerWidth,H=innerHeight;
    for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=4+Math.random()*11;this.parts.push({x:W/2,y:H*.42,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-6,s:4+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:colors[i%colors.length],life:110+Math.random()*70,star:Math.random()<.3});}
    if(!this.running){this.running=true;requestAnimationFrame(()=>this.step(dpr));}},
  step(dpr){const c=$('#confetti'),x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,c.width,c.height);
    this.parts=this.parts.filter(p=>p.life>0);
    for(const p of this.parts){p.life--;p.vy+=.28;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.globalAlpha=Math.min(1,p.life/40);x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;
      if(p.star){x.font=(p.s*2.4)+'px serif';x.fillText('✦',-p.s,p.s);}else x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore();}
    if(this.parts.length)requestAnimationFrame(()=>this.step(dpr));else{this.running=false;x.clearRect(0,0,c.width,c.height);}}
};

/* ============================ ЗВЁЗДНОЕ НЕБО ============================ */
const Stars={init(){const c=$('#stars'),x=c.getContext('2d');let W,H,st=[],shoot=null;const dpr=Math.min(2,window.devicePixelRatio||1);
  const resize=()=>{W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    st=Array.from({length:Math.round(W*H/5500)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.2,p:Math.random()*6.28,s:.5+Math.random()*1.5,g:Math.random()<.15}));};
  resize();addEventListener('resize',resize);
  const motes=Array.from({length:18},()=>({x:Math.random(),y:Math.random(),v:.00004+Math.random()*.00008,r:20+Math.random()*60}));
  const loop=t=>{x.clearRect(0,0,W,H);
    for(const m of motes){m.y-=m.v*16;if(m.y<-.1)m.y=1.1;const g=x.createRadialGradient(m.x*W,m.y*H,0,m.x*W,m.y*H,m.r);g.addColorStop(0,'rgba(143,42,85,.07)');g.addColorStop(1,'rgba(143,42,85,0)');x.fillStyle=g;x.fillRect(m.x*W-m.r,m.y*H-m.r,m.r*2,m.r*2);}
    for(const s of st){const a=.35+.65*Math.abs(Math.sin(t/1000*s.s+s.p));x.globalAlpha=a;x.fillStyle=s.g?'#F3D98B':'#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill();}
    x.globalAlpha=1;
    if(!shoot&&Math.random()<.003)shoot={x:Math.random()*W*.8,y:Math.random()*H*.4,l:0};
    if(shoot){shoot.l+=1;const px=shoot.x+shoot.l*9,py=shoot.y+shoot.l*4;const g=x.createLinearGradient(px,py,px-90,py-40);g.addColorStop(0,'rgba(243,217,139,.9)');g.addColorStop(1,'rgba(243,217,139,0)');
      x.strokeStyle=g;x.lineWidth=1.6;x.beginPath();x.moveTo(px,py);x.lineTo(px-90,py-40);x.stroke();if(shoot.l>60)shoot=null;}
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);}};
