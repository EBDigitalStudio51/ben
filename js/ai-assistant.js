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
  const VERSION = '5.8';

  const state = {
    business:'', city:'', district:'', sector:'', goal:'', style:'', pages:'', urgency:'normal',
    audience:'local', features:[], budget:'', lastText:'', lastBrief:null, history:[],
    mode:'strategist', leadTemperature:'warm'
  };
  let booted = false;

  const sectorDB = [
    {
      label:'Güzellik / Beauty Clinic', value:'beauty', weight:98,
      keywords:['güzellik','beauty','lazer','epilasyon','cilt','kalıcı makyaj','tırnak','bölgesel','incelme','diyet','kaş','kirpik','salon','mezitli','estetik'],
      package:'Signature Web Experience', style:'Krem–gold luxury clinic',
      baseGoal:'Randevu, güven, hijyen ve premium algıyı aynı anda yükseltmek.',
      pages:['Ana sayfa','Hakkımızda','Lazer epilasyon','Cilt bakımı','Kalıcı makyaj','Bölgesel incelme','Tırnak hizmetleri','Kampanyalar','Danışan yorumları','Randevu al','İletişim','Gizlilik / KVKK'],
      seo:['mersin güzellik merkezi','mezitli lazer epilasyon','mersin cilt bakımı','mersin kalıcı makyaj','güzellik salonu randevu'],
      modules:['WhatsApp randevu akışı','Onaylı danışan yorum paneli','Kampanya vitrini','Hizmet detay sayfaları','Galeri','KVKK onayları'],
      pains:['Instagram içerikleri dağınık kalır','Hizmet güveni sayfa sayfa anlatılamaz','Randevu soruları tekrarlanır','Google aramalarından yeterli talep alınmaz'],
      sales:'Bu siteyi “güzellik salonu vitrini” değil, randevu üreten premium bakım merkezi deneyimi olarak konumlandır.',
      caution:['Kesin sonuç, garanti zayıflama, tıbbi tedavi iddiası kullanma','Öncesi/sonrası görseller için açık izin iste','Yorumları işletme onayından geçir']
    },
    {
      label:'Emlak / Gayrimenkul', value:'realestate', weight:99,
      keywords:['emlak','gayrimenkul','ilan','satılık','kiralık','arsa','daire','mülk','konut','portföy','ofis','iş yeri','tapu','mahalle'],
      package:'Özel Dijital Sistem', style:'Lacivert–gold yatırım platformu',
      baseGoal:'İlanları portallardan bağımsız, markaya ait güvenilir dijital portföye dönüştürmek.',
      pages:['Ana sayfa','Satılık ilanlar','Kiralık ilanlar','Arsa & yatırım','İlan detay sayfası','Hakkımızda','Danışmanlık','Portföy ekle','İletişim'],
      seo:['niğde satılık daire','niğde kiralık ev','niğde emlakçı','niğde satılık arsa','niğde gayrimenkul danışmanlığı'],
      modules:['İlan listeleme','Gelişmiş filtreleme','İlan detay sayfası','WhatsApp ilan talebi','Admin ilan yönetimi','Konum ve mahalle odaklı SEO'],
      pains:['İlanlar sosyal medyada hızlı kaybolur','Portal bağımlılığı marka değerini düşürür','Müşteri fiyat/konum/oda bilgisi için tekrar tekrar sorar'],
      sales:'Siteyi “ilan panosu” değil, Net Emlak adına çalışan dijital emlak ofisi gibi sun.',
      caution:['Fiyat ve tapu bilgisinin güncelliğini işletme onaylasın','Sahte ilan veya temsil edilmeyen mülk yayınlanmasın']
    },
    {
      label:'Restoran / Kafe', value:'food', weight:88,
      keywords:['restoran','kafe','cafe','menü','rezervasyon','kahvaltı','tatlı','yemek','doğum günü','organizasyon','masa'],
      package:'Marka Deneyimi', style:'Sıcak premium gastro deneyimi',
      baseGoal:'Menü, rezervasyon ve organizasyon taleplerini düzenli bir dijital akışa çevirmek.',
      pages:['Ana sayfa','Dijital menü','Rezervasyon','Organizasyon paketleri','Galeri','Yorumlar','Konum'],
      seo:['niğde kafe','niğde restoran','niğde kahvaltı','niğde doğum günü organizasyonu'],
      modules:['QR dijital menü','WhatsApp rezervasyon','Galeri','Kampanya alanı','Çalışma saatleri','Harita'],
      pains:['Menü dağınık görünür','Fiyat ve rezervasyon soruları tekrar eder','Etkinlik paketleri yeterince satılamaz'],
      sales:'İştah açıcı görsel dil + hızlı rezervasyon = daha fazla masa ve organizasyon talebi.',
      caution:['Fiyatlar güncel tutulmalı','Gıda görsellerinde gerçeklik korunmalı']
    },
    {
      label:'Fitness / Pilates', value:'fitness', weight:92,
      keywords:['fitness','pilates','gym','reformer','spor','antrenör','koçluk','zumba','üyelik','salon'],
      package:'Signature Web Experience', style:'Dinamik, güçlü, üyelik odaklı',
      baseGoal:'Salonun enerjisini üyelik ve deneme dersi talebine çevirmek.',
      pages:['Ana sayfa','Paketler','Eğitmenler','Ders programı','Deneme dersi','Başarı hikayeleri','İletişim'],
      seo:['fitness salonu','reformer pilates','pilates stüdyosu','online koçluk'],
      modules:['Üyelik talebi','Deneme dersi formu','Ders programı','Eğitmen profilleri','Dönüşüm hikayeleri'],
      pains:['Paketler net görünmez','Yeni müşteri salonu görmeden karar veremez','Instagram güveni tek başına yetmez'],
      sales:'Bu site salonun enerjisini, koç güvenini ve üyelik teklifini tek akışa bağlar.',
      caution:['Sağlık iddialarında garanti ifade kullanılmamalı']
    },
    {
      label:'Klinik / Sağlık', value:'clinic', weight:94,
      keywords:['klinik','doktor','diş','hekim','veteriner','sağlık','poliklinik','tedavi','implant','hasta'],
      package:'Signature Web Experience', style:'Temiz klinik güveni',
      baseGoal:'Uzmanlık, hijyen ve randevu güvenini net bir dijital yapıya çevirmek.',
      pages:['Ana sayfa','Uzmanlar','Tedaviler','Randevu','Hasta bilgilendirme','SSS','İletişim','KVKK'],
      seo:['randevu','klinik','diş hekimi','veteriner kliniği','tedavi'],
      modules:['Online randevu','Uzman profilleri','Bilgilendirme sayfaları','KVKK','SSS','Harita'],
      pains:['Hasta güveni ilk izlenimde oluşur','Tedavi bilgileri dağınık kalır','Randevu süreci manuel ilerler'],
      sales:'Tasarımın görevi sadece şık görünmek değil; tedirginliği azaltıp randevu kararını kolaylaştırmak.',
      caution:['Tıbbi garanti, teşhis veya tedavi vaadi verilmez','KVKK ve açık rıza metinleri ciddi tutulmalı']
    },
    {
      label:'Eğitim / Kurs', value:'education', weight:87,
      keywords:['kurs','eğitim','okul','öğrenci','veli','lgs','yks','akademi','ders','sınıf'],
      package:'Marka Deneyimi', style:'Kurumsal güven + başarı odağı',
      baseGoal:'Veli ve öğrencinin güvenini ön kayıt talebine dönüştürmek.',
      pages:['Ana sayfa','Programlar','Öğretmen kadrosu','Başarılar','Ön kayıt','Duyurular','İletişim'],
      seo:['kurs merkezi','yks kurs','lgs kurs','özel ders','eğitim kurumu'],
      modules:['Ön kayıt formu','Programlar','Duyurular','Başarı alanı','Kadro tanıtımı'],
      pains:['Veli güveni için bilgiler tek yerde değildir','Kayıt dönemlerinde mesaj yoğunluğu artar'],
      sales:'Siteyi dijital broşür değil, kayıt döneminde çalışan ön kayıt makinesi gibi sun.',
      caution:['Başarı iddiaları kanıtlı olmalı']
    },
    {
      label:'Mimarlık / İnşaat', value:'architecture', weight:91,
      keywords:['mimarlık','iç mimar','inşaat','dekorasyon','proje','anahtar teslim','3d','tasarım'],
      package:'Signature Web Experience', style:'Minimal editorial portföy',
      baseGoal:'Projeleri prestijli sunup keşif ve teklif talebi oluşturmak.',
      pages:['Ana sayfa','Projeler','Hizmetler','Önce/sonra','Süreç','Teklif al','İletişim'],
      seo:['mimarlık ofisi','iç mimarlık','anahtar teslim dekorasyon','proje tasarım'],
      modules:['Proje portföyü','Teklif formu','Galeri','Süreç anlatımı','Before/after'],
      pains:['Kalite fotoğrafla satılır ama sosyal medyada kalıcı değildir','Teklif öncesi güven kurmak gerekir'],
      sales:'Markayı “iş yapan ekip” değil, premium proje stüdyosu gibi konumlandır.',
      caution:['Görsellerin proje sahibi/izin durumu net olmalı']
    },
    {
      label:'Kurumsal Şirket', value:'corporate', weight:84,
      keywords:['kurumsal','şirket','firma','danışmanlık','üretim','hizmet','lojistik','sanayi'],
      package:'Marka Deneyimi', style:'Kurumsal netlik ve güven',
      baseGoal:'Firma güvenini, hizmet bilgisini ve teklif talebini tek yapıda toplamak.',
      pages:['Ana sayfa','Hakkımızda','Hizmetler','Referanslar','Süreç','Teklif formu','İletişim'],
      seo:['kurumsal web sitesi','firma tanıtım','hizmet şirketi'],
      modules:['Teklif formu','Hizmet sayfaları','Referanslar','Kurumsal kimlik','SEO altyapısı'],
      pains:['Firma profesyonel görünmezse teklif değeri düşer','Hizmetler net anlatılmazsa müşteri karar vermez'],
      sales:'Bu site firmanın ciddiyetini ve teklif değerini yükselten dijital kurumsal kimliktir.',
      caution:['Referans ve sertifika bilgileri doğrulanmalı']
    }
  ];

  const featureDB = [
    {label:'Admin paneli', value:'admin', price:20000, keywords:['admin','panel','yönetim','ekleyip kaldır','kendim ekleyeyim']},
    {label:'Üyelik sistemi', value:'membership', price:15000, keywords:['üyelik','giriş','login','kayıt','müşteri hesabı']},
    {label:'Veritabanı', value:'database', price:12000, keywords:['veritabanı','database','supabase','kayıt tut','kalıcı']},
    {label:'Randevu / rezervasyon', value:'appointment', price:6000, keywords:['randevu','rezervasyon','takvim','masa ayırt','deneme dersi']},
    {label:'Ödeme entegrasyonu', value:'payment', price:15000, keywords:['ödeme','shopier','iyzico','kart','satın alma','sepet']},
    {label:'Blog / içerik sistemi', value:'blog', price:8000, keywords:['blog','içerik','makale','duyuru','haber']},
    {label:'Galeri / portföy', value:'gallery', price:4000, keywords:['galeri','fotoğraf','portföy','görsel','öncesi sonrası']},
    {label:'Gelişmiş SEO', value:'seo', price:5000, keywords:['seo','google','arama','search console','sıra','görünür']},
    {label:'Çoklu dil', value:'language', price:7500, keywords:['ingilizce','çoklu dil','ikinci dil','arapça','rusça']},
    {label:'Gelişmiş animasyon', value:'animation', price:7500, keywords:['animasyon','hareketli','efekt','wow','3d','parallax']},
    {label:'Yorum paneli', value:'reviews', price:9000, keywords:['yorum','değerlendirme','puan','review','yıldız']},
    {label:'Dosya / fotoğraf yükleme', value:'upload', price:8000, keywords:['yükleme','fotoğraf ekleme','dosya','resim ekleme']},
    {label:'Rol ve yetki sistemi', value:'roles', price:8000, keywords:['rol','yetki','coach','koç','personel','admin rol']},
    {label:'İlan / ürün yönetimi', value:'catalog', price:18000, keywords:['ilan','ürün yönetimi','katalog','portföy yönetimi','listeleme','filtre']},
    {label:'CRM / müşteri takip', value:'crm', price:18000, keywords:['crm','takip','müşteri takip','lead','görüşme takibi']},
    {label:'AI müşteri temsilcisi', value:'ai', price:18000, keywords:['yapay zeka','ai','asistan','chatbot','müşteri temsilcisi']},
    {label:'Analitik ve dönüşüm takibi', value:'analytics', price:5000, keywords:['analitik','analytics','ölçüm','dönüşüm','tıklama']}
  ];

  const styleDB = [
    {label:'Futuristik', value:'futuristic', price:7500, keywords:['futuristik','fütüristik','neon','teknoloji','cyber','3d'], promise:'Gören kişide teknoloji ve wow etkisi bırakır.'},
    {label:'Lüks', value:'luxury', price:6000, keywords:['lüks','luxury','gold','krem','premium','zarif','rose','şampanya'], promise:'Pahalı, seçkin ve güven veren marka algısı oluşturur.'},
    {label:'Minimal', value:'minimal', price:0, keywords:['minimal','sade','temiz','beyaz','az'], promise:'Sakin, net ve modern bir premium sadelik sunar.'},
    {label:'Kurumsal', value:'corporate', price:3000, keywords:['kurumsal','ciddi','güven','lacivert','firma'], promise:'Düzenli, resmi ve güven veren şirket görünümü sağlar.'}
  ];

  const goals = [
    {label:'Randevu almak', value:'appointment'},
    {label:'Teklif toplamak', value:'sales'},
    {label:'Google’da görünmek', value:'seo'},
    {label:'Portföy / ilan göstermek', value:'portfolio'},
    {label:'Admin panelli sistem', value:'system'},
    {label:'Prestij yükseltmek', value:'brand'}
  ];

  const basePrices = { starter:17900, brand:29900, signature:49900, system:84900, platform:119900 };

  const esc = v => String(v || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm = v => String(v || '').toLocaleLowerCase('tr-TR');
  const formatTL = n => new Intl.NumberFormat('tr-TR').format(Math.max(0, Math.round(n))) + ' TL';
  const unique = arr => [...new Set(arr.filter(Boolean))];
  const has = (text, words) => words.some(w => text.includes(norm(w)));

  function addMessage(role, html){
    const node = document.createElement('div');
    node.className = `eb-ai-msg ${role}`;
    node.innerHTML = html;
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    state.history.push({role, text: node.textContent.replace(/\s+/g,' ').trim().slice(0,1400)});
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

  function open(){
    assistant.classList.add('is-open');
    panel.setAttribute('aria-hidden','false');
    if(!booted) boot();
    setTimeout(()=>input?.focus(), 150);
  }
  function close(){
    assistant.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');
  }

  function detectSector(text){
    const n = norm(text);
    let best = null;
    sectorDB.forEach(s => {
      let score = s.keywords.reduce((sum,k) => sum + (n.includes(norm(k)) ? 1 : 0), 0);
      if (score > 0) score = score * 18 + s.weight/10;
      if (!best || score > best.score) best = {sector:s, score};
    });
    return best && best.score > 0 ? best.sector : null;
  }
  function detectStyle(text){
    const n = norm(text);
    return styleDB.find(s => has(n, s.keywords)) || null;
  }
  function detectCity(text){
    const n = norm(text);
    const cities = ['mersin','mezitli','niğde','nigde','bor','adana','ankara','istanbul','konya','kayseri','antalya','tarsus'];
    const hit = cities.find(c => n.includes(c));
    if (!hit) return '';
    return hit === 'nigde' ? 'Niğde' : hit[0].toLocaleUpperCase('tr-TR') + hit.slice(1);
  }
  function detectBrand(text){
    const raw = String(text || '');
    const patterns = [
      /(?:marka(?:m| adı)?|işletme(?:m| adı)?|firmam|şirketim|adında)\s+(?:adı\s+)?([A-ZÇĞİÖŞÜ0-9][\wÇĞİÖŞÜçğıöşü\s&'.-]{2,42})/,
      /([A-ZÇĞİÖŞÜ][\wÇĞİÖŞÜçğıöşü\s&'.-]{2,36})\s+(?:adında|isimli)/
    ];
    for (const p of patterns){
      const m = raw.match(p);
      if (m && m[1]) return m[1].replace(/\s+(var|için|olarak).*$/i,'').trim();
    }
    return '';
  }
  function detectGoal(text){
    const n = norm(text);
    if (has(n,['randevu','rezervasyon','whatsapp randevu','deneme dersi'])) return 'appointment';
    if (has(n,['google','seo','arama','görünür','search'])) return 'seo';
    if (has(n,['ilan','portföy','katalog','ürün'])) return 'portfolio';
    if (has(n,['admin','üyelik','panel','veritabanı','sistem'])) return 'system';
    if (has(n,['prestij','kurumsal','güven','marka algısı','lüks'])) return 'brand';
    return 'sales';
  }
  function detectFeatures(text){
    const n = norm(text);
    const found = [];
    featureDB.forEach(f => { if (has(n, f.keywords)) found.push(f.value); });
    if (found.includes('admin')) { found.push('database'); }
    if (found.includes('membership')) { found.push('database'); }
    if (found.includes('catalog')) { found.push('admin','database'); }
    if (found.includes('reviews')) { found.push('admin','database'); }
    if (found.includes('ai')) { found.push('analytics'); }
    return unique(found);
  }
  function detectPages(text, sector, features){
    const n = norm(text);
    if (has(n,['13','çok sayfa','platform','tam sistem'])) return 'xlarge';
    if (features.includes('catalog') || features.includes('admin') || features.includes('membership')) return 'large';
    if (sector && ['beauty','clinic','architecture','fitness'].includes(sector.value)) return 'large';
    if (has(n,['8','12','hizmet detay','ayrı sayfa'])) return 'large';
    if (has(n,['4','7','kurumsal'])) return 'medium';
    return 'medium';
  }

  function parseText(text){
    state.lastText = text;
    const sector = detectSector(text);
    if (sector) state.sector = sector.value;
    const style = detectStyle(text);
    if (style) state.style = style.value;
    const city = detectCity(text);
    if (city) state.city = city;
    const brand = detectBrand(text);
    if (brand) state.business = brand;
    state.goal = detectGoal(text);
    state.features = unique([...state.features, ...detectFeatures(text)]);
    state.pages = detectPages(text, sector || getSector(), state.features);
    if (norm(text).includes('acil')) state.urgency = 'urgent';
    if (norm(text).includes('bütçe') || norm(text).includes('fiyat')) state.leadTemperature = 'hot';
    applySectorDefaults();
    updateIntel();
  }

  function getSector(){ return sectorDB.find(s => s.value === state.sector); }
  function getStyle(){ return styleDB.find(s => s.value === state.style) || styleDB.find(s => s.value === 'luxury'); }
  function goalLabel(){ return (goals.find(g=>g.value===state.goal)||goals[1]).label; }
  function featureLabel(v){ return (featureDB.find(f=>f.value===v)||{}).label || v; }
  function featurePrice(v){ return (featureDB.find(f=>f.value===v)||{}).price || 0; }

  function applySectorDefaults(){
    const s = getSector();
    if (!s) return;
    const add = [];
    if (s.value === 'beauty') add.push('appointment','reviews','gallery','seo');
    if (s.value === 'realestate') add.push('catalog','admin','database','seo');
    if (s.value === 'food') add.push('appointment','gallery','seo');
    if (s.value === 'fitness') add.push('appointment','gallery','seo');
    if (s.value === 'clinic') add.push('appointment','seo');
    state.features = unique([...state.features, ...add]);
    if (!state.style) {
      if (s.value === 'beauty') state.style = 'luxury';
      else if (s.value === 'realestate') state.style = 'corporate';
      else if (s.value === 'architecture') state.style = 'minimal';
      else state.style = 'corporate';
    }
  }

  function selectPackage(){
    const s = getSector();
    const f = state.features;
    if (f.includes('catalog') || f.includes('membership') || f.includes('crm') || (f.includes('admin') && f.includes('database'))) return 'system';
    if (s && ['beauty','clinic','fitness','architecture'].includes(s.value)) return 'signature';
    if (state.pages === 'large' || state.pages === 'xlarge') return 'signature';
    if (state.pages === 'small') return 'starter';
    return 'brand';
  }

  function packageName(key){
    return ({starter:'Dijital Başlangıç',brand:'Marka Deneyimi',signature:'Signature Web Experience',system:'Özel Dijital Sistem',platform:'Premium Dijital Platform'})[key] || 'Marka Deneyimi';
  }
  function packageMin(key){
    return ({starter:17900,brand:29900,signature:49900,system:84900,platform:119900})[key] || 29900;
  }

  function calculatePrice(){
    const pkg = selectPackage();
    let price = basePrices[pkg] || 29900;
    const included = pkg === 'system' ? ['admin','database','seo'] : pkg === 'signature' ? ['seo','gallery'] : ['seo'];
    state.features.forEach(v => { if (!included.includes(v)) price += featurePrice(v); });
    price += (getStyle()?.price || 0);
    if (state.urgency === 'urgent') price *= 1.25;
    if (state.features.includes('admin') && state.features.includes('database')) price -= 3500;
    if (state.features.includes('membership') && state.features.includes('admin')) price -= 4500;
    if (state.features.includes('catalog') && state.features.includes('admin')) price -= 6000;
    if (state.features.includes('reviews') && state.features.includes('admin')) price -= 2500;
    if (state.features.length >= 8) price -= 5000;
    price = Math.max(price, packageMin(pkg));
    return {pkg, price: Math.round(price/100)*100};
  }

  function readinessScore(){
    let score = 18;
    if (state.sector) score += 17;
    if (state.city) score += 10;
    if (state.business) score += 10;
    if (state.goal) score += 12;
    if (state.style) score += 9;
    if (state.features.length) score += Math.min(22, state.features.length * 4);
    if (state.lastText.length > 120) score += 8;
    return Math.min(100, score);
  }
  function opportunityScore(){
    const s = getSector();
    let score = s ? s.weight : 70;
    if (state.features.includes('appointment')) score += 4;
    if (state.features.includes('seo')) score += 4;
    if (state.features.includes('admin')) score += 3;
    if (state.leadTemperature === 'hot') score += 5;
    return Math.min(100, score);
  }
  function riskScore(){
    let risk = 18;
    if (!state.business) risk += 10;
    if (!state.city) risk += 7;
    if (!state.features.includes('seo')) risk += 4;
    if (state.sector === 'clinic' || state.sector === 'beauty') risk += 8;
    if (state.features.includes('payment')) risk += 6;
    return Math.min(100, risk);
  }

  function buildBrief(){
    const s = getSector() || sectorDB[7];
    const style = getStyle();
    const calc = calculatePrice();
    const name = state.business || 'işletme';
    const city = state.city || 'yerel bölge';
    const must = unique([...s.modules, ...state.features.map(featureLabel)]).slice(0,10);
    const missing = [];
    if (!state.business) missing.push('İşletme adı');
    if (!state.city) missing.push('Şehir / ilçe');
    missing.push('Logo', 'Gerçek fotoğraflar', 'Net telefon / WhatsApp', 'Adres', 'Çalışma saatleri');
    const brief = {
      sector:s,
      style,
      packageKey:calc.pkg,
      packageName:packageName(calc.pkg),
      price:calc.price,
      timeline: calc.pkg === 'system' ? '30–45 iş günü' : calc.pkg === 'signature' ? '20–30 iş günü' : '12–18 iş günü',
      readiness: readinessScore(),
      opportunity: opportunityScore(),
      risk: riskScore(),
      name, city, must, missing,
      seo: s.seo,
      pages: s.pages,
      salesAngle:s.sales,
      cautions:s.caution,
      pains:s.pains
    };
    state.lastBrief = brief;
    updateIntel();
    return brief;
  }

  function updateIntel(){
    const s = getSector();
    const calc = calculatePrice();
    const score = readinessScore();
    intelScore.textContent = score + '%';
    stateSector.textContent = s ? s.label.split('/')[0].trim().toUpperCase() : 'SEKTÖR';
    statePackage.textContent = packageName(calc.pkg).toUpperCase();
    statePrice.textContent = formatTL(calc.price);
    const chips = [];
    chips.push(`<p><b>Netlik:</b> ${score}%</p>`);
    chips.push(`<p><b>Fırsat:</b> ${opportunityScore()} / 100</p>`);
    chips.push(`<p><b>Risk:</b> ${riskScore()} / 100</p>`);
    if (s) chips.push(`<p><b>Satış açısı:</b> ${esc(s.sales)}</p>`);
    if (state.features.length) chips.push(`<p><b>Modüller:</b> ${state.features.slice(0,4).map(featureLabel).join(', ')}</p>`);
    intelList.innerHTML = chips.join('');
  }

  function typing(callback){
    const node = document.createElement('div');
    node.className = 'eb-ai-msg bot eb-ai-typing';
    node.innerHTML = '<span></span><span></span><span></span><b>Strateji motoru çalışıyor...</b>';
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => { node.remove(); callback(); }, 520);
  }

  function premiumResult(){
    const b = buildBrief();
    return `
      <div class="ai-card eb-ai-elite-brief eb-ai-os-card">
        <div class="ai-brief-top">
          <span>EXECUTIVE STRATEGY BRIEF</span>
          <strong>${esc(b.name)} · ${esc(b.city)}</strong>
        </div>
        <h3>${esc(b.sector.label)} için önerilen yapı: ${esc(b.packageName)}</h3>
        <p>${esc(b.sector.baseGoal)}</p>
        <div class="ai-price">${formatTL(b.price)}</div>
        <small>Ön teklif · kapsam netleşince kesinleştirilir · tahmini teslim ${esc(b.timeline)}</small>
        <div class="ai-grid ai-metrics">
          <span><b>${b.readiness}%</b><br>Proje netlik skoru</span>
          <span><b>${b.opportunity}</b><br>Fırsat skoru</span>
          <span><b>${b.risk}</b><br>Risk skoru</span>
          <span><b>${esc(b.style.label)}</b><br>${esc(b.style.promise)}</span>
        </div>
        <div class="ai-note"><b>Stratejik karar:</b> ${esc(b.salesAngle)}</div>
      </div>
      <div class="ai-card">
        <h3>Olmazsa olmaz modüller</h3>
        <ul>${b.must.slice(0,8).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      </div>
      <div class="ai-card">
        <h3>SEO hedefleri</h3>
        <p>${b.seo.map(x=>`<span class="eb-ai-keyword">${esc(x)}</span>`).join('')}</p>
      </div>
      <div class="eb-ai-actions">
        <a class="eb-ai-action-link" href="#lab" data-ai-scroll="#lab">DESIGN LAB</a>
        <a class="eb-ai-action-link" href="#contact" data-ai-scroll="#contact">TEKLİF FORMU</a>
        <a class="eb-ai-action-link" href="${whatsappLink()}" target="_blank" rel="noopener">WHATSAPP</a>
      </div>
    `;
  }

  function blueprint(){
    const b = buildBrief();
    const funnel = [
      'İlk ekran: marka güveni + tek ana vaat + hızlı CTA',
      'Hizmet/portföy alanı: müşterinin aradığı şeyi 8 saniyede bulması',
      'Kanıt alanı: yorum, proje, galeri veya uzmanlık bilgisi',
      'Karar alanı: fiyat/teklif/randevu butonu',
      'Kapanış alanı: WhatsApp, telefon, harita ve sık sorulan sorular'
    ];
    return `<div class="ai-card"><h3>Site mimarisi</h3><ul>${b.pages.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>
      <div class="ai-card"><h3>Dönüşüm akışı</h3><ul>${funnel.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>
      <div class="ai-card"><h3>Eksik bilgi listesi</h3><p>${b.missing.slice(0,7).map(x=>`<span class="eb-ai-keyword">${esc(x)}</span>`).join('')}</p></div>`;
  }

  function designDirector(){
    const b = buildBrief();
    const styleNotes = {
      luxury:['Krem / gold / rose-gold palet','Geniş beyaz alanlar','Zarif serif başlıklar','Yumuşak gölge ve premium kartlar','Randevu butonunda gold degrade'],
      futuristic:['Neon grid arka plan','Cam efektli kartlar','3D enerji küreleri','Parallax hareket','Keskin teknik tipografi'],
      minimal:['Beyaz ağırlıklı arayüz','Monokrom başlıklar','Boşluk kullanımı','Net siyah CTA','Sessiz animasyon'],
      corporate:['Lacivert güven paleti','Dashboard kartları','İstatistik alanları','Düzenli grid','Resmi teklif dili']
    };
    const notes = styleNotes[b.style.value] || styleNotes.luxury;
    return `<div class="ai-card"><h3>Design Director kararı</h3><p><b>${esc(b.style.label)}</b> dili seçilmeli. ${esc(b.style.promise)}</p><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div>
    <pre class="ai-copy">${esc(`${b.name} için ${b.style.label} tasarım: ${notes.join(', ')}. İlk ekranda güven veren güçlü başlık, hizmet/portföy kartları, kanıt alanı ve WhatsApp CTA kullan. Tasarım sıradan tema gibi değil, markaya özel premium dijital deneyim gibi görünmeli.`)}</pre>`;
  }

  function offer(){
    const b = buildBrief();
    const text = `${b.name} için önerim ${b.packageName}. Bu çalışma; ${b.must.slice(0,5).join(', ')} modüllerini kapsar. Amaç yalnızca güzel bir web sitesi yapmak değil; ${b.sector.baseGoal.toLocaleLowerCase('tr-TR')} Sitenin ön fiyatı ${formatTL(b.price)} seviyesindedir. Kapsam ve içerikler netleşince kesin teklif hazırlanır.`;
    return `<div class="ai-card"><h3>Müşteriye söylenecek premium teklif cümlesi</h3><p>${esc(text)}</p></div><pre class="ai-copy">${esc(whatsappText())}</pre>`;
  }

  function objections(){
    const b = buildBrief();
    const list = [
      ['Fiyat yüksek geldi', `Haklısınız, burada sadece sayfa değil; ${b.must.slice(0,3).join(', ')} gibi satışa/randevuya etki eden sistemler kuruluyor. İsterseniz kapsamı iki aşamaya bölüp önce vitrin + teklif akışını yayına alabiliriz.`],
      ['Zaten Instagram var', 'Instagram hızlı görünürlük sağlar ama içerikler akar gider. Web sitesi ise Google’da markanın kalıcı merkezi olur; hizmetleri, yorumları, iletişimi ve teklif akışını tek yerde toplar.'],
      ['Google’da birinci olur muyuz?', 'Google sıralaması garanti edilmez. Ama teknik SEO, hızlı altyapı, doğru başlıklar, sitemap ve hizmet/bölge sayfalarıyla Google’ın siteyi doğru anlaması için güçlü temel kurulur.'],
      ['Sonra yaptırırız', 'Olur, fakat ilk izlenim ve Google görünürlüğü ne kadar erken başlarsa o kadar iyi birikir. Önce küçük bir ana sayfa + teklif/randevu akışıyla başlayıp sonra büyütebiliriz.']
    ];
    return `<div class="ai-card"><h3>İtiraz cevap kalkanı</h3><ul>${list.map(([q,a])=>`<li><b>${esc(q)}:</b> ${esc(a)}</li>`).join('')}</ul></div>`;
  }

  function salesScript(){
    const b = buildBrief();
    return `<pre class="ai-copy">${esc(`Merhaba, ben Efecan Berber. EB Digital Studio olarak işletmelere özel web siteleri ve dijital sistemler geliştiriyorum.

${b.name} için kısa bir analiz yaptım. İşletmenizin dijital tarafta en güçlü fırsatı: ${b.sector.baseGoal}

Size sıradan bir web sitesi değil; ${b.must.slice(0,5).join(', ')} içeren, ${b.city} bölgesindeki müşterilerin daha kolay ulaşabileceği premium bir sistem önerebilirim.

Kısa bir ön izleme hazırlayıp göstermek isterim. Beğenirseniz kapsamı ve net fiyatı birlikte belirleriz. Uygun olduğunuzda 5 dakikalık kısa bir görüşme yapabilir miyiz?`)}</pre>`;
  }

  function riskPanel(){
    const b = buildBrief();
    return `<div class="ai-card"><h3>Risk ve kalite kontrol</h3><ul>${b.cautions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="ai-card"><h3>Profesyonel teslim kriterleri</h3><ul><li>Mobil görünüm ayrı test edilir.</li><li>Form ve WhatsApp akışı test edilir.</li><li>Search Console ve sitemap hazırlanır.</li><li>Gizlilik / hizmet koşulları sayfaları eklenir.</li><li>Gerçek içerik gelmeden sahte başarı iddiası kullanılmaz.</li></ul></div>`;
  }

  function whatsappText(){
    const b = buildBrief();
    return `Merhaba Efecan, EB Digital Studio sitesindeki asistandan proje ön analizi oluşturdum.

İşletme: ${b.name}
Sektör: ${b.sector.label}
Bölge: ${b.city}
Önerilen paket: ${b.packageName}
Tasarım dili: ${b.style.label}
Önerilen modüller: ${b.must.slice(0,8).join(', ')}
Ön fiyat: ${formatTL(b.price)}
Teslim süresi: ${b.timeline}

Detayları görüşmek istiyorum.`;
  }
  function whatsappLink(){ return `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText())}`; }

  async function copy(text){
    try { await navigator.clipboard.writeText(text); addMessage('bot','Kopyaladım kral. Artık direkt müşteriye gönderebilirsin.'); }
    catch(e){ addMessage('bot','Tarayıcı kopyalamayı engelledi. Metni manuel seçip kopyalayabilirsin.'); }
  }

  function fillForm(){
    const b = buildBrief();
    const proposal = document.getElementById('proposalForm');
    if (!proposal) return;
    const name = proposal.querySelector('[name="name"]');
    const details = proposal.querySelector('[name="details"]');
    const type = proposal.querySelector('[name="type"]');
    const pages = proposal.querySelector('[name="pages"]');
    if (name) name.value = b.name === 'işletme' ? '' : b.name;
    if (type) type.value = b.packageKey === 'system' ? 'Admin paneli' : 'Kurumsal web sitesi';
    if (pages) pages.value = b.packageKey === 'signature' || b.packageKey === 'system' ? '8+ sayfa' : '4–7 sayfa';
    if (details) details.value = `${b.sector.label} için ${b.packageName}. Modüller: ${b.must.join(', ')}. Ön fiyat: ${formatTL(b.price)}. SEO hedefleri: ${b.seo.join(', ')}.`;
    close();
    proposal.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function answer(text){
    const n = norm(text);
    if (has(n,['fiyat','kaç tl','ücret','maliyet'])) return addMessage('bot', premiumResult());
    if (has(n,['seo','google','arama'])) return addMessage('bot', `<div class="ai-card"><h3>SEO cevabı</h3><p>Google’da birinci sıra garanti edilmez. Profesyonel yaklaşım; hızlı site, doğru başlıklar, hizmet/bölge sayfaları, sitemap, Search Console ve düzenli içerikle görünürlüğü artırmaktır.</p></div>${buildBrief().seo.map(x=>`<span class="eb-ai-keyword">${esc(x)}</span>`).join('')}`);
    if (has(n,['ödeme','taksit','kapora'])) return addMessage('bot','Ödeme için en sağlıklı yapı: <b>%40 başlangıç, %30 tasarım onayı, %30 yayın öncesi</b>. Büyük sistemlerde aşamalı ödeme planı yapılabilir.');
    if (has(n,['süre','kaç gün','teslim'])) return addMessage('bot', `Bu kapsam için tahmini teslim: <b>${esc(buildBrief().timeline)}</b>. İçerik, fotoğraf ve onay süreci süreyi etkiler.`);
    parseText(text);
    typing(()=> addMessage('bot', premiumResult()));
    setQuick(mainActions());
  }

  function mainActions(){
    return [
      {label:'Strateji briefi', action:'brief', primary:true},
      {label:'Site mimarisi', action:'blueprint'},
      {label:'Design Director', action:'design'},
      {label:'Teklif metni', action:'offer'},
      {label:'İtiraz cevapları', action:'objections'},
      {label:'Satış konuşması', action:'sales'},
      {label:'Risk kontrol', action:'risk'},
      {label:'WhatsApp', action:'whatsapp', primary:true},
      {label:'Formu doldur', action:'fill'}
    ];
  }

  function boot(){
    booted = true;
    addMessage('bot', `<b>EB Strategist AI aktif.</b><br>Ben sadece paket önerici değilim; müşterinin mesajından proje fırsatını, fiyatı, satış açısını, SEO planını ve itiraz cevaplarını çıkaran <b>elite satış danışmanı</b> gibi çalışırım.<small>İşletme türünü ve isteğini tek paragraf anlat; sana müşteri önüne çıkacak strateji dosyası oluşturayım.</small>`);
    setQuick([
      {label:'Güzellik örneği', action:'sample', value:'beauty', primary:true},
      {label:'Emlak örneği', action:'sample', value:'realestate'},
      {label:'Restoran örneği', action:'sample', value:'food'},
      {label:'Sektör seç', action:'sectors'},
      {label:'Sıfırla', action:'reset', danger:true}
    ]);
    updateIntel();
  }

  function sample(type){
    const samples = {
      beauty:'Mersin Mezitli’de Merve Yıldırım Beauty adında güzellik merkezim var. Lazer epilasyon, cilt bakımı, kalıcı makyaj, bölgesel incelme ve tırnak hizmetleri veriyoruz. Krem-gold lüks tasarım istiyorum. WhatsApp randevu, yorum paneli, kampanya alanı, hizmet detay sayfaları, galeri, KVKK ve Google SEO olsun. Mersin güzellik merkezi ve Mezitli lazer epilasyon aramalarında zamanla görünmek istiyorum.',
      realestate:'Niğde’de Net Emlak adında emlak ofisim var. Satılık daire, kiralık daire, arsa ve iş yeri ilanlarımı göstermek istiyorum. Müşteriler fiyat, mahalle, oda sayısı ve mülk türüne göre filtreleme yapabilsin. Her ilanın detay sayfası olsun, WhatsApp’tan bilgi alabilsin. İlanları kendim ekleyip kaldıracağım admin paneli de istiyorum.',
      food:'Niğde’de bir kafe restoran işletmem var. Dijital menü, rezervasyon, galeri, kampanya alanı, organizasyon paketleri, Google harita ve WhatsApp rezervasyon istiyorum. Tasarım sıcak, şık ve mobilde hızlı olsun.'
    };
    input.value = samples[type] || samples.beauty;
    input.focus();
  }

  function sectorChips(){
    setQuick(sectorDB.map(s => ({label:s.label.split('/')[0].trim(), action:'sector', value:s.value, active:state.sector===s.value})).concat([{label:'Devam et', action:'brief', primary:true}]));
  }

  function handleAction(action, value, label){
    if (action === 'sample') return sample(value);
    if (action === 'sectors') return sectorChips();
    if (action === 'sector') { state.sector = value; applySectorDefaults(); updateIntel(); addMessage('user', esc(label)); addMessage('bot','Sektörü aldım. Şimdi işletmenin hedefini veya istediği özellikleri tek cümleyle yazarsan strateji briefini çıkarırım.'); return setQuick(mainActions()); }
    if (action === 'brief') return addMessage('bot', premiumResult());
    if (action === 'blueprint') return addMessage('bot', blueprint());
    if (action === 'design') return addMessage('bot', designDirector());
    if (action === 'offer') return addMessage('bot', offer());
    if (action === 'objections') return addMessage('bot', objections());
    if (action === 'sales') return addMessage('bot', salesScript());
    if (action === 'risk') return addMessage('bot', riskPanel());
    if (action === 'whatsapp') return window.open(whatsappLink(), '_blank', 'noopener');
    if (action === 'fill') return fillForm();
    if (action === 'export') return copy(summaryText());
    if (action === 'reset') { Object.keys(state).forEach(k => { if(Array.isArray(state[k])) state[k]=[]; else if(k!=='history') state[k]=''; }); state.urgency='normal'; state.mode='strategist'; state.history=[]; messages.innerHTML=''; booted=false; return boot(); }
  }

  function summaryText(){
    const b = buildBrief();
    return `EB Strategist AI Özeti\n\nİşletme: ${b.name}\nSektör: ${b.sector.label}\nBölge: ${b.city}\nPaket: ${b.packageName}\nÖn fiyat: ${formatTL(b.price)}\nTeslim: ${b.timeline}\nModüller: ${b.must.join(', ')}\nSEO: ${b.seo.join(', ')}\nSatış açısı: ${b.salesAngle}`;
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', esc(text));
    input.value = '';
    answer(text);
  });
  quick?.addEventListener('click', e => {
    const btn = e.target.closest('[data-ai-action]');
    if (!btn) return;
    handleAction(btn.dataset.aiAction, btn.dataset.value, btn.textContent.trim());
  });
  assistant.querySelectorAll('[data-assistant-open]').forEach(b => b.addEventListener('click', open));
  assistant.querySelectorAll('[data-assistant-close]').forEach(b => b.addEventListener('click', close));
  assistant.addEventListener('click', e => {
    const scroll = e.target.closest('[data-ai-scroll]');
    if(scroll){ e.preventDefault(); close(); document.querySelector(scroll.dataset.aiScroll)?.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && assistant.classList.contains('is-open')) close(); });
})();
