/* Honicorn – © 2026 Piotr Żondełek. All rights reserved. */
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const LANGS=[['en','English'],['pl','Polski'],['de','Deutsch'],['es','Español'],['fr','Français'],['zh','中文'],['uk','Українська'],['lv','Latviešu']];
const SPEECH={en:'en-US',pl:'pl-PL',de:'de-DE',es:'es-ES',fr:'fr-FR',zh:'zh-CN',uk:'uk-UA',lv:'lv-LV'};
const PALETTES={
 plum:{bg:'#1e1533',bg2:'#2b1f47',card:'#362a55',line:'#4a3b6e',tx:'#f7f0fb',mut:'#bfb2d6',a1:'#ff6b5b',a2:'#26c6b0',a3:'#ffb347',a4:'#a77bf3'},
 ocean:{bg:'#0f1d2e',bg2:'#16293f',card:'#1d3450',line:'#2c4766',tx:'#eef6ff',mut:'#a9bfd6',a1:'#ff7a45',a2:'#2ec5e0',a3:'#ffd166',a4:'#7b8cff'},
 forest:{bg:'#13221c',bg2:'#1a2e26',card:'#223a30',line:'#2f4d40',tx:'#effaf3',mut:'#a9c7b7',a1:'#ff6f61',a2:'#9bd35a',a3:'#f4b942',a4:'#4fc1a6'},
 ember:{bg:'#1c1616',bg2:'#282020',card:'#332828',line:'#4a3a3a',tx:'#fff3ef',mut:'#cdb5ad',a1:'#ff5470',a2:'#ff9f1c',a3:'#ffd23f',a4:'#c77dff'}
};
const TOOL_LIST=[['smash','🍽️','a1'],['scream','📣','a3'],['crush','🗑️','a2'],['insult','🤬','a4'],['volcano','🌋','a1'],['bag','🥊','a3']];
const FACES=['😌','🙂','😐','😒','😠','😤','😡','🤬','🌋','💥'];

/* ---------- state ---------- */
let S={lang:'en',pal:'plum',sound:true,vib:true,mean:false,meanSeen:false,comments:true,hist:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem('honicorn')||'{}'))}catch(e){}
if(!I18N[S.lang])S.lang='en';
function save(){try{localStorage.setItem('honicorn',JSON.stringify(S))}catch(e){}}
let P=PALETTES[S.pal]||PALETTES.plum;
let session={before:null,tools:new Set()};
let cur='home',curTool=null,lastPoke=Date.now(),motionOK=false;

/* ---------- i18n ---------- */
function L(){return I18N[S.lang]||I18N.en}
function t(k,n){let v=L()[k];if(v==null)v=I18N.en[k];if(v==null)return k;return n!=null?String(v).replace('{n}',n):v}
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
  renderFamily();
}
/* ---------- PaKu family: Honicorn works alone; this screen only shows the other family apps ---------- */
function renderFamily(){const F=window.PaKuFamily,b=$('#famBtn');if(!F){if(b)b.closest('button').hidden=true;return}
  const l=S.lang,e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(b)b.textContent=F.t('fam_title',l);$('#famTitle').textContent=F.t('fam_title',l);$('#famD').textContent=F.t('fam_d',l);
  $('#famList').innerHTML=F.all().map(a=>{const me=a.id==='honicorn',u=F.used(a.id);
    return `<div class="set famApp"><img src="${e(F.icon(a))}" alt="" width="44" height="44" onerror="this.style.visibility='hidden'"><div class="famTx"><b>${e(a.name)}</b><small class="mut">${me?e(F.t('fam_this',l)):(u?e(F.t('fam_used',l))+' · ':'')+e(F.desc(a,l))}</small></div>${me?'':`<a class="btn sm" href="${e(F.url(a))}">${e(F.t(u?'fam_open':'fam_get',l))}</a>`}</div>`}).join('');
  const h=$('#famHub');h.href=F.hub;h.textContent=F.t('fam_hub',l)}
function applyPal(){P=PALETTES[S.pal]||PALETTES.plum;const r=document.documentElement.style;for(const k in P)r.setProperty('--'+k,P[k]);
  document.querySelector('meta[name=theme-color]').content=P.bg;
  $('#pals').innerHTML=Object.keys(PALETTES).map(k=>{const p=PALETTES[k];return `<button class="sw ${k===S.pal?'on':''}" data-p="${k}" aria-label="${k}" style="background:${p.bg}"><i style="background:${p.a1}"></i><i style="background:${p.a2}"></i><i style="background:${p.a3}"></i><i style="background:${p.a4}"></i></button>`}).join('');
  $$('#pals .sw').forEach(b=>b.onclick=()=>{S.pal=b.dataset.p;save();applyPal()});
}

/* ---------- sound engine: compressor + reverb bus ---------- */
let AC=null,BUS=null,NB=null;
function rawAC(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function initBus(a){const comp=a.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=12;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.25;const master=a.createGain();master.gain.value=.95;comp.connect(master).connect(a.destination);
  const dry=a.createGain();dry.connect(comp);const rev=a.createConvolver();const len=a.sampleRate*2.4|0;const ir=a.createBuffer(2,len,a.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}rev.buffer=ir;const wet=a.createGain();wet.gain.value=.55;rev.connect(wet).connect(comp);
  const nl=a.sampleRate*2|0;NB=a.createBuffer(1,nl,a.sampleRate);const nd=NB.getChannelData(0);for(let i=0;i<nl;i++)nd[i]=Math.random()*2-1;BUS={dry,rev}}
function ac(){if(!S.sound)return null;try{const a=rawAC();if(!BUS)initBus(a);return a}catch(e){return null}}
function route(a,node,rv,pan){let n=node;if(pan&&a.createStereoPanner){const p=a.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,pan));n.connect(p);n=p}n.connect(BUS.dry);if(rv>0){const s=a.createGain();s.gain.value=rv;n.connect(s).connect(BUS.rev)}}
function noise(dur,o={}){const a=ac();if(!a)return;const {type='lowpass',f=1000,f2=null,q=1,g=.5,delay=0,rev=.15,att=.002,pan=0}=o;const t0=a.currentTime+delay;const s=a.createBufferSource();s.buffer=NB;s.loop=true;
  const fl=a.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t0);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t0+dur);fl.Q.value=q;
  const gn=a.createGain();gn.gain.setValueAtTime(.0001,t0);gn.gain.exponentialRampToValueAtTime(Math.max(g,.0002),t0+att);gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  s.connect(fl).connect(gn);route(a,gn,rev,pan);s.start(t0,Math.random()*1.5);s.stop(t0+dur+.05)}
function tone(f1,f2,dur,o={}){const a=ac();if(!a)return;const {type='sine',g=.3,delay=0,rev=.1,att=.003,pan=0}=o;const t0=a.currentTime+delay;const os=a.createOscillator();os.type=type;os.frequency.setValueAtTime(f1,t0);os.frequency.exponentialRampToValueAtTime(Math.max(f2,1),t0+dur);
  const gn=a.createGain();gn.gain.setValueAtTime(.0001,t0);gn.gain.exponentialRampToValueAtTime(Math.max(g,.0002),t0+att);gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);os.connect(gn);route(a,gn,rev,pan);os.start(t0);os.stop(t0+dur+.05)}
const SFX={
 crack(){noise(.12,{type:'bandpass',f:2400,q:1.5,g:1.2,rev:.3});tone(170,55,.18,{g:.6});noise(.05,{type:'highpass',f:5000,g:.6,delay:.02})},
 tink(){tone(rnd(3200,7500),rnd(2500,6000),rnd(.05,.14),{g:rnd(.03,.08),rev:.5,pan:rnd(-.8,.8)})},
 glass(){tone(150,45,.35,{g:.9});noise(.08,{type:'highpass',f:1200,g:1.4,rev:.2});noise(1.6,{type:'highpass',f:2600,g:1.1,rev:.7,att:.004});noise(1.1,{type:'bandpass',f:6500,q:2.5,g:.9,rev:.8,delay:.02});
   for(let i=0;i<34;i++)tone(rnd(2800,8200),rnd(2200,7000),rnd(.05,.25),{g:rnd(.04,.12),rev:.6,pan:rnd(-1,1),delay:Math.pow(Math.random(),2)*1.6})},
 ceramic(){tone(120,40,.4,{g:1});noise(.15,{f:900,g:1.3,rev:.2});noise(1.1,{type:'bandpass',f:2000,q:.7,g:1.1,rev:.6});noise(.6,{type:'highpass',f:3500,g:.6,rev:.5,delay:.03});
   for(let i=0;i<22;i++)tone(rnd(1400,3800),rnd(900,2500),rnd(.04,.1),{type:'triangle',g:rnd(.05,.12),rev:.4,pan:rnd(-1,1),delay:Math.pow(Math.random(),1.6)*1.3})},
 tech(){tone(75,22,1.6,{g:1.1,rev:.3});noise(1.4,{f:3500,f2:70,g:1.3,rev:.5});tone(120,35,.6,{type:'sawtooth',g:.35,rev:.2,delay:.05});
   for(let i=0;i<45;i++)noise(.02,{type:'highpass',f:4000,g:rnd(.3,.8),rev:.2,pan:rnd(-1,1),delay:rnd(.05,1.4)});
   noise(1,{type:'highpass',f:2800,g:.7,rev:.6,delay:.06});for(let i=0;i<12;i++)tone(rnd(3000,7000),2500,.1,{g:.05,rev:.5,delay:rnd(0,1.2),pan:rnd(-1,1)});tone(60,60,.8,{type:'square',g:.08,delay:.1})},
 wood(){noise(.14,{type:'bandpass',f:950,q:1.6,g:1.5,rev:.3});tone(140,50,.3,{g:.8});noise(.5,{type:'highpass',f:1800,g:.6,rev:.4,delay:.03});
   [196,293.7,440,659.3].forEach((f,i)=>tone(f,f*.45,1.4,{type:'sawtooth',g:.07,rev:.5,delay:.02+i*.03}));tone(880,110,.5,{type:'triangle',g:.15,delay:.1})},
 clock(){SFX.ceramic();[1320,1760,2640].forEach((f,i)=>tone(f,f*.995,1.8,{g:.12,rev:.7,delay:i*.07}));tone(300,900,.18,{type:'triangle',g:.2,delay:.25});tone(900,240,.35,{type:'triangle',g:.2,delay:.43});tone(240,700,.2,{type:'triangle',g:.15,delay:.8})},
 thud(){noise(.3,{f:260,g:.9});tone(130,40,.28,{g:.5})},
 boom(){noise(1.6,{f:700,f2:60,g:1,rev:.4});tone(85,28,1.2,{g:.6})},
 bigboom(){SFX.boom();noise(2.5,{f:1800,f2:50,g:1.2,rev:.8});for(let i=0;i<30;i++)noise(.04,{type:'highpass',f:3000,g:rnd(.3,.7),delay:rnd(.1,1.8),pan:rnd(-1,1),rev:.4})},
 whoosh(){noise(1.3,{type:'bandpass',f:250,f2:3200,q:1.4,g:.7,att:.3})},
 nom(){tone(240,140,.12,{type:'square',g:.1})},
 burp(){tone(95,55,.5,{type:'sawtooth',g:.18})},
 shred(){tone(70,62,1.2,{type:'sawtooth',g:.14});noise(1.2,{type:'bandpass',f:1500,q:.8,g:.3})},
 pop(){tone(500,1100,.09,{g:.18})},
 crinkle(){for(let i=0;i<7;i++)noise(.06,{type:'highpass',f:3000,g:.35,delay:i*.11+Math.random()*.05})},
 chime(f){tone(f,f*.999,1.6,{g:.05,rev:.4})},
 punch(){noise(.16,{f:300,g:1.3,rev:.15});tone(110,45,.22,{g:.8})},
 rip(){noise(.45,{type:'bandpass',f:1400,f2:3500,q:2,g:.9,rev:.2})},
 sand(){noise(.5,{type:'highpass',f:5000,g:.2,rev:.1,att:.05})},
 snap(){noise(.08,{type:'highpass',f:2000,g:1.2});tone(800,200,.25,{type:'triangle',g:.3,rev:.4})},
 plop(){tone(320,60,.35,{g:.7,rev:.3});noise(.25,{f:500,g:.8,rev:.3})},
 grunt(){tone(90,150,.6,{type:'sawtooth',g:.15});tone(95,170,.7,{type:'sawtooth',g:.13,delay:.7})},
 fanfare(){[523,659,784,1047].forEach((f,i)=>tone(f,f,.25+(i===3?.7:0),{type:'square',g:.08,rev:.5,delay:i*.14}))},
 fly(){for(let i=0;i<22;i++)tone(rnd(190,260),rnd(190,260),.13,{type:'sawtooth',g:.025,delay:i*.11,pan:Math.sin(i)*.7})}
};
function buzz(p){if(S.vib&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)}
function flash(){$('#flash').animate([{opacity:.55},{opacity:0}],{duration:450})}

/* ---------- app comments: nice 😇 / mega mean 😈, non-repeating decks ---------- */
let lastCom=0;const DECKS={};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function comDraw(mode,ctx){const k=S.lang+'|'+mode+'|'+ctx;if(!DECKS[k]||!DECKS[k].length){const src=((COM[S.lang]||COM.en)[mode]||{})[ctx]||[];DECKS[k]=shuffle([...src])}return DECKS[k].pop()}
function showCom(m,mode){const e=$('#roast');e.classList.toggle('nice',mode==='nice');e.querySelector('.av').textContent=mode==='nice'?'😇':'😈';e.querySelector('span').textContent=m;e.classList.add('on');clearTimeout(showCom.t);showCom.t=setTimeout(()=>e.classList.remove('on'),3800)}
function comment(ctx,chance=1,force=false){if(!S.comments||cur==='cool')return;const now=Date.now();if(now-lastCom<(force?1500:4500)||Math.random()>chance)return;lastCom=now;const mode=S.mean?'mean':'nice';
  const pool=(ctx==='idle'||Math.random()>.35)?ctx:'gen';const m=comDraw(mode,pool)||comDraw(mode,'gen');if(m)showCom(m,mode)}
function poke(){lastPoke=Date.now()}
setInterval(()=>{if(S.comments&&curTool&&Date.now()-lastPoke>12000&&Date.now()-lastCom>12000){lastPoke=Date.now();comment('idle',1,true)}},2000);

/* ---------- navigation ---------- */
const TOOLS={};
function show(id){
  if(curTool&&TOOLS[curTool].stop)TOOLS[curTool].stop();curTool=null;
  if(cur==='cool'&&id!=='cool')Cool.stop();
  $$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));cur=id;window.scrollTo(0,0);
  $('#roast').classList.remove('on');
  if(id==='home')updChip();
  if(id==='history')renderHist();
  if(id==='family'){renderFamily();const F=window.PaKuFamily;if(F){F.detect().then(renderFamily);F.refresh()}}
  if(TOOLS[id]){curTool=id;session.tools.add(id);poke();requestAnimationFrame(()=>TOOLS[id].start());setTimeout(()=>{if(curTool===id)comment('gen',.6)},1800)}
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
const OBJS=[{e:'🍽️',hp:1,m:'ceramic',c:['#f4f1ea','#9fc5e8','#ffffff']},{e:'☕',hp:1,m:'ceramic',c:['#ffffff','#e06666','#8b5a2b']},{e:'🏺',hp:2,m:'ceramic',c:['#c8743a','#e3a15f','#7a3e1d']},{e:'💡',hp:1,m:'glass',c:['#fff7c2','#ffe066','#dddddd']},{e:'🪴',hp:2,m:'ceramic',c:['#c26d3e','#6aa84f','#5b3a1e']},{e:'📺',hp:3,m:'tech',c:['#444','#777','#9ad0ff']},{e:'🖨️',hp:3,m:'tech',c:['#ddd','#999','#555']},{e:'🖥️',hp:3,m:'tech',c:['#333','#888','#6fa8dc']},{e:'⏰',hp:2,m:'clock',c:['#e74c3c','#f1c40f','#eee']},{e:'🍾',hp:1,m:'glass',c:['#2e7d32','#a5d6a7','#ffd54f']},{e:'🥛',hp:1,m:'glass',c:['#ffffff','#dfe9f3','#bbccdd']},{e:'🎻',hp:2,m:'wood',c:['#8b4513','#d2691e','#222']},{e:'🍷',hp:1,m:'glass',c:['#b0002a','#ffffff','#e8eef5']},{e:'🪞',hp:2,m:'glass',c:['#cfe8ff','#ffffff','#b8860b']},{e:'💻',hp:3,m:'tech',c:['#bbb','#555','#7fb3ff']},{e:'🎸',hp:2,m:'wood',c:['#c0392b','#f5cba7','#2c2c2c']},{e:'🫖',hp:2,m:'ceramic',c:['#7fb3d5','#ffffff','#2e86c1']},{e:'🪑',hp:3,m:'wood',c:['#a0522d','#cd853f','#5d3a1a']}];
const Smash=TOOLS.smash=(()=>{let cv,g,shards=[],fx=[],obj=null,count=0,run=false,last=0,raf,shk=0,lastTink=0,bag=[];
  function next(){if(!bag.length)bag=shuffle([...OBJS]);const o=bag.pop();obj={o,x:g.w/2,y:-g.h*.3,ty:g.h*.45,size:Math.min(g.w*.55,g.h*.42),shake:0,cracks:[],hp:o.hp}}
  function hit(){if(!obj||obj.y<obj.ty-30)return;obj.hp--;obj.shake=1;
    for(let i=0;i<3;i++){const a=rnd(0,6.28),l=obj.size*rnd(.18,.42);obj.cracks.push([rnd(-.1,.1)*obj.size,rnd(-.1,.1)*obj.size,Math.cos(a)*l,Math.sin(a)*l])}
    if(obj.hp<=0)explode();else{SFX.crack();if(obj.o.m==='tech')SFX.thud();shk=Math.max(shk,.35);buzz(25);comment('smash',.15)}}
  function explode(){const {x,y,size,o}=obj;const glassy=o.m==='glass'||o.m==='ceramic';
    for(let i=0;i<70;i++){const a=rnd(0,6.28),sp=rnd(250,1000);shards.push({x:x+rnd(-.25,.25)*size,y:y+rnd(-.25,.25)*size,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-380,r:rnd(0,6.28),vr:rnd(-14,14),s:rnd(5,size*.14),c:pick(o.c),life:rnd(2.8,4.2),em:Math.random()<.1?o.e:null,glassy,landed:false})}
    fx.push({k:'ring',x,y,r:size*.2,life:.5,c:'#fff'},{k:'flash',x,y,r:size*.9,life:.25});
    for(let i=0;i<14;i++)fx.push({k:'dust',x:x+rnd(-size*.3,size*.3),y:y+rnd(-size*.2,size*.3),vx:rnd(-120,120),vy:rnd(-140,10),r:rnd(10,24),life:rnd(.8,1.4)});
    if(o.m==='tech')for(let i=0;i<26;i++){const a=rnd(0,6.28),sp=rnd(300,800);fx.push({k:'spark',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:rnd(.3,.7)})}
    SFX[o.m]();shk=1;buzz(o.m==='tech'?[60,30,120,30,60]:[40,20,90]);count++;$('#smashN').textContent=count;obj=null;setTimeout(()=>{if(run)next()},520);comment('smash',.55)}
  function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;const c=g.c,fy=g.h-16;c.clearRect(0,0,g.w,g.h);
    shk*=Math.pow(.004,dt);c.save();if(shk>.02)c.translate(rnd(-1,1)*shk*14,rnd(-1,1)*shk*10);
    c.fillStyle=P.line;c.fillRect(-20,fy,g.w+40,30);
    const sz=Math.min(g.w*.55,g.h*.42),ty=g.h*.45+sz*.46;c.fillStyle=P.card;c.fillRect(g.w*.15,ty,g.w*.7,12);c.fillRect(g.w*.2,ty+12,10,fy-ty-12);c.fillRect(g.w*.8-10,ty+12,10,fy-ty-12);
    if(obj){obj.y+=(obj.ty-obj.y)*Math.min(1,dt*9);obj.shake*=Math.pow(.01,dt);const sx=rnd(-1,1)*obj.shake*16;
      c.save();c.translate(obj.x+sx,obj.y);c.font=`${obj.size}px ${EMOJI_FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(obj.o.e,0,0);
      c.strokeStyle='rgba(15,8,25,.9)';c.lineWidth=3;c.lineJoin='round';obj.cracks.forEach(k=>{c.beginPath();c.moveTo(k[0],k[1]);c.lineTo(k[0]+k[2]*.5+k[3]*.15,k[1]+k[3]*.5-k[2]*.15);c.lineTo(k[0]+k[2],k[1]+k[3]);c.stroke()});c.restore()}
    fx=fx.filter(f=>(f.life-=dt)>0);
    for(const f of fx){if(f.k==='flash'){c.globalAlpha=f.life*3;const gr=c.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r);gr.addColorStop(0,'#fff');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.beginPath();c.arc(f.x,f.y,f.r,0,6.283);c.fill()}
      else if(f.k==='ring'){f.r+=dt*900;c.globalAlpha=f.life*2;c.strokeStyle=f.c;c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,f.r,0,6.283);c.stroke()}
      else if(f.k==='dust'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.r+=dt*20;c.globalAlpha=f.life*.35;c.fillStyle='#d8d0e0';c.beginPath();c.arc(f.x,f.y,f.r,0,6.283);c.fill()}
      else if(f.k==='spark'){f.vy+=900*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;c.globalAlpha=Math.min(1,f.life*3);c.strokeStyle='#ffe066';c.lineWidth=2;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x-f.vx*.03,f.y-f.vy*.03);c.stroke()}}
    c.globalAlpha=1;
    shards=shards.filter(s=>s.life>0);
    for(const s of shards){s.vy+=1700*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.r+=s.vr*dt;s.life-=dt;if(s.y>fy-s.s*.4){s.y=fy-s.s*.4;if(!s.landed&&Math.abs(s.vy)>200){s.landed=true;if(s.glassy&&now-lastTink>28){lastTink=now;SFX.tink()}}s.vy*=-.3;s.vx*=.75;s.vr*=.6}if(s.x<0||s.x>g.w){s.vx*=-.6;s.x=Math.max(0,Math.min(g.w,s.x))}
      c.save();c.globalAlpha=Math.min(1,s.life);c.translate(s.x,s.y);c.rotate(s.r);
      if(s.em){c.font=`${s.s*2.2}px ${EMOJI_FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText(s.em,0,0)}
      else{c.fillStyle=s.c;c.beginPath();c.moveTo(-s.s/2,-s.s/3);c.lineTo(s.s/2,-s.s/2);c.lineTo(s.s/4,s.s/2);c.closePath();c.fill();if(s.glassy){c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1;c.stroke()}}c.restore()}
    c.restore();raf=requestAnimationFrame(loop)}
  return{start(){cv=cv||$('#smashCv');if(!cv.bound){bindTap(cv,Smash);cv.bound=1}g=fit(cv);shards=[];fx=[];next();$('#smashN').textContent=count;updMotionBtns();run=true;last=performance.now();raf=requestAnimationFrame(loop)},
    stop(){run=false;cancelAnimationFrame(raf)},tap:hit,shake:hit,resize(){g=fit(cv);if(obj){obj.x=g.w/2;obj.ty=g.h*.45;obj.size=Math.min(g.w*.55,g.h*.42)}}}})();

/* ================= SCREAM-O-METER ================= */
const Scream=TOOLS.scream=(()=>{let cv,g,run=false,raf,last,stream=null,an=null,buf=null,level=0,hold=false,peak=0,over=0,tower=[],fallen=false,fallT=0,towers=0,t0=0,steam=[];
  function build(){tower=[];const bw=Math.min(64,g.w*.15),bh=bw*.55,x0=g.w*.76,fy=g.h-16;const cols=[P.a2,P.a3,P.a4,P.a1];for(let i=0;i<9;i++)tower.push({x:x0+(i%2?bw*.06:-bw*.06),y:fy-bh*(i+.5),w:bw,h:bh,vx:0,vy:0,r:0,vr:0,c:cols[i%4]});fallen=false}
  function topple(){fallen=true;fallT=0;tower.forEach((b,i)=>{b.vx=-rnd(150,420)-i*30;b.vy=-rnd(150,450);b.vr=rnd(-9,9)});SFX.boom();buzz([60,30,140]);towers++;$('#screamN').textContent=towers;comment('scream',1,true)}
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
    if(level>peak){if(band(level)>band(peak)&&band(level)>=2)comment('scream',.5);peak=level;$('#screamPk').textContent=t('sl')[band(peak)]}
    if(level>.78)over+=dt;else over=Math.max(0,over-dt);
    if(over>.35&&!fallen)topple();
    if(fallen){fallT+=dt;if(fallT>2.6)build()}
    if(!fallen&&now-t0>9000&&peak<.45){t0=now;comment('scream',.8)}
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
  function bubble(st,txt,x,y){const b=prop(st,'',x,y,null);b.className='bubble';b.textContent=txt;return b}
  function prop(st,html,x,y,size){const e=document.createElement('div');e.className='prop';e.innerHTML=html;e.style.left=x+'px';e.style.top=y+'px';if(size)e.style.fontSize=size+'px';st.appendChild(e);return e}
  async function crumple(){poke();stopRec();const txt=$('#crText').value.trim();if(!txt&&!voice){toast(t('needText'));return}
    busy=true;$('#crIn').hidden=true;const st=$('#crStage');st.hidden=false;st.innerHTML='';
    const p=document.createElement('div');p.className='paper';p.textContent=txt||`🎙️ ${t('voiceNote')} ${fmt(voiceDur)}`;st.appendChild(p);
    await wait(500);SFX.crinkle();buzz([20,40,20,40,20]);
    await p.animate([{transform:'translate(-50%,-50%) rotate(0) scale(1)',borderRadius:'6px'},{transform:'translate(-50%,-50%) rotate(-9deg) scale(.85,.75)',borderRadius:'24px'},{transform:'translate(-50%,-50%) rotate(12deg) scale(.55,.6)',borderRadius:'40%'},{transform:'translate(-50%,-50%) rotate(-20deg) scale(.3)',borderRadius:'50%',opacity:.6}],{duration:900,easing:'ease-in',fill:'forwards'}).finished;
    p.remove();const ball=document.createElement('div');ball.className='ball';st.appendChild(ball);ball.animate([{transform:'scale(.6)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:300});
    comment('crush',.5);const m=document.createElement('div');m.className='stageMsg';m.textContent=t('whereTo');st.appendChild(m);
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
      SFX.whoosh();buzz([40,40,200]);const o={duration:1300,easing:'cubic-bezier(.5,0,.9,.5)',fill:'forwards'};const up=`translateY(${-H-200}px)`;
      f.animate([{transform:'rotate(180deg) scale(1)'},{transform:'rotate(180deg) scale(1.4)'}],{duration:150,iterations:9,direction:'alternate'});
      ball.animate([{transform:'none'},{transform:up}],o);f.animate([{transform:'rotate(180deg)'},{transform:`${up} rotate(180deg) scale(1.6)`}],o);await r.animate([{transform:'rotate(-45deg)'},{transform:`${up} rotate(-45deg)`}],o).finished;
      r.remove();f.remove();ball.remove();
      // --- space: the problem reaches orbit ---
      const sp=document.createElement('div');sp.className='space';st.appendChild(sp);
      for(let i=0;i<70;i++){const s=document.createElement('i');s.className='star';s.style.left=rnd(0,100)+'%';s.style.top=rnd(0,100)+'%';const z=rnd(1,3);s.style.width=s.style.height=z+'px';s.style.animationDelay=rnd(0,2)+'s';sp.appendChild(s)}
      const es=Math.min(W,H)*.62;const earth=prop(sp,'🌍',W/2-es/2,H-es*.45,es);earth.style.zIndex=1;
      await sp.animate([{opacity:0},{opacity:1}],{duration:500,fill:'forwards'}).finished;
      earth.animate([{transform:'rotate(0)'},{transform:'rotate(30deg)'}],{duration:7000,fill:'forwards'});
      const craft=document.createElement('div');craft.className='craft';craft.innerHTML='<span class="cr">🚀</span><span class="cf">🔥</span><div class="ball mini"></div>';sp.appendChild(craft);
      const cx=W/2,cy=H-es*.45+es*.5,rx=W*.4,ry=Math.max(120,cy-H*.2),a0=172,a1=72;
      const pos=d=>{const q=d*Math.PI/180;return{x:cx+rx*Math.cos(q),y:cy-ry*Math.sin(q),rot:Math.atan2(ry*Math.cos(q),rx*Math.sin(q))*180/Math.PI+45}};
      const kf=[];for(let i=0;i<=40;i++){const p=pos(a0+(a1-a0)*i/40);kf.push({transform:`translate(${p.x-30}px,${p.y-30}px) rotate(${p.rot}deg)`})}
      SFX.whoosh();await craft.animate(kf,{duration:3200,easing:'ease-in-out',fill:'forwards'}).finished;
      // release the problem…
      const mb=craft.querySelector('.ball');const br=mb.getBoundingClientRect(),sr=sp.getBoundingClientRect();const ex=br.left-sr.left+br.width/2,ey=br.top-sr.top+br.height/2;mb.remove();
      const fb=document.createElement('div');fb.className='ball mini';fb.style.left=(ex-13)+'px';fb.style.top=(ey-13)+'px';sp.appendChild(fb);
      const lp=pos(a1);craft.animate([{transform:`translate(${lp.x-30}px,${lp.y-30}px) rotate(${lp.rot}deg)`},{transform:`translate(${W+140}px,${lp.y-200}px) rotate(${lp.rot-25}deg)`}],{duration:1000,easing:'ease-in',fill:'forwards'});
      for(let i=0;i<6;i++)tone(400+i*120,400+i*120,.08,{type:'square',g:.05,delay:i*.14});
      await fb.animate([{transform:'translate(0,0) scale(1)'},{transform:'translate(-25px,-35px) scale(1.3)',filter:'brightness(1.3)'},{transform:'translate(-30px,-40px) scale(1.7)',filter:'brightness(2) drop-shadow(0 0 14px #ff5a36)'}],{duration:1000,easing:'ease-out',fill:'forwards'}).finished;
      // …and BOOM
      fb.remove();const X=ex-30,Y=ey-40;SFX.bigboom();buzz([80,40,300,40,120]);flash();
      const fl=document.createElement('div');fl.className='boomflash';fl.style.left=X+'px';fl.style.top=Y+'px';sp.appendChild(fl);
      fl.animate([{transform:'translate(-50%,-50%) scale(.1)',opacity:1},{transform:'translate(-50%,-50%) scale(5)',opacity:0}],{duration:1000,easing:'ease-out',fill:'forwards'});
      const ring=document.createElement('div');ring.className='shock';ring.style.left=X+'px';ring.style.top=Y+'px';sp.appendChild(ring);
      ring.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:'translate(-50%,-50%) scale(7)',opacity:0}],{duration:1200,easing:'ease-out',fill:'forwards'});
      for(let i=0;i<70;i++){const p=document.createElement('i');p.className='frag';p.style.background=pick([P.a1,P.a3,'#fff',P.a4,'#ffd27a','#ff5a36']);p.style.left=X+'px';p.style.top=Y+'px';const s=rnd(3,9);p.style.width=p.style.height=s+'px';sp.appendChild(p);
        const a=rnd(0,6.28),d=rnd(60,Math.min(W,H)*.65);p.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px)`,opacity:0}],{duration:rnd(900,1900),easing:'cubic-bezier(.1,.7,.3,1)',fill:'forwards'})}
      for(let i=0;i<10;i++){const p=prop(sp,pick(['📄','✨','💥','📄']),X-12,Y-12,rnd(16,30));const a=rnd(0,6.28),d=rnd(80,220);p.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) rotate(${rnd(-540,540)}deg)`,opacity:0}],{duration:1700,easing:'ease-out',fill:'forwards'})}
      const bm=prop(sp,'BOOM!',X-70,Y-30,null);bm.className='prop boomTxt';bm.animate([{transform:'scale(.2) rotate(-15deg)',opacity:0},{transform:'scale(1.3) rotate(6deg)',opacity:1,offset:.3},{transform:'scale(1) rotate(-4deg)',opacity:1,offset:.7},{transform:'scale(1.1)',opacity:0}],{duration:1800,fill:'forwards'});
      st.animate([{transform:'translate(0,0)'},{transform:'translate(-8px,5px)'},{transform:'translate(7px,-6px)'},{transform:'translate(-5px,3px)'},{transform:'translate(0,0)'}],{duration:450});
      await wait(2000)}
    else{const goat=prop(st,'🐐',W+20,by-50,96);await goat.animate([{transform:'translateX(0)'},{transform:`translateX(${-(W+20-(bx+40))}px)`}],{duration:1300,easing:'ease-out',fill:'forwards'}).finished;
      const gx=-(W+20-(bx+40));for(let i=1;i<=3;i++){const b=bubble(st,'NOM!',bx-20,by-110);SFX.nom();buzz(40);
        goat.animate([{transform:`translateX(${gx}px)`},{transform:`translateX(${gx-14}px) rotate(-8deg)`},{transform:`translateX(${gx}px)`}],{duration:280});
        await ball.animate([{transform:`scale(${1-(i-1)/3})`},{transform:`scale(${1-i/3})`}],{duration:280,fill:'forwards'}).finished;b.remove();await wait(220)}
      ball.remove();const bp=bubble(st,'*BURP*',bx+10,by-120);SFX.burp();buzz(200);await wait(900);bp.remove();
      // --- the spectacular poop ---
      await goat.animate([{transform:`translateX(${gx}px)`},{transform:`translateX(${gx}px) scaleX(-1)`}],{duration:300,fill:'forwards'}).finished;
      const gL=bx+40,feet=by+46,ps=Math.min(120,W*.3);
      const hb=bubble(st,'😣 hnnngh…',gL,by-112);SFX.grunt();buzz([30,30,30,30,30,30,30,30]);
      await goat.animate(Array.from({length:14},(_,i)=>({transform:`translateX(${gx+(i%2?3:-3)}px) scaleX(-1) scaleY(${i%2?.93:1})`})),{duration:1500}).finished;hb.remove();
      for(let i=0;i<12;i++)tone(170,160,.05,{type:'square',g:.06,delay:i*.055});await wait(700);
      const poo=prop(st,'💩',gL-ps*.85,feet-ps,ps);poo.classList.add('poo');SFX.plop();buzz([60,40,160]);
      poo.animate([{transform:`translate(${ps*.6}px,${-ps*.3}px) scale(.12)`},{transform:'translate(0,0) scale(1.25,.8)',offset:.55},{transform:'scale(.9,1.12)',offset:.75},{transform:'scale(1)'}],{duration:800,easing:'ease-out',fill:'forwards'});
      goat.animate([{transform:`translateX(${gx}px) scaleX(-1)`},{transform:`translateX(${gx+10}px) translateY(-14px) scaleX(-1)`},{transform:`translateX(${gx}px) scaleX(-1)`}],{duration:420});
      await wait(700);
      const pc={x:gL-ps*.85+ps/2,y:feet-ps/2};
      for(let i=0;i<18;i++){const s=prop(st,pick(['✨','⭐','🌈','✨']),pc.x-12,pc.y-12,rnd(16,28));const a=rnd(0,6.28),d=rnd(60,150);s.animate([{transform:'translate(0,0) scale(.3)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(1)`,opacity:0}],{duration:1200,easing:'ease-out',fill:'forwards'})}
      SFX.fanfare();
      const crown=prop(st,'👑',pc.x-22,feet-ps-34,44);crown.animate([{transform:'translateY(-220px) rotate(-30deg)'},{transform:'translateY(0) rotate(8deg)',offset:.8},{transform:'translateY(0) rotate(0)'}],{duration:900,easing:'ease-in',fill:'forwards'});
      SFX.fly();
      for(let i=0;i<3;i++){const fy=prop(st,'🪰',pc.x-10,pc.y-ps*.55,18);const R=rnd(48,72),ph=rnd(0,6.28),dir=i%2?1:-1;const kf=[];for(let k=0;k<=24;k++){const a=ph+dir*k/24*6.283;kf.push({transform:`translate(${Math.cos(a)*R}px,${Math.sin(a)*R*.5}px)`})}fy.animate(kf,{duration:rnd(1100,1600),iterations:3})}
      for(let i=0;i<3;i++){const s=prop(st,'💨',pc.x-14+(i-1)*26,feet-ps-6,22);s.style.opacity=0;s.animate([{transform:'translateY(0)',opacity:0},{opacity:.85,offset:.3},{transform:'translateY(-70px)',opacity:0}],{duration:1600,delay:i*260,iterations:2})}
      await wait(1100);
      await goat.animate([{transform:`translateX(${gx}px) scaleX(-1)`},{transform:`translateX(${W}px) scaleX(-1)`}],{duration:1300,easing:'ease-in',fill:'forwards'}).finished;
      await wait(1300)}
    // done
    $('#crText').value='';voice=null;voiceDur=0;$('#crVoice').hidden=true;
    st.innerHTML=`<div class="stageMsg" style="top:30%"><div style="font-size:64px">✨</div>${t('gone')}</div><div class="dest" style="grid-template-columns:1fr"><button class="btn hot" id="crAgain">${t('again')}</button></div>`;
    SFX.chime(880);$('#crAgain').onclick=reset;busy=false;comment('crush',1,true)}
  function reset(){poke();$('#crStage').hidden=true;$('#crStage').innerHTML='';$('#crIn').hidden=false;busy=false}
  let bound=false;
  return{start(){if(!bound){bound=true;$('#crMic').onclick=micClick;$('#crGo').onclick=crumple;$('#crVoiceX').onclick=()=>{voice=null;$('#crVoice').hidden=true};$('#crText').addEventListener('input',poke)}if(!busy)reset();ui(false)},
    stop(){stopRec()},mic(){if(!rec&&!mr)$('#crMic').textContent=t('speak')}}})();

/* ================= INSULT GENERATOR – 400 combinations per language, never repeated in one session ================= */
const Insult=TOOLS.insult=(()=>{let txt='',bound=false,deck=[],lang=null,prev=null,ends=[];
  function build(){const p=INS[S.lang]||INS.en;deck=[];for(let i=0;i<p.a.length;i++)for(let j=0;j<p.n.length;j++)deck.push([i,j]);shuffle(deck);lang=S.lang;ends=[];prev=null}
  function next(){if(lang!==S.lang||!deck.length)build();const p=INS[S.lang]||INS.en;let k=deck.length-1;
    if(prev)for(let m=deck.length-1;m>=Math.max(0,deck.length-20);m--){if(deck[m][0]!==prev[0]&&deck[m][1]!==prev[1]){k=m;break}}
    const [i,j]=deck.splice(k,1)[0];prev=[i,j];if(!ends.length)ends=shuffle([...p.s.keys()]);return p.f(p.a[i],p.n[j],p.s[ends.pop()])}
  function gen(){txt=next();const e=$('#insTxt');e.textContent=txt;e.animate([{transform:'scale(.6) rotate(-5deg)',opacity:0},{transform:'scale(1.08) rotate(1deg)',opacity:1},{transform:'scale(1)'}],{duration:420,easing:'ease-out'});SFX.pop();poke();comment('insult',.4)}
  /* user shouts the insult; voice tension meter */
  let stream=null,an=null,buf=null,listening=false,raf=0,samples=[],voiced=false,quietT=0,t0=0,lastF=0,best=0;
  async function shout(){poke();if(listening)return finish();try{rawAC()}catch(e){}
    try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});const A=rawAC();const src=A.createMediaStreamSource(stream);an=A.createAnalyser();an.fftSize=1024;buf=new Float32Array(an.fftSize);src.connect(an)}
    catch(e){toast(t('micDenied').split('–')[0]);return}
    listening=true;samples=[];voiced=false;quietT=0;t0=lastF=performance.now();
    const b=$('#insSay');b.textContent=t('shoutNow');b.classList.add('hot');$('#insMeter').hidden=false;$('#insLbl').textContent='';raf=requestAnimationFrame(loop)}
  function lvl(){an.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];const db=20*Math.log10(Math.sqrt(s/buf.length)+1e-7);return Math.max(0,Math.min(1,(db+52)/44))}
  function loop(now){if(!listening)return;const dt=(now-lastF)/1000;lastF=now;const v=lvl();samples.push(v);if(v>.38){voiced=true;poke()}
    if(voiced&&v<.25)quietT+=dt;else quietT=0;
    const p=Math.round(v*100);$('#insBar').style.width=p+'%';$('#insPct').textContent=p+'%';
    $('#insTxt').style.transform=`scale(${1+v*.18}) rotate(${(Math.random()-.5)*v*7}deg)`;
    if((voiced&&quietT>1.1)||now-t0>7000)return finish();raf=requestAnimationFrame(loop)}
  function release(){if(stream){stream.getTracks().forEach(x=>x.stop());stream=null}an=null}
  function finish(){listening=false;cancelAnimationFrame(raf);release();$('#insTxt').style.transform='';const b=$('#insSay');b.textContent=t('insShout');b.classList.remove('hot');
    const s=samples.sort((x,y)=>y-x),peak=s[0]||0,top=s.slice(0,Math.max(1,s.length/4|0)),avg=top.reduce((x,y)=>x+y,0)/top.length;
    const score=voiced?Math.round(100*Math.min(1,.65*peak+.35*avg)):Math.round(peak*60);best=Math.max(best,score);
    $('#insBar').style.width=score+'%';$('#insPct').textContent=score+'%';$('#insLbl').textContent=`${t('tl')[Math.min(4,score/20|0)]} · ${t('peak')}: ${best}%`;
    if(score>=70){SFX.fanfare();buzz([60,30,120]);flash()}else SFX.pop();
    if(S.comments){const mode=S.mean?'mean':'nice',m=comDraw(mode,score<40?'shoutLow':score<70?'shoutMid':'shoutHigh');if(m){lastCom=Date.now();showCom(m,mode)}}}
  function copy(){poke();(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast(t('copied'))).catch(()=>{})}
  return{start(){if(!bound){bound=true;$('#insNew').onclick=gen;$('#insSay').onclick=shout;$('#insCopy').onclick=copy}$('#insSay').hidden=!navigator.mediaDevices;$('#insMeter').hidden=true;gen()},stop(){if(listening){listening=false;cancelAnimationFrame(raf);$('#insTxt').style.transform='';$('#insSay').classList.remove('hot');$('#insSay').textContent=t('insShout')}release()}}})();

/* ================= VOLCANO ================= */
const Volcano=TOOLS.volcano=(()=>{let cv,g,run=false,raf,last,pr=0,parts=[],smoke=[],n=0,shakeV=0;
  const TYPES=['lava','confetti','cats','unicorns','brains','lava'];
  function erupt(){const kind=pick(TYPES);const cx=g.w/2,cy=g.h-16-Math.min(g.h*.42,300);
    for(let i=0;i<(kind==='lava'||kind==='confetti'?150:45);i++){const p={x:cx+rnd(-20,20),y:cy,vx:rnd(-330,330),vy:-rnd(650,1250),r:rnd(0,6),vr:rnd(-8,8),life:rnd(2.5,4),k:kind};
      if(kind==='lava'){p.s=rnd(4,11);p.c=pick([P.a1,P.a3,'#ff3b1f','#ffd27a'])}else if(kind==='confetti'){p.s=rnd(6,12);p.c=pick([P.a1,P.a2,P.a3,P.a4,'#fff'])}else{p.s=rnd(22,36);p.e={cats:'🐱',unicorns:'🦄',brains:'🧠'}[kind]}parts.push(p)}
    pr=0;shakeV=1;n++;$('#volN').textContent=n;SFX.boom();buzz([100,40,250]);flash();comment('volcano',1,true)}
  function add(v){if(pr<70&&pr+v>=70)comment('volcano',.4);pr=Math.min(100,pr+v);if(pr>=100)erupt();else if(Math.random()<.3)tone(80+pr*2,60+pr*2,.12,{type:'triangle',g:.08})}
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

/* ================= PUNCHING BAG – every hit leaves a mark, the bag slowly falls apart ================= */
function shade(hex,amt){let h=hex.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);let r=n>>16,g=n>>8&255,b=n&255;const tg=amt<0?0:255,k=Math.abs(amt);r=Math.round(r+(tg-r)*k);g=Math.round(g+(tg-g)*k);b=Math.round(b+(tg-b)*k);return`rgb(${r},${g},${b})`}
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
const Bag=TOOLS.bag=(()=>{let cv,g,run=false,raf,last,th=0,om=0,sq=0,hits=0,recent=[],parts=[],pile=[],tex=null,tc=null,G=null,dmg=0,tears=[],leak=null,snapped=false,fallen=null,drop=0,stuffing=false;
  const DPR=2;
  function geo(){const L=g.h*.15,bw=Math.min(130,g.w*.34),bh=Math.min(g.h*.52,270);return{px:g.w/2,py:8,L,bw,bh}}
  function newBag(){G=geo();tex=document.createElement('canvas');tex.width=G.bw*DPR;tex.height=G.bh*DPR;tc=tex.getContext('2d');tc.scale(DPR,DPR);
    const w=G.bw,h=G.bh,c=tc;c.save();rrect(c,0,0,w,h,w*.35);c.clip();const gr=c.createLinearGradient(0,0,w,0);gr.addColorStop(0,shade(P.a1,-.25));gr.addColorStop(.42,shade(P.a1,.15));gr.addColorStop(1,shade(P.a1,-.42));c.fillStyle=gr;c.fillRect(0,0,w,h);
    for(let i=0;i<160;i++){c.fillStyle=`rgba(0,0,0,${rnd(.03,.08)})`;c.beginPath();c.arc(rnd(0,w),rnd(0,h),rnd(.5,1.6),0,7);c.fill()}
    c.strokeStyle='rgba(255,255,255,.35)';c.setLineDash([5,5]);c.lineWidth=1.5;[w*.16,w*.84].forEach(x=>{c.beginPath();c.moveTo(x,10);c.lineTo(x,h-10);c.stroke()});c.setLineDash([]);
    c.fillStyle=P.a3;c.fillRect(0,h*.1,w,12);c.fillRect(0,h*.84,w,12);c.restore();
    dmg=0;tears=[];leak=null;snapped=false;fallen=null;stuffing=false;th=0;om=0;drop=1}
  function local2world(lx,ly){const y=ly+G.L+G.bh/2,ct=Math.cos(th),s=Math.sin(th);return{x:G.px+lx*ct+y*s,y:G.py-drop*(G.L+G.bh)+(-lx*s+y*ct)}}
  function stamp(x,y){const c=tc,k=Math.min(1,.45+dmg/70);c.save();c.globalCompositeOperation='source-atop';const r=rnd(9,16);
    const gr=c.createRadialGradient(x,y,1,x,y,r);gr.addColorStop(0,`rgba(40,8,8,${.55*k})`);gr.addColorStop(.7,`rgba(60,18,18,${.28*k})`);gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.beginPath();c.arc(x,y,r,0,7);c.fill();
    c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=1.5;c.beginPath();c.arc(x,y,r*.7,3.6,5.2);c.stroke();
    c.strokeStyle=`rgba(30,8,8,${.4*k})`;c.lineWidth=1;for(let i=0;i<3;i++){const a=rnd(0,6.28),l=rnd(4,11);c.beginPath();c.moveTo(x+rnd(-4,4),y+rnd(-4,4));c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}
    c.fillStyle='rgba(35,15,10,.014)';c.fillRect(0,0,G.bw,G.bh);c.restore()}
  function tear(x,y,len,ang){const c=tc;c.save();c.globalCompositeOperation='source-atop';c.translate(x,y);c.rotate(ang);const N=12,top=[],bot=[];
    for(let i=0;i<=N;i++){const px=-len/2+len*i/N,e=Math.sin(i/N*Math.PI);top.push([px,-(2+rnd(2,len*.13)*e)]);bot.push([px,2+rnd(2,len*.13)*e])}
    c.beginPath();top.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));bot.reverse().forEach(p=>c.lineTo(p[0],p[1]));c.closePath();
    c.fillStyle='#efe3c8';c.fill();c.strokeStyle='rgba(25,6,6,.85)';c.lineWidth=2.2;c.stroke();
    c.strokeStyle='#fffaf0';c.lineWidth=1;for(let i=0;i<10;i++){const px=rnd(-len/2.3,len/2.3);c.beginPath();c.moveTo(px,0);c.quadraticCurveTo(px+rnd(-5,5),rnd(-6,6),px+rnd(-6,6),rnd(-9,9));c.stroke()}
    c.restore();const t={x,y,len,ang};tears.push(t);return t}
  function tape(t){const c=tc;c.save();c.globalCompositeOperation='source-atop';c.translate(t.x,t.y);[.55,-.55].forEach(a=>{c.save();c.rotate(t.ang+a);c.fillStyle='rgba(165,170,182,.95)';c.fillRect(-t.len*.62,-7,t.len*1.24,14);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;for(let i=-t.len*.6;i<t.len*.6;i+=4){c.beginPath();c.moveTo(i,-7);c.lineTo(i+2,7);c.stroke()}c.restore()});c.restore()}
  function spot(){return{x:rnd(G.bw*.22,G.bw*.78),y:rnd(G.bh*.22,G.bh*.78)}}
  function milestone(){const big=()=>{comment('bag',1,true);buzz([50,30,90])};
    if(dmg===15){const p=spot();tear(p.x,p.y,G.bw*.32,rnd(-.6,.6));SFX.rip();big()}
    else if(dmg===28){tape(tears[0]);SFX.rip();big()}
    else if(dmg===40){const p=spot();const t=tear(p.x,p.y,G.bw*.38,rnd(-.7,.7));leak={x:t.x,y:t.y};SFX.rip();SFX.sand();big()}
    else if(dmg===55){tear(G.bw*.84,G.bh*.5,G.bh*.42,Math.PI/2);stuffing=true;SFX.rip();big()}
    else if(dmg===66){if(tears[1])tape(tears[1]);const p=spot();tear(p.x,p.y,G.bw*.3,rnd(-.6,.6));SFX.rip()}
    else if(dmg===80){snapped=true;om+=2.2;SFX.snap();big()}
    else if(dmg===95){const ct=Math.cos(th),s=Math.sin(th),d=G.L+G.bh/2;fallen={x:G.px+d*s,y:G.py+d*ct,vx:Math.max(-120,Math.min(120,om*40)),vy:0,rot:-th,vr:rnd(-4,4),landed:false,t:0};SFX.snap();big()}}
  function tap(x,y){if(fallen||drop>.05||!G)return;const dx=x-G.px,dy=y-G.py,ct=Math.cos(th),s=Math.sin(th);let lx=dx*ct-dy*s,ly=dx*s+dy*ct-(G.L+G.bh/2);
    const dir=lx<0?1:-1;lx=Math.max(-G.bw/2+8,Math.min(G.bw/2-8,lx));ly=Math.max(-G.bh/2+8,Math.min(G.bh/2-8,ly));
    om=Math.max(-3,Math.min(3,om+dir*rnd(1.3,2)));sq=1;hits++;dmg++;$('#bagN').textContent=hits;recent.push(performance.now());stamp(lx+G.bw/2,ly+G.bh/2);
    const w=local2world(lx,ly);parts.push({k:'ring',x:w.x,y:w.y,r:6,life:.35});for(let i=0;i<6;i++)parts.push({k:'star',x:w.x,y:w.y,vx:rnd(-170,170),vy:rnd(-230,-40),life:.7,c:pick([P.a3,'#fff',P.a2])});
    for(let i=0;i<4;i++)parts.push({k:'dust',x:w.x,y:w.y,vx:rnd(-60,60),vy:rnd(-60,20),r:rnd(5,10),life:rnd(.5,.9)});
    if(stuffing&&Math.random()<.6)parts.push({k:'fluff',x:w.x,y:w.y,vx:rnd(-160,160),vy:rnd(-220,-60),r:rnd(4,7),life:1.8});
    if(leak)for(let i=0;i<8;i++){const p=local2world(leak.x-G.bw/2,leak.y-G.bh/2);parts.push({k:'sand',x:p.x,y:p.y,vx:rnd(-50,50),vy:rnd(-20,40),life:3})}
    SFX.punch();buzz(25);milestone();if(!fallen)comment('bag',.25)}
  function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;const c=g.c,fy=g.h-16;
    const tilt=snapped?.3:0;om+=(-18*Math.sin(th-tilt)-1.1*om)*dt;th+=om*dt;if(Math.abs(th-tilt)>.55){th=tilt+Math.sign(th-tilt)*.55;om*=-.4}
    sq*=Math.pow(.02,dt);drop=Math.max(0,drop-dt*1.6);recent=recent.filter(x=>now-x<2000);$('#bagP').textContent=Math.min(100,recent.length*12)+'%';
    if(leak&&!fallen&&Math.random()<dt*14){const p=local2world(leak.x-G.bw/2,leak.y-G.bh/2);parts.push({k:'sand',x:p.x,y:p.y,vx:rnd(-15,15),vy:rnd(0,30),life:3})}
    c.clearRect(0,0,g.w,g.h);c.fillStyle=P.line;c.fillRect(0,fy,g.w,16);c.fillStyle=P.card;c.fillRect(G.px-40,0,80,10);
    // sand pile
    pile.forEach(p=>{c.fillStyle='#cdb27a';c.beginPath();c.ellipse(p.x,fy,p.w,p.h,0,Math.PI,0);c.fill()});
    if(!fallen){const off=drop*(G.L+G.bh);c.save();c.translate(G.px,G.py-off);c.rotate(-th);c.strokeStyle='#9a92a8';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(-G.bw*.3,G.L);if(!snapped){c.moveTo(0,0);c.lineTo(G.bw*.3,G.L)}c.stroke();
      c.translate(0,G.L+G.bh/2);c.scale(1+sq*.1,1-sq*.07);c.drawImage(tex,-G.bw/2,-G.bh/2,G.bw,G.bh);c.restore();
      if(snapped){c.strokeStyle='#9a92a8';c.lineWidth=4;c.beginPath();c.moveTo(G.px,G.py);const sw=Math.sin(now/300)*.25;c.lineTo(G.px+Math.sin(sw)*G.L*.55,G.py+Math.cos(sw)*G.L*.55);c.stroke()}}
    else{const f=fallen;f.t+=dt;if(!f.landed){f.vy+=1500*dt;f.x=Math.max(G.bh/2,Math.min(g.w-G.bh/2,f.x+f.vx*dt));f.y+=f.vy*dt;f.rot+=f.vr*dt;if(f.y>fy-G.bw/2){f.y=fy-G.bw/2;f.landed=true;f.rot=Math.PI/2*(f.vr>0?1:-1);SFX.thud();SFX.boom();buzz([120,50,200]);for(let i=0;i<20;i++)parts.push({k:'dust',x:f.x+rnd(-G.bh/2,G.bh/2),y:fy-8,vx:rnd(-120,120),vy:rnd(-90,-10),r:rnd(8,18),life:rnd(.8,1.4)});if(leak)pile.push({x:f.x+rnd(-30,30),w:rnd(20,40),h:rnd(6,12)})}}
      c.save();c.translate(f.x,f.y);c.rotate(f.rot);c.drawImage(tex,-G.bw/2,-G.bh/2,G.bw,G.bh);c.restore();
      if(f.t>2.8){newBag();toast('🥊 ✨')}}
    parts=parts.filter(p=>(p.life-=dt)>0);
    for(const p of parts){if(p.k==='ring'){p.r+=dt*160;c.globalAlpha=p.life*2.5;c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.stroke()}
      else if(p.k==='star'){p.vy+=500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;c.globalAlpha=p.life/.7;c.fillStyle=p.c;c.font='18px system-ui';c.fillText('✦',p.x,p.y)}
      else if(p.k==='dust'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=dt*14;c.globalAlpha=p.life*.4;c.fillStyle='#d8d0e0';c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.fill()}
      else if(p.k==='fluff'){p.vy+=700*dt;p.vx*=.98;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>fy-p.r){p.y=fy-p.r;p.vy=0;p.vx*=.8}c.globalAlpha=Math.min(1,p.life);c.fillStyle='#fff6e6';c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.arc(p.x+p.r*.7,p.y-p.r*.3,p.r*.7,0,6.283);c.fill()}
      else if(p.k==='sand'){p.vy+=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>=fy-1){p.life=0;let q=pile.find(z=>Math.abs(z.x-p.x)<30);if(!q){q={x:p.x,w:6,h:2};pile.push(q)}q.w=Math.min(70,q.w+.35);q.h=Math.min(22,q.h+.12)}c.globalAlpha=1;c.fillStyle='#d8c08a';c.fillRect(p.x,p.y,2,3)}}
    c.globalAlpha=1;raf=requestAnimationFrame(loop)}
  return{start(){cv=cv||$('#bagCv');if(!cv.bound){bindTap(cv,Bag);cv.bound=1}g=fit(cv);if(!tex)newBag();else G=geo();$('#bagN').textContent=hits;run=true;last=performance.now();raf=requestAnimationFrame(loop)},
    stop(){run=false;cancelAnimationFrame(raf)},tap,shake(){if(G)tap(G.px+rnd(-20,20),G.py+G.L+G.bh/2)},resize(){g=fit(cv);if(G){const o=G;G=geo();if(o.bw!==G.bw||o.bh!==G.bh){/* keep texture, scale on draw */}}}}})();

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
function showResult(a){const b=session.before;let msg,key='same';
  if(b==null){$('#resNums').innerHTML=`<span style="color:hsl(${170-(a-1)/9*170} 85% 62%)">${a}</span>`;msg=t('resOnly',a);key=a<=4?'down':a>=8?'up':'same'}
  else{const d=b-a;$('#resNums').innerHTML=`<span style="color:hsl(${170-(b-1)/9*170} 85% 62%)">${b}</span><span class="arr">→</span><span style="color:hsl(${170-(a-1)/9*170} 85% 62%)">${a}</span>`;
    msg=d>0?t('resDown',d):d===0?t('resSame'):t('resUp',-d);key=d>0?'down':d===0?'same':'up'}
  $('#resMsg').textContent=msg;const rc=$('#resCom');if(S.comments){rc.hidden=false;rc.className='resCom '+(S.mean?'mean':'nice');rc.innerHTML=`<span>${S.mean?'😈':'😇'}</span> `;rc.append(comDraw(S.mean?'mean':'nice',key)||'')}else rc.hidden=true;
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
$('#meanBtn').onclick=()=>{if(!S.mean&&!S.meanSeen){$('#modalTxt').textContent=t('meanWarn');$('#modal').hidden=false;return}S.mean=!S.mean;if(S.mean&&!S.comments){S.comments=true;$('#comT').checked=true}save();updMean();toast(t(S.mean?'meanOn':'meanOff'));if(S.mean)tone(140,70,.5,{type:'sawtooth',g:.12})};
$('#modalOk').onclick=()=>{$('#modal').hidden=true;S.meanSeen=true;S.mean=true;S.comments=true;$('#comT').checked=true;save();updMean();toast(t('meanOn'));tone(140,70,.5,{type:'sawtooth',g:.12})};
$('#modalNo').onclick=()=>{$('#modal').hidden=true};
$('#sndT').onchange=e=>{S.sound=e.target.checked;save()};
$('#vibT').onchange=e=>{S.vib=e.target.checked;save();if(S.vib)buzz(40)};
$('#comT').onchange=e=>{S.comments=e.target.checked;save()};
$('#shareBtn').onclick=async()=>{const url=location.href.split('#')[0];try{if(navigator.share){await navigator.share({title:'Honicorn',text:t('shareText'),url});return}}catch(e){if(e&&e.name==='AbortError')return}
  try{await navigator.clipboard.writeText(url);toast(t('linkCopied'))}catch(e){toast(url)}};

/* ================= INSTALL ================= */
let deferredPrompt=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isInApp=/FBAN|FBAV|FB_IAB|Instagram|Messenger|Line\/|; wv\)|TikTok|Snapchat/i.test(navigator.userAgent);
function updInstall(){const b=$('#installBtn');b.hidden=isStandalone();if(b.hidden)$('#installHint').hidden=true}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;updInstall()});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;updInstall();toast('✓ Honicorn')});
$('#installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch(e){}deferredPrompt=null;return}
  const h=$('#installHint');h.textContent=t(isInApp?'inAppHint':isIOS?'iosHint':'menuHint');h.hidden=false;h.animate([{opacity:0},{opacity:1}],{duration:300})};

/* ================= INIT ================= */
$('#sndT').checked=S.sound;$('#vibT').checked=S.vib;$('#comT').checked=S.comments;
applyPal();applyI18n();updMean();updChip();updInstall();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
