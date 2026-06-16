(() => {
'use strict';
const root=document.documentElement,body=document.body;
const systemReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionModes=['full','system','reduced'];
let motionMode=localStorage.getItem('eb-motion')||'full';
if(!motionModes.includes(motionMode))motionMode='full';
root.dataset.motion=motionMode;
const reduced=motionMode==='reduced'||(motionMode==='system'&&systemReduced);
const themes=['ocean','nebula','emerald','sunset','gold','silver'];
const colors={ocean:'#040711',nebula:'#090510',emerald:'#03100d',sunset:'#110604',gold:'#0f0c05',silver:'#080a0f'};
const metaTheme=document.querySelector('meta[name="theme-color"]');
const logoSource=theme=>`assets/logo-${theme}.svg`;
function syncThemeAssets(theme){const src=logoSource(theme);document.querySelectorAll('[data-theme-logo]').forEach(img=>{if(img.getAttribute('src')!==src)img.setAttribute('src',src)});document.querySelector('link[rel~="icon"]')?.setAttribute('href',src)}
function setTheme(theme,persist=true){const safe=themes.includes(theme)?theme:'ocean';root.dataset.theme=safe;document.querySelectorAll('[data-theme-value]').forEach(b=>b.classList.toggle('is-active',b.dataset.themeValue===safe));metaTheme?.setAttribute('content',colors[safe]);syncThemeAssets(safe);if(persist)localStorage.setItem('eb-theme',safe);window.dispatchEvent(new CustomEvent('themechange'))}
setTheme(localStorage.getItem('eb-theme')||'ocean',false);
function syncMotionUI(){document.querySelectorAll('[data-motion-value]').forEach(b=>b.classList.toggle('is-active',b.dataset.motionValue===motionMode));const status=document.querySelector('[data-motion-status]');if(status)status.textContent=motionMode==='full'?'TAM':motionMode==='system'?'SİSTEM':'AZALTILMIŞ'}
function setMotion(mode){const safe=motionModes.includes(mode)?mode:'full';if(safe===motionMode){syncMotionUI();return}localStorage.setItem('eb-motion',safe);root.dataset.motion=safe;location.reload()}
syncMotionUI();
const intro=document.getElementById('intro');
if(intro){body.classList.add('no-scroll');setTimeout(()=>{intro.classList.add('is-hidden');body.classList.remove('no-scroll');setTimeout(()=>intro.remove(),800)},reduced?250:1900)}
const header=document.querySelector('.site-header'),progress=document.querySelector('.scroll-progress span'),navLinks=[...document.querySelectorAll('.desktop-nav a')];
const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
function onScroll(){const y=scrollY;header?.classList.toggle('scrolled',y>20);const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(progress)progress.style.width=`${Math.min(100,y/max*100)}%`;let active='';sections.forEach(s=>{if(s.getBoundingClientRect().top<=180)active=s.id});navLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${active}`))}
onScroll();addEventListener('scroll',onScroll,{passive:true});
const panel=document.querySelector('.theme-panel'),backdrop=document.querySelector('.panel-backdrop');
function openTheme(){panel?.classList.add('is-open');backdrop?.classList.add('is-visible');panel?.setAttribute('aria-hidden','false');document.querySelectorAll('[data-theme-open]').forEach(b=>b.setAttribute('aria-expanded','true'));body.classList.add('no-scroll')}
function closeTheme(){panel?.classList.remove('is-open');backdrop?.classList.remove('is-visible');panel?.setAttribute('aria-hidden','true');document.querySelectorAll('[data-theme-open]').forEach(b=>b.setAttribute('aria-expanded','false'));body.classList.remove('no-scroll')}
document.querySelectorAll('[data-theme-open]').forEach(b=>b.addEventListener('click',openTheme));document.querySelectorAll('[data-theme-close]').forEach(b=>b.addEventListener('click',closeTheme));document.querySelectorAll('[data-theme-value]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeValue)));document.querySelector('.theme-reset')?.addEventListener('click',()=>setTheme('ocean'));
document.querySelectorAll('[data-motion-value]').forEach(b=>b.addEventListener('click',()=>setMotion(b.dataset.motionValue)));
const toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobileMenu');
function toggleMenu(force){if(!toggle||!menu)return;const open=typeof force==='boolean'?force:!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç')}
toggle?.addEventListener('click',()=>toggleMenu());menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -35px'}):null;
document.querySelectorAll('.reveal').forEach(el=>{if(el.dataset.delay)el.style.setProperty('--delay',`${Number(el.dataset.delay)}ms`);io?io.observe(el):el.classList.add('is-visible')});
const rotate=document.querySelector('[data-rotate-word]'),words=['kusursuz detay','özgün karakter','güçlü performans','net kullanıcı deneyimi','kalıcı etki'];let wi=0;if(rotate&&!reduced)setInterval(()=>{rotate.classList.add('swap');setTimeout(()=>{wi=(wi+1)%words.length;rotate.textContent=words[wi];rotate.classList.remove('swap')},220)},2400);
const modal=document.getElementById('caseModal');document.querySelector('[data-case-open]')?.addEventListener('click',()=>modal?.showModal());document.querySelector('[data-case-close]')?.addEventListener('click',()=>modal?.close());modal?.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()});
document.getElementById('proposalForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),features=f.getAll('feature');const msg=['Merhaba Efecan, EB Digital Studio üzerinden ulaşıyorum.','',`Ad / Marka: ${f.get('name')||'-'}`,`Proje türü: ${f.get('type')||'-'}`,`Sayfa sayısı: ${f.get('pages')||'-'}`,`Teslim beklentisi: ${f.get('deadline')||'-'}`,`İstenen özellikler: ${features.length?features.join(', '):'Belirtilmedi'}`,`Proje detayı: ${f.get('details')||'Belirtilmedi'}`,'','Projem için bilgi ve teklif almak istiyorum.'].join('\n');window.open(`https://wa.me/905425866513?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer')});
if(!reduced&&matchMedia('(pointer:fine)').matches){
  const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring'),label=ring?.querySelector('span');
  if(dot&&ring){
    root.classList.add('custom-cursor-ready');
    let mx=-100,my=-100,rx=-100,ry=-100,started=false;
    const setVisible=visible=>{dot.classList.toggle('is-visible',visible);ring.classList.toggle('is-visible',visible)};
    addEventListener('pointermove',e=>{
      mx=e.clientX;my=e.clientY;
      if(!started){rx=mx;ry=my;started=true;setVisible(true)}
      dot.style.transform=`translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
    },{passive:true});
    document.addEventListener('pointerleave',()=>setVisible(false));
    document.addEventListener('pointerenter',()=>started&&setVisible(true));
    addEventListener('blur',()=>setVisible(false));
    (function cursorLoop(){
      rx+=(mx-rx)*.18;ry+=(my-ry)*.18;
      ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(cursorLoop);
    })();
    const interactive='a,button,[data-tilt],input,select,textarea,[data-cursor],.compare-shell';
    document.querySelectorAll(interactive).forEach(el=>{
      el.addEventListener('pointerenter',()=>{
        ring.classList.add('is-active');
        if(label)label.textContent=el.dataset.cursor||((el.matches('input[type=range]')||el.closest('[data-compare]'))?'SÜRÜKLE':el.matches('input,select,textarea')?'':'AÇ');
      });
      el.addEventListener('pointerleave',()=>{ring.classList.remove('is-active');if(label)label.textContent=''});
    });
    addEventListener('pointerdown',()=>{dot.classList.add('is-pressed');ring.classList.add('is-pressed')});
    addEventListener('pointerup',()=>{dot.classList.remove('is-pressed');ring.classList.remove('is-pressed')});
  }
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1200px) rotateX(${-y*3.5}deg) rotateY(${x*4.5}deg)`});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.07}px,${(e.clientY-r.top-r.height/2)*.07}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
}
const canvas=document.getElementById('particleCanvas');if(canvas&&!reduced){const ctx=canvas.getContext('2d');let ps=[],w=0,h=0,dpr=1;const rgb=()=>{const v=getComputedStyle(root).getPropertyValue('--accent').trim().replace('#','');return v.length===6?[parseInt(v.slice(0,2),16),parseInt(v.slice(2,4),16),parseInt(v.slice(4,6),16)]:[59,130,246]};function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(74,Math.max(28,Math.floor(w/22)));ps=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.14,r:Math.random()*1.25+.35,a:Math.random()*.3+.08}))}function frame(){ctx.clearRect(0,0,w,h);const [r,g,b]=rgb();ps.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.fillStyle=`rgba(${r},${g},${b},${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();for(let j=i+1;j<ps.length;j++){const q=ps[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<115){ctx.beginPath();ctx.strokeStyle=`rgba(${r},${g},${b},${(1-d/115)*.03})`;ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}});requestAnimationFrame(frame)}resize();frame();addEventListener('resize',resize)}
let key='';addEventListener('keydown',e=>{if(e.key==='Escape'){closeTheme();toggleMenu(false);modal?.close?.()}key=(key+e.key.toLowerCase()).slice(-2);if(key==='eb')openTheme()});const original=document.title;document.addEventListener('visibilitychange',()=>document.title=document.hidden?'Projen seni bekliyor — EB Studio':original);const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
