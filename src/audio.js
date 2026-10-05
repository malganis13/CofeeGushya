/* =====================================================================
   AUDIO v2.1 — мягкий звуковой движок (Web Audio API)
   Мастер-шина: лоу-пасс → компрессор, общий «зал» (реверб) для всех звуков.
   Никаких square/sawtooth, плавные атаки ≥ 10 мс, верх срезан ~5 кГц.
   ===================================================================== */
const PENTA=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880,1046.5];
Object.assign(SFX,{
  bus:null,rev:null,
  ensure(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(A)try{this.ctx=new A();this.build();}catch(e){this.ctx=null;}}
    if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},
  build(){const c=this.ctx,comp=c.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=18;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.3;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;lp.Q.value=.4;const m=c.createGain();m.gain.value=.85;
    m.connect(lp);lp.connect(comp);comp.connect(c.destination);this.bus=m;
    // мягкий «зал»: стерео-импульс из затухающего сглаженного шума
    const len=Math.floor(c.sampleRate*3.2),ir=c.createBuffer(2,len,c.sampleRate);
    for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);let p=0;for(let i=0;i<len;i++){p=p*.62+(Math.random()*2-1)*.38;d[i]=p*Math.pow(1-i/len,2.6);}}
    const cv=c.createConvolver();cv.buffer=ir;const rg=c.createGain();rg.gain.value=.55;const rlp=c.createBiquadFilter();rlp.type='lowpass';rlp.frequency.value=3200;
    cv.connect(rlp);rlp.connect(rg);rg.connect(m);this.rev=cv;},
  out(node,send=.3){node.connect(this.bus);if(send>0){const s=this.ctx.createGain();s.gain.value=send;node.connect(s);s.connect(this.rev);}},
  // базовый голос: мягкая атака и экспоненциальное затухание
  tone(f,d=.3,type='sine',v=.05,delay=0,o={}){if(!S.settings.sound)return;const c=this.ensure();if(!c)return;const t=c.currentTime+delay,att=Math.max(.012,o.att||.015);
    if(type==='square'||type==='sawtooth')type='triangle';f=Math.min(f,4200);
    const os=c.createOscillator(),g=c.createGain();os.type=type;os.frequency.setValueAtTime(f,t);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+(o.glide||d*.6));if(o.det)os.detune.value=o.det;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.setTargetAtTime(0,t+att,Math.max(.03,d/4));
    os.connect(g);this.out(g,o.send==null?.3:o.send);os.start(t);os.stop(t+att+d*1.6+.1);},
  noise(d=.4,v=.03,f=1200,o={}){if(!S.settings.sound)return;const c=this.ensure();if(!c)return;const t=c.currentTime+(o.delay||0),len=Math.floor(c.sampleRate*d),b=c.createBuffer(1,len,c.sampleRate),ch=b.getChannelData(0);
    for(let i=0;i<len;i++)ch[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type=o.type||'bandpass';fl.frequency.setValueAtTime(Math.min(f,3800),t);fl.Q.value=o.q||.9;
    if(o.to)fl.frequency.exponentialRampToValueAtTime(o.to,t+d*.5);if(o.back)fl.frequency.exponentialRampToValueAtTime(o.back,t+d);
    const g=c.createGain(),a=o.att||Math.min(.08,d*.3);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setTargetAtTime(0,t+a,Math.max(.02,(d-a)/3.5));
    s.connect(fl);fl.connect(g);this.out(g,o.send==null?.2:o.send);s.start(t);s.stop(t+d+.4);},
  // хрустальный колокольчик: основной тон + тихие негармоничные обертоны
  bellNote(f,v=.04,delay=0,d=1.8,send=.5){this.tone(f,d,'sine',v,delay,{send,att:.008});this.tone(f*2.01,d*.55,'sine',v*.28,delay,{send});this.tone(f*2.76,d*.35,'sine',v*.12,delay,{send});},
  click(){this.tone(392,.12,'sine',.022,0,{to:330,send:.15,att:.01});},
  coin(){this.bellNote(1046.5,.025,0,.7,.35);this.bellNote(1318.5,.022,.07,.9,.4);},
  chime(){[523.25,659.25,783.99,1046.5].forEach((f,i)=>this.bellNote(f,.03,i*.12,2.2,.55));},
  crystal(){[783.99,987.77,1174.66,1567.98].forEach((f,i)=>this.bellNote(f,.022,i*.16+Math.random()*.03,2.6,.65));},
  magic(){[392,440,523.25,659.25,783.99,880].forEach((f,i)=>this.bellNote(f,.026,i*.11,2.4,.6));this.tone(196,2.5,'sine',.025,0,{send:.6,att:.3});},
  find(){this.bellNote(659.25,.035,0,1.6);this.bellNote(987.77,.026,.1,1.9);},
  error(){this.tone(233,.45,'sine',.03,0,{to:196,send:.25,att:.03});this.tone(174.6,.6,'sine',.02,.08,{send:.3,att:.05});},
  whoosh(){this.noise(.9,.035,320,{to:1300,back:280,q:.7,att:.25,send:.35});},
  bubble(){const f=150+Math.random()*170;this.tone(f,.12,'sine',.022,0,{to:f*1.9,glide:.07,send:.25,att:.012});},
  rustle(){for(let i=0;i<9;i++)this.noise(.06,.014+Math.random()*.008,1300+Math.random()*900,{delay:i*.035+Math.random()*.03,q:1.4,att:.008,send:.1});},
  boil(){for(let i=0;i<2+(Math.random()*2|0);i++)setTimeout(()=>this.bubble(),i*90+Math.random()*60);},
  porcelain(){[1244.5,1975.5,2793].forEach((f,i)=>this.tone(f*(1+Math.random()*.004),1.1-i*.3,'sine',.018-i*.005,0,{send:.55,att:.006}));},
  shuffle(){for(let i=0;i<8;i++)this.noise(.09,.02,1600+Math.random()*700,{delay:i*.07,q:.8,att:.02,send:.15});},
  cardFlip(){this.noise(.25,.025,700,{to:1800,q:.6,att:.06});this.bellNote(880,.02,.12,1.4);},
  bell(){[783.99,1174.66,1567.98].forEach((f,i)=>this.bellNote(f,.026,i*.18,2.4,.6));},
  harvest(){this.rustle();this.bellNote(523.25,.025,.12,1.6);this.bellNote(783.99,.022,.24,1.8);},
  breath(){this.noise(1.6,.012,500,{to:900,back:420,q:.5,att:.7,send:.4});},

  /* ---------- Эзотерический пэд во время гадания ---------- */
  pad:null,
  ambience(on){on=!!on&&S.settings.sound&&S.settings.pad!==false;if(on&&!this.pad)this.padStart();else if(!on&&this.pad)this.padStop();},
  padStart(){const c=this.ensure();if(!c||this.pad)return;const g=c.createGain();g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(1,c.currentTime+3);
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.Q.value=.6;const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.06;lg.gain.value=380;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
    lp.connect(g);this.out(g,.7);
    const P=this.pad={g,lp,lfo,voices:[],i:0,timer:0,spark:0};
    const CH=[[110,220,261.63,329.63,493.88],[87.31,174.61,220,261.63,392],[130.81,196,246.94,329.63,293.66*2],[82.41,164.81,246.94,293.66,440]];
    const play=()=>{if(this.pad!==P)return;const t=c.currentTime,ch=CH[P.i++%CH.length];
      P.voices.forEach(vv=>{vv.g.gain.cancelScheduledValues(t);vv.g.gain.setValueAtTime(vv.g.gain.value,t);vv.g.gain.linearRampToValueAtTime(0,t+3.5);vv.o.forEach(o=>o.stop(t+3.7));});
      P.voices=ch.map((f,k)=>{const vg=c.createGain(),o1=c.createOscillator(),o2=c.createOscillator();o1.type='sine';o2.type='triangle';o1.frequency.value=f;o2.frequency.value=f;o2.detune.value=k%2?7:-7;
        const lvl=k===0?.05:.026;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(lvl,t+3.5);o1.connect(vg);o2.connect(vg);vg.connect(lp);o1.start(t);o2.start(t);return{g:vg,o:[o1,o2]};});
      P.timer=setTimeout(play,8000);};
    play();P.spark=setInterval(()=>{if(this.pad===P&&Math.random()<.6)this.bellNote(PENTA[5+(Math.random()*6|0)],.009,0,3,.8);},3200);},
  padStop(){const P=this.pad;if(!P)return;this.pad=null;clearTimeout(P.timer);clearInterval(P.spark);const c=this.ctx,t=c.currentTime;
    P.g.gain.cancelScheduledValues(t);P.g.gain.setValueAtTime(P.g.gain.value,t);P.g.gain.linearRampToValueAtTime(0,t+2);P.voices.forEach(v=>v.o.forEach(o=>o.stop(t+2.2)));P.lfo.stop(t+2.2);},

  /* ---------- Тихое шипение турки (непрерывное, по температуре) ---------- */
  hissN:null,
  hiss(level){if(!S.settings.sound){level=0;if(!this.hissN)return;}const c=this.ensure();if(!c)return;
    if(!this.hissN){if(level<=0)return;const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let p=0;for(let i=0;i<len;i++){p=p*.9+(Math.random()*2-1)*.1;d[i]=p*3;}
      const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=600;const g=c.createGain();g.gain.value=0;s.connect(f);f.connect(g);this.out(g,.25);s.start();this.hissN={s,f,g};}
    const h=this.hissN,t=c.currentTime;h.g.gain.setTargetAtTime(Math.max(0,level)*.05,t,.4);h.f.frequency.setTargetAtTime(380+level*700,t,.5);
    if(level<=0){clearTimeout(h.kill);h.kill=setTimeout(()=>{if(this.hissN===h&&h.g.gain.value<.002){h.s.stop();this.hissN=null;}},2500);}else clearTimeout(h.kill);}
});
