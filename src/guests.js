/* =====================================================================
   GUESTS — «Мистическая Кофейня»: гости, заказы, репутация, сюжеты
   ===================================================================== */
const GUESTS={
  poet:{name:'Лиана',role:'Влюблённая поэтесса',icon:'💌',col:'#8f2a55',tip:220,
    intro:'Ах, простите, я опять опоздала на собственную жизнь… Говорят, ваша гуща не лжёт — а мне так нужна правда.',
    orders:[
      {q:'Он читает мои стихи, но молчит. Любит ли он меня — или лишь мои рифмы?',focus:'love',minTier:'B',syms:['heart','ring','flower','feather'],hint:'Ей нужно что-то для сердца — лепестки роз и зерно не проще редкого.'},
      {q:'Мне предложили издать сборник в столице. Стоит ли уезжать от него?',focus:'advice',minTier:'C',syms:['bird','ship','bridge','compass'],hint:'Ей нужен ясный совет — звёздный бадьян подскажет путь.'},
      {q:'Кто-то подбрасывает мне письма с моими же строками. Кто он?',focus:'secrets',minTier:'A',cupTier:'A',syms:['eye','feather','owl','candle'],hint:'Тайна глубокая: кардамон, эпическое зерно и благородная чаша.'}],
    story:['Лиана пишет стихи с двенадцати лет. Первое стихотворение она посвятила мальчику, который кормил голубей у фонтана.','Тот мальчик вырос и стал переплётчиком. Именно он переплетает все её рукописи — и ни разу не взял денег.','Лиана призналась: каждое её стихотворение о любви на самом деле о нём. Но она боится, что он видит в ней лишь клиентку.','Анонимные письма писал он сам — переписывал её строки, потому что не умел выразить чувства своими словами.','В новом сборнике Лианы на первой странице стоит посвящение: «Тому, кто переплёл мою жизнь». Свадьба — весной.'],
    ok:['Вы… вы прочли моё сердце, как раскрытую книгу! Возьмите, это от всей души.','Я напишу о вас поэму. Нет, целую главу!'],bad:['Хм… красиво, но это не обо мне. Может, в другой раз гуща будет добрее.']},
  alchemist:{m:true,name:'Бертран',role:'Уставший алхимик',icon:'⚗️',col:'#2a6a5a',tip:300,
    intro:'Двадцать лет над тиглями… Глаза слезятся от серы, а сердце — от разочарований. Налейте чего-нибудь крепкого. И погадайте.',
    orders:[
      {q:'Двадцать лет я ищу философский камень. Скажи, кофе, близок ли я?',focus:'wealth',minTier:'B',syms:['crown','key','lightning','sun'],hint:'Ему важны успех и богатство — корица и зерно редкого сорта.'},
      {q:'Мой ученик сбежал с моими записями. Вернётся ли он?',focus:'secrets',minTier:'B',syms:['snake','bridge','eye','spider'],hint:'Кардамон раскроет предательство, зерно — не ниже редкого.'},
      {q:'Я так устал… Может, пора бросить алхимию?',focus:'advice',minTier:'A',syms:['hourglass','tree','candle','owl'],hint:'Совет мудрецу: звёздный бадьян и эпическое зерно.'}],
    story:['Бертран когда-то был придворным алхимиком, но его изгнали за то, что он отказался варить яд для короля.','В его лаборатории до сих пор стоит пустая колба с надписью «Для Агаты». Агата — его покойная жена.','Он ищет философский камень не ради золота: легенда гласит, что камень позволяет услышать голос ушедших.','Сбежавший ученик вернулся с повинной — он хотел продать записи, но не смог предать учителя.','Бертран понял: его камень — это ученики. Теперь он открыл школу и впервые за двадцать лет смеётся.'],
    ok:['Хм! Гуща точнее моих весов. Держите — заслужили.','Давно я не чувствовал такой ясности. Благодарю, коллега.'],bad:['Туманно, туманно… Как мои последние опыты.']},
  merchant:{m:true,name:'Хасан',role:'Таинственный купец',icon:'🧳',col:'#7a4a1e',tip:450,
    intro:'Я привёз шёлк из Самарканда и пряности из Занзибара. Но самый ценный товар — знание будущего. Сколько стоит ваше?',
    orders:[
      {q:'Мой караван ждёт у ворот. Принесёт ли эта сделка золото?',focus:'wealth',minTier:'A',syms:['fish','crown','compass','clover'],hint:'Купцу нужна корица и зерно эпической редкости.'},
      {q:'Среди моих людей завёлся вор. Укажи мне на него.',focus:'secrets',minTier:'B',syms:['snake','spider','eye','cat'],hint:'Кардамон и зерно не ниже редкого.'},
      {q:'В одном порту живёт женщина, которую я не видел десять лет…',focus:'love',minTier:'A',cupTier:'B',syms:['heart','ship','anchor','bridge'],hint:'Сердечная тайна: розы, эпическое зерно, чаша не проще фарфоровой.'}],
    story:['Хасан никогда не снимает перстень с синим камнем. Говорят, он выиграл его у джинна в нарды.','На самом деле перстень подарила Зейнаб — дочь смотрителя маяка в порту Танжер.','Он уехал, пообещав вернуться богатым. Вернулся богатым — но через десять лет и слишком гордым, чтобы постучать.','Вором оказался его собственный страх: он «терял» товары, чтобы не плыть в Танжер.','Хасан наконец отплыл. Говорят, маяк Танжера теперь светит двумя огнями.'],
    ok:['Ваше слово дороже шёлка. Вот ваша доля, хозяйка.','Аллах свидетель, вы лучшая гадалка от Багдада до Венеции!'],bad:['Плохая сделка, но я не держу зла. Купцы привыкли к потерям.']},
  witch:{name:'Мира',role:'Молодая колдунья',icon:'🧙‍♀️',col:'#3b1d78',tip:350,
    intro:'Тс-с! Ковен не знает, что я здесь. Говорят, в кофейной гуще видно то, чего не покажет ни одно зеркало.',
    orders:[
      {q:'Ковен говорит, что мой дар слаб. Есть ли во мне сила?',focus:'advice',minTier:'B',syms:['crescent','lightning','star','candle'],hint:'Ей нужен совет звёзд — бадьян и редкое зерно.'},
      {q:'Мне снится юноша с золотыми глазами. Он настоящий?',focus:'love',minTier:'B',syms:['heart','cat','crescent','butterfly'],hint:'Лепестки роз и зерно не ниже редкого.'},
      {q:'Старая ведьма хочет забрать мой гримуар. Как защититься?',focus:'secrets',minTier:'S',cupTier:'A',syms:['sword','wolf','dragon','eye'],hint:'Опасная тайна: кардамон, легендарное зерно и эпическая чаша.'}],
    story:['Мира — единственная в ковене, кто не может зажечь свечу взглядом. Зато её травы лечат лучше любых заклятий.','Юноша с золотыми глазами — не сон. Это кот-фамильяр, который ждёт, когда она назовёт его настоящее имя.','Старая ведьма Гризельда охотится за гримуаром, потому что в нём записано пророчество о новой Верховной.','Пророчество говорит о колдунье, «чья сила — в корнях, а не в огне». Это Мира.','Мира разгадала имя фамильяра — Ориэль. Ковен склонил головы перед новой Верховной.'],
    ok:['Ух ты! Ты сильнее всего ковена вместе взятого. Держи, это кристаллы с лунной поляны!','Я запишу твоё предсказание в гримуар. Самой первой строкой!'],bad:['Хм-м… а гуща точно не перепутала меня с кем-то?']},
  captain:{m:true,name:'Дарен',role:'Капитан без корабля',icon:'⚓',col:'#173556',tip:380,
    intro:'Солёный ветер ещё в моих волосах, а палубы под ногами нет уже год. Плесните кофе покрепче, гадалка.',
    orders:[
      {q:'Мой корабль «Северная Звезда» затонул. Будет ли у меня новый?',focus:'wealth',minTier:'B',syms:['ship','anchor','compass','fish'],hint:'Корица для удачи в деле и редкое зерно.'},
      {q:'Где-то на побережье меня ждёт дочь, которую я ни разу не видел…',focus:'love',minTier:'A',syms:['tree','heart','bridge','bird'],hint:'Лепестки роз и эпическое зерно.'},
      {q:'Говорят, в Туманных морях есть остров Оракула. Куда мне плыть?',focus:'advice',minTier:'A',cupTier:'A',syms:['compass','star','bird','ship'],hint:'Бадьян, эпическое зерно и чаша Луны или Исиды.'}],
    story:['«Северная Звезда» затонула в шторм, но Дарен спас всю команду — и остался последним на тонущей палубе.','Его вытащила из воды рыбачка Илва. Он прожил у неё три месяца, а потом снова ушёл в море.','Спустя годы он узнал, что у Илвы родилась дочь. С его глазами цвета штормового моря.','Команда «Северной Звезды» скинулась своими сбережениями — и купила капитану новую шхуну.','Шхуна называется «Илва». Первым рейсом Дарен отвёз дочь на остров Оракула — смотреть на звёзды.'],
    ok:['Клянусь всеми якорями — в точку! Это вам, от старого морского волка.','Попутного ветра вашей кофейне, гадалка!'],bad:['Штиль в гуще… Ничего, капитаны умеют ждать.']},
  countess:{name:'Элеонора',role:'Графиня в трауре',icon:'🖤',col:'#2a1430',tip:500,
    intro:'Прошу, задёрните штору. Я не хочу, чтобы меня узнали. В свете говорят, что вдове не пристало гадать. Но я должна знать.',
    orders:[
      {q:'Мой муж умер при странных обстоятельствах. Это была судьба?',focus:'secrets',minTier:'A',syms:['snake','eye','hourglass','spider'],hint:'Кардамон и эпическое зерно.'},
      {q:'Наследники требуют моё поместье. Удержу ли я его?',focus:'wealth',minTier:'B',syms:['tower','crown','anchor','sword'],hint:'Корица и редкое зерно.'},
      {q:'Молодой художник пишет мой портрет и смотрит слишком долго…',focus:'love',minTier:'S',cupTier:'A',syms:['heart','butterfly','flower','star'],hint:'Розы, легендарное зерно и эпическая чаша.'}],
    story:['Граф фон Равенсберг был вдвое старше Элеоноры. Их брак устроили родители, но она искренне уважала мужа.','В ночь его смерти в замке гостил кузен графа — Леопольд, первый в очереди наследников.','Яд был в бокале, предназначенном Элеоноре. Граф выпил его, чтобы её защитить: он знал о заговоре.','Леопольд разоблачён, поместье осталось за графиней. В тайнике она нашла письмо мужа: «Живи. И люби».','Портрет закончен. На нём Элеонора впервые улыбается. Художник остался в замке — уже не как гость.'],
    ok:['Вы вернули мне надежду. Примите эту скромную благодарность.','Ваша чашка видит больше, чем весь высший свет.'],bad:['Благодарю… но, кажется, правда всё ещё скрыта под вуалью.']}
};
const TIERS_ARR=['C','B','A','S'];
function repRank(){let i=0;REP_RANKS.forEach((r,k)=>{if(S.rep>=r[0])i=k;});return{i,name:REP_RANKS[i][1],next:REP_RANKS[i+1]?REP_RANKS[i+1][0]:null,cur:REP_RANKS[i][0]};}
const Guests={
  interval(){return 150000*(1-.15*tal('host'))/(1+.12*repRank().i);},
  orderOf(q){const g=GUESTS[q.gid];return g.orders[q.oi%g.orders.length];},
  spawn(force){const G=S.guests;if(G.queue.length>=3)return null;const busy=G.queue.map(q=>q.gid);
    const pool=Object.keys(GUESTS).filter(id=>!busy.includes(id)).map(id=>({id,w:(G.stories[id]||0)<5?3:1}));if(!pool.length)return null;
    const gid=force||R.weighted(pool).id,q={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),gid,oi:G.done[gid]||0,ts:Date.now()};G.queue.push(q);return q;},
  tick(now,silent){const G=S.guests;if(G.queue.length>=3){G.nextAt=now+this.interval();return;}if(!G.nextAt)G.nextAt=now+15000;
    let n=0;while(now>=G.nextAt&&G.queue.length<3){const q=this.spawn();G.nextAt+=this.interval();if(q)n++;if(G.nextAt<now-3*this.interval())G.nextAt=now;}
    if(G.queue.length>=3)G.nextAt=now+this.interval();
    if(n&&!silent){const g=GUESTS[G.queue[G.queue.length-1].gid];SFX.bell();toast(`🛎️ В кофейню ${g.m?'вошёл гость':'вошла гостья'}: <b>${g.name}</b>, ${g.role.toLowerCase()}`,'gold');if(App.tab==='guests')App.render();}},
  boot(){const G=S.guests;if(!G.queue.length&&!G.served)this.spawn('poet');this.tick(Date.now(),true);},
  active(){const G=S.guests;return G.active?G.queue.find(q=>q.id===G.active):null;},
  bannerHTML(){const q=this.active();if(!q)return '';const g=GUESTS[q.gid],o=this.orderOf(q);
    return `<div class="glass order-banner fade-in" style="--gc:${g.col}"><span class="g-ava sm">${g.icon}</span><div class="sp" style="min-width:0"><div class="dim" style="font-size:11.5px">Заказ гостя · ${esc(g.role)}</div>
      <b class="serif gold" style="font-size:18px">${esc(g.name)}: «${esc(o.q)}»</b><div style="font-size:12.5px;color:var(--text-2);margin-top:2px">💡 ${esc(o.hint)}</div><div class="row" style="gap:6px;margin-top:6px">${this.reqChips(o)}</div></div>
      <button class="btn btn-sm" data-act="gCancel" title="Отложить заказ">✕</button></div>`;},
  reqChips(o){const f=SECTIONS.find(s=>s.id===o.focus);return `<span class="chip">${f.icon} ${f.title}</span><span class="chip">Зерно ${tierBadge(o.minTier)}+</span>${o.cupTier?`<span class="chip">Чаша ${tierBadge(o.cupTier)}+</span>`:''}`;},
  evaluate(r,q){const o=this.orderOf(q),sp=SPICES[r.spice],bean=BEANS[r.bean],cup=CUPS[r.cup];let score=20;const notes=[];
    if(sp&&sp.focus===o.focus){score+=30;notes.push('✓ Пряность попала в суть вопроса');}else if(sp&&sp.focus==='all'){score+=18;notes.push('≈ Золотые хлопья помогли');}else notes.push('✗ Пряность не та');
    const bt=TIERS_ARR.indexOf(bean.tier),mt=TIERS_ARR.indexOf(o.minTier);if(bt>=mt){score+=25;notes.push('✓ Зерно достойно вопроса');}else if(bt===mt-1){score+=10;notes.push('≈ Зерно чуть слабее нужного');}else notes.push('✗ Зерно слишком простое');
    if(!o.cupTier||TIERS_ARR.indexOf(cup.tier)>=TIERS_ARR.indexOf(o.cupTier)){score+=10;if(o.cupTier)notes.push('✓ Чаша подходящая');}else notes.push('✗ Нужна чаша благороднее');
    const hit=r.symbols.filter(id=>o.syms.includes(id));if(hit.length){score+=Math.min(20,hit.length*10);notes.push('✓ Знаки откликнулись: '+hit.map(id=>SYMBOLS[id].icon).join(' '));}
    if(r.luck>=60)score+=5;score=clamp(score,0,100);const stars=score>=85?3:score>=60?2:1;return{score,stars,ok:score>=60,notes};},
  complete(r){const q=this.active();if(!q)return null;const G=S.guests,g=GUESTS[q.gid],ev=this.evaluate(r,q),rk=repRank();
    const venus=BEANS[r.bean].eff==='love'?2:1;
    const coins=Math.round(g.tip*(.4+ev.score/100)*(1+.15*tal('persuade'))*(1+.1*rk.i)*venus),crystals=(ev.stars===3?3:ev.stars===2?1:0)+(ev.ok&&rk.i>=2?1:0),rep=ev.stars*5+(ev.ok?5:0);
    addItem('coins',0,coins);S.crystals+=crystals;S.rep+=rep;addXP(ev.stars*15);G.served++;
    let frag=null;if(ev.ok){G.done[q.gid]=(G.done[q.gid]||0)+1;const n=G.stories[q.gid]||0;if(n<g.story.length){G.stories[q.gid]=n+1;frag=n;}}
    G.queue=G.queue.filter(x=>x.id!==q.id);G.active=null;const nr=repRank();
    const res={gid:q.gid,ev,coins,crystals,rep,frag,rankUp:nr.i>rk.i?nr.name:null};save();return res;},
  showResult(res){const g=GUESTS[res.gid],ev=res.ev;
    Modal.open(`<div class="vn-box"><span class="g-ava lg" style="--gc:${g.col}">${g.icon}</span><div class="sp"><div class="dim" style="font-size:12px">${esc(g.role)}</div><h2 class="h2" style="margin:0">${esc(g.name)}</h2>
      <div class="stars5" style="font-size:22px">${'★'.repeat(ev.stars)}${'☆'.repeat(3-ev.stars)}</div></div></div>
      <div class="vn-text serif">«${esc(R.pick(ev.ok?g.ok:g.bad))}»</div>
      <div style="font-size:12.5px;color:var(--text-2);margin:10px 0">${ev.notes.map(n=>`<div>${n}</div>`).join('')}<div style="margin-top:4px">Точность гадания: <b class="gold">${ev.score}%</b></div></div>
      <div class="row" style="justify-content:center;gap:8px"><span class="chip">🪙 +${fmt(res.coins)} чаевых</span>${res.crystals?`<span class="chip">💎 +${res.crystals}</span>`:''}<span class="chip">🏅 +${res.rep} репутации</span></div>
      ${res.frag!=null?`<div class="glass story-frag"><div class="dim" style="font-size:11.5px">📖 Открыт фрагмент истории ${res.frag+1}/${g.story.length}</div><p class="serif" style="font-size:17px;margin-top:4px">${esc(g.story[res.frag])}</p></div>`:''}
      ${res.rankUp?`<div class="toast gold" style="margin-top:10px;animation:none">🏰 Новый ранг кофейни: <b>${res.rankUp}</b></div>`:''}
      <button class="btn btn-gold btn-block" data-act="closeModal" style="margin-top:14px">Проводить гостя</button>`);
    if(ev.ok){SFX.porcelain();SFX.chime();Confetti.burst(ev.stars===3?140:70);}else SFX.error();}
};
Views.guests=()=>{const G=S.guests,rk=repRank(),pct=rk.next?(S.rep-rk.cur)/(rk.next-rk.cur)*100:100;
  let h=`<div class="page-head fade-in"><div><h1 class="section-title">Мистическая Кофейня</h1><p class="subtitle">Гости приходят со своими историями и вопросами. Подберите зерно, пряность и чашку, проведите гадание — и узнайте их тайны.</p></div>
  <div class="glass stat-box glow"><div class="row"><div><div class="dim" style="font-size:12px">Репутация</div><div class="big">🏅 ${fmt(S.rep)}</div></div><div class="sp"></div><div style="text-align:right"><div class="dim" style="font-size:12px">Ранг</div><b class="gold serif" style="font-size:19px">${rk.name}</b></div></div>
  <div class="luck-meter"><i style="width:${pct}%"></i></div><div class="dim" style="font-size:11.5px">${rk.next?`До следующего ранга: ${rk.next-S.rep}`:'Высший ранг достигнут'} · чаевые +${rk.i*10}%</div></div></div>`;
  h+=`<h3 class="h3 gold" style="margin:4px 2px 10px">За столиками</h3><div class="grid g-auto">`;
  for(let i=0;i<3;i++){const q=G.queue[i];
    if(!q){h+=`<div class="glass guest-card empty-seat fade-in"><span class="g-ava" style="--gc:#2a1a36;filter:grayscale(1);opacity:.5">🪑</span><div class="sp"><b>Свободный столик</b><div class="dim" style="font-size:12.5px">Следующий гость через <span class="guest-timer">${fmtTimer(G.nextAt-Date.now())}</span></div></div></div>`;continue;}
    const g=GUESTS[q.gid],o=Guests.orderOf(q),act=G.active===q.id;
    h+=`<div class="glass guest-card fade-in ${act?'glow':''}" style="--gc:${g.col}"><span class="g-ava">${g.icon}</span><div class="sp" style="min-width:0"><div class="dim" style="font-size:11.5px">${esc(g.role)}</div><b class="serif gold" style="font-size:20px">${esc(g.name)}</b>
      <div style="font-size:13px;color:var(--text-2);margin:3px 0 8px">«${esc(o.q)}»</div><div class="row" style="gap:6px">${act?'<span class="chip" style="border-color:var(--gold)">☕ Заказ готовится</span>':''}
      <button class="btn btn-sm btn-gold" data-act="gTalk" data-id="${q.id}">${act?'К ритуалу':'Выслушать'}</button></div></div></div>`;}
  h+=`</div><h3 class="h3 gold" style="margin:20px 2px 10px">Книга историй</h3><div class="grid g-auto">`;
  for(const gid in GUESTS){const g=GUESTS[gid],n=G.stories[gid]||0;
    h+=`<div class="glass guest-card click fade-in" data-act="gStory" data-gid="${gid}" style="--gc:${g.col}"><span class="g-ava sm">${n?g.icon:'❔'}</span><div class="sp"><b>${n?esc(g.name):'Незнакомец'}</b> <span class="dim" style="font-size:12px">${n?esc(g.role):'ещё не открыл свою историю'}</span>
      <div class="frag-dots">${g.story.map((_,k)=>`<i class="${k<n?'on':''}"></i>`).join('')}</div></div><span class="dim" style="font-size:12px">${n}/${g.story.length}</span></div>`;}
  return h+'</div>';};
function fmtTimer(ms){ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
Actions.gTalk=el=>{const q=S.guests.queue.find(x=>x.id===el.dataset.id);if(!q)return;if(S.guests.active===q.id){App.go('ritual');return;}const g=GUESTS[q.gid],o=Guests.orderOf(q),first=!(S.guests.stories[q.gid]||S.guests.done[q.gid]);
  const w=Modal.open(`<div class="vn-box"><span class="g-ava lg" style="--gc:${g.col}">${g.icon}</span><div><div class="dim" style="font-size:12px">${esc(g.role)}</div><h2 class="h2" style="margin:0">${esc(g.name)}</h2></div></div>
    <div class="vn-text serif" id="vnText"></div><div id="vnMore" style="opacity:0;transition:opacity .4s"><div class="glass story-frag"><div class="dim" style="font-size:12px">Что нужно гостю</div><div style="font-size:13.5px;margin:4px 0 8px">💡 ${esc(o.hint)}</div><div class="row" style="gap:6px">${Guests.reqChips(o)}</div></div>
    <div class="row" style="margin-top:14px"><button class="btn sp" data-act="closeModal">Позже</button><button class="btn btn-gold sp" data-act="gAccept" data-id="${q.id}">☕ Взяться за заказ</button></div></div>`);
  SFX.porcelain();const txt=(first?g.intro+'\n\n':'')+'«'+o.q+'»',box=w.querySelector('#vnText');let k=0;const tick=()=>{if(!box.isConnected)return;k=Math.min(txt.length,k+2);box.textContent=txt.slice(0,k);if(k<txt.length)setTimeout(tick,18);else w.querySelector('#vnMore').style.opacity=1;};
  box.addEventListener('click',()=>k=txt.length);tick();};
Actions.gAccept=el=>{if(Ritual.step==='reading'){toast('Сначала завершите текущее гадание','bad');return;}S.guests.active=el.dataset.id;if(Ritual.step==='fortune'||Ritual.step>2){Ritual.step=1;Ritual.cur=null;Ritual.brew=null;}
  save();Modal.close(el.closest('.modal-wrap'));SFX.chime();toast('☕ Заказ принят. Подберите ингредиенты!','gold');App.go('ritual');};
Actions.gCancel=()=>{S.guests.active=null;save();toast('Заказ отложен — гость подождёт за столиком');App.render();};
Actions.gStory=el=>{const g=GUESTS[el.dataset.gid],n=S.guests.stories[el.dataset.gid]||0;
  Modal.open(`<div class="vn-box"><span class="g-ava lg" style="--gc:${g.col}">${n?g.icon:'❔'}</span><div><h2 class="h2" style="margin:0">${n?esc(g.name):'???'}</h2><div class="dim" style="font-size:12px">${n?esc(g.role):'Исполните заказ гостя, чтобы узнать больше'}</div></div></div>
    ${g.story.map((s,k)=>`<div class="glass story-frag ${k<n?'':'locked'}"><div class="dim" style="font-size:11px">Глава ${k+1}</div><p class="serif" style="font-size:16.5px">${k<n?esc(s):'🔒 Фрагмент откроется после успешного гадания для этого гостя'}</p></div>`).join('')}`,{cls:'wide'});};
