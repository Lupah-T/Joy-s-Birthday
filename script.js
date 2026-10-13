const sparkleLayer=document.getElementById('sparkles'), sparkleChars=['✦','✧','⋆','✨','·'];
for(let i=0;i<42;i++){const s=document.createElement('span');s.className='spark';s.textContent=sparkleChars[Math.floor(Math.random()*sparkleChars.length)];s.style.left=Math.random()*100+'%';s.style.animationDuration=(9+Math.random()*13)+'s';s.style.animationDelay=(-Math.random()*20)+'s';s.style.fontSize=(10+Math.random()*17)+'px';sparkleLayer.appendChild(s)}

// Sound opt-in toggle
const soundToggle=document.getElementById('soundToggle');let soundEnabled=false;
if(soundToggle){soundToggle.addEventListener('click',()=>{soundEnabled=!soundEnabled;soundToggle.textContent=soundEnabled? 'Disable sound effects 🔕':'Enable sound effects 🔔';soundToggle.setAttribute('aria-pressed', String(soundEnabled));});}

function playChime(){if(!soundEnabled) return;try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o1=ctx.createOscillator();const o2=ctx.createOscillator();const g=ctx.createGain();o1.type='sine';o2.type='triangle';o1.frequency.setValueAtTime(880,ctx.currentTime);o2.frequency.setValueAtTime(1320,ctx.currentTime);g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(0.12,ctx.currentTime+0.01);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.9);o1.connect(g);o2.connect(g);g.connect(ctx.destination);o1.start();o2.start();o1.stop(ctx.currentTime+0.9);o2.stop(ctx.currentTime+0.9);}catch(e){/* ignore audio errors */}}

const gifts={
 headphones:{emoji:'🎧',title:'HEADPHONES!',message:'Your very own headphones! 🎶 Enjoy your favourite songs and have your own little world — especially when the rest of us get too loud. 😂💗'},
 chicken:{emoji:'🍗',title:'CHICKEN TREAT!',message:'A chicken treat just for you! 🍗 Because a birthday without delicious food would be a crime. Today, the firstborn gets served!'},
 pizza:{emoji:'🍕',title:'PIZZA TIME!',message:'PIZZA IS YOURS! 🍕 Extra cheese, extra happiness, and absolutely no sharing unless you feel generous. We know food makes you smile!'},
 hoodie:{emoji:'🧥',title:'COZY HOODIE!',message:'I now owe you a hoodie.The colour will be your choice!!! :)'}};
const boxes=[...document.querySelectorAll('.gift-box')],result=document.getElementById('result');
const resultEmoji=document.getElementById('resultEmoji'),resultTitle=document.getElementById('resultTitle'),resultMessage=document.getElementById('resultMessage'),resultNote=document.getElementById('resultNote');
function burstConfetti(){const pieces=['✨','💖','🎉','⭐','💕','✦'];for(let i=0;i<55;i++){const el=document.createElement('span');el.className='confetti';el.textContent=pieces[Math.floor(Math.random()*pieces.length)];el.style.left=Math.random()*100+'vw';el.style.fontSize=(12+Math.random()*18)+'px';el.style.animationDuration=(1.6+Math.random()*1.7)+'s';el.style.animationDelay=(Math.random()*.35)+'s';document.body.appendChild(el);setTimeout(()=>el.remove(),3800)} }
let gamePlayed=false;
function reveal(box){
 if(gamePlayed) return; // only allow one box to be played
 gamePlayed=true;
 const gift=gifts[box.dataset.gift];
 // selected box: show full reveal
 box.dataset.revealed='true';box.classList.add('opened');box.querySelector('.box-emoji').textContent=gift.emoji;box.querySelector('.box-label').textContent='REVEALED!';box.querySelector('.box-hint').textContent='';
 resultEmoji.textContent=gift.emoji;resultTitle.textContent=gift.title;resultMessage.textContent=gift.message;resultNote.textContent='Birthday promise sealed with love. 💖';result.classList.add('show');
 playChime();
 burstConfetti();
 // reveal others as expired (no confetti)
 boxes.forEach(b=>{if(b===box) return; const g=gifts[b.dataset.gift]; b.dataset.revealed='expired'; b.classList.add('expired'); const emojiEl=b.querySelector('.box-emoji'); const labelEl=b.querySelector('.box-label'); const hintEl=b.querySelector('.box-hint'); if(emojiEl) emojiEl.textContent=g.emoji; if(labelEl) labelEl.textContent='EXPIRED'; if(hintEl) hintEl.textContent='Not available'; b.setAttribute('aria-disabled','true'); });
}
boxes.forEach(box=>box.addEventListener('click',()=>reveal(box)));

// ---- Cake interaction: blow-to-celebrate (number candles 2 & 3) ----
const cakeEl=document.getElementById('cake');
const candlesEl=document.getElementById('candles');
const blowBtn=document.getElementById('blowBtn');
const micToggle=document.getElementById('micToggle');
let micStream=null;let micListening=false;let cakeBlown=false;
const BLOW_THRESHOLD=90;
const BLOW_COOLDOWN_MS=400;
let lastBlowAt=0;

function createFireworks(){const colors=['#FFD166','#FFB6D9','#9B5CFF','#E83EAE','#FFF'];for(let i=0;i<24;i++){const f=document.createElement('span');f.className='firework';f.style.left=(30+Math.random()*40)+'%';f.style.top=(20+Math.random()*40)+'%';f.style.color=colors[Math.floor(Math.random()*colors.length)];f.textContent=['✨','💥','🎇','🌟'][Math.floor(Math.random()*4)];f.style.fontSize=(12+Math.random()*28)+'px';document.body.appendChild(f);f.animate([{opacity:1,transform:'scale(.2) translateY(0)'},{opacity:0,transform:'scale(1.2) translateY(-60px)'}],{duration:1200+Math.random()*600,easing:'cubic-bezier(.2,.8,.2,1)'});setTimeout(()=>f.remove(),1700)} }

function createEmojiBlast(){const emojis=['🎉','🥳','💖','✨','🎊','💐'];for(let i=0;i<36;i++){const e=document.createElement('span');e.className='firework';e.textContent=emojis[Math.floor(Math.random()*emojis.length)];e.style.left=(40+Math.random()*30)+'%';e.style.top=(30+Math.random()*40)+'%';e.style.fontSize=(18+Math.random()*36)+'px';document.body.appendChild(e);e.animate([{opacity:1,transform:'translateY(0) scale(.6)'},{opacity:0,transform:'translateY(-120px) scale(1.4)'}],{duration:900+Math.random()*800,easing:'cubic-bezier(.2,.8,.2,1)'});setTimeout(()=>e.remove(),1700)} }

function playCheer(){if(!soundEnabled) return;try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const now=ctx.currentTime;const base=ctx.createOscillator();const g=ctx.createGain();base.type='sawtooth';base.frequency.setValueAtTime(440,now);g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(0.14,now+0.02);g.gain.exponentialRampToValueAtTime(0.001,now+1.2);base.connect(g);g.connect(ctx.destination);base.start(now);base.stop(now+1.2);const bufferSize=ctx.sampleRate*0.6;const buffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++){data[i]=(Math.random()*2-1)*Math.exp(-i/bufferSize*3);}const noise=ctx.createBufferSource();noise.buffer=buffer;const ng=ctx.createGain();ng.gain.setValueAtTime(0.5,now);ng.gain.exponentialRampToValueAtTime(0.001,now+0.9);noise.connect(ng);ng.connect(ctx.destination);noise.start(now);noise.stop(now+0.9);}catch(e){/* audio fail silently */}}

function extinguishCandles(){if(cakeBlown) return; cakeBlown=true; const candleItems=document.querySelectorAll('.candle'); candleItems.forEach(c=>c.classList.add('blown')); const scene=document.getElementById('cakeScene'); if(scene) scene.classList.add('blown');
 createFireworks(); createEmojiBlast(); burstConfetti(); playCheer(); resultTitle.textContent='Happy 23rd, Joy! 🎉'; resultEmoji.textContent='🎂'; resultMessage.textContent='Candles blown — time for cheers, hugs, and cake!'; result.classList.add('show'); }

if(blowBtn){blowBtn.addEventListener('click',()=>{extinguishCandles();});}

if(micToggle){micToggle.addEventListener('click',async()=>{if(!micListening){try{const s=await navigator.mediaDevices.getUserMedia({audio:true});micStream=s;const ctx=new (window.AudioContext||window.webkitAudioContext)();const src=ctx.createMediaStreamSource(s);const analyser=ctx.createAnalyser();analyser.fftSize=512;src.connect(analyser);const data=new Uint8Array(analyser.frequencyBinCount);micListening=true;micToggle.textContent='Stop Microphone';micToggle.setAttribute('aria-pressed','true');const check=()=>{analyser.getByteFrequencyData(data);let sum=0;for(let i=0;i<data.length;i++)sum+=data[i];const avg=sum/data.length;const now=Date.now();if(avg>BLOW_THRESHOLD && now-lastBlowAt>BLOW_COOLDOWN_MS){lastBlowAt=now;extinguishCandles();} if(micListening) requestAnimationFrame(check);};check();}catch(e){alert('Unable to access microphone.');}}else{micListening=false;micToggle.textContent='Use Microphone to Blow 🎤';micToggle.setAttribute('aria-pressed','false'); if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}}});}
