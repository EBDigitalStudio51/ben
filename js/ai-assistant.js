(() => {
  'use strict';
  const assistant = document.getElementById('ebAiAssistant');
  if (!assistant) return;

  const panel = assistant.querySelector('[data-ai-panel]');
  const messages = assistant.querySelector('[data-ai-messages]');
  const quick = assistant.querySelector('[data-ai-quick]');
  const form = assistant.querySelector('[data-ai-form]');
  const input = assistant.querySelector('[data-ai-input]');
  const intelList = assistant.querySelector('[data-ai-intel-list]');
  const intelScore = assistant.querySelector('[data-ai-score]');
  const stateSector = assistant.querySelector('[data-ai-state-sector]');
  const statePackage = assistant.querySelector('[data-ai-state-package]');
  const statePrice = assistant.querySelector('[data-ai-state-price]');
  const phone = '905425866513';

  const state = {
    business:'', sector:'', goal:'', style:'', pages:'', urgency:'normal',
    features:[], budget:'', lastRecommendation:null, history:[]
  };
  let booted = false;

  const sectors = [
    {label:'Güzellik merkezi', value:'beauty', keywords:['güzellik','lazer','cilt','kalıcı makyaj','tırnak','epilasyon','beauty','salon','diyet'], package:'Signature Web Experience', style:'Lüks / krem-gold', seo:['mersin güzellik merkezi','mezitli lazer epilasyon','cilt bakımı'], sections:['Hizmet sayfaları','Randevu akışı','Danışan yorumları','Galeri','KVKK']},
    {label:'Emlak ofisi', value:'realestate', keywords:['emlak','gayrimenkul','ilan','satılık','kiralık','arsa','daire'], package:'Özel Dijital Sistem', style:'Prestijli lacivert-gold', seo:['niğde satılık daire','niğde kiralık ev','niğde emlakçı'], sections:['İlan listesi','İlan detay sayfası','Filtreleme','WhatsApp talebi','Admin paneli']},
    {label:'Restoran / kafe', value:'food', keywords:['restoran','kafe','cafe','menü','rezervasyon','kahvaltı','yemek'], package:'Marka Deneyimi', style:'Sıcak / iştah açıcı', seo:['niğde kafe','niğde restoran','kahvaltı'], sections:['Dijital menü','Rezervasyon','Galeri','Kampanyalar','Harita']},
    {label:'Fitness / pilates', value:'fitness', keywords:['fitness','spor','pilates','reformer','gym','antrenör','koçluk'], package:'Signature Web Experience', style:'Dinamik / güçlü', seo:['fitness salonu','pilates stüdyosu','online koçluk'], sections:['Paketler','Eğitmenler','Programlar','Üyelik talebi','Dönüşüm alanı']},
    {label:'Klinik / sağlık', value:'clinic', keywords:['klinik','doktor','diş','sağlık','poliklinik','veteriner','hekim'], package:'Signature Web Experience', style:'Klinik güven / premium', seo:['randevu','tedavi','klinik'], sections:['Hizmetler','Doktor / uzman profili','Randevu','Sık sorulan sorular','Gizlilik']},
    {label:'E-ticaret', value:'commerce', keywords:['e-ticaret','satış','ürün','sepet','ödeme','shop','mağaza'], package:'Özel Dijital Sistem', style:'Satış odaklı', seo:['ürün','kategori','online satış'], sections:['Ürün kataloğu','Sepet','Ödeme','Stok yönetimi','Admin paneli']},
    {label:'Eğitim / kurs', value:'education', keywords:['kurs','eğitim','okul','öğrenci','ders','lgs','yks'], package:'Marka Deneyimi', style:'Güven veren kurumsal', seo:['kurs merkezi','özel ders','kayıt'], sections:['Programlar','Ön kayıt','Başarılar','Kadro','Duyurular']},
    {label:'Mimarlık / inşaat', value:'architecture', keywords:['mimarlık','inşaat','iç mimar','proje','dekorasyon'], package:'Signature Web Experience', style:'Minimal / editorial', seo:['mimarlık ofisi','iç mimarlık','anahtar teslim'], sections:['Proje portföyü','Önce-sonra','Hizmetler','Teklif formu','Galeri']},
    {label:'Kurumsal şirket', value:'corporate', keywords:['kurumsal','şirket','firma','danışmanlık','üretim'], package:'Marka Deneyimi', style:'Kurumsal / güven', seo:['kurumsal web sitesi','firma tanıtım'], sections:['Hakkımızda','Hizmetler','Referanslar','Teklif formu','İletişim']},
    {label:'Kişisel marka', value:'personal', keywords:['kişisel','portföy','cv','benim sitem','freelance'], package:'Dijital Başlangıç', style:'Minimal / karakter sahibi', seo:['kişisel portföy','kişisel web sitesi'], sections:['Hero','Hakkımda','Projeler','Sosyal medya','İletişim']}
  ];

  const goals = [
    {label:'Randevu / rezervasyon almak', value:'appointment'},
    {label:'İlan / portföy göstermek', value:'portfolio'},
    {label:'Satış ve teklif toplamak', value:'sales'},
    {label:'Kurumsal güven oluşturmak', value:'trust'},
    {label:'Üyelik / admin panel kurmak', value:'system'},
    {label:'Google görünürlüğünü artırmak', value:'seo'}
  ];
  const styles = [
    {label:'Futuristik', value:'futuristic'}, {label:'Lüks', value:'luxury'}, {label:'Minimal', value:'minimal'}, {label:'Kurumsal', value:'corporate'}
  ];
  const pages = [
    {label:'1–3 sayfa', value:'small'}, {label:'4–7 sayfa', value:'medium'}, {label:'8–12 sayfa', value:'large'}, {label:'13+ sayfa', value:'xlarge'}
  ];
  const features = [
    {label:'Admin paneli', value:'admin', price:20000}, {label:'Üyelik sistemi', value:'membership', price:15000},
    {label:'Veritabanı', value:'database', price:12000}, {label:'Randevu formu', value:'appointment', price:6000},
    {label:'Ödeme entegrasyonu', value:'payment', price:15000}, {label:'Blog / içerik sistemi', value:'blog', price:8000},
    {label:'Galeri / portföy', value:'gallery', price:4000}, {label:'Gelişmiş SEO', value:'seo', price:5000},
    {label:'Çoklu dil', value:'language', price:7500}, {label:'Gelişmiş animasyon', value:'animation', price:7500},
    {label:'Yorum paneli', value:'reviews', price:9000}, {label:'Dosya / fotoğraf yükleme', value:'upload', price:8000},
    {label:'Rol ve yetki sistemi', value:'roles', price:8000}, {label:'İlan / ürün yönetimi', value:'catalog', price:18000}
  ];
  const basePrices = { small:17900, medium:29900, large:49900, xlarge:64900 };
  const stylePrices = { futuristic:7500, luxury:6000, minimal:0, corporate:3000 };

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function formatTL(n){ return new Intl.NumberFormat('tr-TR').format(Math.max(0, Math.round(n))) + ' TL'; }
  function normalize(text){ return String(text||'').toLocaleLowerCase('tr-TR'); }
  function scrollMessages(){ messages.scrollTop = messages.scrollHeight; }
  function addMessage(role, html){
    const node = document.createElement('div');
    node.className = `eb-ai-msg ${role}`;
    node.innerHTML = html;
    messages.appendChild(node);
    scrollMessages();
    state.history.push({role, html: html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,1000)});
  }
  function setQuick(items){
    quick.innerHTML = '';
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `eb-ai-chip ${item.primary ? 'primary' : ''} ${item.active ? 'is-active' : ''} ${item.danger ? 'danger' : ''}`;
      btn.textContent = item.label;
      btn.dataset.aiAction = item.action;
      if (item.value) btn.dataset.value = item.value;
      quick.appendChild(btn);
    });
  }
  function getSector(){ return sectors.find(x=>x.value===state.sector); }
  function getGoal(){ return goals.find(x=>x.value===state.goal); }
  function getStyle(){ return styles.find(x=>x.value===state.style); }
  function getPages(){ return pages.find(x=>x.value===state.pages); }
  function getFeatureNames(){ return features.filter(x=>state.features.includes(x.value)).map(x=>x.label); }

  function scoreProject(){
    let score = 0;
    if (state.sector) score += 22;
    if (state.goal) score += 20;
    if (state.pages) score += 15;
    if (state.style) score += 12;
    if (state.features.length) score += Math.min(22, state.features.length * 5);
    if (state.business) score += 5;
    if (state.budget) score += 4;
    return Math.min(100, score);
  }
  function updateIntel(){
    const rec = buildRecommendation(false);
    const sector = getSector();
    const style = getStyle();
    const featureNames = getFeatureNames();
    if (stateSector) { stateSector.textContent = sector?.label?.toUpperCase() || 'SEKTÖR'; stateSector.nextElementSibling.textContent = state.sector ? 'algılandı' : 'bekleniyor'; }
    if (statePackage) { statePackage.textContent = rec.packageShort || 'PAKET'; statePackage.nextElementSibling.textContent = rec.level || 'analiz yok'; }
    if (statePrice) { statePrice.textContent = rec.total ? formatTL(rec.total) : 'FİYAT'; statePrice.nextElementSibling.textContent = rec.total ? 'ön teklif' : 'ön teklif yok'; }
    if (intelScore) intelScore.textContent = `${scoreProject()}%`;
    if (intelList) {
      const rows = [];
      rows.push(`<span><b>Stil:</b> ${escapeHtml(style?.label || sector?.style || 'Belirlenmedi')}</span>`);
      rows.push(`<span><b>Hedef:</b> ${escapeHtml(getGoal()?.label || 'Belirlenmedi')}</span>`);
      rows.push(`<span><b>Özellik:</b> ${featureNames.length ? escapeHtml(featureNames.slice(0,3).join(', ')) : 'Seçilmedi'}</span>`);
      rows.push(`<span><b>Teslim:</b> ${escapeHtml(rec.delivery)}</span>`);
      intelList.innerHTML = rows.join('');
    }
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
  function close(){ assistant.classList.remove('is-open'); panel.setAttribute('aria-hidden','true'); }
  function boot(){
    booted = true;
    messages.innerHTML = '';
    state.history = [];
    addMessage('bot', `<b>Merhaba, ben EB Asistan Pro.</b><br>İşletmenin sektörünü, hedefini ve gerekli özellikleri analiz edip sana paket, yaklaşık kapsam, fiyat ön teklifi, SEO planı ve WhatsApp teklif mesajı çıkarırım.<div class="ai-note">Serbest yazabilirsin: “Güzellik merkezim var, randevu ve SEO istiyorum.”</div>`);
    setQuick([
      {label:'Sihirbazı başlat', action:'wizard', primary:true},
      {label:'Güzellik örneği', action:'sample', value:'beauty'},
      {label:'Emlak örneği', action:'sample', value:'realestate'},
      {label:'SEO planı sor', action:'faq', value:'seo'},
      {label:'Fiyat mantığı', action:'faq', value:'price'}
    ]);
    updateIntel();
  }
  function startWizard(){
    addMessage('bot','Önce işletme türünü seçelim. Sonra hedef, sayfa sayısı, tasarım dili ve özellikleri belirleyeceğim.');
    setQuick(sectors.map(s => ({label:s.label, action:'sector', value:s.value})));
  }
  function askGoal(){ addMessage('bot','Bu projede en önemli hedef ne olsun?'); setQuick(goals.map(g => ({label:g.label, action:'goal', value:g.value}))); }
  function askPages(){ addMessage('bot','Yaklaşık kaç sayfalık bir yapı düşünülüyor?'); setQuick(pages.map(p => ({label:p.label, action:'pages', value:p.value}))); }
  function askStyle(){ addMessage('bot','Tasarım dili nasıl hissettirsin?'); setQuick(styles.map(s => ({label:s.label, action:'style', value:s.value}))); }
  function askFeatures(){ addMessage('bot','Gereken özellikleri seç. Birden fazla işaretleyebilirsin; sonra <b>üst seviye önerimi çıkar</b> butonuna bas.'); renderFeatureChips(); }
  function renderFeatureChips(){
    const list = features.map(f => ({label: state.features.includes(f.value) ? `✓ ${f.label}` : f.label, action:'feature', value:f.value, active:state.features.includes(f.value)}));
    list.push({label:'Üst seviye önerimi çıkar', action:'result', primary:true});
    setQuick(list);
  }

  function parseText(text){
    const q = normalize(text);
    const detectedSector = sectors.find(s => s.keywords.some(k => q.includes(k)));
    if (detectedSector) state.sector = detectedSector.value;
    if (/randevu|rezervasyon|appointment/.test(q)) state.goal = 'appointment';
    if (/ilan|portföy|proje galerisi|mülk|ürünleri göster/.test(q)) state.goal = 'portfolio';
    if (/satış|teklif|müşteri kazan|sipariş|ödeme/.test(q)) state.goal = 'sales';
    if (/güven|kurumsal|prestij|profesyonel/.test(q)) state.goal = state.goal || 'trust';
    if (/google|seo|arama|search|sıra|görünür/.test(q)) state.goal = 'seo';
    if (/admin|panel|üyelik|veritabanı|supabase|giriş|login/.test(q)) state.goal = 'system';
    if (/futuristik|neon|teknolojik/.test(q)) state.style = 'futuristic';
    if (/lüks|premium|gold|altın|prestij|zarif|krem/.test(q)) state.style = 'luxury';
    if (/minimal|sade|temiz|beyaz/.test(q)) state.style = 'minimal';
    if (/kurumsal|ciddi|güven/.test(q)) state.style = state.style || 'corporate';
    const pageMatch = q.match(/(\d{1,2})\s*(sayfa|sayfalık)/);
    if (pageMatch) {
      const n = Number(pageMatch[1]);
      state.pages = n <= 3 ? 'small' : n <= 7 ? 'medium' : n <= 12 ? 'large' : 'xlarge';
    }
    if (/acil|hızlı|çok çabuk|hemen/.test(q)) state.urgency = 'urgent';
    features.forEach(f => {
      const tests = {
        admin:['admin','panel','yönetim'], membership:['üyelik','giriş','login','kayıt'], database:['veritabanı','database','supabase'],
        appointment:['randevu','rezervasyon'], payment:['ödeme','shopier','iyzico','kart'], blog:['blog','içerik','makale'],
        gallery:['galeri','fotoğraf','portföy'], seo:['seo','google','arama'], language:['ingilizce','çoklu dil','ikinci dil'],
        animation:['animasyon','hareketli','efekt'], reviews:['yorum','değerlendirme','puan'], upload:['yükleme','fotoğraf ekleme','dosya'],
        roles:['rol','yetki','coach','admin rol'], catalog:['ilan','ürün yönetimi','katalog','portföy yönetimi']
      }[f.value] || [];
      if (tests.some(t => q.includes(t)) && !state.features.includes(f.value)) state.features.push(f.value);
    });
    const budgetMatch = q.match(/(\d{2,3})(?:\.|,)?(\d{0,3})\s*(bin|k|tl)?/);
    if (budgetMatch && /(bütçe|tl|fiyat|maliyet|para|bin)/.test(q)) state.budget = budgetMatch[0];
    const businessMatch = text.match(/(?:markam|işletmem|firmam|adım|adı)\s+([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s&.-]{2,35})/);
    if (businessMatch) state.business = businessMatch[1].trim();
    if (!state.pages) {
      if (state.goal === 'system' || state.features.includes('admin') || state.features.includes('catalog')) state.pages = 'large';
      else if (state.sector || state.goal) state.pages = 'medium';
    }
  }

  function buildRecommendation(save=true){
    const sector = getSector();
    const f = state.features;
    const system = state.goal === 'system' || ['admin','membership','database','payment','roles','catalog','upload'].some(x => f.includes(x)) || state.sector === 'commerce' || state.sector === 'realestate';
    const signature = system || ['beauty','clinic','fitness','architecture'].includes(state.sector) || state.goal === 'seo' || state.goal === 'appointment' || f.includes('seo') || f.includes('reviews');
    let packageName = 'Marka Deneyimi';
    let packageShort = 'MARKA';
    let level = 'premium tanıtım';
    if (system) { packageName = 'Özel Dijital Sistem'; packageShort = 'SİSTEM'; level = 'admin panelli'; }
    else if (signature) { packageName = 'Signature Web Experience'; packageShort = 'SIGNATURE'; level = 'üst seviye'; }
    if (!state.pages) state.pages = system ? 'large' : signature ? 'large' : 'medium';
    let total = basePrices[state.pages] || 29900;
    total += stylePrices[state.style] || 0;
    f.forEach(v => total += features.find(x=>x.value===v)?.price || 0);
    let discount = 0;
    if (f.includes('membership') && f.includes('database')) discount += 3000;
    if (f.includes('membership') && f.includes('database') && f.includes('admin')) discount += 7500;
    if (f.includes('admin') && f.includes('database') && f.includes('catalog')) discount += 9000;
    total -= discount;
    if (system) total = Math.max(total, state.sector === 'realestate' ? 99900 : 84900);
    if (f.includes('catalog') && f.includes('admin')) total = Math.max(total, 99900);
    if (state.urgency === 'urgent') total *= 1.25;
    const delivery = system ? '30–50 iş günü' : signature ? '20–30 iş günü' : '12–18 iş günü';
    const rec = { packageName, packageShort, level, total: Math.round(total/100)*100, discount, delivery, sector };
    if (save) state.lastRecommendation = rec;
    return rec;
  }

  function result(){
    const rec = buildRecommendation(true);
    const sector = getSector();
    const featureNames = getFeatureNames();
    const seo = sector?.seo || ['marka adı','hizmet sayfaları','bölgesel aramalar'];
    const sections = sector?.sections || ['Ana sayfa','Hizmetler','Hakkımızda','Referanslar','İletişim'];
    addMessage('bot', `<b>Üst seviye proje analizi hazır.</b>
      <div class="ai-card">
        <h3>${escapeHtml(rec.packageName)}</h3>
        <div class="ai-price">${formatTL(rec.total)}</div>
        <small>Tek nihai ön teklif · kesin kapsam görüşmede netleşir</small>
        <div class="ai-grid">
          <span><b>Sektör</b><br>${escapeHtml(sector?.label || 'Belirtilmedi')}</span>
          <span><b>Tasarım</b><br>${escapeHtml(getStyle()?.label || sector?.style || 'Premium')}</span>
          <span><b>Teslim</b><br>${escapeHtml(rec.delivery)}</span>
          <span><b>Netlik</b><br>${scoreProject()}%</span>
        </div>
        <div class="ai-note"><b>Önerilen yapı:</b> ${escapeHtml(sections.join(' · '))}</div>
        <div class="ai-note"><b>SEO hedefleri:</b> ${escapeHtml(seo.join(' · '))}</div>
        <div class="ai-note"><b>Seçilen özellikler:</b> ${featureNames.length ? escapeHtml(featureNames.join(', ')) : 'Henüz özellik seçilmedi'}</div>
      </div>
      <div class="eb-ai-actions"><a class="eb-ai-action-link" href="#lab" data-ai-scroll-lab>DESIGN LAB</a><a class="eb-ai-action-link" href="#contact" data-ai-scroll-contact>TEKLİF FORMU</a></div>`);
    setQuick([
      {label:'WhatsApp teklif mesajı', action:'whatsapp', primary:true},
      {label:'Formu otomatik doldur', action:'fillForm'},
      {label:'SEO planı çıkar', action:'seoPlan'},
      {label:'Özeti kopyala', action:'export'},
      {label:'Baştan başla', action:'restart'}
    ]);
    updateIntel();
  }

  function seoPlan(){
    const sector = getSector();
    const seo = sector?.seo || ['marka adı + şehir', 'hizmet adı + şehir', 'sektör + bölge'];
    addMessage('bot', `<b>SEO yol haritası:</b><ul><li>Her ana hizmet için ayrı sayfa: ${escapeHtml(seo.join(', '))}</li><li>Başlık, açıklama, sitemap ve Search Console kurulumu yapılır.</li><li>Google sıralaması garanti edilmez; hedef önce marka araması, sonra hizmet + bölge aramalarıdır.</li><li>Gerçek fotoğraflar, müşteri yorumları ve düzenli içerik yükselmeyi güçlendirir.</li></ul>`);
    setQuick([{label:'WhatsApp mesajı',action:'whatsapp',primary:true},{label:'Öneriyi tekrar göster',action:'result'}]);
  }
  function sample(type){
    const examples = {
      beauty:'Mersin’de güzellik merkezim var. Lazer epilasyon, cilt bakımı, kalıcı makyaj, bölgesel incelme ve tırnak hizmetlerim var. Krem-gold lüks tasarım, WhatsApp randevu, yorum paneli, kampanya alanı, hizmet sayfaları ve Google SEO istiyorum.',
      realestate:'Niğde’de emlak ofisim var. Satılık ve kiralık ilanları göstermek, fiyat-mahalle-oda sayısı filtreleme, ilan detay sayfası, WhatsApp iletişim, admin paneli ve Google’da Niğde satılık daire aramalarında görünmek istiyorum.'
    };
    const text = examples[type] || examples.beauty;
    input.value = text;
    answer(text);
  }
  function faq(topic){
    const data = {
      price:'Fiyat; sayfa sayısı, tasarım seviyesi, admin paneli, üyelik, veritabanı ve entegrasyonlara göre hesaplanır. Asistan tek nihai ön teklif çıkarır; resmi teklif kapsam görüşmesinden sonra hazırlanır.',
      seo:'SEO tarafında başlıklar, meta açıklamalar, sitemap, Search Console ve hizmet/bölge sayfaları kurulur. Google sıralaması garanti edilmez; teknik altyapı doğru hazırlanır.',
      payment:'Standart ödeme: %40 başlangıç, %30 tasarım onayı, %30 yayın öncesi. Alan adı, ücretli servisler ve üçüncü taraf maliyetleri ayrıca değerlendirilir.',
      admin:'Admin paneli; yorum, ilan, ürün, öğrenci, randevu veya içerik yönetmek için kullanılır. Veritabanı ve rol/yetki yapısıyla birlikte özel sistem kapsamına girer.'
    };
    addMessage('bot', data[topic] || data.price);
    setQuick([{label:'Paket analizi yap', action:'wizard', primary:true},{label:'WhatsApp', action:'whatsapp'}]);
  }
  function summaryText(){
    const rec = state.lastRecommendation || buildRecommendation(false);
    const featureNames = getFeatureNames();
    return [
      'EB Digital Studio — EB Asistan Pro Ön Değerlendirme',
      `İşletme / marka: ${state.business || 'Belirtilmedi'}`,
      `Sektör: ${getSector()?.label || 'Belirtilmedi'}`,
      `Hedef: ${getGoal()?.label || 'Belirtilmedi'}`,
      `Tasarım dili: ${getStyle()?.label || getSector()?.style || 'Belirtilmedi'}`,
      `Sayfa kapsamı: ${getPages()?.label || 'Belirtilmedi'}`,
      `Özellikler: ${featureNames.length ? featureNames.join(', ') : 'Belirtilmedi'}`,
      `Önerilen paket: ${rec.packageName}`,
      `Tek nihai ön teklif: ${formatTL(rec.total)}`,
      `Tahmini teslim: ${rec.delivery}`,
      'Not: Google sıralaması garanti edilmez; teknik SEO altyapısı ve Search Console kurulumu yapılır.'
    ].join('\n');
  }
  function whatsapp(){
    const msg = summaryText() + '\n\nProjem için detaylı görüşmek istiyorum.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null; else location.href = url;
  }
  async function copySummary(){
    const text = summaryText();
    try { await navigator.clipboard.writeText(text); addMessage('bot','Proje özeti panoya kopyalandı. WhatsApp veya notlara yapıştırabilirsin.'); }
    catch(e){ addMessage('bot', `<b>Proje özeti:</b><br><pre style="white-space:pre-wrap;margin:8px 0 0">${escapeHtml(text)}</pre>`); }
    setQuick([{label:'WhatsApp mesajı',action:'whatsapp',primary:true},{label:'Formu doldur',action:'fillForm'}]);
  }
  function fillForm(){
    const formEl = document.getElementById('proposalForm');
    if (!formEl) { scrollToTarget('#contact'); return; }
    const rec = state.lastRecommendation || buildRecommendation(false);
    if (formEl.name) formEl.name.value = state.business || getSector()?.label || '';
    if (formEl.type) formEl.type.value = rec.packageName.includes('Sistem') ? 'Admin paneli' : 'Kurumsal web sitesi';
    if (formEl.pages) formEl.pages.value = getPages()?.label || 'Henüz belli değil';
    if (formEl.deadline) formEl.deadline.value = state.urgency === 'urgent' ? 'Acil' : '2–4 hafta';
    const details = formEl.querySelector('[name="details"]');
    if (details) details.value = summaryText();
    scrollToTarget('#contact');
  }
  function scrollToTarget(selector){
    close();
    document.querySelector(selector)?.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function answer(text){
    if (!text.trim()) return;
    addMessage('user', escapeHtml(text));
    parseText(text);
    const q = normalize(text);
    if (/(merhaba|selam|sa|slm)/.test(q)) {
      addMessage('bot','Merhaba. Bana işletme türünü ve istediğin sistemi yazarsan kapsam, paket, fiyat ve SEO önerisi çıkarırım.');
      setQuick([{label:'Sihirbazı başlat',action:'wizard',primary:true},{label:'Örnek güzellik',action:'sample',value:'beauty'},{label:'Örnek emlak',action:'sample',value:'realestate'}]);
    } else if (/(fiyat|ücret|maliyet|kaç para|ne kadar|bütçe)/.test(q) || state.sector || state.goal || state.features.length) {
      result();
    } else if (/(ödeme|taksit|kapora)/.test(q)) {
      faq('payment');
    } else if (/(seo|google|search|arama|birinci|sıra)/.test(q)) {
      faq('seo');
    } else if (/(admin|panel|üyelik|veritabanı|supabase|giriş)/.test(q)) {
      faq('admin');
    } else {
      addMessage('bot','Bunu proje açısından netleştirmek için birkaç bilgiye ihtiyacım var. İşletme türünü, hedefini ve istediğin özellikleri yazarsan üst seviye öneri çıkarabilirim.');
      setQuick([{label:'Sihirbazı başlat',action:'wizard',primary:true},{label:'WhatsApp',action:'whatsapp'}]);
    }
    updateIntel();
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
    if (action === 'wizard') startWizard();
    if (action === 'sector') { state.sector = value; addMessage('user', btn.textContent); askGoal(); }
    if (action === 'goal') { state.goal = value; addMessage('user', btn.textContent); askPages(); }
    if (action === 'pages') { state.pages = value; addMessage('user', btn.textContent); askStyle(); }
    if (action === 'style') { state.style = value; addMessage('user', btn.textContent); askFeatures(); }
    if (action === 'feature') { state.features = state.features.includes(value) ? state.features.filter(x=>x!==value) : [...state.features, value]; renderFeatureChips(); }
    if (action === 'result') result();
    if (action === 'whatsapp') whatsapp();
    if (action === 'fillForm') fillForm();
    if (action === 'seoPlan') seoPlan();
    if (action === 'export') copySummary();
    if (action === 'sample') sample(value);
    if (action === 'faq') faq(value);
    if (action === 'lab') scrollToTarget('#lab');
    if (action === 'contact') scrollToTarget('#contact');
    if (action === 'restart') { Object.assign(state,{business:'',sector:'',goal:'',style:'',pages:'',urgency:'normal',features:[],budget:'',lastRecommendation:null,history:[]}); booted=false; boot(); }
    updateIntel();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value;
    input.value = '';
    answer(text);
  });
  addEventListener('keydown', event => {
    if ((event.key === 'a' || event.key === 'A') && (event.ctrlKey || event.metaKey)) { event.preventDefault(); assistant.classList.contains('is-open') ? close() : open(); }
    if (event.key === 'Escape' && assistant.classList.contains('is-open')) close();
  });
})();
