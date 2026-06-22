(() => {
  'use strict';
  const assistant = document.getElementById('ebAiAssistant');
  if (!assistant) return;

  const panel = assistant.querySelector('[data-ai-panel]');
  const messages = assistant.querySelector('[data-ai-messages]');
  const quick = assistant.querySelector('[data-ai-quick]');
  const form = assistant.querySelector('[data-ai-form]');
  const input = assistant.querySelector('[data-ai-input]');
  const phone = '905425866513';
  const state = { sector:'', goal:'', features:[] };
  let booted = false;

  const sectors = [
    ['Güzellik merkezi','beauty'], ['Emlak','realestate'], ['Restoran / kafe','food'],
    ['Fitness / pilates','fitness'], ['Klinik / sağlık','clinic'], ['E-ticaret','commerce'],
    ['Eğitim','education'], ['Kurumsal şirket','corporate'], ['Kişisel marka','personal'], ['Diğer','other']
  ];
  const goals = [
    ['Randevu almak','appointment'], ['İlan / portföy göstermek','portfolio'], ['Satış yapmak','sales'],
    ['Kurumsal güven','trust'], ['Üyelik / panel','system'], ['Google görünürlüğü','seo']
  ];
  const features = [
    ['Admin paneli','admin'], ['Üyelik sistemi','membership'], ['Veritabanı','database'], ['Randevu formu','appointment'],
    ['Ödeme entegrasyonu','payment'], ['Blog / içerik','blog'], ['Galeri','gallery'], ['Gelişmiş SEO','seo']
  ];

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function scrollMessages(){ messages.scrollTop = messages.scrollHeight; }
  function addMessage(role, html){
    const node = document.createElement('div');
    node.className = `eb-ai-msg ${role}`;
    node.innerHTML = html;
    messages.appendChild(node);
    scrollMessages();
  }
  function setQuick(items){
    quick.innerHTML = '';
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `eb-ai-chip ${item.primary ? 'primary' : ''} ${item.active ? 'is-active' : ''}`;
      btn.textContent = item.label;
      btn.dataset.aiAction = item.action;
      if (item.value) btn.dataset.value = item.value;
      quick.appendChild(btn);
    });
  }
  function open(){
    assistant.classList.add('is-open');
    panel.setAttribute('aria-hidden','false');
    document.getElementById('commandCenter')?.classList.remove('is-open');
    document.getElementById('commandCenter')?.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
    if (!booted) boot();
    setTimeout(()=>input?.focus(),120);
  }
  function close(){
    assistant.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');
  }
  function boot(){
    booted = true;
    messages.innerHTML = '';
    addMessage('bot', '<b>Merhaba, ben EB Asistan.</b><br>Projeniz için en uygun web sitesi yapısını belirlemede yardımcı olurum. Önce işletme türünü seçelim.');
    setQuick(sectors.map(([label,value]) => ({label, action:'sector', value})));
  }
  function askGoal(){
    addMessage('bot', '<b>Harika.</b> Bu projede en önemli hedef ne olsun?');
    setQuick(goals.map(([label,value]) => ({label, action:'goal', value})));
  }
  function askFeatures(){
    addMessage('bot', 'Gereken özellikleri seç. Birden fazla işaretleyebilirsin; sonra <b>önerimi çıkar</b> butonuna bas.');
    renderFeatureChips();
  }
  function renderFeatureChips(){
    const list = features.map(([label,value]) => ({label: state.features.includes(value) ? `✓ ${label}` : label, action:'feature', value, active:state.features.includes(value)}));
    list.push({label:'Önerimi çıkar', action:'result', primary:true});
    setQuick(list);
  }
  function getSectorName(){ return sectors.find(x=>x[1]===state.sector)?.[0] || 'Belirtilmedi'; }
  function getGoalName(){ return goals.find(x=>x[1]===state.goal)?.[0] || 'Belirtilmedi'; }
  function getFeatureNames(){ return features.filter(x=>state.features.includes(x[1])).map(x=>x[0]); }
  function recommendation(){
    const f = state.features;
    const system = ['admin','membership','database','payment'].some(x=>f.includes(x)) || state.goal === 'system' || state.sector === 'commerce';
    const signature = ['beauty','clinic','realestate','fitness'].includes(state.sector) || state.goal === 'appointment' || state.goal === 'seo' || f.includes('seo');
    if (system) return {
      name:'Özel Dijital Sistem', price:'84.900 TL’den başlayan kapsam',
      why:'Admin paneli, üyelik, veritabanı veya ödeme gibi teknik parçalar olduğu için özel sistem mantığı daha doğru olur.',
      next:'Teknik kapsamı netleştirip Design Lab üzerinden ön fiyatı güçlendirelim.'
    };
    if (signature) return {
      name:'Signature Web Experience', price:'49.900 TL’den başlayan kapsam',
      why:'Güven, prestij, hizmet detayları ve Google görünürlüğü bu projede kritik olduğu için premium sunum daha doğru olur.',
      next:'Sektöre göre ana sayfa, hizmet sayfaları ve WhatsApp teklif akışı hazırlanır.'
    };
    return {
      name:'Marka Deneyimi', price:'29.900 TL’den başlayan kapsam',
      why:'Kurumsal tanıtım, mobil uyum, iletişim akışı ve temel SEO için en dengeli paket olur.',
      next:'4–7 sayfalık güçlü bir marka sitesiyle başlanabilir.'
    };
  }
  function result(){
    const rec = recommendation();
    const featureNames = getFeatureNames();
    addMessage('bot', `<b>Önerilen paket: ${rec.name}</b><br><small>${rec.price}</small><br>${rec.why}<ul><li>Sektör: ${escapeHtml(getSectorName())}</li><li>Hedef: ${escapeHtml(getGoalName())}</li><li>Özellikler: ${featureNames.length ? escapeHtml(featureNames.join(', ')) : 'Henüz seçilmedi'}</li></ul>${rec.next}<div class="eb-ai-actions"><a class="eb-ai-action-link" href="#lab" data-ai-scroll-lab>DESIGN LAB</a><a class="eb-ai-action-link" href="#contact" data-ai-scroll-contact>TEKLİF FORMU</a></div>`);
    setQuick([
      {label:'WhatsApp mesajı hazırla', action:'whatsapp', primary:true},
      {label:'Design Lab’e git', action:'lab'},
      {label:'Baştan başla', action:'restart'}
    ]);
  }
  function whatsapp(){
    const rec = recommendation();
    const featureNames = getFeatureNames();
    const msg = [
      'Merhaba Efecan, EB Digital Studio sitesindeki EB Asistan üzerinden proje ön değerlendirmesi yaptım.',
      '',
      `İşletme türü: ${getSectorName()}`,
      `Ana hedef: ${getGoalName()}`,
      `İstenen özellikler: ${featureNames.length ? featureNames.join(', ') : 'Belirtilmedi'}`,
      `Asistan önerisi: ${rec.name}`,
      `Fiyat yönlendirmesi: ${rec.price}`,
      '',
      'Projem için detaylı görüşmek istiyorum.'
    ].join('\n');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null; else location.href = url;
  }
  function scrollToTarget(selector){
    close();
    document.querySelector(selector)?.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function answer(text){
    const q = text.toLocaleLowerCase('tr-TR');
    if (!q.trim()) return;
    addMessage('user', escapeHtml(text));
    if (/(merhaba|selam|sa|slm)/.test(q)) {
      addMessage('bot','Merhaba. İşletme türünü seçersen sana en uygun site paketini önerebilirim.');
      setQuick(sectors.map(([label,value]) => ({label, action:'sector', value})));
    } else if (/(fiyat|ücret|maliyet|kaç para|ne kadar)/.test(q)) {
      addMessage('bot','Fiyat; sayfa sayısı, tasarım seviyesi ve admin paneli gibi özelliklere göre değişir. Design Lab tek nihai ön fiyat çıkarır. Başlangıç olarak Marka Deneyimi 29.900 TL, Signature 49.900 TL, özel sistemler 84.900 TL’den başlar.');
      setQuick([{label:'Design Lab’e git',action:'lab',primary:true},{label:'WhatsApp mesajı hazırla',action:'whatsapp'}]);
    } else if (/(ödeme|taksit|kapora)/.test(q)) {
      addMessage('bot','Standart ödeme düzeni: %40 başlangıç, %30 tasarım onayı, %30 yayın öncesi şeklindedir. Projeye göre yazılı teklif hazırlanır.');
      setQuick([{label:'Hizmet koşulları',action:'terms',primary:true},{label:'Teklif formu',action:'contact'}]);
    } else if (/(teslim|süre|kaç gün|ne zaman)/.test(q)) {
      addMessage('bot','Kurumsal web projelerinde ortalama teslim 2–4 haftadır. Admin paneli, üyelik, veritabanı veya özel sistemlerde süre teknik kapsama göre uzar.');
      setQuick([{label:'Paket öner',action:'restart',primary:true},{label:'WhatsApp',action:'whatsapp'}]);
    } else if (/(seo|google|search|arama|birinci|sıra)/.test(q)) {
      addMessage('bot','SEO altyapısı, sitemap, Search Console ve doğru sayfa başlıkları kurulabilir. Google sıralaması garanti edilmez; hedef marka aramalarında görünürlük ve zamanla hizmet/bölge aramalarında güçlenmektir.');
      setQuick([{label:'SEO odaklı paket',action:'goal',value:'seo',primary:true},{label:'Design Lab',action:'lab'}]);
    } else if (/(admin|panel|üyelik|veritabanı|supabase|giriş)/.test(q)) {
      addMessage('bot','Admin paneli, üyelik ve veritabanı isteyen projeler özel dijital sistem kapsamına girer. Müşteri, öğrenci, ilan, yorum veya randevu yönetimi gibi parçalar eklenebilir.');
      state.goal = 'system';
      setQuick([{label:'Sistem önerimi çıkar',action:'result',primary:true},{label:'Özellik seç',action:'features'}]);
    } else if (/(randevu|rezervasyon|form)/.test(q)) {
      addMessage('bot','Randevu ve rezervasyon akışı; güzellik, klinik, fitness, restoran ve danışmanlık işlerinde çok güçlü çalışır. WhatsApp yönlendirmeli veya admin panelli yapılabilir.');
      state.goal = 'appointment';
      setQuick([{label:'Paket öner',action:'result',primary:true},{label:'Güzellik merkezi',action:'sector',value:'beauty'}]);
    } else {
      addMessage('bot','Bu konuda en doğru yönlendirme için Efecan ile görüşmek daha iyi olur. Yine de işletme türünü seçersen sana güvenli bir paket önerisi çıkarabilirim.');
      setQuick([{label:'Paket önericiye başla',action:'restart',primary:true},{label:'WhatsApp',action:'whatsapp'}]);
    }
  }

  document.addEventListener('click', event => {
    const openBtn = event.target.closest('[data-assistant-open]');
    if (openBtn) { event.preventDefault(); event.stopPropagation(); open(); return; }
    if (event.target.closest('[data-assistant-close]')) { event.preventDefault(); close(); return; }
    if (event.target.closest('[data-ai-scroll-lab]')) { event.preventDefault(); scrollToTarget('#lab'); return; }
    if (event.target.closest('[data-ai-scroll-contact]')) { event.preventDefault(); scrollToTarget('#contact'); return; }
  }, true);

  quick.addEventListener('click', event => {
    const btn = event.target.closest('[data-ai-action]');
    if (!btn) return;
    const action = btn.dataset.aiAction, value = btn.dataset.value;
    if (action === 'sector') { state.sector = value; addMessage('user', btn.textContent); askGoal(); }
    if (action === 'goal') { state.goal = value; addMessage('user', btn.textContent); askFeatures(); }
    if (action === 'feature') {
      state.features = state.features.includes(value) ? state.features.filter(x=>x!==value) : [...state.features, value];
      renderFeatureChips();
    }
    if (action === 'features') askFeatures();
    if (action === 'result') result();
    if (action === 'whatsapp') whatsapp();
    if (action === 'lab') scrollToTarget('#lab');
    if (action === 'contact') scrollToTarget('#contact');
    if (action === 'terms') location.href = 'hizmet-ve-odeme-kosullari.html';
    if (action === 'restart') { state.sector=''; state.goal=''; state.features=[]; boot(); }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value;
    input.value = '';
    answer(text);
  });

  addEventListener('keydown', event => {
    if (event.key === 'Escape' && assistant.classList.contains('is-open')) close();
  });
})();
