// Pagina "Guide": articoli brevi di educazione alla salute orale.
// Fonti (verificate il 2026-10-02): linee guida IADT 2020 e indicazioni del Ministero della Salute sui traumi
// dentali (dente avulso: tenerlo per la corona, sciacquo breve in acqua fredda, reimpianto o latte/fisiologica,
// entro 15–60 minuti; i denti da latte non si reimpiantano); gengive (controllo se il sanguinamento non migliora
// in 10–14 giorni; segnali di parodontite); allineatori (circa 22 ore al giorno, contenzione finale).
module.exports = function ({ page, icon, TEL, TEL_HREF }) {
  const GUIDES = [
    { id: 'dente-rotto', icon: 'tooth', title: 'Si è rotto o è caduto un dente: cosa fare subito', min: 3,
      intro: 'Una caduta, una pallonata, un boccone duro: un dente scheggiato o caduto spaventa, ma nei primi minuti si può fare molto. Ecco cosa fare, in ordine.',
      body: `
        <h3>Se il dente si è scheggiato o rotto</h3>
        <ul>
          <li>Sciacqua la bocca con acqua tiepida.</li>
          <li>Se trovi il frammento, conservalo in un bicchiere con un po' di latte o d'acqua e portalo con te: a volte si può riattaccare.</li>
          <li>Se la guancia si gonfia, appoggia un impacco freddo dall'esterno.</li>
          <li>Chiama lo studio: anche se non fa male, un dente rotto va controllato presto.</li>
        </ul>
        <h3>Se è caduto un dente definitivo: ogni minuto conta</h3>
        <ol>
          <li><strong>Raccoglilo tenendolo per la corona</strong>, la parte bianca che si vede quando sorridi. Non toccare la radice.</li>
          <li><strong>Se è sporco, sciacqualo pochi secondi</strong> sotto acqua fredda corrente, senza strofinarlo e senza disinfettarlo.</li>
          <li><strong>Se ci riesci, rimettilo subito al suo posto</strong> e mordi delicatamente un fazzoletto pulito per tenerlo fermo.</li>
          <li><strong>Se non è possibile, mettilo in un bicchiere di latte</strong> o di soluzione fisiologica. Non lasciarlo asciugare e non conservarlo in acqua.</li>
          <li><strong>Vieni subito in studio o al Pronto Soccorso.</strong> Un dente rimesso in sede entro 15–60 minuti ha le maggiori possibilità di salvarsi.</li>
        </ol>
        <h3>Se è caduto un dente da latte</h3>
        <p>Non va rimesso al suo posto: si rischia di danneggiare il dente definitivo che sta crescendo sotto. Porta comunque il bambino a un controllo nei giorni successivi.</p>
        <p class="guide__alert">Se dopo la caduta ci sono stati perdita di coscienza, vomito, forte mal di testa o ferite che sanguinano molto, rivolgiti subito al Pronto Soccorso o chiama il 112.</p>` },
    { id: 'gengive', icon: 'goccia', title: 'Gengive che sanguinano: quando preoccuparsi', min: 2,
      intro: 'Vedere un po\' di sangue sullo spazzolino capita a molti, ed è facile pensare che sia normale. Non lo è: le gengive sane non sanguinano. La buona notizia è che, preso in tempo, il problema è quasi sempre reversibile.',
      body: `
        <h3>Da cosa dipende</h3>
        <p>Nella maggior parte dei casi è una gengivite: un'infiammazione causata dalla placca che resta lungo il bordo delle gengive. Si risolve con una pulizia professionale e una buona igiene a casa.</p>
        <h3>Cosa fare a casa</h3>
        <ul>
          <li>Non smettere di lavare i denti dove sanguina: è un errore comune. Spazzola con delicatezza, con setole morbide.</li>
          <li>Usa ogni giorno filo interdentale o scovolini: la placca tra i denti è la causa più frequente.</li>
          <li>Con un'igiene accurata, il sanguinamento di solito si riduce nel giro di qualche giorno.</li>
        </ul>
        <h3>Quando prenotare una visita</h3>
        <ul>
          <li>Se dopo 10–14 giorni di igiene accurata il sanguinamento non migliora.</li>
          <li>Subito, se noti gengive che si ritirano, alito cattivo che non passa, denti che si muovono o cambiano posizione: possono essere segnali di parodontite, un'infiammazione dei tessuti che sostengono il dente.</li>
        </ul>
        <h3>Due casi particolari</h3>
        <p>Il fumo può ridurre il sanguinamento e nascondere un'infiammazione: chi fuma dovrebbe fare controlli regolari anche se le gengive non sanguinano. In gravidanza le gengive sanguinano più facilmente per i cambiamenti ormonali: una seduta di igiene è utile e si può fare tranquillamente.</p>` },
    { id: 'allineatori', icon: 'ortodonzia', title: 'Allineatori trasparenti: cosa sapere prima di iniziare', min: 3,
      intro: 'Gli allineatori sono mascherine trasparenti che spostano i denti un poco alla volta. Sono comodi e quasi invisibili, ma funzionano solo con alcune regole precise.',
      body: `
        <h3>Funzionano se li porti</h3>
        <p>Vanno indossati circa 22 ore al giorno. Si tolgono solo per mangiare e per lavare i denti: lasciarli fuori più a lungo rallenta il trattamento.</p>
        <h3>Nella vita di tutti i giorni</h3>
        <ul>
          <li>Con le mascherine in bocca si beve solo acqua. Per caffè, tè o bibite è meglio toglierle: trattengono zuccheri e possono macchiarsi.</li>
          <li>Prima di rimetterle, lava i denti: altrimenti il cibo resta chiuso a contatto con lo smalto.</li>
          <li>Si cambiano ogni 1–2 settimane, seguendo il piano dell'ortodontista, con controlli periodici in studio.</li>
          <li>Spesso si incollano su alcuni denti piccoli rilievi del colore del dente (attachment), che aiutano le mascherine a guidarli. Alla fine si tolgono.</li>
        </ul>
        <h3>Prima: visita e radiografie</h3>
        <p>Carie o gengive infiammate vanno curate prima di spostare i denti. Per questo sconsigliamo gli allineatori acquistati online senza una visita: senza esami nessuno può escludere problemi che il trattamento potrebbe peggiorare.</p>
        <h3>Dopo: la contenzione</h3>
        <p>Finito il trattamento i denti tendono a tornare indietro. Una contenzione, un filo sottile incollato dietro i denti o una mascherina da portare di notte, mantiene il risultato nel tempo.</p>` },
  ];

  page({
    file: 'guide.html', active: 'guide',
    title: 'Guide per la salute dei denti · Studio Odontoiatrico Lumea',
    description: 'Dente rotto o caduto, gengive che sanguinano, allineatori trasparenti: guide brevi e pratiche dello Studio Lumea. Informazioni generali che non sostituiscono la visita.',
    body: `
<section class="page-head">
  <div class="wrap">
    <div class="page-head__text" data-reveal>
      <span class="eyebrow">Guide</span>
      <h1 class="h1">Piccole guide per la salute dei tuoi denti.</h1>
      <p class="lead">Le risposte pratiche alle situazioni che ci raccontano più spesso al telefono. Sono informazioni generali: se hai un dubbio sul tuo caso, chiamaci.</p>
    </div>
    <nav class="chips" aria-label="Indice delle guide" data-reveal="100">
${GUIDES.map(g => `      <a class="chip chip--ico" href="#${g.id}">${icon(g.icon)}${g.title.split(':')[0]}</a>`).join('\n')}
    </nav>
  </div>
</section>

<div class="wrap guides">
${GUIDES.map(g => `  <article class="guide" id="${g.id}">
    <header class="guide__head" data-reveal>
      <span class="guide__ico">${icon(g.icon)}</span>
      <span class="guide__meta">Lettura: ${g.min} minuti · Rivista dallo staff medico dello studio</span>
      <h2 class="guide__title">${g.title}</h2>
      <p class="lead">${g.intro}</p>
    </header>
    <div class="guide__body" data-reveal="100">${g.body}
    </div>
  </article>`).join('\n')}

  <div class="cta-panel" data-reveal>
    <div class="stack" style="gap:14px">
      <h2 class="h2">Hai un dubbio sul tuo caso?</h2>
      <p class="text" style="color:var(--ink-2)">Queste guide non sostituiscono la visita. Chiamaci o mandaci una foto su WhatsApp: ti diciamo se è il caso di venire subito.</p>
    </div>
    <div class="actions">
      <a class="btn btn--primary" href="${TEL_HREF}">Chiama ${TEL}</a>
      <a class="btn btn--ghost" href="contatti.html#prenota">Prenota una visita</a>
    </div>
  </div>
</div>
`});
};
