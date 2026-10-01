// Genera le pagine HTML statiche del sito (header e footer scritti una volta sola).
// Uso: node _build/build.js  (dalla cartella del progetto). Modificare i testi QUI, non negli .html generati.
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..');

// Dati di contatto: DEMO, volutamente fittizi
const TEL = '02 0000 0000', TEL_HREF = 'tel:+390200000000';
const WA = '000 000 0000', WA_HREF = 'https://wa.me/390000000000';
const EMAIL = 'segreteria@studiolumea.example';
const ADDR = 'Via delle Calendule 12, 20145 Milano';
const MAP_LINK = 'https://www.openstreetmap.org/?mlat=45.4679&amp;mlon=9.1560#map=17/45.4679/9.1560';
const V = '11'; // cache-busting css/js
// Indirizzo pubblico del sito (da compilare quando sarà online): serve per l'anteprima dei link (og:image vuole un URL assoluto)
const SITE = 'https://chillguyzofficial-spec.github.io/StudioLumea_Dentistico/';

// Dati strutturati per Google (scheda "Dentista")
const SCHEMA = {
  "@context": "https://schema.org", "@type": "Dentist",
  name: "Studio Odontoiatrico Lumea (progetto dimostrativo)",
  telephone: "+39 02 0000 0000", email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: "Via delle Calendule 12", postalCode: "20145", addressLocality: "Milano", addressCountry: "IT" },
  geo: { "@type": "GeoCoordinates", latitude: 45.4679, longitude: 9.1560 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
  ],
  medicalSpecialty: "Dentistry",
};

const NAV = [
  { id: 'home', label: 'Home', href: 'index.html' },
  { id: 'trattamenti', label: 'Trattamenti', href: 'trattamenti.html' },
  { id: 'studio', label: 'Lo studio e il team', href: 'studio.html' },
  { id: 'contatti', label: 'Contatti', href: 'contatti.html' },
];
const cur = (id, active) => (id === active ? ' aria-current="page"' : '');

// Ogni foto ha 3 misure (800, 1400, originale): il browser scarica quella adatta allo schermo.
// dimensioni lette direttamente dal file WebP (VP8X / VP8 / VP8L)
function webpSize(file) {
  const b = fs.readFileSync(path.join(out, 'assets/img', file));
  const t = b.toString('ascii', 12, 16);
  if (t === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  if (t === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (t === 'VP8L') { const n = b.readUInt32LE(21); return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
  throw new Error('formato WebP non riconosciuto: ' + file);
}
const img = (src, alt, { eager = false, sizes = '(max-width: 960px) 100vw, 50vw' } = {}) => {
  const { w, h } = webpSize(src);
  const base = 'assets/img/' + src.replace('.webp', '');
  return `<img src="${base}-1400.webp" srcset="${base}-800.webp 800w, ${base}-1400.webp 1400w, ${base}.webp ${w}w" sizes="${sizes}" alt="${alt}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
};
const TEAM_SIZES = '(max-width: 700px) 100vw, 33vw';

function page({ file, active, title, description, body, schema = false }) {
  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#FAF7F1">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="Studio Odontoiatrico Lumea">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
${SITE ? `<meta property="og:url" content="${SITE}${file === 'index.html' ? '' : file}">
<meta property="og:image" content="${SITE}assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
` : ''}${schema ? `<script type="application/ld+json">${JSON.stringify(SCHEMA)}</script>
` : ''}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&amp;family=Newsreader:opsz,wght@6..72,400;6..72,500&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css?v=${V}">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
<a class="skip" href="#main">Vai al contenuto</a>
<div class="header-spacer"></div>
<header class="site-header">
  <div class="header-in">
    <a class="brand" href="index.html">
      <span class="brand__name">Studio Lumea</span>
      <span class="brand__sub">Odontoiatria · Milano</span>
    </a>
    <nav class="nav" aria-label="Menu principale">
${NAV.map(l => `      <a class="nav__link" href="${l.href}"${cur(l.id, active)}>${l.label}</a>`).join('\n')}
      <a class="nav__tel" href="${TEL_HREF}">${TEL}</a>
      <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
    </nav>
    <button class="menu-toggle" type="button" data-menu-open aria-controls="mobile-menu" aria-expanded="false">
      <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span></span>Menu
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="mobile-menu__top">
    <span class="brand__name">Studio Lumea</span>
    <button class="menu-toggle" type="button" data-menu-close>Chiudi</button>
  </div>
  <nav class="mobile-menu__nav" aria-label="Menu mobile">
${NAV.map(l => `    <a href="${l.href}"${cur(l.id, active)} data-menu-close>${l.label}</a>`).join('\n')}
  </nav>
  <div class="mobile-menu__foot">
    <a class="btn btn--primary" href="contatti.html#prenota" data-menu-close>Prenota una visita</a>
    <div class="row">
      <a class="btn btn--ghost btn--sm" href="${TEL_HREF}">Chiama</a>
      <a class="btn btn--ghost btn--sm" href="${WA_HREF}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
    <p>${ADDR}<br>Lun–Ven 9:00–19:30 · Sab 9:00–13:00</p>
  </div>
</div>
<div class="mobile-bar">
  <a class="btn btn--ghost" href="${TEL_HREF}">Chiama</a>
  <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
</div>

<main id="main">
${body.trim()}
</main>

<footer class="site-footer">
  <div class="footer-in">
    <div class="footer-cols">
      <div>
        <span class="footer-brand">Studio Lumea</span>
        <p>Studio Odontoiatrico Lumea S.r.l.<br>${ADDR}</p>
      </div>
      <div>
        <span class="footer-title">Contatti</span>
        <a href="${TEL_HREF}">Tel. ${TEL}</a>
        <a href="${WA_HREF}" target="_blank" rel="noopener">WhatsApp ${WA}</a>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
      </div>
      <div>
        <span class="footer-title">Orari</span>
        <p>Lun–Ven 9:00–19:30<br>Sabato 9:00–13:00<br>Domenica chiuso</p>
      </div>
      <div>
        <span class="footer-title">Pagine</span>
        <a href="trattamenti.html">Trattamenti</a>
        <a href="studio.html">Lo studio e il team</a>
        <a href="contatti.html">Contatti e prenotazione</a>
      </div>
    </div>
    <div class="footer-legal">
      <p>Direttore sanitario: Dott. Lorenzo Valdieri, odontoiatra, iscritto all'Albo degli Odontoiatri dell'Ordine dei Medici Chirurghi e degli Odontoiatri di Milano al n. 4127.<br>P.IVA 00000000000 · Autorizzazione sanitaria n. 318/2006</p>
      <div class="footer-links">
        <a href="privacy.html">Privacy policy</a>
        <a href="privacy.html#cookie">Cookie policy</a>
        <small>Progetto dimostrativo realizzato da Eff$Kappa. Studio, persone, nomi, numeri, dati e indirizzo sono di fantasia: non si riferiscono a persone o attività reali e ogni somiglianza è casuale. Le foto sono illustrative.</small>
      </div>
    </div>
  </div>
</footer>
<script src="js/main.js?v=${V}"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(out, file), html);
  console.log('scritto', file);
}

// ---------- HOME ----------
const TREATMENTS = [
  ['igiene', 'Igiene e prevenzione', 'Pulizia professionale, controllo delle gengive e consigli pratici per la cura quotidiana a casa.'],
  ['conservativa', 'Conservativa', 'Cura della carie e ricostruzione dei denti danneggiati, cercando di conservare quanto più dente naturale possibile.'],
  ['ortodonzia', 'Ortodonzia', 'Apparecchi fissi e allineatori trasparenti per bambini, ragazzi e adulti.'],
  ['implantologia', 'Implantologia', 'Sostituzione di uno o più denti mancanti con impianti in titanio e corone fisse.'],
  ['pedodonzia', 'Pedodonzia', 'Le prime visite dei bambini, la prevenzione della carie e la cura dei denti da latte.'],
  ['estetica', 'Estetica dentale', 'Sbiancamento professionale e faccette, valutati dopo una visita e solo se indicati.'],
];
const URGENT = `<aside class="urgent" data-reveal aria-label="Urgenze">
      <span class="urgent__icon" aria-hidden="true">!</span>
      <div class="urgent__text">
        <strong>Hai dolore o un'urgenza?</strong>
        <span>Chiama la segreteria: per i pazienti dello studio cerchiamo un posto in giornata. <a href="index.html#faq-urgenze">Cosa fare fuori orario →</a></span>
      </div>
      <a class="btn btn--ghost btn--sm" href="${TEL_HREF}">Chiama ${TEL}</a>
    </aside>`;

const COSTS = [
  ['Preventivo scritto, sempre', 'Dopo la visita ricevi un preventivo scritto con le cure proposte, i tempi e i costi. Nessun trattamento inizia senza il tuo consenso.'],
  ['Pagamenti anche a rate', 'Accettiamo carta, bancomat e bonifico. Per i piani di cura più lunghi il pagamento può essere suddiviso nel corso del trattamento, da concordare prima di iniziare.'],
  ['Fondi sanitari integrativi', 'Lavoriamo con i principali fondi sanitari, in forma diretta (paga il fondo) o indiretta (paghi tu e poi chiedi il rimborso). La segreteria verifica la tua copertura prima dell\'appuntamento.'],
  ['Detrazione fiscale del 19%', 'Le spese odontoiatriche sono detraibili nella dichiarazione dei redditi. Serve il pagamento tracciabile (carta o bonifico): per questo non accettiamo contanti.'],
];

const FAQ = [
  ['faq-paura', 'Ho paura del dentista. Posso dirlo?', 'Certo, anzi ti chiediamo di dircelo già al telefono. Fissiamo appuntamenti con più tempo, spieghiamo ogni passaggio prima di farlo e concordiamo un segnale con la mano per fermarci quando vuoi.'],
  ['faq-prima-visita', 'Quanto costa e quanto dura la prima visita?', 'Dura circa un\'ora. Il costo della visita te lo comunica la segreteria al momento della prenotazione; eventuali cure successive sono indicate nel preventivo scritto, che puoi portare a casa e valutare con calma.'],
  ['faq-portare', 'Cosa devo portare al primo appuntamento?', 'Tessera sanitaria, eventuali radiografie o esami recenti e l\'elenco dei farmaci che prendi. Se hai un fondo sanitario, porta anche il numero di adesione.'],
  ['faq-bambini', 'A che età portare un bambino dal dentista?', 'Le raccomandazioni del Ministero della Salute consigliano una prima visita intorno ai 2 anni, anche senza problemi evidenti: serve a controllare i denti da latte e ad abituare il bambino all\'ambiente. Una prima valutazione ortodontica è utile verso i 6–7 anni.'],
  ['faq-fondi', 'Accettate assicurazioni e fondi sanitari?', 'Sì, con i principali fondi sanitari integrativi, in forma diretta o indiretta. Chiedi alla segreteria: verifichiamo noi cosa copre il tuo piano prima di iniziare.'],
  ['faq-detrazione', 'Le cure dentistiche sono detraibili?', 'Sì, rientrano nelle spese sanitarie detraibili al 19% per la parte che supera la franchigia di 129,11 euro. Conserva la fattura e paga con un metodo tracciabile (carta, bancomat o bonifico).'],
  ['faq-urgenze', 'Cosa faccio se ho dolore fuori orario?', 'Durante gli orari di apertura chiama la segreteria: per i pazienti dello studio cerchiamo un posto in giornata. Fuori orario lascia un messaggio in segreteria e ti richiamiamo alla riapertura. In caso di gonfiore al viso con febbre, difficoltà a deglutire o respirare, o di un trauma importante, rivolgiti subito al Pronto Soccorso o chiama il 112.'],
  ['faq-igiene', 'Ogni quanto va fatta la pulizia dei denti?', 'Di norma ogni 6 mesi. In alcuni casi, per esempio con gengive infiammate, apparecchi o impianti, l\'igienista può consigliare richiami più ravvicinati.'],
];

const HOURS = `<dl class="hours">
          <dt>Lunedì – Venerdì</dt><dd>9:00 – 19:30</dd>
          <dt>Sabato</dt><dd>9:00 – 13:00</dd>
          <dt>Domenica</dt><dd>Chiuso</dd>
        </dl>`;

page({
  file: 'index.html', active: 'home', schema: true,
  title: 'Studio Odontoiatrico Lumea · Milano',
  description: 'Studio odontoiatrico a Milano, zona Wagner: igiene, conservativa, ortodonzia, implantologia, pedodonzia ed estetica dentale. Progetto dimostrativo.',
  body: `
<section class="hero">
  <div class="wrap">
    <div class="hero__grid">
      <div class="hero__text" data-reveal>
        <span class="eyebrow">Studio odontoiatrico · Milano, zona Wagner</span>
        <h1 class="hero__title">Cure dentali con calma, spiegate passo dopo passo.</h1>
        <p class="lead">Siamo uno studio di quartiere dove adulti e bambini vengono ascoltati prima di essere curati. Ogni trattamento parte da una visita, da un piano scritto e dal tempo per fare domande.</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
          <a class="hero__tel" href="${TEL_HREF}">oppure chiama lo ${TEL}</a>
        </div>
      </div>
      <div class="photo hero__photo" data-reveal="150">
        ${img('reception.webp', 'La segreteria dello studio accoglie un paziente all\'ingresso', { eager: true })}
      </div>
    </div>
    <div class="facts" data-reveal>
      <div><span>In Via delle Calendule</span><span>dal 2006</span></div>
      <div><span>Orari</span><span>Lun–Ven 9–19:30 · Sab 9–13</span></div>
      <div><span>Come arrivare</span><span>M1 Wagner, 4 minuti a piedi</span></div>
    </div>
    ${URGENT}
  </div>
</section>

<section class="section section--alt">
  <div class="wrap split">
    <div class="photo" style="aspect-ratio:5/4" data-reveal>
      ${img('accoglienza.webp', 'Un papà con la figlia in braccio sorride all\'ingresso dello studio')}
    </div>
    <div class="stack-lg" style="max-width:560px" data-reveal="120">
      <span class="eyebrow">Chi siamo</span>
      <h2 class="h2">Uno studio piccolo, dove ci si conosce per nome.</h2>
      <p class="text">Lo studio è stato aperto nel 2006 dal Dott. Lorenzo Valdieri. Oggi lavoriamo in tre professionisti, con due poltrone e una segreteria che segue ogni paziente dalla prima telefonata.</p>
      <p class="text">Sappiamo che per molte persone sedersi sulla poltrona non è semplice. Per questo fissiamo appuntamenti con tempi ampi, spieghiamo cosa stiamo per fare e ci fermiamo quando serve.</p>
      <a class="link-u" style="align-self:flex-start" href="studio.html">Conosci lo studio e il team →</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="row-between" data-reveal>
      <div class="stack" style="max-width:640px">
        <span class="eyebrow">Trattamenti</span>
        <h2 class="h2">Di cosa ci occupiamo</h2>
      </div>
      <a class="link-u" href="trattamenti.html">Tutti i trattamenti →</a>
    </div>
    <div class="cards">
${TREATMENTS.map(([id, t, d], i) => `      <div data-reveal="${(i % 3) * 80}"><a class="card" href="trattamenti.html#${id}"><span class="card__num">0${i + 1}</span><span class="card__title">${t}</span><span class="card__text">${d}</span><span class="card__more">Scopri di più →</span></a></div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="stack" style="max-width:680px;margin-bottom:clamp(36px,4vw,56px)" data-reveal>
      <span class="eyebrow">Il team</span>
      <h2 class="h2">Tre professionisti, sempre gli stessi volti.</h2>
    </div>
    <div class="team">
      <div class="person" data-reveal>
        <div class="photo">${img('team-valdieri.webp', 'Ritratto del Dott. Lorenzo Valdieri', { sizes: TEAM_SIZES })}</div>
        <div class="stack" style="gap:6px"><span class="person__name">Dott. Lorenzo Valdieri</span><span class="person__role">Odontoiatra · Direttore sanitario</span><span class="person__bio">Laureato a Milano nel 2001, si occupa di conservativa e implantologia.</span></div>
      </div>
      <div class="person" data-reveal="100">
        <div class="photo">${img('team-ardenghi.webp', 'Ritratto della Dott.ssa Camilla Ardenghi', { sizes: TEAM_SIZES })}</div>
        <div class="stack" style="gap:6px"><span class="person__name">Dott.ssa Camilla Ardenghi</span><span class="person__role">Odontoiatra · Ortodontista</span><span class="person__bio">Specialista in Ortognatodonzia, segue bambini, ragazzi e adulti.</span></div>
      </div>
      <div class="person" data-reveal="200">
        <div class="photo">${img('team-sorelli.webp', 'Ritratto della Dott.ssa Giulia Sorelli', { sizes: TEAM_SIZES })}</div>
        <div class="stack" style="gap:6px"><span class="person__name">Dott.ssa Giulia Sorelli</span><span class="person__role">Igienista dentale</span><span class="person__bio">Si occupa di igiene professionale, prevenzione ed educazione alla cura a casa.</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="head-row" data-reveal>
      <div class="stack">
        <span class="eyebrow">La prima visita</span>
        <h2 class="h2">Come si svolge il primo appuntamento</h2>
      </div>
      <p class="text" style="max-width:520px">Dura circa un'ora. Non si inizia nessuna cura il primo giorno, salvo urgenze: prima si parla, si controlla e si decide insieme.</p>
    </div>
    <ol class="steps">
      <li data-reveal><span class="steps__n">1</span><span class="steps__t">Accoglienza e colloquio</span><span class="steps__d">Ci racconti cosa ti preoccupa, eventuali fastidi e le tue esperienze precedenti. Compiliamo insieme la scheda sulla salute generale.</span></li>
      <li data-reveal="100"><span class="steps__n">2</span><span class="steps__t">Visita e controllo</span><span class="steps__d">Il dentista controlla denti, gengive e masticazione. Se necessarie, si eseguono radiografie digitali, che richiedono pochi secondi.</span></li>
      <li data-reveal="200"><span class="steps__n">3</span><span class="steps__t">Piano di cura spiegato</span><span class="steps__d">Ti mostriamo cosa abbiamo visto e le possibili soluzioni, con tempi e costi indicati in un preventivo scritto.</span></li>
      <li data-reveal="300"><span class="steps__n">4</span><span class="steps__t">Decidi con calma</span><span class="steps__d">Porti a casa il preventivo e ci pensi. Quando vuoi, la segreteria fissa il primo appuntamento di cura.</span></li>
    </ol>
  </div>
</section>

<section class="section section--alt" id="costi">
  <div class="wrap">
    <div class="head-row" data-reveal>
      <div class="stack">
        <span class="eyebrow">Costi e pagamenti</span>
        <h2 class="h2">Sai prima quanto spendi, e come pagarlo</h2>
      </div>
      <p class="text" style="max-width:520px">I costi dipendono dalla cura che ti serve, per questo li indichiamo solo dopo la visita. Ma come funziona il pagamento è giusto saperlo da subito.</p>
    </div>
    <div class="tech">
${COSTS.map(([t, d], i) => `      <div data-reveal="${i * 80}" style="background:var(--card);border:1px solid var(--line)"><strong>${t}</strong><span>${d}</span></div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap faq-wrap">
    <div class="stack" data-reveal>
      <span class="eyebrow">Domande frequenti</span>
      <h2 class="h2">Le domande che ci fanno più spesso</h2>
      <p class="text">Non trovi la tua? Chiedila alla segreteria al telefono o su WhatsApp.</p>
    </div>
    <div class="faq" data-reveal="120">
${FAQ.map(([id, q, a]) => `      <details id="${id}"><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap split" style="align-items:stretch">
    <div class="stack-lg" style="gap:28px" data-reveal>
      <div class="stack">
        <span class="eyebrow">Dove siamo</span>
        <h2 class="h2">Via delle Calendule 12, Milano</h2>
        <p class="text">Piano terra, accessibile senza gradini. A 4 minuti a piedi dalla fermata M1 Wagner; tram 16 fermata Via Ravizza. Parcheggio a pagamento in Piazza Wagner.</p>
      </div>
      <div class="box">
        <span class="box__title">Orari</span>
        ${HOURS}
        <p class="box__note">La segreteria risponde al telefono dalle 9:00 alle 19:00. Per i pazienti dello studio, in caso di dolore improvviso cerchiamo un posto in giornata.</p>
      </div>
      <div class="actions">
        <a class="btn btn--primary btn--sm" href="contatti.html#prenota">Prenota una visita</a>
        <a class="btn btn--ghost btn--sm" href="${MAP_LINK}" target="_blank" rel="noopener">Apri nelle mappe</a>
      </div>
    </div>
    <div class="map" data-reveal="120">
      <iframe title="Mappa dello studio" src="https://www.openstreetmap.org/export/embed.html?bbox=9.1480%2C45.4640%2C9.1640%2C45.4718&amp;layer=mapnik&amp;marker=45.4679%2C9.1560" loading="lazy"></iframe>
    </div>
  </div>
</section>
`});

// ---------- TRATTAMENTI ----------
const TR = [
  { id: 'igiene', title: 'Igiene e prevenzione', img: 'tr-igiene.webp', alt: 'L\'igienista mostra a una paziente come usare lo spazzolino',
    cos: 'La seduta di igiene professionale rimuove placca e tartaro dove lo spazzolino non arriva. Include il controllo delle gengive e indicazioni sugli strumenti da usare a casa.',
    chi: 'Per tutti, adulti e bambini. È particolarmente indicata a chi ha gengive che sanguinano, porta apparecchi o impianti, è in gravidanza o fuma.',
    come: 'L\'igienista usa ultrasuoni e strumenti manuali, poi lucida le superfici dei denti. Se c\'è sensibilità, si può applicare un anestetico locale in gel o si procede per zone.',
    dura: 'Circa 45–60 minuti. Di solito si ripete ogni 6 mesi; l\'intervallo può essere diverso in base alla situazione delle gengive.' },
  { id: 'conservativa', title: 'Conservativa', img: 'tr-conservativa.webp', alt: 'Il dentista parla con una paziente seduta, entrambi sorridenti',
    cos: 'È la cura dei denti colpiti da carie o scheggiati. Si rimuove la parte danneggiata e si ricostruisce il dente con materiali compositi del colore del dente.',
    chi: 'Per chi ha una carie individuata durante un controllo, un\'otturazione vecchia da sostituire, sensibilità al freddo o un dente rotto.',
    come: 'Dopo l\'anestesia locale si isola il dente, si pulisce la cavità e si applica il materiale a strati. Alla fine si controlla che il morso sia corretto.',
    dura: 'Da 30 a 60 minuti per dente, in una sola seduta. Nelle ricostruzioni più ampie può servire un secondo appuntamento.' },
  { id: 'ortodonzia', title: 'Ortodonzia, anche invisibile', img: 'tr-ortodonzia.webp', alt: 'Una ragazza e sua madre sorridono in sala d\'attesa',
    cos: 'Corregge la posizione dei denti e il rapporto tra le arcate. Si usano apparecchi fissi, mobili oppure allineatori trasparenti rimovibili, a seconda del caso.',
    chi: 'Per bambini dai 6–7 anni, per una prima valutazione della crescita, e per ragazzi e adulti con denti affollati, distanziati o un morso non corretto.',
    come: 'Si parte da visita, radiografie e scansione digitale delle arcate. L\'ortodontista propone il tipo di apparecchio e segue il trattamento con controlli periodici.',
    dura: 'In genere da 12 a 24 mesi, con controlli ogni 6–8 settimane. Segue una fase di mantenimento con un contenitore.' },
  { id: 'implantologia', title: 'Implantologia', img: 'tr-implantologia.webp', alt: 'Il dentista spiega una radiografia sullo schermo a una paziente',
    cos: 'Un impianto è una piccola vite in titanio inserita nell\'osso al posto della radice di un dente mancante. Sopra si fissa una corona, un ponte o una protesi.',
    chi: 'Per adulti che hanno perso uno o più denti. L\'indicazione dipende dalla quantità di osso e dallo stato di salute generale, valutati in visita.',
    come: 'Dopo gli esami radiografici, l\'impianto si inserisce in anestesia locale. Si attende l\'integrazione con l\'osso, poi si realizza e si fissa la corona definitiva.',
    dura: 'L\'intervento richiede circa un\'ora per impianto. L\'integrazione con l\'osso richiede di norma da 3 a 6 mesi; il percorso si allunga se prima serve rigenerare l\'osso.' },
  { id: 'pedodonzia', title: 'Pedodonzia', img: 'tr-pedodonzia.webp', alt: 'Un bambino gioca con le costruzioni nell\'angolo bambini della sala d\'attesa',
    cos: 'È l\'odontoiatria dedicata ai bambini: controlli, prevenzione della carie, sigillature dei solchi e cura dei denti da latte e dei primi permanenti.',
    chi: 'Per bambini a partire dai 2 anni circa, come consigliano le raccomandazioni del Ministero della Salute. La prima visita è utile anche senza problemi evidenti, per abituare il bambino all\'ambiente.',
    come: 'Il genitore resta nella stanza. Mostriamo al bambino gli strumenti prima di usarli e procediamo con i suoi tempi; se serve, si divide il lavoro in più appuntamenti brevi.',
    dura: 'Un controllo richiede circa 30 minuti. Consigliamo una visita ogni 6 mesi.' },
  { id: 'estetica', title: 'Estetica dentale', img: 'tr-estetica.webp', alt: 'Una ragazza sorride guardandosi allo specchio',
    cos: 'Comprende lo sbiancamento professionale e le faccette, sottili lamine in ceramica o composito applicate sulla superficie visibile dei denti.',
    chi: 'Per adulti con denti e gengive in salute che desiderano modificare colore o forma dei denti. Non è indicata in presenza di carie o infiammazioni non curate.',
    come: 'Dopo una seduta di igiene, lo sbiancamento si esegue in studio o a domicilio con mascherine personalizzate. Le faccette richiedono una scansione e un periodo di prova.',
    dura: 'Lo sbiancamento in studio richiede una seduta di circa 60–90 minuti; a domicilio 2–3 settimane. Per le faccette servono in genere 3 appuntamenti in un mese.' },
];

page({
  file: 'trattamenti.html', active: 'trattamenti',
  title: 'Trattamenti · Studio Odontoiatrico Lumea',
  description: 'Igiene, conservativa, ortodonzia, implantologia, pedodonzia ed estetica dentale: a cosa servono, per chi sono, come si svolgono e quanto durano.',
  body: `
<section class="page-head">
  <div class="wrap">
    <div class="page-head__text" data-reveal>
      <span class="eyebrow">Trattamenti</span>
      <h1 class="h1">Cosa facciamo, spiegato in modo semplice.</h1>
      <p class="lead">Per ogni trattamento trovi a cosa serve, a chi è indicato, come si svolge e quanto dura. Sono informazioni generali: il percorso adatto a te viene definito solo dopo la visita.</p>
    </div>
    <nav class="chips" aria-label="Indice dei trattamenti" data-reveal="100">
${TR.map(t => `      <a class="chip" href="#${t.id}">${t.title.replace(', anche invisibile', '')}</a>`).join('\n')}
    </nav>
  </div>
</section>

<div class="wrap treatments">
${TR.map((t, i) => `  <article class="treatment" id="${t.id}">
    <div class="treatment__side" data-reveal>
      <span class="card__num">0${i + 1}</span>
      <h2 class="treatment__title">${t.title}</h2>
      <div class="photo">${img(t.img, t.alt)}</div>
    </div>
    <div class="facts-grid" data-reveal="120">
      <div><h3 class="label">Cos'è</h3><p>${t.cos}</p></div>
      <div><h3 class="label">Per chi è</h3><p>${t.chi}</p></div>
      <div><h3 class="label">Come si svolge</h3><p>${t.come}</p></div>
      <div><h3 class="label">Quanto dura</h3><p>${t.dura}</p></div>
    </div>
  </article>`).join('\n')}

  <div class="cta-panel" data-reveal>
    <div class="stack" style="gap:14px">
      <h2 class="h2">Non sai quale trattamento ti serve?</h2>
      <p class="text" style="color:var(--ink-2)">È normale. Si parte sempre da una visita: ti diciamo cosa abbiamo visto e quali sono le possibilità, senza impegno a proseguire.</p>
    </div>
    <div class="actions">
      <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
      <a class="btn btn--ghost" href="${TEL_HREF}">${TEL}</a>
    </div>
  </div>
</div>
`});

// ---------- STUDIO E TEAM ----------
const PEOPLE = [
  { img: 'team-valdieri.webp', role: 'Direttore sanitario', name: 'Dott. Lorenzo Valdieri', area: 'Odontoiatra · Conservativa, protesi e implantologia',
    bio: 'Esercita la professione dal 2001 e nel 2006 ha aperto lo studio in Via delle Calendule. Segue i pazienti adulti nei percorsi di cura più lunghi e coordina il lavoro del team. Ai pazienti ansiosi propone appuntamenti più brevi e ripetuti.',
    edu: ['Laurea in Odontoiatria e Protesi Dentaria, Università degli Studi di Milano, 2001', 'Master di II livello in Implantologia, Università di Pavia, 2005', 'Corso di perfezionamento in Protesi fissa, 2009'],
    albo: 'Albo degli Odontoiatri, OMCeO di Milano, n. 4127' },
  { img: 'team-ardenghi.webp', role: 'Ortodontista', name: 'Dott.ssa Camilla Ardenghi', area: 'Odontoiatra · Ortodonzia e pedodonzia',
    bio: 'In studio dal 2015, si occupa di ortodonzia per bambini, ragazzi e adulti, con apparecchi fissi e allineatori trasparenti. Segue anche le prime visite dei più piccoli, insieme ai genitori.',
    edu: ['Laurea in Odontoiatria e Protesi Dentaria, Università di Pavia, 2010', 'Specializzazione in Ortognatodonzia, Università degli Studi di Milano, 2014'],
    albo: 'Albo degli Odontoiatri, OMCeO di Milano, n. 5893' },
  { img: 'team-sorelli.webp', role: 'Igienista dentale', name: 'Dott.ssa Giulia Sorelli', area: 'Igiene professionale e prevenzione',
    bio: 'È la persona che la maggior parte dei pazienti incontra più spesso. Si occupa delle sedute di igiene, del mantenimento di impianti e apparecchi e mostra, con calma, come prendersi cura di denti e gengive a casa.',
    edu: ['Laurea in Igiene Dentale, Università degli Studi di Milano, 2015', 'Corso di aggiornamento in parodontologia non chirurgica, 2019'],
    albo: 'Albo degli Igienisti Dentali, Ordine TSRM e PSTRP di Milano, n. 1182' },
];

page({
  file: 'studio.html', active: 'studio',
  title: 'Lo studio e il team · Studio Odontoiatrico Lumea',
  description: 'I professionisti dello studio, la loro formazione, le tecnologie che usiamo e gli ambienti in cui ti accogliamo.',
  body: `
<section class="page-head" style="padding-bottom:clamp(56px,7vw,96px)">
  <div class="wrap">
    <div class="head-row" style="margin-bottom:0" data-reveal>
      <div class="stack-lg">
        <span class="eyebrow">Lo studio e il team</span>
        <h1 class="h1">Le persone che incontrerai in studio.</h1>
      </div>
      <p class="lead" style="max-width:560px">Siamo in tre, più Laura e Sofia in segreteria. Lavorare in un gruppo piccolo significa che a ogni appuntamento trovi le stesse persone, che conoscono la tua storia.</p>
    </div>
    <div class="photo banner" data-reveal="120">
      ${img('sala-attesa.webp', 'La sala d\'attesa dello studio, con poltroncine, piante e grandi finestre', { sizes: '100vw' })}
    </div>
  </div>
</section>

<section style="padding-bottom:clamp(72px,9vw,120px)">
  <div class="wrap">
${PEOPLE.map(p => `    <article class="profile">
      <div class="photo" data-reveal>${img(p.img, 'Ritratto: ' + p.name, { sizes: TEAM_SIZES })}</div>
      <div class="profile__body" data-reveal="120">
        <div class="stack" style="gap:8px">
          <span class="profile__role">${p.role}</span>
          <h2 class="profile__name">${p.name}</h2>
          <span class="profile__area">${p.area}</span>
        </div>
        <p class="profile__bio">${p.bio}</p>
        <div class="profile__meta">
          <div class="stack" style="gap:10px"><h3 class="label">Formazione</h3><ul>${p.edu.map(e => `<li>${e}</li>`).join('')}</ul></div>
          <div class="stack" style="gap:10px"><h3 class="label">Iscrizione all'albo</h3><p>${p.albo}</p></div>
        </div>
      </div>
    </article>`).join('\n')}
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="head-row" data-reveal>
      <div class="stack">
        <span class="eyebrow">Tecnologie</span>
        <h2 class="h2">Gli strumenti che usiamo, e perché</h2>
      </div>
      <p class="text" style="max-width:520px;color:var(--ink-2)">Scegliamo le attrezzature pensando a due cose: vedere meglio e rendere le sedute più semplici per chi le affronta.</p>
    </div>
    <div class="tech">
      <div data-reveal><strong>Radiologia digitale</strong><span>Sensori intraorali e ortopantomografo digitale: immagini visibili subito sullo schermo, con esposizioni brevi.</span></div>
      <div data-reveal="80"><strong>Scanner intraorale</strong><span>Rileva l'impronta delle arcate con una piccola telecamera, al posto delle paste da impronta tradizionali.</span></div>
      <div data-reveal="160"><strong>Telecamera intraorale</strong><span>Ti permette di vedere sul monitor quello che vede il dentista, così la spiegazione è più chiara.</span></div>
      <div data-reveal="240"><strong>Sterilizzazione tracciata</strong><span>Autoclave di classe B e buste sigillate con data e ciclo registrati per ogni set di strumenti.</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="stack" style="max-width:680px;margin-bottom:clamp(36px,4vw,56px)" data-reveal>
      <span class="eyebrow">Gli ambienti</span>
      <h2 class="h2">Luce naturale e spazi tranquilli</h2>
      <p class="text">Lo studio è al piano terra di una palazzina degli anni Trenta, con affaccio su un cortile interno. Ci sono una sala d'attesa con angolo bambini, due sale operative e una sala dedicata ai colloqui.</p>
    </div>
    <div class="gallery">
      <figure data-reveal><div class="photo">${img('reception.webp', 'La reception in legno chiaro', { sizes: TEAM_SIZES })}</div><figcaption>La reception</figcaption></figure>
      <figure data-reveal="80"><div class="photo">${img('lettura.webp', 'Una paziente legge una rivista in sala d\'attesa', { sizes: TEAM_SIZES })}</div><figcaption>La sala d'attesa</figcaption></figure>
      <figure data-reveal="160"><div class="photo">${img('tr-pedodonzia.webp', 'L\'angolo bambini con giochi in legno', { sizes: TEAM_SIZES })}</div><figcaption>L'angolo bambini</figcaption></figure>
      <figure data-reveal="240"><div class="photo">${img('kit-igiene.webp', 'Un cassetto con spazzolini, fili interdentali e kit per la cura dei denti a casa', { sizes: TEAM_SIZES })}</div><figcaption>I kit per la cura a casa</figcaption></figure>
    </div>
    <div class="closing" data-reveal>
      <p>Vuoi conoscerci prima di iniziare? Prenota una prima visita.</p>
      <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
    </div>
  </div>
</section>
`});

// ---------- CONTATTI ----------
page({
  file: 'contatti.html', active: 'contatti',
  title: 'Contatti e prenotazione · Studio Odontoiatrico Lumea',
  description: 'Richiedi un appuntamento: la segreteria ti richiama entro un giorno lavorativo. Telefono, WhatsApp, email, orari e mappa.',
  body: `
<section class="page-head">
  <div class="wrap">
    <div class="page-head__text" data-reveal>
      <span class="eyebrow">Contatti e prenotazione</span>
      <h1 class="h1">Scrivici o chiamaci: troviamo insieme l'orario giusto.</h1>
      <p class="lead">Compila il modulo e la segreteria ti richiama entro un giorno lavorativo per fissare l'appuntamento. Se preferisci parlare subito con qualcuno, il telefono è la strada più rapida.</p>
    </div>
  </div>
</section>

<section style="padding-bottom:clamp(72px,9vw,120px)">
  <div class="wrap contact-grid">
    <div class="form-card" id="prenota" data-reveal>
      <form class="form" id="booking-form" novalidate>
        <div class="stack" style="gap:6px">
          <h2 class="h2" style="font-size:clamp(30px,3vw,40px)">Richiedi un appuntamento</h2>
          <p style="font-size:16px;color:#5E5B54">Scegli giorno e orario tra quelli liberi: la segreteria ti richiama per confermare. I campi con * sono obbligatori.</p>
        </div>

        <div class="step"><span class="step__n">1</span><span class="step__t">Di cosa hai bisogno</span></div>
        <label class="field">
          <span>Motivo della visita</span>
          <select name="motivo">
            <option>Prima visita</option>
            <option>Controllo e igiene</option>
            <option>Dolore o fastidio</option>
            <option>Ortodonzia (anche per bambini)</option>
            <option>Visita per un bambino</option>
            <option>Implantologia</option>
            <option>Altro</option>
          </select>
        </label>

        <div class="step"><span class="step__n">2</span><span class="step__t">Quando preferisci venire</span></div>
        <fieldset class="field slot-field">
          <legend class="sr-only">Giorno e orario</legend>
          <div class="cal" id="cal">
            <div class="cal__head">
              <button type="button" class="cal__nav" data-cal-prev aria-label="Mese precedente">‹</button>
              <span class="cal__month" data-cal-month aria-live="polite"></span>
              <button type="button" class="cal__nav" data-cal-next aria-label="Mese successivo">›</button>
            </div>
            <div class="cal__dow" aria-hidden="true"><span>Lu</span><span>Ma</span><span>Me</span><span>Gi</span><span>Ve</span><span>Sa</span><span>Do</span></div>
            <div class="cal__grid" data-cal-grid role="grid"></div>
          </div>
          <div class="slots" id="slots" hidden>
            <p class="slots__day" data-slots-day></p>
            <div class="slots__group" data-slots-am><span class="slots__label">Mattina</span><div class="slots__list"></div></div>
            <div class="slots__group" data-slots-pm><span class="slots__label">Pomeriggio</span><div class="slots__list"></div></div>
          </div>
          <p class="slot-hint" data-slot-hint>Tocca un giorno per vedere gli orari liberi. Se preferisci, puoi anche non sceglierlo: ti proporremo noi un orario.</p>
          <span class="err">Scegli anche l'orario, oppure tocca di nuovo il giorno per annullare la scelta.</span>
          <input type="hidden" name="data">
          <input type="hidden" name="ora">
        </fieldset>

        <div class="step"><span class="step__n">3</span><span class="step__t">I tuoi dati</span></div>
        <label class="field">
          <span>Nome e cognome *</span>
          <input type="text" name="nome" autocomplete="name">
          <span class="err">Inserisci il tuo nome.</span>
        </label>
        <div class="two-col">
          <label class="field">
            <span>Telefono *</span>
            <input type="tel" name="telefono" autocomplete="tel" inputmode="tel">
            <span class="err">Inserisci un numero valido.</span>
          </label>
          <label class="field">
            <span>Email</span>
            <input type="email" name="email" autocomplete="email">
            <span class="err">Controlla l'indirizzo email.</span>
          </label>
        </div>
        <label class="field">
          <span>Note (facoltativo)</span>
          <textarea name="note" rows="3" placeholder="Ad esempio: ho un po' di timore, preferisco un appuntamento lungo"></textarea>
        </label>
        <div class="check-wrap">
          <label class="check">
            <input type="checkbox" name="privacy">
            <span>Ho letto l'<a href="privacy.html">informativa privacy</a> e acconsento al trattamento dei miei dati per essere ricontattato. *</span>
          </label>
          <span class="err" style="margin-top:8px">Per inviare la richiesta serve il consenso.</span>
        </div>
        <div class="summary" data-summary hidden></div>
        <button class="btn btn--primary" type="submit">Invia la richiesta</button>
        <p class="form__note">La richiesta non è ancora una conferma: l'appuntamento è fissato dopo la telefonata della segreteria, di solito entro un giorno lavorativo. Gli orari liberi mostrati sono simulati (sito dimostrativo).</p>
      </form>
      <div class="sent" id="booking-sent" role="status" tabindex="-1" hidden>
        <span class="sent__icon" aria-hidden="true">✓</span>
        <h2 class="h2" style="font-size:clamp(30px,3vw,40px)">Grazie, <span data-first></span>.</h2>
        <p class="text" style="color:var(--ink-2)">Abbiamo ricevuto la tua richiesta per «<span data-motivo></span>»<span data-when></span>. La segreteria ti chiamerà al numero <span data-tel></span> entro un giorno lavorativo per confermare.</p>
        <p class="form__note">Questo è un sito dimostrativo: la richiesta non è stata inviata a nessuno.</p>
        <button class="btn btn--ghost btn--sm" type="button" id="booking-again">Invia un'altra richiesta</button>
      </div>
    </div>

    <div class="contact-side">
      <aside class="urgent urgent--compact" data-reveal="60" aria-label="Urgenze"><span class="urgent__icon" aria-hidden="true">!</span><div class="urgent__text"><strong>Dolore o urgenza?</strong><span>Non usare il modulo: chiama la segreteria, per i pazienti dello studio cerchiamo un posto in giornata. <a href="index.html#faq-urgenze">Fuori orario →</a></span></div></aside>
      <div class="contact-cards" data-reveal="100">
        <a class="ccard ccard--soft" href="${TEL_HREF}"><small>Telefono</small><span class="ccard__big">${TEL}</span><small>Segreteria 9:00–19:00</small></a>
        <a class="ccard ccard--alt" href="${WA_HREF}" target="_blank" rel="noopener"><small>WhatsApp</small><span class="ccard__big">${WA}</span><small>Solo messaggi, rispondiamo in giornata</small></a>
      </div>
      <div class="ccard ccard--line" data-reveal="160"><small>Email</small><a href="mailto:${EMAIL}">${EMAIL}</a></div>
      <div class="box" data-reveal="220"><span class="box__title">Orari dello studio</span>
        ${HOURS}
      </div>
      <div class="box stack" style="gap:10px" data-reveal="280"><span class="box__title">Indirizzo</span>
        <p style="font-size:17px;line-height:1.6">${ADDR}<br><span style="color:var(--ink-3)">Piano terra, accessibile senza gradini. M1 Wagner a 4 minuti a piedi, tram 16 fermata Via Ravizza.</span></p>
      </div>
    </div>
  </div>
</section>

<section style="padding-bottom:clamp(72px,9vw,120px)">
  <div class="wrap">
    <div class="map map--wide" data-reveal>
      <iframe title="Mappa: ${ADDR}" src="https://www.openstreetmap.org/export/embed.html?bbox=9.1440%2C45.4630%2C9.1680%2C45.4728&amp;layer=mapnik&amp;marker=45.4679%2C9.1560" loading="lazy"></iframe>
    </div>
    <div class="map-foot">
      <span>Mappa © contributori OpenStreetMap</span>
      <a href="${MAP_LINK}" target="_blank" rel="noopener">Apri nelle mappe →</a>
    </div>
  </div>
</section>
`});

// ---------- PRIVACY (demo) ----------
page({
  file: 'privacy.html', active: '',
  title: 'Privacy e cookie · Studio Odontoiatrico Lumea',
  description: 'Informativa privacy e cookie di esempio del sito dimostrativo Studio Lumea.',
  body: `
<section class="page-head">
  <div class="wrap">
    <div class="page-head__text">
      <span class="eyebrow">Privacy e cookie</span>
      <h1 class="h1">Informativa privacy</h1>
      <p class="lead">Questo è un sito dimostrativo: lo studio non esiste e il modulo di contatto non invia dati a nessuno. Il testo qui sotto mostra la struttura che avrebbe l'informativa di uno studio reale.</p>
    </div>
  </div>
</section>
<div class="wrap">
  <div class="legal">
    <h2>Titolare del trattamento</h2>
    <p>In un sito reale: la ragione sociale dello studio, l'indirizzo della sede e un contatto email dedicato alla privacy.</p>
    <h2>Quali dati raccogliamo e perché</h2>
    <ul>
      <li>Dati inseriti nel modulo di richiesta (nome, telefono, email, motivo della visita, note): usati solo per ricontattarti e fissare l'appuntamento.</li>
      <li>Le note possono contenere informazioni sulla salute: in un sito reale andrebbero trattate come dati particolari (art. 9 GDPR), con il tuo consenso esplicito.</li>
    </ul>
    <h2>Per quanto tempo</h2>
    <p>Il tempo necessario a gestire la richiesta; se diventi paziente, i dati confluiscono nella cartella clinica secondo gli obblighi di legge.</p>
    <h2>I tuoi diritti</h2>
    <p>Accesso, rettifica, cancellazione, limitazione, opposizione, portabilità e revoca del consenso in qualsiasi momento, oltre al reclamo al Garante per la protezione dei dati personali.</p>
    <h2 id="cookie">Cookie</h2>
    <p>Questo sito non usa cookie propri né strumenti di statistica o pubblicità. La mappa è fornita da OpenStreetMap e i caratteri tipografici da Google Fonts: caricandoli, il browser comunica a questi servizi il tuo indirizzo IP.</p>
  </div>
</div>
`});
