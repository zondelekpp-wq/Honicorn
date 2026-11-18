/* Honicorn – © 2026 Piotr Żondełek. All rights reserved. */
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const LANGS=[['en','English'],['pl','Polski'],['de','Deutsch'],['es','Español'],['fr','Français'],['zh','中文'],['uk','Українська']];
const SPEECH={en:'en-US',pl:'pl-PL',de:'de-DE',es:'es-ES',fr:'fr-FR',zh:'zh-CN',uk:'uk-UA'};
const PALETTES={
 plum:{bg:'#1e1533',bg2:'#2b1f47',card:'#362a55',line:'#4a3b6e',tx:'#f7f0fb',mut:'#bfb2d6',a1:'#ff6b5b',a2:'#26c6b0',a3:'#ffb347',a4:'#a77bf3'},
 ocean:{bg:'#0f1d2e',bg2:'#16293f',card:'#1d3450',line:'#2c4766',tx:'#eef6ff',mut:'#a9bfd6',a1:'#ff7a45',a2:'#2ec5e0',a3:'#ffd166',a4:'#7b8cff'},
 forest:{bg:'#13221c',bg2:'#1a2e26',card:'#223a30',line:'#2f4d40',tx:'#effaf3',mut:'#a9c7b7',a1:'#ff6f61',a2:'#9bd35a',a3:'#f4b942',a4:'#4fc1a6'},
 ember:{bg:'#1c1616',bg2:'#282020',card:'#332828',line:'#4a3a3a',tx:'#fff3ef',mut:'#cdb5ad',a1:'#ff5470',a2:'#ff9f1c',a3:'#ffd23f',a4:'#c77dff'}
};
const TOOL_LIST=[['smash','🍽️','a1'],['scream','📣','a3'],['crush','🗑️','a2'],['insult','🤬','a4'],['volcano','🌋','a1'],['bag','🥊','a3']];
const FACES=['😌','🙂','😐','😒','😠','😤','😡','🤬','🌋','💥'];

/* ---------- state ---------- */
let S={lang:'en',pal:'plum',sound:true,vib:true,mean:false,meanSeen:false,hist:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem('honicorn')||'{}'))}catch(e){}
if(!I18N[S.lang])S.lang='en';
function save(){try{localStorage.setItem('honicorn',JSON.stringify(S))}catch(e){}}
let P=PALETTES[S.pal]||PALETTES.plum;
let session={before:null,tools:new Set()};
let cur='home',curTool=null,lastPoke=Date.now(),motionOK=false;

/* ---------- i18n ---------- */
function L(){return I18N[S.lang]||I18N.en}
function t(k,n){let v=L()[k];if(v==null)v=I18N.en[k];if(v==null)return k;return n!=null?String(v).replace('{n}',n):v}
function R(){return L().r||I18N.en.r}
function applyI18n(){
  document.documentElement.lang=S.lang;
  $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  $$('[data-ph]').forEach(e=>e.placeholder=t(e.dataset.ph));
  $('#infoBox').innerHTML=L().info;$('#termsBox').innerHTML=L().termsHtml;$('#supText').textContent=t('supportText');
  $('#grid').innerHTML=TOOL_LIST.map(([id,em,c])=>`<button class="card" data-tool="${id}" style="--c:var(--${c})"><span class="em">${em}</span><b>${t('t_'+id)}</b><small>${t('d_'+id)}</small></button>`).join('');
  $$('#grid .card').forEach(b=>b.onclick=()=>show(b.dataset.tool));
  $('#langs').innerHTML=LANGS.map(([c,n])=>`<button data-l="${c}" class="${c===S.lang?'on':''}">${n}</button>`).join('');
  $$('#langs button').forEach(b=>b.onclick=()=>{S.lang=b.dataset.l;save();applyI18n();Crush.mic();});
  Crush.mic();updMeter();
  if(cur==='history')renderHist();
}
function applyPal(){P=PALETTES[S.pal]||PALETTES.plum;const r=document.documentElement.style;for(const k in P)r.setProperty('--'+k,P[k]);
  document.querySelector('meta[name=theme-color]').content=P.bg;
  $('#pals').innerHTML=Object.keys(PALETTES).map(k=>{const p=PALETTES[k];return `<button class="sw ${k===S.pal?'on':''}" data-p="${k}" aria-label="${k}" style="background:${p.bg}"><i style="background:${p.a1}"></i><i style="background:${p.a2}"></i><i style="background:${p.a3}"></i><i style="background:${p.a4}"></i></button>`}).join('');
  $$('#pals .sw').forEach(b=>b.onclick=()=>{S.pal=b.dataset.p;save();applyPal()});
}

/* ---------- feedback: sound, vibration, toasts, roasts ---------- */
let AC=null;
function rawAC(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function ac(){if(!S.sound)return null;try{return rawAC()}catch(e){return null}}
function noise(dur,o={}){const a=ac();if(!a)return;const {type='lowpass',f=1000,f2=null,q=1,g=.5,delay=0}=o;const n=Math.max(1,a.sampleRate*dur|0);const b=a.createBuffer(1,n,a.sampleRate);const d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  const s=a.createBufferSource();s.buffer=b;const fl=a.createBiquadFilter();fl.type=type;const t0=a.currentTime+delay;fl.frequency.setValueAtTime(f,t0);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t0+dur);fl.Q.value=q;const gn=a.createGain();gn.gain.value=g;s.connect(fl).connect(gn).connect(a.destination);s.start(t0)}
function tone(f1,f2,dur,o={}){const a=ac();if(!a)return;const {type='sine',g=.3,delay=0}=o;const t0=a.currentTime+delay;const os=a.createOscillator();os.type=type;os.frequency.setValueAtTime(f1,t0);os.frequency.exponentialRampToValueAtTime(Math.max(f2,1),t0+dur);const gn=a.createGain();gn.gain.setValueAtTime(g,t0);gn.gain.exponentialRampToValueAtTime(.001,t0+dur);os.connect(gn).connect(a.destination);os.start(t0);os.stop(t0+dur+.05)}
const SFX={
 glass(){noise(.6,{type:'highpass',f:2200,g:.55});for(let i=0;i<5;i++)tone(2600+Math.random()*3200,1800,.15,{g:.06,delay:i*.04})},
 crack(){noise(.09,{type:'bandpass',f:1800,q:2,g:.7})},
 thud(){noise(.3,{f:260,g:.9});tone(130,40,.28,{g:.5})},
 boom(){noise(1.6,{f:700,f2:60,g:1});tone(85,28,1.2,{g:.6})},
 squeak(){tone(1250,330,.2,{type:'triangle',g:.16})},
 whoosh(){noise(1.3,{type:'bandpass',f:250,f2:3200,q:1.4,g:.7})},
 nom(){tone(240,140,.12,{type:'square',g:.1})},
 burp(){tone(95,55,.5,{type:'sawtooth',g:.18})},
 shred(){tone(70,62,1.2,{type:'sawtooth',g:.14});noise(1.2,{type:'bandpass',f:1500,q:.8,g:.3})},
 pop(){tone(500,1100,.09,{g:.18})},
 crinkle(){for(let i=0;i<7;i++)noise(.06,{type:'highpass',f:3000,g:.35,delay:i*.11+Math.random()*.05})},
 chime(f){tone(f,f*.999,1.6,{g:.05})}
};
function buzz(p){if(S.vib&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)}
function flash(){$('#flash').animate([{opacity:.55},{opacity:0}],{duration:450})}
let lastRoast=0;
function showRoast(m){const e=$('#roast');e.querySelector('span').textContent=m;e.classList.add('on');clearTimeout(showRoast.t);showRoast.t=setTimeout(()=>e.classList.remove('on'),4200)}
function roast(ctx,chance=1){if(!S.mean||cur==='cool')return;const now=Date.now();if(now-lastRoast<7000||Math.random()>chance)return;lastRoast=now;const r=R();const pool=(r[ctx]||[]).concat(r.gen);showRoast(pool[Math.random()*pool.length|0])}
function poke(){lastPoke=Date.now()}
setInterval(()=>{if(S.mean&&curTool&&Date.now()-lastPoke>12000&&Date.now()-lastRoast>12000){lastRoast=Date.now();lastPoke=Date.now();showRoast(R().idle)}},2000);

/* ---------- navigation ---------- */
const TOOLS={};
function show(id){
  if(curTool&&TOOLS[curTool].stop)TOOLS[curTool].stop();curTool=null;
  if(cur==='cool'&&id!=='cool')Cool.stop();
  if('speechSynthesis' in window)speechSynthesis.cancel();
  $$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));cur=id;window.scrollTo(0,0);
  $('#roast').classList.remove('on');
  if(id==='home')updChip();
  if(id==='history')renderHist();
  if(TOOLS[id]){curTool=id;session.tools.add(id);poke();requestAnimationFrame(()=>TOOLS[id].start())}
  if(id==='cool')Cool.start();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){e.preventDefault();show(b.dataset.go)}});
function updChip(){const c=$('#sessChip');if(session.before!=null){c.hidden=false;$('#sessV').textContent=session.before}else c.hidden=true}

/* ---------- canvas helpers ---------- */
function fit(cv){const r=cv.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,2);cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w:r.width,h:r.height}}
function bindTap(cv,tool){cv.addEventListener('pointerdown',e=>{e.preventDefault();const r=cv.getBoundingClientRect();poke();tool.tap(e.clientX-r.left,e.clientY-r.top)})}
const EMOJI_FONT='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif';
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.random()*a.length|0]}
window.addEventListener('resize',()=>{if(curTool&&TOOLS[curTool].resize)TOOLS[curTool].resize()});

/* ---------- shaking ---------- */
let lastShake=0;
window.addEventListener('devicemotion',e=>{const a=e.accelerationIncludingGravity;if(!a||a.x==null)return;if(!motionOK){motionOK=true;updMotionBtns()}const j=Math.abs(Math.hypot(a.x,a.y,a.z)-9.81);const now=performance.now();if(j>11&&now-lastShake>160){lastShake=now;poke();if(curTool&&TOOLS[curTool].shake)TOOLS[curTool].shake(j)}});
const needMotionPerm=typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function';
function updMotionBtns(){$$('.motionBtn').forEach(b=>b.hidden=!needMotionPerm||motionOK)}
$$('.motionBtn').forEach(b=>b.onclick=()=>{DeviceMotionEvent.requestPermission().then(r=>{if(r==='granted'){motionOK=true;updMotionBtns()}}).catch(()=>{})});

/* ================= RAGE ROOM ================= */
const OBJS=[{e:'🍽️',hp:1,c:['#f4f1ea','#9fc5e8','#ffffff']},{e:'☕',hp:1,c:['#ffffff','#e06666','#8b5a2b']},{e:'🏺',hp:2,c:['#c8743a','#e3a15f','#7a3e1d']},{e:'💡',hp:1,c:['#fff7c2','#ffe066','#cccccc']},{e:'🪴',hp:2,c:['#c26d3e','#6aa84f','#5b3a1e']},{e:'📺',hp:3,c:['#444','#777','#9ad0ff'],heavy:1},{e:'🖨️',hp:3,c:['#ddd','#999','#555'],heavy:1},{e:'🖥️',hp:3,c:['#333','#888','#6fa8dc'],heavy:1},{e:'⏰',hp:2,c:['#e74c3c','#f1c40f','#eee'],heavy:1},{e:'🍾',hp:1,c:['#2e7d32','#a5d6a7','#ffd54f']},{e:'🥛',hp:1,c:['#ffffff','#dfe9f3','#bcd']},{e:'🎻',hp:2,c:['#8b4513','#d2691e','#222']}];
const Smash=TOOLS.smash=(()=>{let cv,g,shards=[],obj=null,count=0,run=false,last=0,raf;
  function next(){obj={o:pick(OBJS),x:g.w/2,y:-g.h*.3,ty:g.h*.45,size:Math.min(g.w*.55,g.h*.42),shake:0,cracks:[]};obj.hp=obj.o.hp}
  function hit(){if(!obj||obj.y<obj.ty-30)return;obj.hp--;obj.shake=1;
    for(let i=0;i<3;i++){const a=rnd(0,6.28),l=obj.size*rnd(.18,.42);obj.cracks.push([rnd(-.1,.1)*obj.size,rnd(-.1,.1)*obj.size,Math.cos(a)*l,Math.sin(a)*l])}
    if(obj.hp<=0)explode();else{SFX.crack();if(obj.o.heavy)SFX.thud();buzz(18)}}
  function explode(){const {x,y,size,o}=obj;for(let i=0;i<50;i++){const a=rnd(0,6.28),sp=rnd(200,850);shards.push({x:x+rnd(-.25,.25)*size,y:y+rnd(-.25,.25)*size,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-320,r:rnd(0,6.28),vr:rnd(-12,12),s:rnd(6,size*.13),c:pick(o.c),life:rnd(2.6,3.8),em:Math.random()<.12?o.e:null})}
    SFX.glass();if(o.heavy)SFX.thud();buzz([30,20,70]);count++;$('#smashN').textContent=count;obj=null;setTimeout(()=>{if(run)next()},420);if(count%4===0)roast('smash',.6)}
  function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;const c=g.c,fy=g.h-16;c.clearRect(0,0,g.w,g.h);
    c.fillStyle=P.line;c.fillRect(0,fy,g.w,16);
    // table
    const sz=Math.min(g.w*.55,g.h*.42),ty=g.h*.45+sz*.46;c.fillStyle=P.card;c.fillRect(g.w*.15,ty,g.w*.7,12);c.fillRect(g.w*.2,ty+12,10,fy-ty-12);c.fillRect(g.w*.8-10,ty+12,10,fy-ty-12);
    if(obj){obj.y+=(obj.ty-obj.y)*Math.min(1,dt*9);obj.shake*=Math.pow(.01,dt);const sx=rnd(-1,1)*obj.shake*16;
      c.save();c.translate(obj.x+sx,obj.y);c.font=`${obj.size}px ${EMOJI_FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(obj.o.e,0,0);
      c.strokeStyle='rgba(15,8,25,.9)';c.lineWidth=3;c.lineJoin='round';obj.cracks.forEach(k=>{c.beginPath();c.moveTo(k[0],k[1]);c.lineTo(k[0]+k[2]*.5+k[3]*.15,k[1]+k[3]*.5-k[2]*.15);c.lineTo(k[0]+k[2],k[1]+k[3]);c.stroke()});c.restore()}
    shards=shards.filter(s=>s.life>0);
    for(const s of shards){s.vy+=1700*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.r+=s.vr*dt;s.life-=dt;if(s.y>fy-s.s*.4){s.y=fy-s.s*.4;s.vy*=-.3;s.vx*=.75;s.vr*=.6}if(s.x<0||s.x>g.w){s.vx*=-.6;s.x=Math.max(0,Math.min(g.w,s.x))}
      c.save();c.globalAlpha=Math.min(1,s.life);c.translate(s.x,s.y);c.rotate(s.r);
      if(s.em){c.font=`${s.s*2.2}px ${EMOJI_FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(s.em,0,0)}
      else{c.fillStyle=s.c;c.beginPath();c.moveTo(-s.s/2,-s.s/3);c.lineTo(s.s/2,-s.s/2);c.lineTo(s.s/4,s.s/2);c.closePath();c.fill()}c.restore()}
    raf=requestAnimationFrame(loop)}
  return{start(){cv=cv||$('#smashCv');if(!cv.bound){bindTap(cv,Smash);cv.bound=1}g=fit(cv);shards=[];next();$('#smashN').textContent=count;updMotionBtns();run=true;last=performance.now();raf=requestAnimationFrame(loop)},
    stop(){run=false;cancelAnimationFrame(raf)},tap:hit,shake:hit,resize(){g=fit(cv);if(obj){obj.x=g.w/2;obj.ty=g.h*.45;obj.size=Math.min(g.w*.55,g.h*.42)}}}})();

/* ================= SCREAM-O-METER ================= */
const Scream=TOOLS.scream=(()=>{let cv,g,run=false,raf,last,stream=null,an=null,buf=null,level=0,hold=false,peak=0,over=0,tower=[],fallen=false,fallT=0,towers=0,t0=0,steam=[];
  function build(){tower=[];const bw=Math.min(64,g.w*.15),bh=bw*.55,x0=g.w*.76,fy=g.h-16;const cols=[P.a2,P.a3,P.a4,P.a1];for(let i=0;i<9;i++)tower.push({x:x0+(i%2?bw*.06:-bw*.06),y:fy-bh*(i+.5),w:bw,h:bh,vx:0,vy:0,r:0,vr:0,c:cols[i%4]});fallen=false}
  function topple(){fallen=true;fallT=0;tower.forEach((b,i)=>{b.vx=-rnd(150,420)-i*30;b.vy=-rnd(150,450);b.vr=rnd(-9,9)});SFX.boom();buzz([60,30,140]);towers++;$('#screamN').textContent=towers;roast('scream',.35)}
  async function mic(){poke();try{rawAC()}catch(e){}
    try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      const A=rawAC();const src=A.createMediaStreamSource(stream);an=A.createAnalyser();an.fftSize=1024;buf=new Float32Array(an.fftSize);src.connect(an);
      $('#screamMic').hidden=true;$('#screamMsg').textContent=t('screamHint')}
    catch(e){$('#screamMsg').textContent=t('micDenied');$('#screamMic').hidden=true}}
  function read(){if(!an)return 0;an.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];const db=20*Math.log10(Math.sqrt(s/buf.length)+1e-7);return Math.max(0,Math.min(1,(db+52)/44))}
  function band(v){return Math.min(4,Math.floor(v*5))}
  function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;const c=g.c,fy=g.h-16;
    const target=hold?1:read();level+=(target-level)*Math.min(1,dt*(hold?2.2:(target>level?10:3)));
    if(level>.35)poke();
    if(level>peak){peak=level;$('#screamPk').textContent=t('sl')[band(peak)]}
    if(level>.78)over+=dt;else over=Math.max(0,over-dt);
    if(over>.35&&!fallen)topple();
    if(fallen){fallT+=dt;if(fallT>2.6)build()}
    if(S.mean&&!fallen&&now-t0>9000&&peak<.45){t0=now;roast('scream',1)}
    c.clearRect(0,0,g.w,g.h);c.fillStyle=P.line;c.fillRect(0,fy,g.w,16);
    // level bar
    const bh=g.h-60,bx=14,by=24;c.fillStyle=P.card;c.fillRect(bx,by,14,bh);const lg=c.createLinearGradient(0,by+bh,0,by);lg.addColorStop(0,P.a2);lg.addColorStop(.6,P.a3);lg.addColorStop(1,P.a1);c.fillStyle=lg;c.fillRect(bx,by+bh*(1-level),14,bh*level);
    c.fillStyle=P.tx;c.font='600 14px system-ui';c.fillText(t('sl')[band(level)],bx+22,by+12);
    // monster
    const mx=g.w*.36,r=Math.min(g.w,g.h)*(.1+level*.13),my=fy-r;
    c.save();c.translate(mx+(level>.7?rnd(-3,3):0),my);
    c.fillStyle=P.a3;c.beginPath();c.moveTo(-r*.15,-r*.85);c.lineTo(r*.15,-r*.85);c.lineTo(r*.08,-r*1.55);c.closePath();c.fill();
    c.fillStyle=P.a1;c.beginPath();c.arc(0,0,r,0,6.283);c.fill();
    c.fillStyle='#fff';[-1,1].forEach(s=>{c.beginPath();c.ellipse(s*r*.38,-r*.25,r*.2,r*.22,0,0,6.283);c.fill()});
    c.fillStyle='#1a0f1f';[-1,1].forEach(s=>{c.beginPath();c.arc(s*r*.34,-r*.2,r*.09,0,6.283);c.fill()});
    c.strokeStyle='#1a0f1f';c.lineWidth=Math.max(3,r*.07);c.lineCap='round';[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*r*.6,-r*.58);c.lineTo(s*r*.18,-r*(.42+level*.12));c.stroke()});
    c.fillStyle='#2a0d18';c.beginPath();c.ellipse(0,r*.32,r*(.25+level*.2),r*(.06+level*.38),0,0,6.283);c.fill();
    c.restore();
    if(level>.5&&Math.random()<level*.5)steam.push({x:mx+rnd(-r*.6,r*.6),y:my-r*.8,vy:-rnd(40,90),life:1.2,s:rnd(6,14)});
    steam=steam.filter(p=>(p.life-=dt)>0);c.fillStyle='rgba(220,245,240,.5)';steam.forEach(p=>{p.y+=p.vy*dt;p.s+=dt*12;c.globalAlpha=p.life/1.2*.6;c.beginPath();c.arc(p.x,p.y,p.s,0,6.283);c.fill()});c.globalAlpha=1;
    // sound waves
    if(level>.3){c.strokeStyle=P.a3;c.lineWidth=3;for(let i=0;i<3;i++){const k=((now/300+i/3)%1);c.globalAlpha=(1-k)*level;c.beginPath();c.arc(mx+r*.4,my+r*.3,r*.4+k*g.w*.3*level,-.5,.5);c.stroke()}c.globalAlpha=1}
    // tower
    tower.forEach(b=>{if(fallen){b.vy+=1400*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.r+=b.vr*dt;if(b.y>fy-b.h/2){b.y=fy-b.h/2;b.vy*=-.25;b.vx*=.6;b.vr*=.5}}
      const wob=!fallen&&level>.5?Math.sin(now/40+b.y)*level*3:0;c.save();c.translate(b.x+wob,b.y);c.rotate(b.r);c.fillStyle=b.c;c.fillRect(-b.w/2,-b.h/2,b.w,b.h);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;c.strokeRect(-b.w/2,-b.h/2,b.w,b.h);c.restore()});
    raf=requestAnimationFrame(loop)}
  function holdOn(e){e.preventDefault();hold=true;poke();try{rawAC()}catch(_){}}
  function holdOff(){hold=false}
  return{start(){cv=cv||$('#screamCv');if(!cv.bound){cv.bound=1;cv.addEventListener('pointerdown',()=>poke());$('#screamMic').onclick=mic;const h=$('#screamHold');h.addEventListener('pointerdown',holdOn);['pointerup','pointerleave','pointercancel'].forEach(ev=>h.addEventListener(ev,holdOff))}
      g=fit(cv);build();level=0;peak=0;over=0;$('#screamPk').textContent='–';$('#screamN').textContent=towers;$('#screamMic').hidden=!navigator.mediaDevices;$('#screamMsg').textContent=t('screamHint');t0=performance.now();run=true;last=performance.now();raf=requestAnimationFrame(loop)},
    stop(){run=false;hold=false;cancelAnimationFrame(raf);if(stream){stream.getTracks().forEach(x=>x.stop());stream=null}an=null},
    resize(){g=fit(cv);build()}}})();

/* ================= PROBLEM CRUSHER ================= */
const Crush=TOOLS.crush=(()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null,mr=null,mrStream=null,chunks=[],voice=null,voiceDur=0,recT0=0,timer=null,busy=false;
  const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  function ui(on){const b=$('#crMic');b.textContent=on?t('stopRec'):t('speak');$('#crStatus').innerHTML=on?`<span class="rec"></span>${t('recording')} <span id="crTm">0:00</span>`:'';clearInterval(timer);if(on){recT0=Date.now();timer=setInterval(()=>{const e=$('#crTm');if(e)e.textContent=fmt((Date.now()-recT0)/1000)},500)}}
  function stopRec(){if(rec){const r=rec;rec=null;try{r.stop()}catch(e){}}if(mr){try{mr.stop()}catch(e){}mr=null}ui(false)}
  async function recorder(){try{mrStream=await navigator.mediaDevices.getUserMedia({audio:true});mr=new MediaRecorder(mrStream);chunks=[];mr.ondataavailable=e=>chunks.push(e.data);
      mr.onstop=()=>{voice=new Blob(chunks);voiceDur=(Date.now()-recT0)/1000;chunks=[];mrStream.getTracks().forEach(x=>x.stop());mrStream=null;$('#crVoice').hidden=false;$('#crVoiceT').textContent=fmt(voiceDur)};mr.start();ui(true)}
    catch(e){mr=null;ui(false);toast(t('micDenied').split('–')[0])}}
  function micClick(){poke();if(rec||mr)return stopRec();
    if(SR&&navigator.onLine){rec=new SR();rec.lang=SPEECH[S.lang];rec.interimResults=true;rec.continuous=true;const base=$('#crText').value?$('#crText').value.trim()+' ':'';
      rec.onresult=e=>{let s='';for(let i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;$('#crText').value=base+s;poke()};
      rec.onerror=ev=>{if(['network','service-not-allowed','language-not-supported'].includes(ev.error)){rec=null;recorder()}else stopRec()};
      rec.onend=()=>{if(rec){rec=null;ui(false)}};
      try{rec.start();ui(true)}catch(e){rec=null;recorder()}}
    else recorder()}
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  function prop(st,html,x,y,size){const e=document.createElement('div');e.className='prop';e.innerHTML=html;e.style.left=x+'px';e.style.top=y+'px';if(size)e.style.fontSize=size+'px';st.appendChild(e);return e}
  async function crumple(){poke();stopRec();const txt=$('#crText').value.trim();if(!txt&&!voice){toast(t('needText'));return}
    busy=true;$('#crIn').hidden=true;const st=$('#crStage');st.hidden=false;st.innerHTML='';
    const p=document.createElement('div');p.className='paper';p.textContent=txt||`🎙️ ${t('voiceNote')} ${fmt(voiceDur)}`;st.appendChild(p);
    await wait(500);SFX.crinkle();buzz([20,40,20,40,20]);
    await p.animate([{transform:'translate(-50%,-50%) rotate(0) scale(1)',borderRadius:'6px'},{transform:'translate(-50%,-50%) rotate(-9deg) scale(.85,.75)',borderRadius:'24px'},{transform:'translate(-50%,-50%) rotate(12deg) scale(.55,.6)',borderRadius:'40%'},{transform:'translate(-50%,-50%) rotate(-20deg) scale(.3)',borderRadius:'50%',opacity:.6}],{duration:900,easing:'ease-in',fill:'forwards'}).finished;
    p.remove();const ball=document.createElement('div');ball.className='ball';st.appendChild(ball);ball.animate([{transform:'scale(.6)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:300});
    const m=document.createElement('div');m.className='stageMsg';m.textContent=t('whereTo');st.appendChild(m);
    const d=document.createElement('div');d.className='dest';d.innerHTML=[['trash','🗑️','dTrash'],['shred','📄','dShred'],['rocket','🚀','dRocket'],['goat','🐐','dGoat']].map(([k,e,l])=>`<button class="btn" data-d="${k}">${e} ${t(l)}</button>`).join('');st.appendChild(d);
    d.querySelectorAll('button').forEach(b=>b.onclick=()=>{d.remove();m.remove();destroy(b.dataset.d,ball,st)})}
  async function destroy(kind,ball,st){poke();const W=st.clientWidth,H=st.clientHeight,bx=W/2,by=H*.4;
    if(kind==='trash'){const bin=prop(st,'🗑️',W*.78-40,H*.72-40,80);const dx=W*.78-bx,dy=H*.72-by;const kf=[];for(let i=0;i<=14;i++){const q=i/14;kf.push({transform:`translate(${dx*q}px,${dy*q-200*4*q*(1-q)}px) rotate(${q*720}deg) scale(${1-q*.55})`})}
      SFX.whoosh();await ball.animate(kf,{duration:900,easing:'linear',fill:'forwards'}).finished;ball.remove();SFX.thud();buzz(60);await bin.animate([{transform:'rotate(0)'},{transform:'rotate(-14deg)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}],{duration:500}).finished}
    else if(kind==='shred'){const sh=document.createElement('div');sh.className='shredder';sh.style.top=H*.62+'px';st.appendChild(sh);await sh.animate([{transform:'translateY(200px)'},{transform:'translateY(0)'}],{duration:400,easing:'ease-out'}).finished;
      await ball.animate([{transform:'translate(0,0)'},{transform:`translate(0,${H*.62-by-10}px) scale(.9)`}],{duration:500,easing:'ease-in',fill:'forwards'}).finished;
      SFX.shred();buzz(500);sh.animate([{transform:'translateX(-2px)'},{transform:'translateX(2px)'}],{duration:60,iterations:18});
      await ball.animate([{transform:`translate(0,${H*.62-by-10}px) scale(.9)`},{transform:`translate(0,${H*.62-by+40}px) scale(.9,.2)`}],{duration:900,fill:'forwards'}).finished;ball.remove();
      for(let i=0;i<14;i++){const s=document.createElement('div');s.className='strip';s.style.left=(W/2-60+i*9)+'px';s.style.top=(H*.62+60)+'px';st.appendChild(s);s.animate([{transform:'translateY(-30px)',opacity:1},{transform:`translateY(${H*.35}px) rotate(${rnd(-40,40)}deg)`,opacity:0}],{duration:rnd(900,1500),delay:i*40,fill:'forwards'})}
      await wait(1500)}
    else if(kind==='rocket'){const r=prop(st,'🚀',bx-35,by+30,70);r.style.transform='rotate(-45deg)';const f=prop(st,'🔥',bx-18,by+95,36);f.style.transform='rotate(180deg)';
      for(let i=0;i<12;i++){const s=prop(st,'✦',rnd(10,W-20),rnd(10,H*.5),rnd(10,18));s.style.color=P.a3;s.animate([{opacity:0},{opacity:1},{opacity:0}],{duration:1200,delay:i*80})}
      SFX.whoosh();buzz([40,40,200]);const o={duration:1500,easing:'cubic-bezier(.5,0,.9,.5)',fill:'forwards'};const up=`translateY(${-H-200}px)`;
      f.animate([{transform:'rotate(180deg) scale(1)'},{transform:'rotate(180deg) scale(1.4)'}],{duration:150,iterations:10,direction:'alternate'});
      ball.animate([{transform:'none'},{transform:up}],o);f.animate([{transform:'rotate(180deg)'},{transform:`${up} rotate(180deg) scale(1.6)`}],o);await r.animate([{transform:'rotate(-45deg)'},{transform:`${up} rotate(-45deg)`}],o).finished}
    else{const goat=prop(st,'🐐',W+20,by-50,96);await goat.animate([{transform:'translateX(0)'},{transform:`translateX(${-(W+20-(bx+40))}px)`}],{duration:1300,easing:'ease-out',fill:'forwards'}).finished;
      const gx=-(W+20-(bx+40));for(let i=1;i<=3;i++){const b=prop(st,'',bx-20,by-110,null);b.className='bubble';b.textContent='NOM!';SFX.nom();buzz(40);
        goat.animate([{transform:`translateX(${gx}px)`},{transform:`translateX(${gx-14}px) rotate(-8deg)`},{transform:`translateX(${gx}px)`}],{duration:280});
        await ball.animate([{transform:`scale(${1-(i-1)/3})`},{transform:`scale(${1-i/3})`}],{duration:280,fill:'forwards'}).finished;b.remove();await wait(220)}
      ball.remove();const bp=prop(st,'',bx+10,by-120,null);bp.className='bubble';bp.textContent='*BURP*';SFX.burp();buzz(200);await wait(900);bp.remove();
      await goat.animate([{transform:`translateX(${gx}px)`},{transform:`translateX(${gx}px) scaleX(-1)`},{transform:`translateX(${W}px) scaleX(-1)`}],{duration:1200,easing:'ease-in',fill:'forwards'}).finished}
    // done
    $('#crText').value='';voice=null;voiceDur=0;$('#crVoice').hidden=true;
    st.innerHTML=`<div class="stageMsg" style="top:30%"><div style="font-size:64px">✨</div>${t('gone')}</div><div class="dest" style="grid-template-columns:1fr"><button class="btn hot" id="crAgain">${t('again')}</button></div>`;
    SFX.chime(880);$('#crAgain').onclick=reset;busy=false;roast('crush',.7)}
  function reset(){poke();$('#crStage').hidden=true;$('#crStage').innerHTML='';$('#crIn').hidden=false;busy=false}
  let bound=false;
  return{start(){if(!bound){bound=true;$('#crMic').onclick=micClick;$('#crGo').onclick=crumple;$('#crVoiceX').onclick=()=>{voice=null;$('#crVoice').hidden=true};$('#crText').addEventListener('input',poke)}if(!busy)reset();ui(false)},
    stop(){stopRec()},mic(){if(!rec&&!mr)$('#crMic').textContent=t('speak')}}})();

/* ================= INSULT GENERATOR ================= */
const Insult=TOOLS.insult=(()=>{let txt='',n=0,bound=false;
  function gen(){const p=INS[S.lang]||INS.en;txt=p.f(pick(p.a),pick(p.n),pick(p.s));const e=$('#insTxt');e.textContent=txt;e.animate([{transform:'scale(.6) rotate(-5deg)',opacity:0},{transform:'scale(1.08) rotate(1deg)',opacity:1},{transform:'scale(1)'}],{duration:420,easing:'ease-out'});SFX.pop();poke();n++;if(n%5===0)roast('insult',.5)}
  function say(){poke();if(!('speechSynthesis' in window))return;const u=new SpeechSynthesisUtterance(txt);u.lang=SPEECH[S.lang];u.rate=1.05;u.pitch=.8;const v=speechSynthesis.getVoices().find(v=>(v.lang||'').toLowerCase().startsWith(S.lang));if(v)u.voice=v;speechSynthesis.cancel();speechSynthesis.speak(u);$('#insTxt').animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:500})}
  function copy(){poke();(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast(t('copied'))).catch(()=>{})}
  return{start(){if(!bound){bound=true;$('#insNew').onclick=gen;$('#insSay').onclick=say;$('#insCopy').onclick=copy}$('#insSay').hidden=!('speechSynthesis' in window);gen()},stop(){}}})();

/* ================= VOLCANO ================= */
const Volcano=TOOLS.volcano=(()=>{let cv,g,run=false,raf,last,pr=0,parts=[],smoke=[],n=0,shakeV=0;
  const TYPES=['lava','confetti','cats','unicorns','brains','lava'];
  function erupt(){const kind=pick(TYPES);const cx=g.w/2,cy=g.h-16-Math.min(g.h*.42,300);
    for(let i=0;i<(kind==='lava'||kind==='confetti'?150:45);i++){const p={x:cx+rnd(-20,20),y:cy,vx:rnd(-330,330),vy:-rnd(650,1250),r:rnd(0,6),vr:rnd(-8,8),life:rnd(2.5,4),k:kind};
      if(kind==='lava'){p.s=rnd(4,11);p.c=pick([P.a1,P.a3,'#ff3b1f','#ffd27a'])}else if(kind==='confetti'){p.s=rnd(6,12);p.c=pick([P.a1,P.a2,P.a3,P.a4,'#fff'])}else{p.s=rnd(22,36);p.e={cats:'🐱',unicorns:'🦄',brains:'🧠'}[kind]}parts.push(p)}
    pr=0;shakeV=1;n++;$('#volN').textContent=n;SFX.boom();buzz([100,40,250]);flash();roast('volcano',.4)}
  function add(v){pr=Math.min(100,pr+v);if(pr>=100)erupt();else if(Math.random()<.3)tone(80+pr*2,60+pr*2,.12,{type:'triangle',g:.08})}
  function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;const c=g.c,fy=g.h-16;
    pr=Math.max(0,pr-dt*5);shakeV*=Math.pow(.05,dt);const q=pr/100;
    c.clearRect(0,0,g.w,g.h);c.save();const sh=(q*q*5+shakeV*12);c.translate(rnd(-sh,sh),rnd(-sh,sh));
    const bw=Math.min(g.w*.85,420),vh=Math.min(g.h*.42,300),tw=bw*.22,cx=g.w/2,top=fy-vh;
    // glow
    const gl=c.createRadialGradient(cx,top,5,cx,top,vh*.9);gl.addColorStop(0,`rgba(255,120,60,${.15+q*.55})`);gl.addColorStop(1,'rgba(255,120,60,0)');c.fillStyle=gl;c.fillRect(0,0,g.w,g.h);
    // smoke
    if(Math.random()<.1+q*.6)smoke.push({x:cx+rnd(-tw/3,tw/3),y:top,vy:-rnd(30,70)-q*60,vx:rnd(-15,15),s:rnd(8,16),life:2.2});
    smoke=smoke.filter(p=>(p.life-=dt)>0);smoke.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.s+=dt*14;c.globalAlpha=p.life/2.2*.45;c.fillStyle='#d9d4e3';c.beginPath();c.arc(p.x,p.y,p.s,0,6.283);c.fill()});c.globalAlpha=1;
    // cone
    const cg=c.createLinearGradient(0,top,0,fy);cg.addColorStop(0,'#6b4a5e');cg.addColorStop(1,'#3b2638');c.fillStyle=cg;c.beginPath();c.moveTo(cx-bw/2,fy);c.lineTo(cx-tw/2,top);c.lineTo(cx+tw/2,top);c.lineTo(cx+bw/2,fy);c.closePath();c.fill();
    // lava in crater + drips by pressure
    c.fillStyle=q>.6?P.a1:P.a3;c.beginPath();c.ellipse(cx,top,tw/2,8+q*6,0,0,6.283);c.fill();
    c.strokeStyle=P.a1;c.lineWidth=8;c.lineCap='round';[-.25,.15].forEach((o,i)=>{const l=vh*Math.min(1,q*1.3)*(i?.6:.85);if(l>4){c.globalAlpha=.85;c.beginPath();c.moveTo(cx+o*tw,top+4);c.quadraticCurveTo(cx+o*tw*2.2,top+l*.5,cx+o*tw*3,top+l);c.stroke()}});c.globalAlpha=1;
    // ground
    c.fillStyle=P.line;c.fillRect(-20,fy,g.w+40,30);c.restore();
    // particles
    parts=parts.filter(p=>(p.life-=dt)>0);for(const p of parts){p.vy+=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;if(p.y>fy-4){p.y=fy-4;p.vy*=-.3;p.vx*=.7}
      c.save();c.globalAlpha=Math.min(1,p.life);c.translate(p.x,p.y);c.rotate(p.r);
      if(p.e){c.font=`${p.s}px ${EMOJI_FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(p.e,0,0)}else if(p.k==='lava'){c.fillStyle=p.c;c.beginPath();c.arc(0,0,p.s,0,6.283);c.fill()}else{c.fillStyle=p.c;c.fillRect(-p.s/2,-p.s/4,p.s,p.s/2)}c.restore()}
    // gauge
    const gw=g.w-32;c.fillStyle=P.card;c.fillRect(16,14,gw,14);const gg=c.createLinearGradient(16,0,16+gw,0);gg.addColorStop(0,P.a2);gg.addColorStop(.6,P.a3);gg.addColorStop(1,P.a1);c.fillStyle=gg;c.fillRect(16,14,gw*q,14);
    c.fillStyle=P.tx;c.font='600 13px system-ui';c.fillText(`${t('pressure')}: ${Math.round(pr)}%`,16,46);
    raf=requestAnimationFrame(loop)}
  return{start(){cv=cv||$('#volCv');if(!cv.bound){bindTap(cv,Volcano);cv.bound=1}g=fit(cv);$('#volN').textContent=n;updMotionBtns();run=true;last=performance.now();raf=requestAnimationFrame(loop)},
    stop(){run=false;cancelAnimationFrame(raf)},tap(){add(7);buzz(10)},shake(j){add(Math.min(14,j*.7))},resize(){g=fit(cv)}}})();

/* ================= PUNCHING BAG ================= */
const Bag=TOOLS.bag=(()=>{let cv,g,run=false,raf,last,th=0,om=0,sq=0,hitT=0,hits=0,recent=[],stars=[],tongue=0;
  function geo(){const L=g.h*.16,bw=Math.min(130,g.w*.34),bh=Math.min(g.h*.52,270);return{px:g.w/2,py:8,L,bw,bh}}
  function tap(x,y){const G=geo();const cx=G.px+Math.sin(th)*(G.L+G.bh/2);const dir=x<cx?1:-1;om+=dir*rnd(1.3,2);sq=1;hitT=.6;hits++;$('#bagN').textContent=hits;const now=performance.now();recent.push(now);
    for(let i=0;i<6;i++)stars.push({x,y,vx:rnd(-160,160),vy:rnd(-220,-40),life:.7,c:pick([P.a3,'#fff',P.a2])});
    noise(.18,{f:320,g:.8});if(Math.random()<.5)SFX.squeak();buzz(25);if(hits%10===0)roast('bag',.5)}
  function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;const c=g.c,G=geo();
    om+=(-18*Math.sin(th)-1.1*om)*dt;th+=om*dt;if(Math.abs(th)>.85){th=Math.sign(th)*.85;om*=-.4};sq*=Math.pow(.02,dt);hitT=Math.max(0,hitT-dt);
    recent=recent.filter(x=>now-x<2000);$('#bagP').textContent=Math.min(100,recent.length*12)+'%';
    if(S.mean&&hitT===0&&Math.random()<dt*.15)tongue=1.2;tongue=Math.max(0,tongue-dt);
    c.clearRect(0,0,g.w,g.h);c.fillStyle=P.line;c.fillRect(0,g.h-16,g.w,16);
    c.fillStyle=P.card;c.fillRect(G.px-40,0,80,10);
    c.save();c.translate(G.px,G.py);c.rotate(-th);
    c.strokeStyle='#9a92a8';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(-G.bw*.3,G.L);c.moveTo(0,0);c.lineTo(G.bw*.3,G.L);c.stroke();
    c.translate(0,G.L+G.bh/2);c.scale(1+sq*.12,1-sq*.08);
    const bg=c.createLinearGradient(-G.bw/2,0,G.bw/2,0);bg.addColorStop(0,P.a1);bg.addColorStop(.5,'#ff8c7f');bg.addColorStop(1,'#b8423a');c.fillStyle=bg;
    const rr=G.bw*.35;c.beginPath();c.roundRect?c.roundRect(-G.bw/2,-G.bh/2,G.bw,G.bh,rr):c.rect(-G.bw/2,-G.bh/2,G.bw,G.bh);c.fill();
    c.fillStyle=P.a3;c.fillRect(-G.bw/2,-G.bh/2+G.bh*.12,G.bw,10);c.fillRect(-G.bw/2,G.bh/2-G.bh*.18,G.bw,10);
    // face
    const fy=-G.bh*.08,ex=G.bw*.2;c.strokeStyle='#2a0d18';c.fillStyle='#2a0d18';c.lineWidth=5;c.lineCap='round';
    if(hitT>0){[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*ex-8,fy-8);c.lineTo(s*ex+8,fy+8);c.moveTo(s*ex+8,fy-8);c.lineTo(s*ex-8,fy+8);c.stroke()});c.beginPath();c.ellipse(0,fy+G.bh*.13,12,15,0,0,6.283);c.fill()}
    else{[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*ex-10,fy);c.lineTo(s*ex+10,fy);c.stroke()});c.beginPath();c.moveTo(-ex-12,fy-16);c.lineTo(-ex+10,fy-12);c.moveTo(ex-10,fy-20);c.lineTo(ex+12,fy-26);c.stroke();
      c.beginPath();c.moveTo(-G.bw*.15,fy+G.bh*.12);c.quadraticCurveTo(G.bw*.05,fy+G.bh*.17,G.bw*.2,fy+G.bh*.08);c.stroke();
      if(tongue>0){c.fillStyle='#ff5c8a';c.beginPath();c.ellipse(G.bw*.06,fy+G.bh*.17,9,12,0,0,6.283);c.fill()}}
    c.restore();
    stars=stars.filter(s=>(s.life-=dt)>0);stars.forEach(s=>{s.vy+=500*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;c.globalAlpha=s.life/.7;c.fillStyle=s.c;c.font='18px system-ui';c.fillText('✦',s.x,s.y)});c.globalAlpha=1;
    raf=requestAnimationFrame(loop)}
  return{start(){cv=cv||$('#bagCv');if(!cv.bound){bindTap(cv,Bag);cv.bound=1}g=fit(cv);$('#bagN').textContent=hits;run=true;last=performance.now();raf=requestAnimationFrame(loop)},
    stop(){run=false;cancelAnimationFrame(raf)},tap,shake(){tap(rnd(0,g.w),g.h/2)},resize(){g=fit(cv)}}})();

/* ================= COOL DOWN ================= */
const Cool=(()=>{let run=false,raf,t0,phase=-1,crumbs=[];const DUR=60000,IN=4000,CYC=10000;
  function start(){run=true;t0=performance.now();phase=-1;$('#coolMean').hidden=!S.mean;$('#roast').classList.remove('on');
    const fl=$('#coolFloor');fl.innerHTML='<div id="robot">🤖🧹</div>';crumbs=[];for(let i=0;i<16;i++){const d=document.createElement('span');d.className='crumb';d.textContent=pick(['✦','◆','▲','✶','●','🍽️','📄']);const x=rnd(8,95);d.style.left=x+'%';d.style.color=pick([P.a1,P.a2,P.a3,P.a4]);d.style.fontSize=rnd(11,17)+'px';fl.appendChild(d);crumbs.push({el:d,x})}
    raf=requestAnimationFrame(loop)}
  function loop(now){if(!run)return;const el=now-t0;const c=el%CYC;let s;
    if(c<IN){s=.55+.45*Math.sin((c/IN)*Math.PI/2);if(phase!==0){phase=0;$('#breathTxt').textContent=t('inhale');SFX.chime(392)}}
    else{s=1-.45*(1-Math.cos(((c-IN)/(CYC-IN))*Math.PI))/2;if(phase!==1){phase=1;$('#breathTxt').textContent=t('exhale');SFX.chime(294)}}
    $('#breath').style.transform=`scale(${s})`;
    const left=Math.max(0,Math.ceil((DUR-el)/1000));$('#coolLeft').textContent=left+' s';
    const rx=Math.min(100,el/DUR*100);const r=$('#robot');if(r)r.style.left=(6+rx*.86)+'%';
    crumbs.forEach(k=>{if(k.x<6+rx*.86+4&&k.el.style.opacity!=='0'){k.el.style.opacity='0';k.el.style.transform='translateY(-10px) scale(.3)'}});
    if(el>=DUR){finish();return}
    raf=requestAnimationFrame(loop)}
  function finish(){stop();goMeter('after')}
  function stop(){run=false;cancelAnimationFrame(raf)}
  return{start,stop,finish}})();
$('#coolSkip').onclick=()=>Cool.finish();

/* ================= RAGE-O-METER & RESULT ================= */
let meterMode='before';
function goMeter(mode){meterMode=mode;$('#meterQ').textContent=t(mode==='before'?'meterBefore':'meterAfter');$('#mIn').value=mode==='after'&&session.before!=null?session.before:5;updMeter();show('meter')}
function updMeter(){const v=+$('#mIn').value;$('#mFace').textContent=FACES[v-1];$('#mNum').textContent=v;$('#mLbl').textContent=t('lv')[Math.min(4,Math.floor((v-1)/2))];
  const hue=170-(v-1)/9*170;const g=$('#gauge');g.style.setProperty('--mc',`hsl(${hue} 85% 62%)`);g.style.setProperty('--mp',v*10)}
$('#mIn').addEventListener('input',()=>{updMeter();tone(200+ +$('#mIn').value*60,200+ +$('#mIn').value*60,.06,{g:.05});buzz(8)});
$('#mNext').onclick=()=>{const v=+$('#mIn').value;if(meterMode==='before'){session.before=v;session.tools=new Set();show('home');setTimeout(()=>$('#grid').scrollIntoView({behavior:'smooth',block:'start'}),60)}else{showResult(v)}};
$('#startBtn').onclick=()=>goMeter('before');
function showResult(a){const b=session.before;let msg;const r=R();
  if(b==null){$('#resNums').innerHTML=`<span style="color:hsl(${170-(a-1)/9*170} 85% 62%)">${a}</span>`;msg=t('resOnly',a)}
  else{const d=b-a;$('#resNums').innerHTML=`<span style="color:hsl(${170-(b-1)/9*170} 85% 62%)">${b}</span><span class="arr">→</span><span style="color:hsl(${170-(a-1)/9*170} 85% 62%)">${a}</span>`;
    msg=d>0?(S.mean?r.down:t('resDown',d)):d===0?(S.mean?r.same:t('resSame')):(S.mean?r.up:t('resUp',-d))}
  $('#resMsg').textContent=msg;
  S.hist.unshift({d:Date.now(),b,a,tl:[...session.tools]});S.hist=S.hist.slice(0,100);save();
  session={before:null,tools:new Set()};show('result');if(b!=null&&b>a){SFX.chime(660);SFX.chime(880)}}
$('#resAgain').onclick=()=>goMeter('before');

/* ================= HISTORY ================= */
function renderHist(){const h=S.hist;const em=Object.fromEntries(TOOL_LIST.map(x=>[x[0],x[1]]));
  const withB=h.filter(x=>x.b!=null);const avg=withB.length?(withB.reduce((s,x)=>s+(x.b-x.a),0)/withB.length):0;
  $('#histSum').innerHTML=`<span>${t('sessions')}: <b>${h.length}</b></span><span>${t('avgDrop')}: <b>${withB.length?avg.toFixed(1):'–'}</b></span>`;
  $('#histList').innerHTML=h.length?h.map(x=>`<li><span>${new Date(x.d).toLocaleString(S.lang,{dateStyle:'short',timeStyle:'short'})}<br><small class="mut">${(x.tl||[]).map(k=>em[k]||'').join(' ')}</small></span><b>${x.b!=null?x.b+' → ':''}${x.a}</b></li>`).join(''):`<li class="mut">${t('noHistory')}</li>`;
  $('#histClear').hidden=!h.length}
$('#histClear').onclick=()=>{S.hist=[];save();renderHist();toast('✓')};

/* ================= MEAN MODE, SETTINGS, SHARE ================= */
function updMean(){document.body.classList.toggle('mean',S.mean);$('#meanBtn').textContent=S.mean?'😈':'😇'}
$('#meanBtn').onclick=()=>{if(!S.mean&&!S.meanSeen){$('#modalTxt').textContent=t('meanWarn');$('#modal').hidden=false;return}S.mean=!S.mean;save();updMean();toast(t(S.mean?'meanOn':'meanOff'));if(S.mean)tone(140,70,.5,{type:'sawtooth',g:.12})};
$('#modalOk').onclick=()=>{$('#modal').hidden=true;S.meanSeen=true;S.mean=true;save();updMean();toast(t('meanOn'));tone(140,70,.5,{type:'sawtooth',g:.12})};
$('#modalNo').onclick=()=>{$('#modal').hidden=true};
$('#sndT').onchange=e=>{S.sound=e.target.checked;save()};
$('#vibT').onchange=e=>{S.vib=e.target.checked;save();if(S.vib)buzz(40)};
$('#shareBtn').onclick=async()=>{const url=location.href.split('#')[0];try{if(navigator.share){await navigator.share({title:'Honicorn',text:t('shareText'),url});return}}catch(e){if(e&&e.name==='AbortError')return}
  try{await navigator.clipboard.writeText(url);toast(t('linkCopied'))}catch(e){toast(url)}};

/* ================= INIT ================= */
$('#sndT').checked=S.sound;$('#vibT').checked=S.vib;
applyPal();applyI18n();updMean();updChip();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
