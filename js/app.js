(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const themes = ['ocean','nebula','emerald','sunset','gold','silver'];
  const themeColors = {ocean:'#050814',nebula:'#090610',emerald:'#04100e',sunset:'#120705',gold:'#100d06',silver:'#090b10'};
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function setTheme(theme, persist = true) {
    const safe = themes.includes(theme) ? theme : 'ocean';
    root.dataset.theme = safe;
    document.querySelectorAll('[data-theme-value]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.themeValue === safe));
    if (metaTheme) metaTheme.setAttribute('content', themeColors[safe]);
    if (persist) localStorage.setItem('eb-signature-theme', safe);
    window.dispatchEvent(new CustomEvent('ebthemechange'));
  }
  setTheme(localStorage.getItem('eb-signature-theme') || 'ocean', false);

  const intro = document.getElementById('intro');
  if (intro) {
    if (prefersReduced || sessionStorage.getItem('eb-intro-seen')) {
      intro.remove();
    } else {
      body.classList.add('no-scroll');
      window.setTimeout(() => {
        intro.classList.add('is-hidden');
        body.classList.remove('no-scroll');
        sessionStorage.setItem('eb-intro-seen', '1');
        window.setTimeout(() => intro.remove(), 750);
      }, 1850);
    }
  }

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function handleScroll() {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 20);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    let activeId = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 180) activeId = section.id; });
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`));
  }
  handleScroll();
  window.addEventListener('scroll', handleScroll, {passive:true});

  const themePanel = document.querySelector('.theme-panel');
  const backdrop = document.querySelector('.panel-backdrop');
  const themeOpeners = document.querySelectorAll('[data-theme-open]');
  const themeClosers = document.querySelectorAll('[data-theme-close]');
  function openTheme() {
    themePanel?.classList.add('is-open'); backdrop?.classList.add('is-visible');
    themePanel?.setAttribute('aria-hidden','false'); themeOpeners.forEach(b => b.setAttribute('aria-expanded','true'));
    body.classList.add('no-scroll');
  }
  function closeTheme() {
    themePanel?.classList.remove('is-open'); backdrop?.classList.remove('is-visible');
    themePanel?.setAttribute('aria-hidden','true'); themeOpeners.forEach(b => b.setAttribute('aria-expanded','false'));
    body.classList.remove('no-scroll');
  }
  themeOpeners.forEach(btn => btn.addEventListener('click', openTheme));
  themeClosers.forEach(btn => btn.addEventListener('click', closeTheme));
  document.querySelectorAll('[data-theme-value]').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.themeValue)));
  document.querySelector('.theme-reset')?.addEventListener('click', () => setTheme('ocean'));

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function toggleMenu(force) {
    if (!menuToggle || !mobileMenu) return;
    const open = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }
  menuToggle?.addEventListener('click', () => toggleMenu());
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.11, rootMargin:'0px 0px -40px'}) : null;
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.dataset.delay) el.style.setProperty('--delay', `${Number(el.dataset.delay)}ms`);
    if (observer) observer.observe(el); else el.classList.add('is-visible');
  });

  const rotateTarget = document.querySelector('[data-rotate-word]');
  const rotatingWords = ['kusursuz detay','özgün karakter','güçlü performans','net kullanıcı deneyimi','kalıcı etki'];
  let wordIndex = 0;
  if (rotateTarget && !prefersReduced) {
    window.setInterval(() => {
      rotateTarget.classList.add('swap');
      window.setTimeout(() => {
        wordIndex = (wordIndex + 1) % rotatingWords.length;
        rotateTarget.textContent = rotatingWords[wordIndex];
        rotateTarget.classList.remove('swap');
      }, 220);
    }, 2400);
  }

  const caseModal = document.getElementById('caseModal');
  document.querySelector('[data-case-open]')?.addEventListener('click', () => caseModal?.showModal?.());
  document.querySelector('[data-case-close]')?.addEventListener('click', () => caseModal?.close());
  caseModal?.addEventListener('click', event => {
    const rect = caseModal.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) caseModal.close();
  });

  const proposalForm = document.getElementById('proposalForm');
  proposalForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(proposalForm);
    const features = data.getAll('feature');
    const message = [
      'Merhaba Efecan, EB Digital Studio üzerinden ulaşıyorum.',
      '',
      `Ad / Marka: ${data.get('name') || '-'}`,
      `Proje türü: ${data.get('type') || '-'}`,
      `Sayfa sayısı: ${data.get('pages') || '-'}`,
      `Teslim beklentisi: ${data.get('deadline') || '-'}`,
      `İstenen özellikler: ${features.length ? features.join(', ') : 'Belirtilmedi'}`,
      `Proje detayı: ${data.get('details') || 'Belirtilmedi'}`,
      '',
      'Projem için bilgi ve teklif almak istiyorum.'
    ].join('\n');
    const url = `https://wa.me/905425866513?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      let mx = -100, my = -100, rx = -100, ry = -100;
      window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; }, {passive:true});
      const cursorLoop = () => {
        rx += (mx-rx)*.16; ry += (my-ry)*.16;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(cursorLoop);
      };
      cursorLoop();
      document.querySelectorAll('a,button,.tilt-card,input,select,textarea').forEach(el => {
        el.addEventListener('mouseenter', () => { ring.classList.add('is-active'); ring.querySelector('span').textContent = el.matches('input,select,textarea') ? '' : 'AÇ'; });
        el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
      });
    }

    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(1200px) rotateX(${-y*4.5}deg) rotateY(${x*5}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        el.style.transform = `translate(${x*.08}px,${y*.08}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0, height = 0, dpr = 1;
    const hexToRgb = hex => {
      const clean = hex.trim().replace('#','');
      if (clean.length !== 6) return [59,130,246];
      return [parseInt(clean.slice(0,2),16),parseInt(clean.slice(2,4),16),parseInt(clean.slice(4,6),16)];
    };
    const accent = () => hexToRgb(getComputedStyle(root).getPropertyValue('--accent'));
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(70, Math.max(28, Math.floor(width/22)));
      particles = Array.from({length:count}, () => ({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.13,vy:(Math.random()-.5)*.13,r:Math.random()*1.3+.35,a:Math.random()*.35+.08}));
    }
    function frame() {
      ctx.clearRect(0,0,width,height);
      const [r,g,b] = accent();
      particles.forEach((p,i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>width) p.vx*=-1;
        if (p.y<0||p.y>height) p.vy*=-1;
        ctx.beginPath(); ctx.fillStyle=`rgba(${r},${g},${b},${p.a})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        for(let j=i+1;j<particles.length;j++){
          const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);
          if(dist<120){ctx.beginPath();ctx.strokeStyle=`rgba(${r},${g},${b},${(1-dist/120)*.035})`;ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
        }
      });
      requestAnimationFrame(frame);
    }
    resize(); frame(); window.addEventListener('resize', resize);
  }

  let keyBuffer = '';
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeTheme(); toggleMenu(false); caseModal?.close?.(); }
    keyBuffer = (keyBuffer + event.key.toLowerCase()).slice(-2);
    if (keyBuffer === 'eb') openTheme();
  });

  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? 'Projen seni bekliyor — EB Studio' : originalTitle; });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
