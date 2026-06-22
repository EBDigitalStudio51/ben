(() => {
  'use strict';

  const assistant = document.getElementById('ebAiAssistant');
  if (!assistant) return;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const panel = $('[data-ai-panel]', assistant);
  const messages = $('[data-ai-messages]', assistant);
  const quick = $('[data-ai-quick]', assistant);
  const form = $('[data-ai-form]', assistant);
  const input = $('[data-ai-input]', assistant);
  const intelList = $('[data-ai-intel-list]', assistant);
  const intelScore = $('[data-ai-score]', assistant);
  const stateSector = $('[data-ai-state-sector]', assistant);
  const statePackage = $('[data-ai-state-package]', assistant);
  const statePrice = $('[data-ai-state-price]', assistant);

  const PHONE = '905425866513';
  const VERSION = '5.9';
  const STORE = 'eb_oracle_ai_v59';

  const state = {
    lastText: '',
    lastBrief: null,
    history: JSON.parse(localStorage.getItem(STORE) || '[]').slice(-6),
    booted: false
  };

  const tr = (value) => String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));

  const money = (n) => `${Math.round(n).toLocaleString('tr-TR')} TL`;
  const uniq = (arr) => [...new Set(arr.filter(Boolean))];
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const matchAny = (text, words) => words.some(w => tr(text).includes(tr(w)));

  const sectors = [
    {
      key: 'beauty', label: 'Güzellik / Beauty Clinic', package: 'Signature Web Experience', base: 49900, min: 59900,
      icon: '✦', weight: 98, style: 'Krem–gold luxury beauty clinic',
      keywords: ['guzellik','beauty','lazer','epilasyon','cilt','kalici makyaj','tirnak','bolgesel','incelme','diyet','kas','kirpik','salon','estetik','mezitli','bakim'],
      goal: 'Güven, hijyen, lüks algı ve randevu kararını aynı akışta güçlendirmek.',
      pages: ['Ana sayfa','Hakkımızda','Lazer epilasyon','Cilt bakımı','Kalıcı makyaj','Bölgesel incelme','Tırnak hizmetleri','Kampanyalar','Danışan yorumları','Randevu al','İletişim','Gizlilik / KVKK'],
      seo: ['mersin güzellik merkezi','mezitli lazer epilasyon','mersin cilt bakımı','mersin kalıcı makyaj','güzellik salonu randevu'],
      angle: '“Instagram’da güzel görünen marka” algısını Google’da güven veren premium bakım merkezine taşımak.',
      warnings: ['Kesin sonuç / garanti zayıflama vaadi kullanılmaz.','Öncesi–sonrası görselleri izinli yayınlanır.','Yorumlar onaydan geçer.']
    },
    {
      key: 'realestate', label: 'Emlak / Gayrimenkul', package: 'Özel Dijital Sistem', base: 84900, min: 84900,
      icon: '◆', weight: 99, style: 'Lacivert–gold yatırım platformu',
      keywords: ['emlak','gayrimenkul','ilan','satilik','kiralik','arsa','daire','konut','mulkiyet','portfoy','tapu','mahalle','is yeri','filtre'],
      goal: 'İlanları portallardan bağımsız, markaya ait güvenilir dijital portföye dönüştürmek.',
      pages: ['Ana sayfa','Satılık ilanlar','Kiralık ilanlar','Arsa & yatırım','İlan detay sayfası','Hakkımızda','Portföy ekle','İletişim'],
      seo: ['niğde satılık daire','niğde kiralık ev','niğde emlakçı','niğde satılık arsa','niğde gayrimenkul danışmanlığı'],
      angle: 'Sosyal medyada kaybolan ilanları, kendi markasına ait dijital emlak ofisine çevirmek.',
      warnings: ['Fiyat, tapu ve ilan durumu güncel tutulmalı.','Temsil edilmeyen mülk yayınlanmamalı.']
    },
    {
      key: 'food', label: 'Restoran / Kafe', package: 'Marka Deneyimi', base: 29900, min: 29900,
      icon: '●', weight: 88, style: 'Sıcak premium gastro deneyimi',
      keywords: ['restoran','kafe','cafe','menu','menü','rezervasyon','kahvalti','tatli','yemek','organizasyon','masa','bistro'],
      goal: 'Menü, rezervasyon ve organizasyon taleplerini net bir satış akışına çevirmek.',
      pages: ['Ana sayfa','Dijital menü','Rezervasyon','Organizasyon paketleri','Galeri','Yorumlar','Konum'],
      seo: ['niğde kafe','niğde restoran','niğde kahvaltı','niğde doğum günü organizasyonu'],
      angle: 'İştah açıcı görsel dil + hızlı rezervasyon = daha fazla masa ve organizasyon talebi.',
      warnings: ['Menü fiyatları güncel tutulmalı.','Görseller gerçek ürünlerle uyumlu olmalı.']
    },
    {
      key: 'fitness', label: 'Fitness / Pilates', package: 'Signature Web Experience', base: 49900, min: 49900,
      icon: '▲', weight: 92, style: 'Dinamik üyelik odaklı stüdyo',
      keywords: ['fitness','pilates','gym','reformer','spor','antrenor','koçluk','kocluk','zumba','uyelik','salon','beslenme'],
      goal: 'Salon enerjisini, eğitmen güvenini ve üyelik teklifini tek akışta toplamak.',
      pages: ['Ana sayfa','Paketler','Eğitmenler','Ders programı','Deneme dersi','Başarı hikayeleri','İletişim'],
      seo: ['fitness salonu','reformer pilates','pilates stüdyosu','online koçluk'],
      angle: 'Kişiyi “salona bir bakayım” aşamasından deneme dersi talebine taşımak.',
      warnings: ['Sağlık ve fiziksel sonuçlarda garanti verilmez.']
    },
    {
      key: 'clinic', label: 'Klinik / Sağlık', package: 'Signature Web Experience', base: 49900, min: 59900,
      icon: '✚', weight: 94, style: 'Temiz klinik güveni',
      keywords: ['klinik','doktor','dis','diş','hekim','veteriner','saglik','sağlık','poliklinik','tedavi','hasta','randevu'],
      goal: 'Uzmanlık, hijyen ve randevu güvenini sakin, açıklayıcı bir yapıya çevirmek.',
      pages: ['Ana sayfa','Uzmanlar','Tedaviler','Randevu','Hasta bilgilendirme','SSS','İletişim','KVKK'],
      seo: ['randevu','klinik','diş hekimi','veteriner kliniği','tedavi'],
      angle: 'Tedirginliği azaltan bilgi mimarisiyle randevu kararını kolaylaştırmak.',
      warnings: ['Teşhis / tedavi garantisi verilmez.','KVKK ve açık rıza ciddi tutulur.']
    },
    {
      key: 'education', label: 'Eğitim / Kurs', package: 'Marka Deneyimi', base: 29900, min: 29900,
      icon: '◆', weight: 87, style: 'Kurumsal güven + başarı odağı',
      keywords: ['kurs','egitim','eğitim','okul','ogrenci','öğrenci','veli','lgs','yks','akademi','ders','sinif'],
      goal: 'Veli ve öğrencinin güvenini ön kayıt talebine dönüştürmek.',
      pages: ['Ana sayfa','Programlar','Öğretmen kadrosu','Başarılar','Ön kayıt','Duyurular','İletişim'],
      seo: ['kurs merkezi','yks kurs','lgs kurs','özel ders','eğitim kurumu'],
      angle: 'Kayıt döneminde çalışan dijital ön kayıt makinesi kurmak.',
      warnings: ['Başarı iddiaları kanıtlı olmalı.']
    },
    {
      key: 'architecture', label: 'Mimarlık / İnşaat', package: 'Signature Web Experience', base: 49900, min: 49900,
      icon: '▰', weight: 91, style: 'Minimal editorial portföy',
      keywords: ['mimarlik','mimarlık','ic mimar','iç mimar','insaat','inşaat','dekorasyon','proje','anahtar teslim','3d','tasarim'],
      goal: 'Projeleri prestijli sunup keşif ve teklif talebi oluşturmak.',
      pages: ['Ana sayfa','Projeler','Hizmetler','Önce/sonra','Süreç','Teklif al','İletişim'],
      seo: ['mimarlık ofisi','iç mimarlık','anahtar teslim dekorasyon','proje tasarım'],
      angle: 'Markayı iş yapan ekipten premium proje stüdyosuna taşımak.',
      warnings: ['Proje görselleri izinli kullanılmalı.']
    },
    {
      key: 'corporate', label: 'Kurumsal Şirket', package: 'Marka Deneyimi', base: 29900, min: 29900,
      icon: '◇', weight: 84, style: 'Kurumsal netlik ve güven',
      keywords: ['kurumsal','sirket','şirket','firma','danismanlik','danışmanlık','uretim','üretim','hizmet','lojistik','sanayi'],
      goal: 'Firma güvenini, hizmet bilgisini ve teklif talebini tek yapıda toplamak.',
      pages: ['Ana sayfa','Hakkımızda','Hizmetler','Referanslar','Süreç','Teklif formu','İletişim'],
      seo: ['kurumsal web sitesi','firma tanıtım','hizmet şirketi'],
      angle: 'Daha ciddi görünümle teklif değerini ve güveni yükseltmek.',
      warnings: ['Referans, sertifika ve belge bilgileri doğrulanmalı.']
    }
  ];

  const features = [
    { key:'appointment', label:'Randevu / rezervasyon', price:6000, keywords:['randevu','rezervasyon','takvim','masa','deneme dersi','başvuru','basvuru'] },
    { key:'reviews', label:'Onaylı yorum paneli', price:12000, keywords:['yorum','yıldız','yildiz','değerlendirme','deneyim','referans'] },
    { key:'campaigns', label:'Kampanya vitrini', price:5000, keywords:['kampanya','indirim','fırsat','firsat','paket'] },
    { key:'gallery', label:'Galeri / portföy', price:4000, keywords:['galeri','fotoğraf','fotograf','portföy','portfoy','öncesi','sonrası'] },
    { key:'servicePages', label:'Hizmet detay sayfaları', price:8500, keywords:['hizmet sayfaları','hizmet detay','ayrı sayfa','seo sayfaları','sayfalar'] },
    { key:'seo', label:'Gelişmiş SEO altyapısı', price:5000, keywords:['seo','google','search console','arama','görünür','gorunur','index'] },
    { key:'admin', label:'Admin paneli', price:20000, keywords:['admin','panel','yönetim','yonetim','ekleyip kaldır','kendim ekleyeyim'] },
    { key:'database', label:'Veritabanı', price:12000, keywords:['veritabanı','database','supabase','kayıt','kalıcı','kalici'] },
    { key:'membership', label:'Üyelik / giriş sistemi', price:15000, keywords:['üyelik','uyelik','giriş','giris','login','kayıt ol','hesap'] },
    { key:'listings', label:'İlan / ürün yönetimi', price:25000, keywords:['ilan','satılık','satilik','kiralık','kiralik','ürün','urun','stok','katalog'] },
    { key:'filters', label:'Gelişmiş filtreleme', price:12000, keywords:['filtre','oda sayısı','oda sayisi','fiyat aralığı','mahalle','kategori','arama'] },
    { key:'payment', label:'Ödeme entegrasyonu', price:15000, keywords:['ödeme','odeme','kart','shopier','iyzico','satın alma','satin alma','sepet'] },
    { key:'multilang', label:'İkinci dil', price:7500, keywords:['ikinci dil','ingilizce','arapça','almanca','dil seçeneği'] },
    { key:'blog', label:'Blog / içerik sistemi', price:8000, keywords:['blog','makale','duyuru','haber','içerik'] },
    { key:'animation', label:'Gelişmiş animasyon', price:7500, keywords:['animasyon','premium geçiş','gecis','interaktif','3d','futuristik'] },
    { key:'kvkk', label:'KVKK / gizlilik sayfaları', price:3500, keywords:['kvkk','gizlilik','çerez','cerez','hukuk','izin'] }
  ];

  const styleProfiles = [
    { key:'luxury', label:'Luxury / Editorial', price:6000, keywords:['lüks','luks','gold','krem','rose','premium','şık','sik','zarif','altın'], description:'Krem, gold, rose-gold detaylar; geniş boşluk, editorial başlıklar, yüksek güven ve pahalı algı.' },
    { key:'futuristic', label:'Futuristic / Immersive', price:7500, keywords:['futuristik','fütüristik','neon','ai','yapay zeka','teknolojik','cyber','interaktif'], description:'Koyu zemin, neon enerji, hareketli katmanlar, teknoloji ve yenilik algısı.' },
    { key:'minimal', label:'Minimal / Pure', price:0, keywords:['minimal','sade','beyaz','temiz','soft','modern','basit'], description:'Ferah boşluk, net tipografi, az efekt; yüksek okunabilirlik ve premium sadelik.' },
    { key:'corporate', label:'Corporate / Trust', price:3000, keywords:['kurumsal','ciddi','güven','guven','lacivert','profesyonel'], description:'Lacivert, düzenli grid, net CTA, şirket güveni ve karar verici dili.' }
  ];

  function detectBusinessName(text) {
    const raw = String(text || '').replace(/\s+/g, ' ').trim();
    const patterns = [
      /(?:marka|işletme|isletme|firma|şirket|sirket)\s*(?:adı|adi)?\s*[:\-]\s*([^.,;\n]{2,70})/i,
      /([^.,;\n]{3,70})\s+adında\s+(?:bir\s+)?(?:güzellik|beauty|emlak|kafe|restoran|klinik|firma|işletme|isletme|salon)/i,
      /([^.,;\n]{3,70})\s+isimli\s+(?:bir\s+)?(?:güzellik|beauty|emlak|kafe|restoran|klinik|firma|işletme|isletme|salon)/i,
      /(?:benim|bizim)\s+([^.,;\n]{3,60})\s+(?:adlı|adli|isimli)\s+/i
    ];
    for (const rgx of patterns) {
      const m = raw.match(rgx);
      if (m && m[1]) return m[1].replace(/^(Mersin|Niğde|Istanbul|İstanbul|Ankara|Mezitli|Bor)\s+/i, '').trim();
    }
    return '';
  }

  function detectLocation(text) {
    const known = ['Mersin','Mezitli','Niğde','Bor','İstanbul','Ankara','Adana','Konya','Kayseri','Aşağı Kayabaşı','İlhanlı','Selçuk','Yenişehir','Tarsus'];
    const found = known.filter(k => tr(text).includes(tr(k)));
    return { city: found[0] || '', district: found[1] || '' };
  }

  function detectSector(text) {
    const scored = sectors.map(s => ({
      ...s,
      score: s.keywords.reduce((acc, k) => acc + (tr(text).includes(tr(k)) ? 1 : 0), 0)
    })).sort((a,b) => b.score - a.score || b.weight - a.weight);
    return scored[0].score > 0 ? scored[0] : sectors.find(s => s.key === 'corporate');
  }

  function detectStyle(text, sector) {
    const style = styleProfiles
      .map(s => ({...s, score: s.keywords.reduce((acc,k)=>acc + (tr(text).includes(tr(k)) ? 1 : 0), 0)}))
      .sort((a,b)=>b.score-a.score)[0];
    if (style.score) return style;
    if (sector.key === 'beauty') return styleProfiles.find(s => s.key === 'luxury');
    if (sector.key === 'realestate') return styleProfiles.find(s => s.key === 'corporate');
    if (sector.key === 'architecture') return styleProfiles.find(s => s.key === 'minimal');
    return styleProfiles.find(s => s.key === 'corporate');
  }

  function detectFeatures(text, sector) {
    let selected = features.filter(f => matchAny(text, f.keywords));
    const ensure = (key) => { const f = features.find(x => x.key === key); if (f && !selected.some(x => x.key === key)) selected.push(f); };
    if (sector.key === 'beauty') { ensure('appointment'); ensure('seo'); ensure('servicePages'); ensure('gallery'); }
    if (sector.key === 'realestate') { ensure('listings'); ensure('filters'); ensure('seo'); }
    if (sector.key === 'food') { ensure('appointment'); ensure('gallery'); }
    if (sector.key === 'clinic') { ensure('appointment'); ensure('kvkk'); ensure('seo'); }
    if (tr(text).includes('yorum panel')) ensure('reviews');
    if (tr(text).includes('google')) ensure('seo');
    if (tr(text).includes('whatsapp')) ensure('appointment');
    return uniq(selected.map(f => f.key)).map(k => features.find(f => f.key === k));
  }

  function choosePackage(sector, feats) {
    const keys = feats.map(f => f.key);
    if (keys.includes('admin') || keys.includes('database') || keys.includes('membership') || keys.includes('listings') || keys.includes('payment')) {
      if (sector.key === 'realestate') return { name:'Özel Dijital Sistem', base:84900, min:84900 };
      return { name:'Özel Dijital Sistem', base:84900, min:84900 };
    }
    if (sector.key === 'beauty' || sector.key === 'clinic' || sector.key === 'fitness' || sector.key === 'architecture') {
      return { name:'Signature Web Experience', base:49900, min:sector.min || 49900 };
    }
    return { name:sector.package, base:sector.base, min:sector.min };
  }

  function calcPrice(sector, style, feats, text) {
    const pkg = choosePackage(sector, feats);
    const included = new Set(['seo']);
    if (pkg.name.includes('Signature')) included.add('servicePages');
    let featureTotal = feats.reduce((sum, f) => sum + (included.has(f.key) ? 0 : f.price), 0);
    let total = pkg.base + style.price + featureTotal;
    const keys = feats.map(f => f.key);
    let discount = 0;
    if (keys.includes('admin') && keys.includes('database')) discount += 5000;
    if (keys.includes('listings') && keys.includes('filters') && keys.includes('admin')) discount += 12000;
    if (sector.key === 'beauty' && keys.includes('appointment') && keys.includes('reviews') && keys.includes('campaigns') && keys.includes('gallery')) discount += 5000;
    if (matchAny(text, ['acil','hemen','çok hızlı','cok hizli','1 hafta'])) total *= 1.25;
    total = Math.max(pkg.min || 0, total - discount);
    return { total: Math.round(total / 100) * 100, pkg, discount, featureTotal };
  }

  function estimateTime(total, feats) {
    const keys = feats.map(f => f.key);
    if (total >= 100000 || keys.includes('admin') || keys.includes('database')) return '30–45 iş günü';
    if (total >= 65000) return '22–32 iş günü';
    if (total >= 45000) return '16–24 iş günü';
    return '10–18 iş günü';
  }

  function analyze(text) {
    const sector = detectSector(text);
    const style = detectStyle(text, sector);
    const feats = detectFeatures(text, sector);
    const location = detectLocation(text);
    const business = detectBusinessName(text);
    const price = calcPrice(sector, style, feats, text);
    const keys = feats.map(f => f.key);
    const missing = [];
    if (!business) missing.push('Marka / işletme adı');
    if (!location.city) missing.push('Şehir ve hizmet bölgesi');
    if (!matchAny(text, ['telefon','whatsapp','numara'])) missing.push('WhatsApp / telefon');
    if (!matchAny(text, ['fotoğraf','fotograf','logo','görsel','gorsel'])) missing.push('Logo ve gerçek işletme fotoğrafları');
    if (!matchAny(text, ['bütçe','butce','fiyat','tl'])) missing.push('Bütçe beklentisi');
    if (sector.key === 'beauty' && !keys.includes('reviews')) missing.push('Yorum paneli istenip istenmediği');
    if (sector.key === 'realestate' && !keys.includes('admin')) missing.push('İlanları kimin yöneteceği');

    const clarity = clamp(26 + (sector ? 18 : 0) + (business ? 10 : 0) + (location.city ? 10 : 0) + (style ? 8 : 0) + Math.min(28, feats.length * 4) + (text.length > 160 ? 8 : 0), 15, 99);
    const opportunity = clamp(sector.weight + Math.min(12, feats.length * 2) + (keys.includes('seo') ? 5 : 0) - missing.length * 2, 40, 100);
    const risk = clamp(18 + (keys.includes('payment') ? 14 : 0) + (keys.includes('admin') ? 10 : 0) + (keys.includes('database') ? 10 : 0) + ((sector.key === 'beauty' || sector.key === 'clinic') ? 12 : 0) + missing.length * 3, 10, 92);
    const pages = uniq([...sector.pages, ...(keys.includes('blog') ? ['Blog / içerikler'] : []), ...(keys.includes('payment') ? ['Ödeme / satın alma'] : []), ...(keys.includes('membership') ? ['Üye paneli'] : []), ...(keys.includes('admin') ? ['Admin paneli'] : [])]);

    const brief = {
      text, sector, style, feats, location, business,
      packageName: price.pkg.name,
      price: price.total,
      discount: price.discount,
      time: estimateTime(price.total, feats),
      clarity, opportunity, risk, missing,
      pages,
      seo: sector.seo,
      angle: sector.angle,
      warnings: sector.warnings,
      createdAt: new Date().toISOString()
    };
    state.lastBrief = brief;
    state.history.push({ business: business || sector.label, sector: sector.label, price: brief.price, time: brief.createdAt });
    state.history = state.history.slice(-6);
    localStorage.setItem(STORE, JSON.stringify(state.history));
    return brief;
  }

  function addMessage(role, html, opts = {}) {
    const msg = document.createElement('div');
    msg.className = `eb-ai-msg ${role}`;
    msg.innerHTML = html;
    messages.appendChild(msg);
    if (!opts.noScroll) messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  function typing(label = 'Oracle analiz ediyor') {
    const el = addMessage('bot', `<div class="eb-ai-typing"><span></span><span></span><span></span><b>${esc(label)}</b></div>`);
    return () => el.remove();
  }

  function updateIntel(brief) {
    stateSector.textContent = brief.sector.label.split('/')[0].trim().toUpperCase();
    statePackage.textContent = brief.packageName.toUpperCase();
    statePrice.textContent = money(brief.price);
    intelScore.textContent = `${brief.clarity}%`;
    intelList.innerHTML = `
      <p><b>Fırsat:</b> ${brief.opportunity}/100</p>
      <p><b>Risk:</b> ${brief.risk}/100</p>
      <p><b>Tasarım:</b> ${esc(brief.style.label)}</p>
      <p><b>Modül:</b> ${brief.feats.length} ana özellik</p>
      <p><b>Teslim:</b> ${esc(brief.time)}</p>
    `;
  }

  function moduleTags(brief) {
    return brief.feats.map(f => `<span class="eb-ai-keyword">${esc(f.label)}</span>`).join('') || '<span class="eb-ai-keyword">Temel web site altyapısı</span>';
  }

  function mainReport(brief) {
    const missing = brief.missing.slice(0, 5).map(x => `<li>${esc(x)}</li>`).join('') || '<li>Brief ana hatlarıyla yeterli.</li>';
    return `
      <div class="eb-ai-oracle-card">
        <div class="ai-brief-top"><span>PROJECT INTELLIGENCE REPORT</span><strong>${esc(brief.business || 'Yeni Proje')}</strong></div>
        <div class="ai-price">${money(brief.price)}</div>
        <p><b>Karar:</b> ${esc(brief.packageName)} önerilir. ${esc(brief.angle)}</p>
        <div class="ai-metrics">
          <span><b>${brief.clarity}%</b><small>Netlik</small></span>
          <span><b>${brief.opportunity}</b><small>Fırsat</small></span>
          <span><b>${brief.risk}</b><small>Risk</small></span>
        </div>
      </div>
      <div class="ai-card"><h3>Stratejik Konumlandırma</h3><p>${esc(brief.sector.goal)}</p><p><b>Tasarım dili:</b> ${esc(brief.style.description)}</p></div>
      <div class="ai-card"><h3>Olmazsa Olmaz Modüller</h3>${moduleTags(brief)}</div>
      <div class="ai-card"><h3>İlk Mimari</h3><ul>${brief.pages.slice(0, 9).map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
      <div class="ai-card"><h3>Eksik Bilgi Kontrolü</h3><ul>${missing}</ul></div>
      <div class="ai-note">SEO veya satış sonucu garanti edilmez; sistem teknik altyapı, içerik ve güven akışı olarak profesyonel biçimde hazırlanır.</div>
    `;
  }

  function setQuick(mode = 'analysis') {
    const chips = [
      ['strategy','Strateji briefi',true],
      ['architecture','Site mimarisi'],
      ['design','Design Director'],
      ['proposal','Teklif metni'],
      ['sales','Satış konuşması'],
      ['objections','İtiraz cevapları'],
      ['risk','Risk kontrol'],
      ['whatsapp','WhatsApp özeti'],
      ['fill','Formu doldur'],
      ['copy','Kopyala']
    ];
    quick.innerHTML = chips.map(([action,label,primary]) => `<button class="eb-ai-chip ${primary ? 'primary' : ''}" type="button" data-ai-action="${action}">${label}</button>`).join('');
  }

  function boot() {
    if (state.booted) return;
    state.booted = true;
    addMessage('bot', `
      <b>EB Oracle AI hazır.</b><br>
      Bana müşterinin işletmesini tek paragraf anlat. Ben bunu satış dosyasına çeviririm: paket, fiyat, site mimarisi, tasarım dili, SEO planı, itiraz cevapları ve WhatsApp teklifi.
      <div class="ai-card"><h3>En iyi test</h3><p>“Mersin Mezitli’de Merve Yıldırım Beauty adında güzellik merkezim var. Krem-gold lüks tasarım, randevu, yorum paneli, kampanya, hizmet sayfaları, galeri, KVKK ve SEO istiyorum.”</p></div>
    `);
    quick.innerHTML = [
      ['demoBeauty','Güzellik demo',true],
      ['demoEstate','Emlak demo'],
      ['demoFood','Kafe demo'],
      ['how','Nasıl çalışır?']
    ].map(([a,l,p]) => `<button class="eb-ai-chip ${p?'primary':''}" data-ai-action="${a}" type="button">${l}</button>`).join('');
  }

  function analyzeAndRender(text) {
    state.lastText = text;
    addMessage('user', esc(text));
    const stop = typing('brief, fiyat, SEO ve satış planı çıkarılıyor');
    setTimeout(() => {
      stop();
      const brief = analyze(text);
      updateIntel(brief);
      addMessage('bot', mainReport(brief));
      setQuick('analysis');
    }, 520);
  }

  function buildSummary(brief) {
    if (!brief) return 'Henüz analiz yapılmadı.';
    return `EB Digital Studio Proje Özeti\n\nMarka: ${brief.business || 'Belirtilmedi'}\nSektör: ${brief.sector.label}\nKonum: ${brief.location.city || 'Belirtilmedi'} ${brief.location.district || ''}\nPaket: ${brief.packageName}\nÖn fiyat: ${money(brief.price)}\nTeslim: ${brief.time}\nTasarım: ${brief.style.label}\nModüller: ${brief.feats.map(f=>f.label).join(', ') || 'Temel web sitesi'}\nSEO hedefleri: ${brief.seo.join(', ')}\nEksik bilgiler: ${brief.missing.join(', ') || 'Yok'}\n\nNot: Fiyat ön bilgilendirme niteliğindedir; kesin teklif kapsam netleşince hazırlanır.`;
  }

  function actionStrategy(brief) {
    return `
      <div class="ai-card"><h3>CEO Seviyesi Strateji Briefi</h3>
      <p><b>Ana satış fikri:</b> ${esc(brief.angle)}</p>
      <p><b>Müşteri psikolojisi:</b> Bu sektör müşterisi önce güven, sonra kolay iletişim, en son fiyat arar. Site bu sırayı bozmadan tasarlanmalı.</p>
      <p><b>Dönüşüm zinciri:</b> Arama / Instagram → güven veren ana sayfa → hizmet veya portföy detayı → sosyal kanıt → WhatsApp/randevu → takip.</p>
      <p><b>Sunum cümlesi:</b> “Bu çalışma yalnızca site değil, markanız için randevu ve talep toplayan dijital satış sistemi olacak.”</p></div>
    `;
  }

  function actionArchitecture(brief) {
    return `
      <div class="ai-card"><h3>Site Mimarisi</h3><ul>${brief.pages.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>
      <div class="ai-card"><h3>Dönüşüm Akışı</h3><ul>
        <li>Hero alanında net değer vaadi ve hızlı WhatsApp CTA.</li>
        <li>Hizmet / ilan / paket detaylarında karar için gerekli bilgiler.</li>
        <li>Güven katmanı: yorumlar, süreç, KVKK, sık sorulan sorular.</li>
        <li>Son adım: kısa form + WhatsApp mesajı + telefon bağlantısı.</li>
      </ul></div>
    `;
  }

  function actionDesign(brief) {
    return `
      <div class="ai-card"><h3>Design Director Kararı</h3>
      <p><b>Yön:</b> ${esc(brief.style.label)}</p><p>${esc(brief.style.description)}</p>
      <ul>
        <li>İlk ekranda premium marka algısı; kalabalık değil, net ve güçlü.</li>
        <li>Butonlar tek amaçlı: randevu, teklif veya WhatsApp.</li>
        <li>Kartlar sektöre göre farklılaşır; beauty’de zarif, emlakta yatırım odaklı, klinikte güvenli.</li>
        <li>Mobilde alt sabit iletişim butonu kullanılmalı.</li>
      </ul></div>
    `;
  }

  function actionProposal(brief) {
    return `
      <div class="ai-card"><h3>Müşteriye Gönderilecek Teklif Metni</h3>
      <pre class="ai-copy">Merhaba, ${brief.business || 'markanız'} için yaptığım ön değerlendirmeye göre en doğru yapı ${brief.packageName} olacaktır.\n\nBu sistemde ${brief.feats.map(f=>f.label).join(', ') || 'kurumsal web site altyapısı'} yer alır. Amaç yalnızca şık bir site yapmak değil; markanızı daha güvenilir göstermek, müşterinin bilgiye hızlı ulaşmasını sağlamak ve WhatsApp / teklif akışını güçlendirmektir.\n\nÖn kapsam fiyatı: ${money(brief.price)}\nTahmini teslim: ${brief.time}\n\nKesin teklif; logo, fotoğraflar, içerikler ve teknik kapsam netleştikten sonra hazırlanır.</pre>
      </div>
    `;
  }

  function actionSales(brief) {
    return `
      <div class="ai-card"><h3>Telefon Görüşmesi Senaryosu</h3>
      <pre class="ai-copy">Merhaba, ben Efecan Berber. EB Digital Studio olarak işletmelere özel web siteleri ve dijital sistemler hazırlıyorum.\n\n${brief.business || 'İşletmenizi'} incelediğimde, ${brief.sector.label} alanında daha güçlü ve güven veren bir dijital sunumla müşteri taleplerinin daha düzenli toplanabileceğini düşündüm.\n\nBenim önerim sadece güzel görünen bir site değil; ${brief.feats.map(f=>f.label).join(', ') || 'iletişim ve teklif akışı'} olan, müşteriyi karar vermeye yaklaştıran bir yapı.\n\nSize özel kısa bir ön izleme hazırlayıp göstermek isterim. Beğenirseniz kapsamı ve fiyatı birlikte netleştiririz.</pre>
      </div>
    `;
  }

  function actionObjections(brief) {
    return `
      <div class="ai-card"><h3>İtiraz Cevapları</h3><ul>
        <li><b>“Instagram yetiyor.”</b> Instagram görünürlük sağlar; web sitesi ise güven, Google araması ve düzenli bilgi merkezi sağlar.</li>
        <li><b>“Fiyat yüksek.”</b> Kapsam; tasarım, mobil uyum, SEO altyapısı, ${esc(brief.feats.slice(0,3).map(f=>f.label).join(', '))} ve yayın desteğini içerir.</li>
        <li><b>“Sonra düşünelim.”</b> Önce düşük riskli ana sayfa ön izlemesiyle başlayabiliriz; beğenilirse tam kapsam netleşir.</li>
        <li><b>“Google’da çıkar mıyız?”</b> Teknik altyapı ve içerik SEO uyumlu kurulur; sıralama garanti edilmez ama doğru temel atılır.</li>
      </ul></div>
    `;
  }

  function actionRisk(brief) {
    return `
      <div class="ai-card"><h3>Risk ve Kalite Kontrol</h3><ul>
        ${brief.warnings.map(w=>`<li>${esc(w)}</li>`).join('')}
        <li>Fiyat, kesin teklif değil ön bilgilendirme olarak sunulmalı.</li>
        <li>Alan adı, hosting, e-posta ve üçüncü taraf servisler ayrıca belirtilmeli.</li>
        <li>Gerçek müşteri verisi kullanılacaksa KVKK / açık rıza akışı korunmalı.</li>
        <li>Yayın öncesi mobil hız, form bağlantıları, WhatsApp mesajı ve Search Console kontrol edilmeli.</li>
      </ul></div>
    `;
  }

  function actionSeo(brief) {
    return `
      <div class="ai-card"><h3>SEO Hedefleri</h3>${brief.seo.map(k=>`<span class="eb-ai-keyword">${esc(k)}</span>`).join('')}</div>
      <div class="ai-card"><h3>SEO Planı</h3><ul>
        <li>Her ana hizmet / ilan / kategori için ayrı başlık ve açıklama.</li>
        <li>Yerel aramalar için şehir + hizmet kombinasyonları.</li>
        <li>Schema, sitemap, robots ve Search Console kurulumu.</li>
        <li>Düzenli içerik veya yeni portföy girişiyle tazelik sinyali.</li>
      </ul></div>
    `;
  }

  function fillProposal(brief) {
    const formEl = document.getElementById('proposalForm');
    if (!formEl) return false;
    const set = (name, value) => { const el = formEl.querySelector(`[name="${name}"]`); if (el) el.value = value; };
    set('name', brief.business || 'Yeni proje');
    set('type', brief.packageName.includes('Sistem') ? 'Admin paneli' : 'Kurumsal web sitesi');
    set('pages', brief.pages.length > 7 ? '8+ sayfa' : '4–7 sayfa');
    set('deadline', brief.time.includes('10') ? '2–4 hafta' : '1–2 ay');
    const details = formEl.querySelector('[name="details"]');
    if (details) details.value = buildSummary(brief);
    formEl.querySelectorAll('[name="feature"]').forEach(c => {
      c.checked = brief.feats.some(f => tr(f.label).includes(tr(c.value))) || (c.value === 'Mobil uyum');
    });
    location.hash = '#contact';
    return true;
  }

  function handleAction(action) {
    const brief = state.lastBrief;
    if (action === 'demoBeauty') return analyzeAndRender('Mersin Mezitli’de Merve Yıldırım Beauty adında güzellik merkezim var. Lazer epilasyon, cilt bakımı, kalıcı makyaj, bölgesel incelme ve tırnak hizmetleri veriyoruz. Krem-gold lüks tasarım, WhatsApp randevu, yorum paneli, kampanya alanı, hizmet detay sayfaları, galeri, KVKK ve Google SEO istiyorum.');
    if (action === 'demoEstate') return analyzeAndRender('Niğde’de Net Emlak adında emlak ofisim var. Satılık ve kiralık ilanlarımı göstermek, mahalle fiyat oda sayısı ve ilan türüne göre filtreleme yapmak, her ilan için detay sayfası ve WhatsApp bilgi al butonu eklemek istiyorum. İleride admin panelinden ilanları kendim eklemek istiyorum.');
    if (action === 'demoFood') return analyzeAndRender('Niğde’de restoran ve kafe işletmem var. Dijital menü, rezervasyon, galeri, kampanya, müşteri yorumları, konum ve WhatsApp üzerinden masa talebi almak istiyorum. Sıcak, modern ve iştah açıcı bir tasarım olsun.');
    if (action === 'how') return addMessage('bot', '<b>Çalışma mantığı:</b> Müşteri mesajını sektör, hedef, tasarım dili, modül, risk ve SEO açısından okur; sonra paket, fiyat, site mimarisi, satış metni ve WhatsApp özeti üretir. Bu sürüm API kullanmaz; güvenli ve maliyetsizdir.');
    if (!brief) return addMessage('bot', 'Önce bir proje briefi yaz. Sonra bu butonlar aktif olarak satış dosyası üretir.');
    const map = {
      strategy: actionStrategy,
      architecture: actionArchitecture,
      design: actionDesign,
      proposal: actionProposal,
      sales: actionSales,
      objections: actionObjections,
      risk: actionRisk,
      seo: actionSeo
    };
    if (map[action]) return addMessage('bot', map[action](brief));
    if (action === 'copy' || action === 'export') {
      navigator.clipboard?.writeText(buildSummary(brief));
      return addMessage('bot', '<b>Özet kopyalandı.</b><br>Teklif görüşmesinde veya WhatsApp mesajında kullanabilirsin.');
    }
    if (action === 'fill') {
      const ok = fillProposal(brief);
      return addMessage('bot', ok ? '<b>Teklif formu dolduruldu.</b><br>Form alanına geçip WhatsApp teklifini gönderebilirsin.' : 'Teklif formu bu sayfada bulunamadı.');
    }
    if (action === 'whatsapp') {
      const txt = encodeURIComponent(buildSummary(brief));
      window.open(`https://wa.me/${PHONE}?text=${txt}`, '_blank', 'noopener');
      return addMessage('bot', '<b>WhatsApp özeti hazırlandı.</b><br>Yeni pencerede gönderim ekranı açıldı.');
    }
  }

  function answerSimple(text) {
    const n = tr(text);
    if (n.includes('fiyat') || n.includes('ne kadar') || n.includes('ucret')) {
      return 'Fiyat proje kapsamına göre değişir. Basit kurumsal siteler daha düşük, admin paneli/veritabanı/üyelik/ilan sistemi olan projeler daha yüksek bütçelidir. En doğru sonuç için işletme türü, sayfa sayısı ve istenen özellikleri tek paragraf yaz; ben net bir ön fiyat çıkarayım.';
    }
    if (n.includes('seo') || n.includes('google')) {
      return 'Google görünürlüğü için title, açıklama, hizmet sayfaları, yerel anahtar kelimeler, schema, sitemap ve Search Console kurulumu gerekir. Sıralama garanti edilmez; ama teknik ve içerik altyapısı doğru kurulursa marka aramalarında görünme ihtimali güçlenir.';
    }
    if (n.includes('admin')) {
      return 'Admin paneli; işletmenin ilan, yorum, kampanya, hizmet veya öğrenci/müşteri verilerini kendi yönetebilmesini sağlar. Veritabanı ve giriş yetkisiyle birlikte düşünülmelidir.';
    }
    return '';
  }

  function openAssistant() {
    assistant.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    boot();
    setTimeout(() => input?.focus(), 100);
  }
  function closeAssistant() {
    assistant.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  $$('[data-assistant-open]').forEach(btn => btn.addEventListener('click', openAssistant));
  $$('[data-assistant-close]', assistant).forEach(btn => btn.addEventListener('click', closeAssistant));

  assistant.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-ai-action]');
    if (actionBtn) {
      e.preventDefault();
      handleAction(actionBtn.dataset.aiAction);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const simple = answerSimple(text);
    if (simple && text.length < 80) {
      addMessage('user', esc(text));
      addMessage('bot', esc(simple));
      return;
    }
    analyzeAndRender(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && assistant.classList.contains('is-open')) closeAssistant();
  });

  assistant.dataset.aiVersion = VERSION;
})();
