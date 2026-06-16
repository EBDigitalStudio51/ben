(() => {
  const root = document.documentElement;
  const body = document.body;
  const themePanel = document.querySelector('.theme-panel');
  const backdrop = document.querySelector('.panel-backdrop');
  const themeButtons = document.querySelectorAll('[data-theme-open]');
  const themeClose = document.querySelectorAll('[data-theme-close]');
  const themeOptions = document.querySelectorAll('[data-theme-value]');
  const resetButton = document.querySelector('.theme-reset');
  const validThemes = ['ocean', 'nebula', 'emerald', 'sunset', 'gold', 'silver'];
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const themeColors = { ocean:'#070a12', nebula:'#090710', emerald:'#05110f', sunset:'#120907', gold:'#100d07', silver:'#0b0d12' };

  function setTheme(theme, persist = true) {
    const safeTheme = validThemes.includes(theme) ? theme : 'ocean';
    root.dataset.theme = safeTheme;
    themeOptions.forEach(btn => btn.classList.toggle('is-active', btn.dataset.themeValue === safeTheme));
    if (persist) localStorage.setItem('eb-theme', safeTheme);
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColors[safeTheme]);
  }

  function openThemePanel() {
    themePanel?.classList.add('is-open');
    backdrop?.classList.add('is-visible');
    themePanel?.setAttribute('aria-hidden', 'false');
    themeButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    body.classList.add('no-scroll');
  }

  function closeThemePanel() {
    themePanel?.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    themePanel?.setAttribute('aria-hidden', 'true');
    themeButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    body.classList.remove('no-scroll');
  }

  setTheme(localStorage.getItem('eb-theme') || 'ocean', false);
  themeButtons.forEach(btn => btn.addEventListener('click', openThemePanel));
  themeClose.forEach(btn => btn.addEventListener('click', closeThemePanel));
  themeOptions.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.themeValue)));
  resetButton?.addEventListener('click', () => setTheme('ocean'));

  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }
  menuToggle?.addEventListener('click', () => toggleMenu());
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px' }) : null;
  document.querySelectorAll('.reveal').forEach((el, index) => {
    if (el.dataset.delay) el.style.setProperty('--delay', `${Number(el.dataset.delay)}ms`);
    if (observer) observer.observe(el); else el.classList.add('is-visible');
  });

  const caseModal = document.getElementById('caseModal');
  document.querySelector('[data-case-open]')?.addEventListener('click', () => {
    if (typeof caseModal?.showModal === 'function') caseModal.showModal();
  });
  document.querySelector('[data-case-close]')?.addEventListener('click', () => caseModal?.close());
  caseModal?.addEventListener('click', event => {
    const rect = caseModal.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) caseModal.close();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeThemePanel(); toggleMenu(false); }
  });
})();
