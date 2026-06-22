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
    business:'', city:'', sector:'', goal:'', style:'', pages:'', urgency:'normal',
    features:[], budget:'', tone:'professional', audience:'local', lastRecommendation:null, history:[]
  };
  let booted = false;

  const sectors = [
    {label:'Güzellik merkezi', value:'beauty', weight:96, keywords:['güzellik','lazer','cilt','kalıcı makyaj','tırnak','epilasyon','beauty','salon','diyet','bölgesel incelme','kaş','kirpik'], package:'Signature Web Experience', style:'Krem-gold luxury clinic', seo:['mersin güzellik merkezi','mezitli lazer epilasyon','mersin cilt bakımı','güzellik salonu randevu'], sections:['Premium hero','Hizmet detay sayfaları','WhatsApp randevu','Danışan yorumları','Kampanya vitrini','Galeri','KVKK'], strategy:'Güven, hijyen, randevu ve görsel prestij üzerinden satış.'},
    {label:'Emlak ofisi', value:'realestate', weight:98, keywords:['emlak','gayrimenkul','ilan','satılık','kiralık','arsa','daire','mülk','portföy','konut'], package:'Özel Dijital Sistem', style:'Lacivert-gold yatırım platformu', seo:['niğde satılık daire','niğde kiralık ev','niğde emlakçı','niğde satılık arsa'], sections:['İlan listesi','İlan detay sayfası','Akıllı filtreler','WhatsApp ilan talebi','Admin ilan paneli','Konum odaklı SEO'], strategy:'Portal bağımlılığını azaltıp markaya ait dijital portföy oluşturmak.'},
    {label:'Restoran / kafe', value:'food', weight:88, keywords:['restoran','kafe','cafe','menü','rezervasyon','kahvaltı','yemek','tatlı','organize','doğum günü'], package:'Marka Deneyimi', style:'Sıcak, iştah açıcı, sosyal', seo:['niğde kafe','niğde restoran','kahvaltı niğde','rezervasyon'], sections:['Dijital menü','Rezervasyon','Galeri','Organizasyon paketleri','Harita','Yorumlar'], strategy:'Menüyü, rezervasyonu ve organizasyon paketlerini tek noktada toplamak.'},
    {label:'Fitness / pilates', value:'fitness', weight:92, keywords:['fitness','spor','pilates','reformer','gym','antrenör','koçluk','zumba','diyet'], package:'Signature Web Experience', style:'Dinamik, güçlü, dönüşüm odaklı', seo:['fitness salonu','pilates stüdyosu','online koçluk','reformer pilates'], sections:['Paketler','Eğitmenler','Programlar','Deneme dersi formu','Üyelik talebi','Dönüşüm hikayeleri'], strategy:'Üyelik başvurusu, güven ve dönüşüm hikayesi üzerinden satış.'},
    {label:'Klinik / sağlık', value:'clinic', weight:94, keywords:['klinik','doktor','diş','sağlık','poliklinik','veteriner','hekim','implant','tedavi'], package:'Signature Web Experience', style:'Klinik güven, temiz premium', seo:['randevu','tedavi','klinik','diş hekimi'], sections:['Hizmetler','Uzman profilleri','Randevu','SSS','Gizlilik','Hasta bilgilendirme'], strategy:'Uzmanlık ve güven algısını randevuya dönüştürmek.'},
    {label:'E-ticaret', value:'commerce', weight:90, keywords:['e-ticaret','satış','ürün','sepet','ödeme','shop','mağaza','stok'], package:'Özel Dijital Sistem', style:'Satış odaklı vitrin', seo:['ürün','kategori','online satış','alışveriş'], sections:['Ürün kataloğu','Sepet','Ödeme','Stok yönetimi','Admin paneli','Kampanyalar'], strategy:'Ürün keşfinden ödeme akışına kadar satış sistemini kurmak.'},
    {label:'Eğitim / kurs', value:'education', weight:87, keywords:['kurs','eğitim','okul','öğrenci','ders','lgs','yks','akademi'], package:'Marka Deneyimi', style:'Güven veren kurumsal', seo:['kurs merkezi','özel ders','kayıt','yks kurs'], sections:['Programlar','Ön kayıt','Başarılar','Kadro','Duyurular','Veli güven alanı'], strategy:'Veli/öğrenci güvenini online kayıt talebine çevirmek.'},
    {label:'Mimarlık / inşaat', value:'architecture', weight:91, keywords:['mimarlık','inşaat','iç mimar','proje','dekorasyon','tasarım'], package:'Signature Web Experience', style:'Minimal editorial / portföy odaklı', seo:['mimarlık ofisi','iç mimarlık','anahtar teslim','dekorasyon'], sections:['Proje portföyü','Önce-sonra','Hizmetler','Teklif formu','Galeri','Süreç'], strategy:'Projeleri prestijli sunup keşif/teklif talebi almak.'},
    {label:'Kurumsal şirket', value:'corporate', weight:84, keywords:['kurumsal','şirket','firma','danışmanlık','üretim','hizmet'], package:'Marka Deneyimi', style:'Kurumsal güven ve netlik', seo:['kurumsal web sitesi','firma tanıtım','hizmet şirketi'], sections:['Hakkımızda','Hizmetler','Referanslar','Teklif formu','İletişim','Süreç'], strategy:'Güveni, referansı ve hizmetleri net teklif akışına bağlamak.'},
    {label:'Kişisel marka', value:'personal', weight:74, keywords:['kişisel','portföy','cv','benim sitem','freelance','influencer'], package:'Dijital Başlangıç', style:'Minimal / karakter sahibi', seo:['kişisel portföy','kişisel web sitesi','freelance'], sections:['Hero','Hakkımda','Projeler','Sosyal medya','İletişim'], strategy:'Kişisel algıyı profesyonel portföye çevirmek.'}
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
    {label:'Futuristik', value:'futuristic', description:'Neon, teknoloji, 3D etki, güçlü wow etkisi'},
    {label:'Lüks', value:'luxury', description:'Gold, editorial, premium marka algısı'},
    {label:'Minimal', value:'minimal', description:'Temiz, sakin, pahalı boşluk kullanımı'},
    {label:'Kurumsal', value:'corporate', description:'Güven, düzen, ciddi firma yapısı'}
  ];
  const pages = [
    {label:'1–3 sayfa', value:'small'}, {label:'4–7 sayfa', value:'medium'}, {label:'8–12 sayfa', value:'large'}, {label:'13+ sayfa', value:'xlarge'}
  ];
  const features = [
    {label:'Admin paneli', value:'admin', price:20000, keywords:['admin','panel','yönetim']},
    {label:'Üyelik sistemi', value:'membership', price:15000, keywords:['üyelik','giriş','login','kayıt']},
    {label:'Veritabanı', value:'database', price:12000, keywords:['veritabanı','database','supabase','kayıt tut']},
    {label:'Randevu / rezervasyon', value:'appointment', price:6000, keywords:['randevu','rezervasyon','takvim']},
    {label:'Ödeme entegrasyonu', value:'payment', price:15000, keywords:['ödeme','shopier','iyzico','kart','satın alma']},
    {label:'Blog / içerik sistemi', value:'blog', price:8000, keywords:['blog','içerik','makale','duyuru']},
    {label:'Galeri / portföy', value:'gallery', price:4000, keywords:['galeri','fotoğraf','portföy','görsel']},
    {label:'Gelişmiş SEO', value:'seo', price:5000, keywords:['seo','google','arama','search console','sıra']},
    {label:'Çoklu dil', value:'language', price:7500, keywords:['ingilizce','çoklu dil','ikinci dil','arapça']},
    {label:'Gelişmiş animasyon', value:'animation', price:7500, keywords:['animasyon','hareketli','efekt','wow','3d']},
    {label:'Yorum paneli', value:'reviews', price:9000, keywords:['yorum','değerlendirme','puan','review']},
    {label:'Dosya / fotoğraf yükleme', value:'upload', price:8000, keywords:['yükleme','fotoğraf ekleme','dosya','resim ekleme']},
    {label:'Rol ve yetki sistemi', value:'roles', price:8000, keywords:['rol','yetki','coach','admin rol','personel']},
    {label:'İlan / ürün yönetimi', value:'catalog', price:18000, keywords:['ilan','ürün yönetimi','katalog','portföy yönetimi','listeleme','filtre']}
  ];
  const basePrices = { small:17900, medium:29900, large:49900, xlarge:64900 };
  const stylePrices = { futuristic:7500, luxury:6000, minimal:0, corporate:3000 };

  function escapeHtml(value){ return String(value || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function formatTL(n){ return new Intl.NumberFormat('tr-TR').format(Math.max(0, Math.round(n))) + ' TL'; }
  function normalize(text){ return String(text||'').toLocaleLowerCase('tr-TR'); }
  function getSector(){ return sectors.find(x=>x.value===state.sector); }
  function getGoal(){ return goals.find(x=>x.value===state.goal); }
  function getStyle(){ return styles.find(x=>x.value===state.style); }
  function getPages(){ return pages.find(x=>x.value===state.pages); }
  function getFeatureNames(){ return features.filter(x=>state.features.includes(x.value)).map(x=>x.label); }
  function uniquePush(arr, value){ if(value && !arr.includes(value)) arr.push(value); }

  function addMessage(role, html){
    const node = document.createElement('div');
    node.className = `eb-ai-msg ${role}`;
    node.innerHTML = html;
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    state.history.push({role, html: html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,1200)});
  }
  function setQuick(items){
    quick.innerHTML = '';
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `eb-ai-chip ${item.primary ? 'primary' : ''} ${item.active ? 'is-active' : ''} ${item.danger ? 'danger' : ''}`;
      btn.textContent = item.label;
      btn.dataset.aiAction = item.action;
      if (item.value !== undefined) btn.dataset.value = item.value;
      quick.appendChild(btn);
    });
  }

  function scoreProject(){
    let score = 0;
    if (state.sector) score += 20;
    if (state.goal) score += 16;
    if (state.pages) score += 12;
    if (state.style) score += 12;
    if (state.features.length) score += Math.min(22, state.features.length * 4);
    if (state.business) score += 7;
    if (state.city) score += 5;
    if (state.budget) score += 3;
    if (state.urgency !== 'normal') score += 3;
    return Math.min(100, score);
  }
  function opportunityScore(){
    const sector = getSector();
    let score = sector?.weight || 78;
    if (state.features.includes('appointment') || state.features.includes('catalog')) score += 5;
    if (state.features.includes('seo')) score += 4;
    if (state.features.includes('reviews')) score += 3;
    if (state.city) score += 2;
    if (state.budget) score += 2;
    return Math.min(100, score);
  }
  function riskScore(){
    let risk = 22;
    if (!state.business) risk += 8;
    if (!state.city) risk += 5;
    if (!state.pages) risk += 6;
    if (state.features.includes('payment')) risk += 7;
    if (state.features.includes('roles')) risk += 6;
    if (state.urgency === 'urgent') risk += 9;
    return Math.min(70, risk);
  }

  function updateIntel(){
    const rec = buildRecommendation(false);
    const sector = getSector();
    const featureNames = getFeatureNames();
    if (stateSector) { stateSector.textContent = sector?.label?.toUpperCase() || 'SEKTÖR'; stateSector.nextElementSibling.textContent = state.sector ? 'algılandı' : 'bekleniyor'; }
    if (statePackage) { statePackage.textContent = rec.packageShort || 'PAKET'; statePackage.nextElementSibling.textContent = rec.level || 'analiz yok'; }
    if (statePrice) { statePrice.textContent = rec.total ? formatTL(rec.total) : 'FİYAT'; statePrice.nextElementSibling.textContent = rec.total ? 'ön teklif' : 'ön teklif yok'; }
    if (intelScore) intelScore.textContent = `${scoreProject()}%`;
    if (intelList) {
      intelList.innerHTML = [
        `<span><b>Fırsat:</b> ${opportunityScore()} / 100</span>`,
        `<span><b>Risk:</b> ${riskScore()} / 100</span>`,
        `<span><b>Stil:</b> ${escapeHtml(getStyle()?.label || sector?.style || 'Belirlenmedi')}</span>`,
        `<span><b>Hedef:</b> ${escapeHtml(getGoal()?.label || 'Belirlenmedi')}</span>`,
        `<span><b>Özellik:</b> ${featureNames.length ? escapeHtml(featureNames.slice(0,3).join(', ')) : 'Seçilmedi'}</span>`,
        `<span><b>Teslim:</b> ${escapeHtml(rec.delivery)}</span>`
      ].join('');
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
    addMessage('bot', `<b>Merhaba, ben EB Copilot OS.</b><br>Bir müşterinin tek mesajından sektörünü, gerçek ihtiyacını, satış potansiyelini, risklerini, paketini, fiyatını, SEO yolunu ve WhatsApp teklif özetini çıkarırım.<div class="ai-note"><b>Üst seviye mod:</b> Projeyi sadece “site” olarak değil; satış, güven, randevu, ilan, admin panel ve Google görünürlüğü sistemi olarak kurgularım.</div>`);
    setQuick([
      {label:'Derin analiz başlat', action:'wizard', primary:true},
      {label:'Güzellik merkezi senaryosu', action:'sample', value:'beauty'},
      {label:'Emlak ofisi senaryosu', action:'sample', value:'realestate'},
      {label:'İtiraz cevapları', action:'objections'},
      {label:'Satış mesajı üret', action:'salesScript'}
    ]);
    updateIntel();
  }

  function startWizard(){
    addMessage('bot','Derin analiz için önce işletme türünü seç. Sonra hedef, sayfa kapsamı, tasarım dili ve modülleri belirleyeceğim. En sonunda yönetici özeti, fiyat, yol haritası ve satış mesajı vereceğim.');
    setQuick(sectors.map(s => ({label:s.label, action:'sector', value:s.value})));
  }
  function askGoal(){ addMessage('bot','Bu projede asıl ticari hedef ne olsun?'); setQuick(goals.map(g => ({label:g.label, action:'goal', value:g.value}))); }
  function askPages(){ addMessage('bot','Yaklaşık kaç sayfalık veya kaç ekranlık yapı gerekir?'); setQuick(pages.map(p => ({label:p.label, action:'pages', value:p.value}))); }
  function askStyle(){ addMessage('bot','Tasarım dili müşteride nasıl bir ilk izlenim bırakmalı?'); setQuick(styles.map(s => ({label:s.label, action:'style', value:s.value}))); }
  function askFeatures(){ addMessage('bot','Modülleri seç. Birden fazla işaretleyebilirsin. Sistem bağlantılı özellikleri fiyat ve paket seviyesine göre otomatik yorumlayacağım.'); renderFeatureChips(); }
  function renderFeatureChips(){
    const list = features.map(f => ({label: state.features.includes(f.value) ? `✓ ${f.label}` : f.label, action:'feature', value:f.value, active:state.features.includes(f.value)}));
    list.push({label:'Copilot analizini çıkar', action:'result', primary:true});
    setQuick(list);
  }

  function parseText(text){
    const q = normalize(text);
    let best = {sector:null, hits:0};
    sectors.forEach(s => {
      const hits = s.keywords.filter(k => q.includes(k)).length;
      if (hits > best.hits) best = {sector:s, hits};
    });
    if (best.sector) state.sector = best.sector.value;
    const cityMatch = q.match(/\b(niğde|mersin|mezitli|bor|adana|kayseri|istanbul|ankara|izmir|konya|antalya)\b/);
    if (cityMatch) state.city = cityMatch[1].replace(/^./, c => c.toLocaleUpperCase('tr-TR'));
    if (/randevu|rezervasyon|appointment|takvim/.test(q)) state.goal = 'appointment';
    if (/ilan|portföy|proje galerisi|mülk|ürünleri göster|listele|filtre/.test(q)) state.goal = 'portfolio';
    if (/satış|teklif|müşteri kazan|sipariş|ödeme|dönüşüm|lead/.test(q)) state.goal = 'sales';
    if (/güven|kurumsal|prestij|profesyonel|marka algısı/.test(q)) state.goal = state.goal || 'trust';
    if (/google|seo|arama|search|sıra|görünür|harita|business/.test(q)) state.goal = 'seo';
    if (/admin|panel|üyelik|veritabanı|supabase|giriş|login|yönetmek/.test(q)) state.goal = 'system';
    if (/futuristik|neon|teknolojik|cyber|gelecek/.test(q)) state.style = 'futuristic';
    if (/lüks|premium|gold|altın|prestij|zarif|krem|rose|şampanya/.test(q)) state.style = 'luxury';
    if (/minimal|sade|temiz|beyaz|ferah/.test(q)) state.style = 'minimal';
    if (/kurumsal|ciddi|güven|lacivert/.test(q)) state.style = state.style || 'corporate';
    const pageMatch = q.match(/(\d{1,2})\s*(sayfa|sayfalık|ekran)/);
    if (pageMatch) {
      const n = Number(pageMatch[1]);
      state.pages = n <= 3 ? 'small' : n <= 7 ? 'medium' : n <= 12 ? 'large' : 'xlarge';
    }
    if (/acil|hızlı|çok çabuk|hemen|bu hafta/.test(q)) state.urgency = 'urgent';
    features.forEach(f => { if (f.keywords.some(k => q.includes(k))) uniquePush(state.features, f.value); });
    if (state.sector === 'beauty') { uniquePush(state.features,'appointment'); uniquePush(state.features,'seo'); if(/yorum|güven|deneyim/.test(q)) uniquePush(state.features,'reviews'); }
    if (state.sector === 'realestate') { uniquePush(state.features,'catalog'); uniquePush(state.features,'admin'); uniquePush(state.features,'database'); uniquePush(state.features,'seo'); }
    if (state.sector === 'commerce') { uniquePush(state.features,'catalog'); uniquePush(state.features,'payment'); uniquePush(state.features,'admin'); }
    const budgetMatch = q.match(/(\d{2,3})(?:\.|,)?(\d{0,3})\s*(bin|k|tl)?/);
    if (budgetMatch && /(bütçe|tl|fiyat|maliyet|para|bin)/.test(q)) state.budget = budgetMatch[0];
    const businessMatch = text.match(/(?:markam|işletmem|firmam|şirketim|adımız|adı|site adı|marka adı)\s*:??\s*([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s&.-]{2,45})/);
    if (businessMatch) state.business = businessMatch[1].trim().replace(/[.。]$/,'');
    if (!state.pages) {
      if (state.goal === 'system' || state.features.includes('admin') || state.features.includes('catalog')) state.pages = 'large';
      else if (state.sector === 'beauty' || state.sector === 'clinic' || state.features.includes('seo')) state.pages = 'large';
      else if (state.sector || state.goal) state.pages = 'medium';
    }
  }

  function buildRecommendation(save=true){
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
    if (f.includes('appointment') && f.includes('reviews') && state.sector === 'beauty') discount += 2500;
    total -= discount;
    if (system) total = Math.max(total, state.sector === 'realestate' ? 99900 : 84900);
    if (f.includes('catalog') && f.includes('admin')) total = Math.max(total, 99900);
    if (state.sector === 'beauty' && f.includes('reviews') && f.includes('appointment') && f.includes('seo')) total = Math.max(total, 69900);
    if (state.urgency === 'urgent') total *= 1.25;
    const delivery = system ? '30–50 iş günü' : signature ? '20–30 iş günü' : '12–18 iş günü';
    const rec = { packageName, packageShort, level, total: Math.round(total/100)*100, discount, delivery };
    if (save) state.lastRecommendation = rec;
    return rec;
  }

  function recommendedMustHaves(){
    const sector = getSector();
    if (!sector) return ['Net marka mesajı','Mobil hızlı arayüz','WhatsApp teklif akışı','SEO temel kurulumu','Güven artırıcı içerikler'];
    const map = {
      beauty:['Hizmet detay sayfaları','WhatsApp randevu','Danışan yorum paneli','Kampanya vitrini','Krem-gold premium görsel dil','KVKK/gizlilik metinleri'],
      realestate:['İlan listesi ve filtreleme','İlan detay şablonu','Admin ilan yönetimi','WhatsApp ilan talebi','Mahalle bazlı SEO sayfaları','Portföy güven alanı'],
      food:['Dijital menü','Rezervasyon butonu','Galeri','Kampanya/etkinlik alanı','Harita ve çalışma saatleri','Mobil hızlı menü'],
      clinic:['Uzman profilleri','Hizmet/treatment sayfaları','Randevu talebi','SSS','KVKK ve gizlilik','Hasta güven kartları'],
      fitness:['Üyelik paketleri','Deneme dersi formu','Eğitmen alanı','Program sayfaları','Dönüşüm/hikaye alanı','WhatsApp başvuru'],
      education:['Ön kayıt formu','Program sayfaları','Öğretmen kadrosu','Başarılar','Veli güven alanı','Duyurular'],
      architecture:['Proje portföyü','Önce/sonra sunum','Teklif/keşif formu','Hizmet detayları','Minimal premium galeri','Referans alanı'],
      commerce:['Ürün katalogları','Sepet ve ödeme','Admin ürün yönetimi','Kampanya alanı','Stok/kategori altyapısı','Sipariş bildirimi']
    };
    return map[sector.value] || sector.sections;
  }
  function missingInfo(){
    const list = [];
    if (!state.business) list.push('Marka/işletme adı');
    if (!state.city) list.push('Şehir/bölge hedefi');
    if (!state.style) list.push('Tasarım dili');
    if (!state.budget) list.push('Yaklaşık bütçe beklentisi');
    if (!state.features.length) list.push('Gerekli modüller');
    return list.length ? list : ['Temel bilgiler yeterli; içerik ve fotoğraflar son aşamada netleşir.'];
  }
  function roadmap(){
    const rec = state.lastRecommendation || buildRecommendation(false);
    const system = rec.packageShort === 'SİSTEM';
    return system ? [
      '1. Kapsam ve veri yapısı netleştirme', '2. Premium arayüz + mobil tasarım', '3. Veritabanı, admin panel ve roller', '4. İçerik/ilan/modül girişleri', '5. Test, güvenlik kontrolü, Search Console', '6. Yayın ve kullanım eğitimi'
    ] : [
      '1. Marka dili ve içerik planı', '2. Premium ana sayfa tasarımı', '3. Hizmet/proje sayfaları', '4. WhatsApp teklif/randevu akışı', '5. SEO ve performans kontrolü', '6. Yayın ve teslim'
    ];
  }
  function result(){
    const rec = buildRecommendation(true);
    const sector = getSector();
    const featureNames = getFeatureNames();
    const seo = sector?.seo || ['marka adı + şehir','hizmet adı + şehir','sektör + bölge'];
    const must = recommendedMustHaves();
    const missing = missingInfo();
    addMessage('bot', `<b>Copilot OS analiz raporu hazır.</b>
      <div class="ai-card ai-elite-brief">
        <div class="ai-brief-top"><span>EXECUTIVE PROJECT BRIEF</span><strong>${escapeHtml(rec.packageName)}</strong></div>
        <div class="ai-price">${formatTL(rec.total)}</div>
        <small>Tek nihai ön teklif · kesin kapsam görüşmede netleşir</small>
        <div class="ai-grid ai-metrics">
          <span><b>Fırsat Skoru</b><br>${opportunityScore()} / 100</span>
          <span><b>Netlik</b><br>${scoreProject()}%</span>
          <span><b>Risk</b><br>${riskScore()} / 100</span>
          <span><b>Teslim</b><br>${escapeHtml(rec.delivery)}</span>
        </div>
        <div class="ai-note"><b>Satış açısı:</b> ${escapeHtml(sector?.strategy || 'Markayı daha güvenilir gösterip teklif taleplerini artırmak.')}</div>
        <div class="ai-note"><b>Olmazsa olmaz modüller:</b> ${escapeHtml(must.join(' · '))}</div>
        <div class="ai-note"><b>SEO hedefleri:</b> ${escapeHtml(seo.join(' · '))}</div>
        <div class="ai-note"><b>Seçilen özellikler:</b> ${featureNames.length ? escapeHtml(featureNames.join(', ')) : 'Henüz özellik seçilmedi'}</div>
        <div class="ai-note"><b>Eksik bilgiler:</b> ${escapeHtml(missing.join(' · '))}</div>
      </div>
      <div class="eb-ai-actions"><a class="eb-ai-action-link" href="#lab" data-ai-scroll-lab>DESIGN LAB</a><a class="eb-ai-action-link" href="#contact" data-ai-scroll-contact>TEKLİF FORMU</a></div>`);
    setQuick([
      {label:'WhatsApp teklif mesajı', action:'whatsapp', primary:true},
      {label:'Yol haritası', action:'roadmap'},
      {label:'İtiraz cevapları', action:'objections'},
      {label:'Satış mesajı üret', action:'salesScript'},
      {label:'Formu doldur', action:'fillForm'},
      {label:'Özeti kopyala', action:'export'}
    ]);
    updateIntel();
  }
  function showRoadmap(){
    addMessage('bot', `<b>Uygulama yol haritası:</b><ul>${roadmap().map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><div class="ai-note">Bu plan müşteriye “site yaparız” yerine “kontrollü proje süreci yürütürüz” hissi verir.</div>`);
    setQuick([{label:'WhatsApp özeti', action:'whatsapp', primary:true},{label:'Satış mesajı',action:'salesScript'},{label:'Analizi tekrar göster',action:'result'}]);
  }
  function seoPlan(){
    const sector = getSector();
    const seo = sector?.seo || ['marka adı + şehir', 'hizmet adı + şehir', 'sektör + bölge'];
    addMessage('bot', `<b>SEO stratejisi:</b><ul><li>Önce marka araması: işletme adı + şehir.</li><li>Sonra hizmet/bölge sayfaları: ${escapeHtml(seo.join(', '))}.</li><li>Sitemap, robots, title, meta açıklama ve Search Console kurulumu yapılır.</li><li>Google sıralaması garanti edilmez; doğru teknik altyapı ve içerik planı kurulur.</li><li>Gerçek fotoğraflar, yorumlar ve düzenli güncelleme yükselmeyi güçlendirir.</li></ul>`);
    setQuick([{label:'Yol haritası',action:'roadmap',primary:true},{label:'WhatsApp mesajı',action:'whatsapp'}]);
  }
  function objections(){
    addMessage('bot', `<b>Müşteri itirazlarına hazır cevaplar:</b>
      <div class="ai-card"><h3>“Fiyat yüksek.”</h3><p>Bu çalışma yalnızca görsel site değil; markanız için randevu/teklif toplayan, Google’a hazır ve uzun süre kullanılacak dijital altyapıdır. Kapsamı küçültüp başlangıç paketiyle de ilerleyebiliriz.</p></div>
      <div class="ai-card"><h3>“Instagram yetiyor.”</h3><p>Instagram görünürlük sağlar ama arama yapan müşteri Google’da sizi bulamayabilir. Web sitesi; hizmetleri, güven bilgilerini ve başvuru akışını tek merkezde toplar.</p></div>
      <div class="ai-card"><h3>“Google’da çıkar mıyız?”</h3><p>Marka aramasında görünmek ilk hedeftir. Hizmet + şehir aramalarında yükselmek için doğru sayfa yapısı, Search Console, içerik ve zaman gerekir. Sıralama garanti edilmez.</p></div>`);
    setQuick([{label:'Satış mesajı üret',action:'salesScript',primary:true},{label:'Analiz raporu',action:'result'}]);
  }
  function salesScript(){
    const sector = getSector();
    const rec = state.lastRecommendation || buildRecommendation(false);
    const business = state.business || (sector ? sector.label : 'işletmeniz');
    const city = state.city || 'bölgenizde';
    addMessage('bot', `<b>Müşteriye gönderilecek premium ilk mesaj:</b><pre class="ai-copy">Merhaba, ${escapeHtml(business)} yetkilisiyle mi görüşüyorum?\n\nBen Efecan Berber. EB Digital Studio olarak işletmelere özel web siteleri ve dijital sistemler hazırlıyorum. ${escapeHtml(city)} odağında markanızı daha kurumsal gösterecek, müşterilerin hizmetlerinize daha kolay ulaşmasını sağlayacak bir site yapısı düşündüm.\n\nSizin için önerdiğim yapı: ${escapeHtml(rec.packageName)}. Bu yapı; ${escapeHtml(recommendedMustHaves().slice(0,4).join(', '))} gibi bölümlerle işletmenizin daha güvenilir ve profesyonel görünmesini sağlar.\n\nUygun görürseniz kısa bir ön izleme hazırlayıp hiçbir zorunluluk olmadan paylaşabilirim. 5 dakikalık kısa bir görüşme yapabilir miyiz?</pre>`);
    setQuick([{label:'Metni kopyala',action:'export',primary:true},{label:'WhatsApp',action:'whatsapp'},{label:'İtiraz cevapları',action:'objections'}]);
  }
  function sample(type){
    const examples = {
      beauty:'Mersin Mezitli’de Merve Yıldırım Beauty adında güzellik merkezim var. Lazer epilasyon, cilt bakımı, kalıcı makyaj, bölgesel incelme ve tırnak hizmetleri veriyoruz. Krem-gold lüks tasarım istiyorum. WhatsApp randevu, yorum paneli, kampanya alanı, hizmet detay sayfaları, galeri, KVKK ve Google SEO olsun. Mersin güzellik merkezi ve Mezitli lazer epilasyon aramalarında zamanla görünmek istiyorum.',
      realestate:'Niğde’de Net Emlak adında emlak ofisim var. Satılık daire, kiralık daire, arsa ve iş yeri ilanlarını göstermek istiyorum. Müşteri fiyat, mahalle, oda sayısı ve mülk türüne göre filtreleme yapabilsin. Her ilanın detay sayfası, WhatsApp bilgi al butonu, admin ilan paneli, veritabanı ve Niğde satılık daire SEO altyapısı olsun.'
    };
    input.value = examples[type] || examples.beauty;
    answer(input.value);
    input.value = '';
  }
  function faq(topic){
    const data = {
      price:'Fiyat; sayfa sayısı, tasarım seviyesi, admin paneli, üyelik, veritabanı ve entegrasyonlara göre hesaplanır. Copilot tek nihai ön teklif çıkarır; resmi teklif kapsam görüşmesinden sonra hazırlanır.',
      seo:'SEO tarafında başlıklar, meta açıklamalar, sitemap, Search Console ve hizmet/bölge sayfaları kurulur. Google sıralaması garanti edilmez; teknik altyapı doğru hazırlanır.',
      payment:'Standart ödeme: %40 başlangıç, %30 tasarım onayı, %30 yayın öncesi. Alan adı, ücretli servisler ve üçüncü taraf maliyetleri ayrıca değerlendirilir.',
      admin:'Admin paneli; yorum, ilan, ürün, öğrenci, randevu veya içerik yönetmek için kullanılır. Veritabanı ve rol/yetki yapısıyla birlikte özel sistem kapsamına girer.'
    };
    addMessage('bot', data[topic] || data.price);
    setQuick([{label:'Derin analiz yap', action:'wizard', primary:true},{label:'SEO planı',action:'seoPlan'},{label:'WhatsApp', action:'whatsapp'}]);
  }
  function summaryText(){
    const rec = state.lastRecommendation || buildRecommendation(false);
    const featureNames = getFeatureNames();
    return [
      'EB Digital Studio — EB Copilot OS Ön Değerlendirme',
      `İşletme / marka: ${state.business || 'Belirtilmedi'}`,
      `Şehir / bölge: ${state.city || 'Belirtilmedi'}`,
      `Sektör: ${getSector()?.label || 'Belirtilmedi'}`,
      `Hedef: ${getGoal()?.label || 'Belirtilmedi'}`,
      `Tasarım dili: ${getStyle()?.label || getSector()?.style || 'Belirtilmedi'}`,
      `Sayfa kapsamı: ${getPages()?.label || 'Belirtilmedi'}`,
      `Özellikler: ${featureNames.length ? featureNames.join(', ') : 'Belirtilmedi'}`,
      `Fırsat skoru: ${opportunityScore()} / 100`,
      `Önerilen paket: ${rec.packageName}`,
      `Tek nihai ön teklif: ${formatTL(rec.total)}`,
      `Tahmini teslim: ${rec.delivery}`,
      `Olmazsa olmazlar: ${recommendedMustHaves().join(', ')}`,
      `Eksik bilgiler: ${missingInfo().join(', ')}`,
      'Not: Google sıralaması garanti edilmez; teknik SEO altyapısı ve Search Console kurulumu yapılır.'
    ].join('\n');
  }
  async function copySummary(){
    const text = summaryText();
    try { await navigator.clipboard.writeText(text); addMessage('bot','Copilot özeti panoya kopyalandı. WhatsApp, teklif notu veya CRM alanına yapıştırabilirsin.'); }
    catch(e){ addMessage('bot', `<b>Copilot özeti:</b><pre class="ai-copy">${escapeHtml(text)}</pre>`); }
    setQuick([{label:'WhatsApp mesajı',action:'whatsapp',primary:true},{label:'Formu doldur',action:'fillForm'}]);
  }
  function whatsapp(){
    const msg = summaryText() + '\n\nProjem için detaylı görüşmek istiyorum.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null; else location.href = url;
  }
  function fillForm(){
    const formEl = document.getElementById('proposalForm');
    if (!formEl) { scrollToTarget('#contact'); return; }
    const rec = state.lastRecommendation || buildRecommendation(false);
    if (formEl.name) formEl.name.value = state.business || getSector()?.label || '';
    if (formEl.type) formEl.type.value = rec.packageName.includes('Sistem') ? 'Admin paneli' : 'Kurumsal web sitesi';
    if (formEl.pages) formEl.pages.value = getPages()?.label || 'Henüz belli değil';
    if (formEl.deadline) formEl.deadline.value = state.urgency === 'urgent' ? 'Acil' : '2–4 hafta';
    const checks = [...formEl.querySelectorAll('[name="feature"]')];
    checks.forEach(c => { c.checked = getFeatureNames().some(n => c.value.includes(n.split(' ')[0])) || (c.value === 'Admin paneli' && state.features.includes('admin')) || (c.value === 'Veritabanı' && state.features.includes('database')) || (c.value === 'Üyelik sistemi' && state.features.includes('membership')); });
    const details = formEl.querySelector('[name="details"]');
    if (details) details.value = summaryText();
    scrollToTarget('#contact');
  }
  function scrollToTarget(selector){ close(); document.querySelector(selector)?.scrollIntoView({behavior:'smooth', block:'start'}); }

  function answer(text){
    if (!text.trim()) return;
    addMessage('user', escapeHtml(text));
    parseText(text);
    const q = normalize(text);
    if (/(merhaba|selam|sa|slm)/.test(q) && q.length < 35) {
      addMessage('bot','Merhaba. İşletme türünü, şehri, istediğin özellikleri ve hedefini yaz; ben sana üst seviye proje briefi, fiyat ve satış yol haritası çıkarayım.');
      setQuick([{label:'Derin analiz başlat',action:'wizard',primary:true},{label:'Güzellik örneği',action:'sample',value:'beauty'},{label:'Emlak örneği',action:'sample',value:'realestate'}]);
    } else if (/(ödeme|taksit|kapora)/.test(q)) faq('payment');
    else if (/(seo|google|search|arama|birinci|sıra)/.test(q) && !state.sector && !state.features.length) faq('seo');
    else if (/(admin|panel|üyelik|veritabanı|supabase|giriş)/.test(q) && !state.sector) faq('admin');
    else result();
    updateIntel();
  }

  function handleAction(action, value, label){
    if (action === 'wizard') startWizard();
    if (action === 'sector') { state.sector = value; addMessage('user', label); askGoal(); }
    if (action === 'goal') { state.goal = value; addMessage('user', label); askPages(); }
    if (action === 'pages') { state.pages = value; addMessage('user', label); askStyle(); }
    if (action === 'style') { state.style = value; addMessage('user', label); askFeatures(); }
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
    if (action === 'roadmap') showRoadmap();
    if (action === 'objections') objections();
    if (action === 'salesScript') salesScript();
    if (action === 'restart') { Object.assign(state,{business:'',city:'',sector:'',goal:'',style:'',pages:'',urgency:'normal',features:[],budget:'',tone:'professional',audience:'local',lastRecommendation:null,history:[]}); booted=false; boot(); }
    updateIntel();
  }

  document.addEventListener('click', event => {
    const openBtn = event.target.closest('[data-assistant-open]');
    if (openBtn) { event.preventDefault(); event.stopPropagation(); open(); return; }
    if (event.target.closest('[data-assistant-close]')) { event.preventDefault(); close(); return; }
    if (event.target.closest('[data-ai-scroll-lab]')) { event.preventDefault(); scrollToTarget('#lab'); return; }
    if (event.target.closest('[data-ai-scroll-contact]')) { event.preventDefault(); scrollToTarget('#contact'); return; }
    const actionBtn = event.target.closest('[data-ai-action]');
    if (actionBtn && assistant.contains(actionBtn)) {
      event.preventDefault();
      handleAction(actionBtn.dataset.aiAction, actionBtn.dataset.value, actionBtn.textContent.trim());
    }
  }, true);

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
