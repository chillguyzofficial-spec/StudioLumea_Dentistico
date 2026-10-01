// Pagina indice dei trattamenti + una pagina per ciascun trattamento (slug.html).
// Chiamato da build.js, che passa page(), img(), icon() e i dati.
module.exports = function ({ page, img, icon, TR, TEL, TEL_HREF, SITE }) {
  const CTA = (title, text) => `<div class="cta-panel" data-reveal>
    <div class="stack" style="gap:14px">
      <h2 class="h2">${title}</h2>
      <p class="text" style="color:var(--ink-2)">${text}</p>
    </div>
    <div class="actions">
      <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
      <a class="btn btn--ghost" href="${TEL_HREF}">${TEL}</a>
    </div>
  </div>`;

  // ---------- INDICE TRATTAMENTI ----------
  page({
    file: 'trattamenti.html', active: 'trattamenti',
    title: 'Trattamenti · Studio Odontoiatrico Lumea',
    description: 'Igiene, conservativa, ortodonzia, implantologia, dentista per bambini ed estetica dentale: a cosa servono, per chi sono, come si svolgono e quanto durano.',
    body: `
<section class="page-head">
  <div class="wrap">
    <div class="page-head__text" data-reveal>
      <span class="eyebrow">Trattamenti</span>
      <h1 class="h1">Cosa facciamo, spiegato in modo semplice.</h1>
      <p class="lead">Per ogni trattamento trovi una pagina con a cosa serve, a chi è indicato, come si svolge, quanto dura e le domande che ci fanno più spesso. Sono informazioni generali: il percorso adatto a te viene definito solo dopo la visita.</p>
    </div>
  </div>
</section>

<section style="padding-bottom:clamp(72px,9vw,120px)">
  <div class="wrap">
    <div class="tr-index">
${TR.map((t, i) => `      <a class="tr-card" id="${t.id}" href="${t.slug}.html" data-reveal="${(i % 3) * 80}">
        <span class="tr-card__ico">${icon(t.icon)}</span>
        <span class="card__num">0${i + 1}</span>
        <span class="card__title">${t.menu}</span>
        <span class="card__text">${t.short}</span>
        <span class="tr-card__meta"><span>${t.dura.split('.')[0]}.</span></span>
        <span class="card__more">Leggi la scheda completa →</span>
      </a>`).join('\n')}
    </div>
    ${CTA('Non sai quale trattamento ti serve?', 'È normale. Si parte sempre da una visita: ti diciamo cosa abbiamo visto e quali sono le possibilità, senza impegno a proseguire.')}
  </div>
</section>
`});

  // ---------- PAGINA DI OGNI TRATTAMENTO ----------
  TR.forEach((t, i) => {
    const others = TR.filter(o => o !== t);
    const url = SITE ? SITE + t.slug + '.html' : '';
    page({
      file: t.slug + '.html', active: 'trattamenti', activeTr: t.slug,
      title: `${t.seo} · Studio Odontoiatrico Lumea`,
      description: t.desc,
      ld: [
        { '@context': 'https://schema.org', '@type': 'MedicalWebPage', name: t.seo, description: t.desc, ...(url ? { url } : {}),
          about: { '@type': 'MedicalProcedure', name: t.menu, description: t.cos },
          lastReviewed: '2026-10-02', reviewedBy: { '@type': 'Person', name: t.team[0].split(' e ')[0] } },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', ...(SITE ? { item: SITE } : {}) },
          { '@type': 'ListItem', position: 2, name: 'Trattamenti', ...(SITE ? { item: SITE + 'trattamenti.html' } : {}) },
          { '@type': 'ListItem', position: 3, name: t.menu } ] },
      ],
      body: `
<section class="page-head tr-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Sei qui"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="trattamenti.html">Trattamenti</a><span aria-hidden="true">/</span><span aria-current="page">${t.menu}</span></nav>
    <div class="tr-head__grid">
      <div class="page-head__text" data-reveal>
        <span class="eyebrow">${t.seo}</span>
        <h1 class="h1">${t.title}</h1>
        <p class="lead">${t.lead}</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="contatti.html#prenota">Prenota una visita</a>
          <a class="hero__tel" href="${TEL_HREF}">oppure chiama lo ${TEL}</a>
        </div>
      </div>
      <div class="photo tr-head__photo" data-reveal="120">${img(t.img, t.alt, { eager: true })}</div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="stack" style="max-width:680px;margin-bottom:clamp(36px,4vw,56px)" data-reveal>
      <span class="eyebrow">In breve</span>
      <h2 class="h2">Cosa aspettarti</h2>
    </div>
    <div class="facts-grid facts-grid--cards" data-reveal="80">
      <div><h3 class="label">Cos'è</h3><p>${t.cos}</p></div>
      <div><h3 class="label">Per chi è</h3><p>${t.chi}</p></div>
      <div><h3 class="label">Come si svolge</h3><p>${t.come}</p></div>
      <div><h3 class="label">Quanto dura</h3><p>${t.dura}</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap faq-wrap">
    <div class="stack-lg" data-reveal>
      <div class="stack">
        <span class="eyebrow">Da sapere</span>
        <h2 class="h2">Prima di iniziare</h2>
      </div>
      <ul class="know">
${t.sapere.map(x => `        <li>${x}</li>`).join('\n')}
      </ul>
    </div>
    <div class="stack-lg" data-reveal="120">
      <div class="stack">
        <span class="eyebrow">Domande frequenti</span>
        <h2 class="h2">Le domande più comuni</h2>
      </div>
      <div class="faq">
${t.faq.map(([q, a], n) => `        <details id="faq-${t.slug}-${n + 1}"><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
      </div>
    </div>
  </div>
</section>

<section style="padding-bottom:clamp(72px,9vw,120px)">
  <div class="wrap">
    <div class="who" data-reveal>
      <div class="stack" style="gap:4px">
        <span class="label">Chi se ne occupa</span>
        <span class="who__name">${t.team[0]}</span>
        <span class="who__role">${t.team[1]}</span>
      </div>
      <a class="link-u" href="studio.html">Formazione e iscrizione all'albo →</a>
    </div>
    <div class="others" data-reveal>
      <span class="label">Altri trattamenti</span>
      <nav class="chips" aria-label="Altri trattamenti">
${others.map(o => `        <a class="chip chip--ico" href="${o.slug}.html">${icon(o.icon)}${o.menu}</a>`).join('\n')}
      </nav>
    </div>
    ${CTA('Vuoi capire se fa al caso tuo?', 'Si parte da una visita: guardiamo insieme la situazione e ti consegniamo un preventivo scritto, da valutare con calma. Le informazioni di questa pagina sono generali e non sostituiscono la visita.')}
  </div>
</section>
`});
  });
};
