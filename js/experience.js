
(() => {
  'use strict';

  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  /* ============================
     LIVE DESIGN LAB
     ============================ */
  const preview = $('[data-lab-preview]');
  if (preview) {
    const sectors = {
      fitness: {
        brand:'PULSE',
        kicker:'PERFORMANCE COACHING',
        title:'Potansiyelini|performansa|dönüştür.',
        desc:'Bilimsel yaklaşım, güçlü takip ve kişiye özel dijital deneyim.',
        feature:'Günlük gelişim'
      },
      architecture: {
        brand:'FORMA',
        kicker:'ARCHITECTURE & SPACE',
        title:'Mekânları|karaktere|dönüştür.',
        desc:'Mimari yaklaşımı, seçkin projeleri ve tasarım dilini güçlü biçimde sun.',
        feature:'Proje vitrini'
      },
      beauty: {
        brand:'LUMI',
        kicker:'BEAUTY STUDIO',
        title:'Doğallığını|ışıltıya|dönüştür.',
        desc:'Zarif marka dili, online randevu akışı ve premium hizmet sunumu.',
        feature:'Online randevu'
      },
      technology: {
        brand:'NEXA',
        kicker:'DIGITAL PRODUCT',
        title:'Fikrini|ölçeklenebilir ürüne|dönüştür.',
        desc:'Modern ürün anlatımı, güçlü arayüz ve veriye dayalı dijital sistem.',
        feature:'Ürün sistemi'
      },
      personal: {
        brand:'SIGNATURE',
        kicker:'PERSONAL BRAND',
        title:'Uzmanlığını|dijital imzaya|dönüştür.',
        desc:'Hikâyeni, yeteneğini ve projelerini akılda kalan bir deneyimle sun.',
        feature:'Kişisel vitrin'
      }
    };
    const state = {sector:'fitness', style:'futuristic', palette:'electric'};
    const status = $('[data-lab-status]');
    const title = $('[data-preview-title]');
    const brand = $('[data-preview-brand]');
    const kicker = $('[data-preview-kicker]');
    const desc = $('[data-preview-desc]');
    const feature = $('[data-preview-feature]');

    function renderLab() {
      const s = sectors[state.sector];
      const parts = s.title.split('|');
      if (brand) brand.textContent = s.brand;
      if (kicker) kicker.textContent = s.kicker;
      if (title) title.innerHTML = `${parts[0]}<br><em>${parts[1]}</em> ${parts[2]}`;
      if (desc) desc.textContent = s.desc;
      if (feature) {
        const checked = $$('[data-lab-feature]:checked').map(x=>x.value);
        feature.textContent = checked[0] || s.feature;
      }
      preview.dataset.style = state.style;
      preview.dataset.palette = state.palette;
      if (status) {
        status.textContent = 'RENDERING';
        status.classList.add('is-rendering');
        setTimeout(()=>{status.textContent='READY';status.classList.remove('is-rendering')}, 380);
      }
    }

    $$('[data-lab-group]').forEach(group => {
      group.addEventListener('click', e => {
        const btn = e.target.closest('button[data-value]');
        if (!btn) return;
        $$('button[data-value]', group).forEach(x=>x.classList.toggle('is-active', x===btn));
        const key = group.dataset.labGroup;
        state[key] = btn.dataset.value;
        renderLab();
      });
    });
    $$('[data-lab-feature]').forEach(x=>x.addEventListener('change', renderLab));

    $('[data-lab-apply]')?.addEventListener('click', () => {
      const form = $('#proposalForm');
      if (!form) return;
      const sectorNames = {fitness:'Fitness / Koçluk', architecture:'Mimarlık', beauty:'Güzellik', technology:'Teknoloji', personal:'Kişisel Marka'};
      const styleNames = {futuristic:'Futuristik', luxury:'Lüks', minimal:'Minimal', corporate:'Kurumsal'};
      const paletteNames = {electric:'Elektrik Mavi / Mor', emerald:'Zümrüt / Turkuaz', gold:'Altın / Siyah', fire:'Turuncu / Kırmızı', mono:'Gümüş / Minimal'};
      const type = form.elements.type;
      if (type) {
        const desired = state.sector === 'personal' ? 'Kişisel portföy' : 'Kurumsal web sitesi';
        [...type.options].forEach(o => { if (o.textContent.trim() === desired) type.value = o.value; });
      }
      const selectedFeatures = $$('[data-lab-feature]:checked').map(x=>x.value);
      $$('input[name="feature"]', form).forEach(ch => ch.checked = selectedFeatures.includes(ch.value));
      const details = form.elements.details;
      if (details) details.value = `Design Lab konsepti:\nSektör: ${sectorNames[state.sector]}\nTasarım dili: ${styleNames[state.style]}\nRenk atmosferi: ${paletteNames[state.palette]}\nÖzellikler: ${selectedFeatures.join(', ') || 'Henüz seçilmedi'}\n\nProjem için bu yönde bir tasarım istiyorum.`;
      $('#contact')?.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>form.elements.name?.focus(), 720);
    });

    renderLab();
  }

  /* ============================
     EB COMMAND CENTER
     ============================ */
  const center = $('#commandCenter');
  if (center) {
    const input = $('[data-command-search]', center);
    const list = $('[data-command-list]', center);
    const items = () => $$('button,a', list).filter(x => !x.hidden);
    let selected = 0;

    function syncSelection() {
      items().forEach((x,i)=>x.classList.toggle('is-selected', i===selected));
      items()[selected]?.scrollIntoView({block:'nearest'});
    }
    function openCommand() {
      center.classList.add('is-open');
      center.setAttribute('aria-hidden','false');
      document.body.classList.add('no-scroll');
      if (input) { input.value=''; filterCommands(''); setTimeout(()=>input.focus(),80); }
    }
    function closeCommand() {
      center.classList.remove('is-open');
      center.setAttribute('aria-hidden','true');
      document.body.classList.remove('no-scroll');
    }
    function filterCommands(q) {
      const query = q.toLocaleLowerCase('tr-TR').trim();
      $$('button,a', list).forEach(item=>{
        item.hidden = query && !item.textContent.toLocaleLowerCase('tr-TR').includes(query);
      });
      selected = 0; syncSelection();
    }
    function activate(item) {
      if (!item) return;
      const command = item.dataset.command;
      if (command === 'navigate') {
        closeCommand();
        $(item.dataset.target)?.scrollIntoView({behavior:'smooth'});
      } else if (command === 'theme') {
        closeCommand();
        setTimeout(()=>document.querySelector('[data-theme-open]')?.click(),80);
      } else if (item.tagName === 'A') {
        if (item.target === '_blank') window.open(item.href,'_blank','noopener,noreferrer');
        else location.href = item.href;
        closeCommand();
      }
    }

    $$('[data-command-open]').forEach(b=>b.addEventListener('click',openCommand));
    $$('[data-command-close]').forEach(b=>b.addEventListener('click',closeCommand));
    input?.addEventListener('input',()=>filterCommands(input.value));
    list?.addEventListener('click',e=>{
      const item=e.target.closest('button,a'); if(item){e.preventDefault();activate(item)}
    });

    addEventListener('keydown', e => {
      const commandOpen = center.classList.contains('is-open');
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k') {
        e.preventDefault(); commandOpen ? closeCommand() : openCommand(); return;
      }
      if (!commandOpen) return;
      if (e.key==='Escape') {e.preventDefault();closeCommand()}
      if (e.key==='ArrowDown') {e.preventDefault();selected=Math.min(selected+1,items().length-1);syncSelection()}
      if (e.key==='ArrowUp') {e.preventDefault();selected=Math.max(selected-1,0);syncSelection()}
      if (e.key==='Enter') {e.preventDefault();activate(items()[selected])}
    });
    syncSelection();
  }

  /* ============================
     CASE STUDY COMPARISON
     ============================ */
  const compare = $('[data-compare]');
  if (compare) {
    const range = $('input[type="range"]', compare);
    const update = value => compare.style.setProperty('--split', `${value}%`);
    const fitLegacyViewport = () => {
      const width = compare.getBoundingClientRect().width;
      compare.style.setProperty('--legacy-scale', String(width / 1440));
    };
    range?.addEventListener('input',()=>update(range.value));
    update(range?.value || 50);
    fitLegacyViewport();
    addEventListener('resize', fitLegacyViewport, {passive:true});
    if ('ResizeObserver' in window) new ResizeObserver(fitLegacyViewport).observe(compare);
  }

  /* small system details */
  const labStatus = $('[data-lab-status]');
  addEventListener('online',()=>{if(labStatus)labStatus.textContent='READY'});
  addEventListener('offline',()=>{if(labStatus)labStatus.textContent='OFFLINE'});
})();
