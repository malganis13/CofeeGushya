/* =====================================================================
   GROUNDS — процедурный генератор кофейной гущи на HTML5 Canvas
   (детерминированный: по seed можно восстановить любой узор)
   ===================================================================== */
const SHAPES={
  heart(c){c.beginPath();c.moveTo(0,.85);c.bezierCurveTo(-.15,.7,-1,.2,-.95,-.3);c.bezierCurveTo(-.9,-.85,-.25,-.95,0,-.45);c.bezierCurveTo(.25,-.95,.9,-.85,.95,-.3);c.bezierCurveTo(1,.2,.15,.7,0,.85);c.fill();},
  key(c){c.lineWidth=.17;c.beginPath();c.arc(-.55,0,.3,0,7);c.stroke();c.beginPath();c.moveTo(-.25,0);c.lineTo(.92,0);c.moveTo(.6,0);c.lineTo(.6,.34);c.moveTo(.86,0);c.lineTo(.86,.26);c.stroke();},
  ring(c){c.lineWidth=.2;c.beginPath();c.ellipse(0,.18,.6,.56,0,0,7);c.stroke();c.beginPath();c.moveTo(0,-.95);c.lineTo(.28,-.62);c.lineTo(0,-.36);c.lineTo(-.28,-.62);c.closePath();c.fill();},
  crown(c){c.beginPath();c.moveTo(-.9,.5);c.lineTo(-.95,-.45);c.lineTo(-.48,.02);c.lineTo(0,-.72);c.lineTo(.48,.02);c.lineTo(.95,-.45);c.lineTo(.9,.5);c.closePath();c.fill();c.fillRect(-.92,.6,1.84,.22);
    [[-.95,-.58],[0,-.86],[.95,-.58]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,.13,0,7);c.fill();});},
  snake(c){c.lineWidth=.2;c.beginPath();c.moveTo(-.88,.72);c.bezierCurveTo(-.2,1,-.05,.25,-.3,0);c.bezierCurveTo(-.58,-.3,-.3,-.78,.15,-.55);c.bezierCurveTo(.5,-.38,.45,.05,.72,-.06);c.stroke();
    c.beginPath();c.ellipse(.8,-.1,.22,.14,-.4,0,7);c.fill();c.lineWidth=.05;c.beginPath();c.moveTo(.98,-.2);c.lineTo(1.12,-.3);c.moveTo(.98,-.2);c.lineTo(1.12,-.12);c.stroke();},
  tower(c){c.beginPath();c.moveTo(-.42,.95);c.lineTo(-.3,-.42);c.lineTo(.3,-.42);c.lineTo(.42,.95);c.closePath();c.fill();c.fillRect(-.5,-.64,1,.26);for(let i=0;i<3;i++)c.fillRect(-.5+i*.4,-.88,.2,.26);
    c.globalCompositeOperation='destination-out';c.fillRect(-.08,-.2,.16,.26);c.beginPath();c.arc(0,.95,.16,Math.PI,0);c.fill();c.globalCompositeOperation='source-over';},
  bird(c){c.beginPath();c.moveTo(-.95,-.35);c.quadraticCurveTo(-.5,-.68,-.05,.1);c.quadraticCurveTo(.4,-.72,.95,-.45);c.quadraticCurveTo(.4,-.32,.05,.35);c.quadraticCurveTo(-.35,-.12,-.95,-.35);c.fill();
    c.beginPath();c.ellipse(0,.28,.14,.3,0,0,7);c.fill();c.beginPath();c.moveTo(-.14,.48);c.lineTo(0,.88);c.lineTo(.14,.48);c.fill();},
  crescent(c){c.beginPath();c.arc(0,0,.85,0,7);c.fill();c.globalCompositeOperation='destination-out';c.beginPath();c.arc(.36,-.16,.7,0,7);c.fill();c.globalCompositeOperation='source-over';},
  wolf(c){const p=[[-.82,-.45],[-.45,-.62],[-.38,-.97],[-.22,-.68],[-.08,-.94],[.02,-.6],[.2,-.3],[.5,.1],[.62,.55],[.95,.58],[.9,.8],[.55,.9],[-.05,.92],[-.05,.7],[-.15,.38],[-.25,.92],[-.42,.92],[-.38,.1],[-.5,-.2],[-.84,-.3]];
    c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
};
const Grounds={
  W:600,
  makeNoise(rng){const N=64,g=new Float32Array(N*N);for(let i=0;i<g.length;i++)g[i]=rng();const sm=t=>t*t*(3-2*t);
    return(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,X0=xi&63,X1=(xi+1)&63,Y0=(yi&63)*N,Y1=((yi+1)&63)*N;
      const a=g[Y0+X0],b=g[Y0+X1],c=g[Y1+X0],d=g[Y1+X1],u=sm(xf),v=sm(yf);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;};},
  render(canvas,seed,symIds){
    const W=this.W,cx=W/2,cy=W/2,x=canvas.getContext('2d');const rng=mulberry32(seed>>>0);const nz=this.makeNoise(rng);
    const fbm=(a,b)=>nz(a,b)*.55+nz(a*2.1+5,b*2.1+9)*.3+nz(a*4.3+11,b*4.3+3)*.15;
    x.clearRect(0,0,W,W);
    // блюдце / фарфор
    let g=x.createRadialGradient(cx-40,cy-50,20,cx,cy,298);g.addColorStop(0,'#fbf4ea');g.addColorStop(.7,'#e8dac6');g.addColorStop(1,'#bba184');
    x.fillStyle=g;x.beginPath();x.arc(cx,cy,296,0,7);x.fill();
    x.strokeStyle='#D4AF37';x.lineWidth=7;x.beginPath();x.arc(cx,cy,291,0,7);x.stroke();
    x.strokeStyle='rgba(156,122,28,.6)';x.lineWidth=1.5;x.beginPath();x.arc(cx,cy,280,0,7);x.stroke();
    x.save();x.beginPath();x.arc(cx,cy,276,0,7);x.clip();
    // размытые пятна
    for(let i=0;i<80;i++){const a=rng()*6.283,d=Math.sqrt(rng())*250,px=cx+Math.cos(a)*d,py=cy+Math.sin(a)*d,r=25+rng()*85;
      g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${100+rng()*40|0},${58+rng()*20|0},${30+rng()*10|0},${.08+rng()*.16})`);g.addColorStop(1,'rgba(110,64,34,0)');
      x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);}
    // подтёки от центра к краю (чашку перевернули)
    x.lineCap='round';
    for(let i=0;i<34;i++){const a=rng()*6.283,r0=20+rng()*70,r1=150+rng()*125;x.strokeStyle=`rgba(70,40,20,${.05+rng()*.12})`;x.lineWidth=2+rng()*9;x.beginPath();
      for(let t=0;t<=1.0001;t+=.1){const rr=r0+(r1-r0)*t,aa=a+Math.sin(t*5+i)*.08;const px=cx+Math.cos(aa)*rr,py=cy+Math.sin(aa)*rr;t?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}
    // крупинки по шумовому полю
    for(let i=0;i<16000;i++){const a=rng()*6.283,d=Math.sqrt(rng())*274,px=cx+Math.cos(a)*d,py=cy+Math.sin(a)*d;const f=fbm(px/62,py/62);
      if(f<.5+rng()*.22)continue;const sz=.6+rng()*2.1;x.fillStyle=`rgba(${30+rng()*40|0},${16+rng()*22|0},${6+rng()*12|0},${.3+rng()*.6})`;x.fillRect(px,py,sz,sz);}
    // знаки
    const placed=[];
    for(const id of symIds){let tries=0,px,py;do{const a=rng()*6.283,d=40+rng()*170;px=cx+Math.cos(a)*d;py=cy+Math.sin(a)*d;tries++;}
      while(tries<120&&placed.some(p=>Math.hypot(p.x-px,p.y-py)<145));
      const s=80+rng()*22,rot=(rng()-.5)*.7;placed.push({id,x:px,y:py,s,rot});this.drawSymbol(x,id,px,py,s,rot,rng);}
    // виньетка
    g=x.createRadialGradient(cx,cy,180,cx,cy,280);g.addColorStop(0,'rgba(60,30,15,0)');g.addColorStop(1,'rgba(60,30,15,.28)');x.fillStyle=g;x.fillRect(0,0,W,W);
    x.restore();
    // блик
    g=x.createLinearGradient(cx-260,cy-260,cx,cy);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,0)');
    x.fillStyle=g;x.beginPath();x.ellipse(cx-120,cy-150,120,50,-.7,0,7);x.fill();
    return placed;
  },
  drawSymbol(ctx,id,px,py,s,rot,rng){
    const M=Math.ceil(s*1.35),m=document.createElement('canvas');m.width=m.height=M;const mc=m.getContext('2d');
    mc.translate(M/2,M/2);mc.rotate(rot);mc.scale(s/2,s/2);mc.fillStyle='#000';mc.strokeStyle='#000';mc.lineCap='round';mc.lineJoin='round';SHAPES[id](mc);
    const t=document.createElement('canvas');t.width=t.height=M;const tc=t.getContext('2d');tc.drawImage(m,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle='rgb(62,34,16)';tc.fillRect(0,0,M,M);
    const ox=px-M/2,oy=py-M/2;
    ctx.save();ctx.globalAlpha=.5;ctx.filter='blur(3px)';ctx.drawImage(t,ox,oy);ctx.filter='none';ctx.globalAlpha=.32;ctx.drawImage(t,ox,oy);ctx.restore();
    const data=mc.getImageData(0,0,M,M).data,N=Math.floor(M*M*.3);
    for(let i=0;i<N;i++){const qx=rng()*M|0,qy=rng()*M|0;if(data[(qy*M+qx)*4+3]<120)continue;const sz=.8+rng()*2.3;
      ctx.fillStyle=`rgba(${28+rng()*30|0},${14+rng()*16|0},${6+rng()*8|0},${.45+rng()*.55})`;ctx.fillRect(ox+qx+(rng()-.5)*3,oy+qy+(rng()-.5)*3,sz,sz);}
  },
  chooseSymbols(rng,n,spice){const pool=Object.keys(SYMBOLS).map(id=>({id,w:spice&&SPICE_BIAS[spice]&&SPICE_BIAS[spice].includes(id)?3.2:1}));const out=[];
    while(out.length<n&&pool.length){const p=R.weighted(pool,rng);out.push(p.id);pool.splice(pool.indexOf(p),1);}return out;}
};
