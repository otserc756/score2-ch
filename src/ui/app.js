/*
 * Interfaccia: legge il modulo, chiama il motore di calcolo e mostra il risultato.
 * I dati del paziente esistono solo nel modulo della pagina: non vengono salvati.
 */
(function () {
  'use strict';
  const E = window.ESCScore;
  const $ = (id) => document.getElementById(id);
  const form = $('form');

  let settings = E.settings.load();
  let lang = settings.uiLanguage;
  let lastAssessment = null;

  const t = (key, params) => E.i18n.t(lang, key, params);

  // Unità mostrate nei messaggi (valori interni: lipidi in mmol/L, HbA1c in mmol/mol)
  const FIELD_UNITS = {
    age: 'hints.years', ageAtDiagnosis: 'hints.years', sbp: 'units.mmHg', dbp: 'units.mmHg',
    totalChol: 'units.mmolL', hdl: 'units.mmolL', triglycerides: 'units.mmolL', ldlMeasured: 'units.mmolL',
    hba1c: 'units.mmolMol', egfr: 'units.egfr', creatinine: 'units.umolL'
  };

  // ---------------------------------------------------------------- utilità
  function fmt(x, digits) { return (Math.round(x * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits); }
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach((k) => {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach((c) => { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function field(name) { return form.elements[name]; }
  function val(name) { const f = field(name); return f ? String(f.value || '').trim() : ''; }
  function radio(name, scope) {
    const r = (scope || form).querySelector('input[name="' + name + '"]:checked');
    return r ? r.value : null;
  }
  function setRadio(name, value, scope) {
    (scope || form).querySelectorAll('input[name="' + name + '"]').forEach((r) => { r.checked = r.value === value; });
  }
  function yesNo(name) { const v = radio(name); return v === 'yes' ? true : v === 'no' ? false : undefined; }
  /** null se vuoto, NaN se non è un numero */
  function num(name) { const v = val(name); return v === '' ? null : E.units.parseDecimal(v); }
  function isNum(x) { return typeof x === 'number' && isFinite(x); }
  function fieldLabel(f) { return t('fields.' + f); }
  function plain(f, v) {
    return isNum(v) ? fmt(v, Number.isInteger(v) ? 0 : (FIELD_UNITS[f] === 'units.mmolL' ? 2 : 1)) : String(v);
  }
  function withUnit(f, v) {
    const u = FIELD_UNITS[f];
    return plain(f, v) + (u && isNum(v) ? ' ' + t(u) : '');
  }

  // ---------------------------------------------------------------- traduzioni
  function applyTranslations() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((n) => { n.placeholder = t(n.dataset.i18nPlaceholder); });
    document.title = 'SCORE2 · ' + t('app.title');
    setRadio('uiLanguage', lang, document);
    renderReminders();
  }

  // ---------------------------------------------------------------- lettura del modulo
  function normalizeDateField(name) {
    const f = field(name);
    const digits = f.value.replace(/\s/g, '');
    if (/^\d{8}$/.test(digits)) f.value = digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4);
  }

  function readForm() {
    const uiErrors = [];
    const mg = radio('lipidUnit') === 'mgdl';
    const chol = (x) => (isNum(x) && mg ? E.units.cholMgdlToMmol(x) : x);
    const tg = (x) => (isNum(x) && mg ? E.units.tgMgdlToMmol(x) : x);

    // Date ed età
    let birth = null, visit = null, age = null, ageFromBirth = false;
    if (val('birthDate')) {
      birth = E.age.parseSwissDate(val('birthDate'));
      if (!birth) uiErrors.push({ field: 'birthDate', code: 'invalidDate' });
    }
    if (val('visitDate')) {
      visit = E.age.parseSwissDate(val('visitDate'));
      if (!visit) uiErrors.push({ field: 'visitDate', code: 'invalidDate' });
    } else {
      visit = E.age.today();
    }
    if (birth && visit) {
      age = E.age.ageInYears(birth, visit);
      if (age === null) uiErrors.push({ field: 'visitDate', code: 'visitBeforeBirth' });
      else ageFromBirth = true;
    }
    if (!ageFromBirth && !val('birthDate')) age = num('age');

    const sex = radio('sex');

    // HbA1c
    let hba1c = num('hba1c');
    if (isNum(hba1c) && radio('hba1cUnit') === 'percent') hba1c = E.units.hba1cPercentToMmolMol(hba1c);

    // eGFR (inserito o calcolato dalla creatinina)
    const fromCreat = field('egfrFromCreatinine').checked;
    let egfr = null, egfrComputed = null;
    if (fromCreat) {
      const creat = num('creatinine');
      if (creat !== null && !isNum(creat)) uiErrors.push({ field: 'creatinine', code: 'not_a_number' });
      else if (isNum(creat) && (creat < 10 || creat > 2000)) uiErrors.push({ field: 'creatinine', code: 'implausible', range: [10, 2000] });
      else if (isNum(creat) && isNum(age) && sex) {
        egfr = E.egfr.ckdEpi2021(creat, age, sex);
        egfrComputed = egfr;
      }
    } else {
      egfr = num('egfr');
    }

    const input = {
      age: age,
      sex: sex || undefined,
      smoker: yesNo('smoker'),
      diabetes: yesNo('diabetes'),
      sbp: num('sbp'),
      dbp: num('dbp'),
      totalChol: chol(num('totalChol')),
      hdl: chol(num('hdl')),
      triglycerides: tg(num('triglycerides')),
      ldlMeasured: chol(num('ldlMeasured')),
      ageAtDiagnosis: num('ageAtDiagnosis'),
      hba1c: hba1c,
      egfr: egfr,
      acr: num('acr'),
      acrUnit: radio('acrUnit') || 'mg/mmol',
      region: settings.region
    };

    // Campi facoltativi: il motore li ignora se non validi, quindi li controlla l'interfaccia
    ['dbp', 'triglycerides', 'ldlMeasured', 'acr', 'egfr'].forEach((f) => {
      if (input[f] !== null && !isNum(input[f])) uiErrors.push({ field: f, code: 'not_a_number' });
    });
    if (isNum(input.acr) && input.acr < 0) uiErrors.push({ field: 'acr', code: 'invalid' });

    const checks = {
      ascvd: field('ascvd').checked,
      diabetesSevereTod: field('diabetesSevereTod').checked,
      microvascular3Sites: field('microvascular3Sites').checked,
      ckd: field('ckd').value,
      fh: field('fh').value,
      markedFactor: field('markedFactor').checked
    };

    return {
      input: input, checks: checks, uiErrors: uiErrors,
      ageFromBirth: ageFromBirth, egfrComputed: egfrComputed, fromCreat: fromCreat,
      lipidUnitMg: mg,
      patient: { firstName: val('firstName'), lastName: val('lastName'), birth: birth, visit: visit }
    };
  }

  function hasAnyClinicalInput(r) {
    const i = r.input;
    return [i.age, i.sbp, i.totalChol, i.hdl].some((x) => x !== null && x !== undefined) ||
      i.sex || i.smoker !== undefined || i.diabetes !== undefined ||
      Object.keys(r.checks).some((k) => r.checks[k] === true || (r.checks[k] !== 'none' && typeof r.checks[k] === 'string'));
  }

  // ---------------------------------------------------------------- aggiornamento della pagina
  function updateVisibility(r) {
    const dm = r.input.diabetes === true;
    $('card-diabetes').hidden = !dm;
    form.querySelectorAll('.diabetes-only').forEach((n) => { n.hidden = !dm; });

    $('field-creatinine').hidden = !r.fromCreat;
    const egfrInput = field('egfr');
    egfrInput.readOnly = r.fromCreat;
    if (r.fromCreat) egfrInput.value = isNum(r.egfrComputed) ? fmt(r.egfrComputed, 0) : '';
    $('egfr-hint').textContent = r.fromCreat ? 'CKD-EPI 2021' : (dm ? t('hints.requiredDiabetes') : t('hints.optional'));

    const ageInput = field('age');
    ageInput.readOnly = r.ageFromBirth;
    if (r.ageFromBirth) ageInput.value = String(r.input.age);
    else if (val('birthDate')) ageInput.value = '';
    $('age-hint').textContent = r.ageFromBirth ? t('hints.ageFromBirth') : t('hints.ageManual');

    const h = num('hba1c');
    let hint = '';
    if (isNum(h)) {
      hint = radio('hba1cUnit') === 'percent'
        ? '= ' + fmt(E.units.hba1cPercentToMmolMol(h), 0) + ' mmol/mol'
        : '= ' + fmt(E.units.hba1cMmolMolToPercent(h), 1) + ' %';
    }
    $('hba1c-hint').textContent = hint;

    const unitLabel = r.lipidUnitMg ? 'mg/dL' : 'mmol/L';
    form.querySelectorAll('.lipid-unit').forEach((n) => { n.textContent = unitLabel; });
  }

  function markInvalid(errors) {
    form.querySelectorAll('.invalid').forEach((n) => n.classList.remove('invalid'));
    errors.forEach((e) => {
      if (e.code === 'required') return;
      const name = e.field === 'egfr' && field('egfrFromCreatinine').checked ? 'creatinine' : e.field;
      const f = field(name);
      if (f && f.classList) f.classList.add('invalid');
    });
  }

  function errorMessage(e) {
    const params = { field: fieldLabel(e.field) };
    if (e.range) { params.min = plain(e.field, e.range[0]); params.max = withUnit(e.field, e.range[1]); }
    return t('errors.' + e.code, params);
  }

  function warningMessage(w, input) {
    const params = { field: fieldLabel(w.field) };
    if (w.range) {
      params.value = withUnit(w.field, input[w.field]);
      params.min = plain(w.field, w.range[0]);
      params.max = withUnit(w.field, w.range[1]);
    }
    return t('warnings.' + w.code, params);
  }

  function categoryPill(cat) {
    return el('span', { class: 'cat-pill cat-' + cat }, [
      el('span', { class: 'dot', 'aria-hidden': 'true' }),
      t('categories.label', { category: t('categories.' + cat) })
    ]);
  }

  function ldlTargetText(target) {
    let s = t('result.ldlTargetValue', { value: fmt(target.ldlBelow, 1) });
    if (target.minReductionPct) s += ' ' + t('result.ldlReduction', { pct: target.minReductionPct });
    if (target.alternativeLow) s += ' ' + t('result.ldlAltLow', { value: fmt(target.alternativeLow, 1) });
    return s;
  }

  function renderResult(a, r) {
    const box = $('result');
    box.textContent = '';
    box.appendChild(el('h2', { text: t('sections.result') }));

    const allErrors = r.uiErrors.concat(a.calc.errors);
    markInvalid(allErrors);

    if (!hasAnyClinicalInput(r)) {
      box.appendChild(el('p', { class: 'result-empty', text: t('result.empty') }));
      return;
    }

    if (a.calc.ok) {
      box.appendChild(el('div', { class: 'risk-head' }, [
        el('span', {
          class: 'risk-value' + (a.checklist.scoreApplies ? '' : ' risk-value-indicative'),
          text: fmt(a.score.percent, 1) + '%'
        }),
        categoryPill(a.category)
      ]));
      box.appendChild(el('p', { class: 'risk-sub', text: t('result.tenYear') }));
    } else if (a.category) {
      box.appendChild(el('div', { class: 'risk-head' }, [categoryPill(a.category)]));
      box.appendChild(el('p', { class: 'risk-sub', text: t('result.noScore') }));
    }

    // Dati principali
    const kv = el('dl', { class: 'kv' });
    function row(k, v, small) {
      kv.appendChild(el('dt', { text: k }));
      kv.appendChild(el('dd', null, [v, small ? el('small', { text: ' ' + small }) : null]));
    }
    if (a.calc.ok) row(t('result.model'), a.calc.model, '· ' + t('regions.' + a.calc.region + 'Short'));
    if (isNum(a.lipids.nonHdl)) {
      row(t('result.nonHdl'), fmt(a.lipids.nonHdl, 2) + ' mmol/L',
        r.lipidUnitMg ? '(' + fmt(E.units.cholMmolToMgdl(a.lipids.nonHdl), 0) + ' mg/dL)' : null);
    }
    if (isNum(a.lipids.ldl)) {
      row(t('result.ldl'), fmt(a.lipids.ldl, 2) + ' mmol/L',
        '(' + t(a.lipids.ldlSource === 'measured' ? 'result.ldlMeasured' : 'result.ldlFriedewald') + ')');
    }
    if (a.ldlTarget) row(t('result.ldlTarget'), ldlTargetText(a.ldlTarget));
    if (kv.childNodes.length) box.appendChild(kv);

    // Note: condizioni, avvisi, errori
    const notes = el('ul', { class: 'notes' });
    a.checklist.conditions.forEach((c) => {
      notes.appendChild(el('li', { class: 'note-condition', text: t('conditions.' + c.code) }));
    });
    if (a.calc.ok && !a.checklist.scoreApplies) {
      notes.appendChild(el('li', { class: 'note-condition', text: t('result.scoreIndicative') }));
    }
    if (a.lipids.ldlSource === 'friedewaldNotValid') {
      notes.appendChild(el('li', { class: 'note-warning', text: t('result.ldlNotValid') }));
    }
    a.calc.warnings.forEach((w) => {
      notes.appendChild(el('li', { class: 'note-warning', text: warningMessage(w, r.input) }));
    });

    const missing = allErrors.filter((e) => e.code === 'required').map((e) => fieldLabel(e.field));
    const others = allErrors.filter((e) => e.code !== 'required');
    others.forEach((e) => notes.appendChild(el('li', { class: 'note-error', text: errorMessage(e) })));
    if (missing.length && !others.some((e) => e.code === 'age_below_40' || e.code === 'age_above_89')) {
      notes.appendChild(el('li', { class: 'note-error', text: t('result.missing', { fields: missing.join(', ') }) }));
    }
    if (notes.childNodes.length) box.appendChild(notes);
  }

  function renderWhatIf(a) {
    const box = $('whatif');
    // Se lo score non si applica (ASCVD, IRC, FH…) gli scenari non hanno senso
    const w = a.checklist.scoreApplies ? a.whatIf : null;
    box.hidden = !w;
    if (!w) return;
    box.textContent = '';
    box.appendChild(el('h2', { text: t('sections.whatIf') }));
    if (!w.scenarios.length) {
      box.appendChild(el('p', { class: 'muted', text: t('whatIf.none') }));
      return;
    }
    const tbody = el('tbody');
    tbody.appendChild(el('tr', null, [
      el('td', { text: t('whatIf.now') }),
      el('td', { class: 'num', text: fmt(w.basePercent, 1) + '%' }),
      el('td', { class: 'num', text: '' })
    ]));
    w.scenarios.forEach((s) => {
      tbody.appendChild(el('tr', { class: s.id === 'all' ? 'all' : '' }, [
        el('td', { text: t('whatIf.' + s.id) }),
        el('td', { class: 'num', text: fmt(s.percent, 1) + '%' }),
        el('td', { class: 'num', text: (s.deltaPoints > 0 ? '+' : s.deltaPoints < 0 ? '−' : '±') + fmt(Math.abs(s.deltaPoints), 1) })
      ]));
    });
    box.appendChild(el('table', { class: 'whatif-table' }, [
      el('thead', null, [el('tr', null, [
        el('th', { text: '' }),
        el('th', { class: 'num', text: t('whatIf.risk') }),
        el('th', { class: 'num', text: t('whatIf.change') })
      ])]),
      tbody
    ]));
    box.appendChild(el('p', { class: 'whatif-note', text: t('whatIf.disclaimer') }));
  }

  function renderSuggestions(a, r) {
    const box = $('suggestions');
    box.textContent = '';
    const s = a.suggestions;
    const ckdRank = { none: 0, moderate: 1, severe: 2 };

    function suggestion(text, apply) {
      const btn = el('button', { type: 'button', class: 'btn btn-link', text: t('actions.apply') });
      btn.addEventListener('click', () => { apply(); update(); });
      box.appendChild(el('div', { class: 'suggestion' }, [el('span', { text: t('checklist.suggested', { what: text }) }), btn]));
    }

    if ((s.ckd === 'moderate' || s.ckd === 'severe') && ckdRank[s.ckd] > ckdRank[r.checks.ckd]) {
      suggestion(t(s.ckd === 'severe' ? 'checklist.ckdSuggestSevere' : 'checklist.ckdSuggestModerate'),
        () => { field('ckd').value = s.ckd; });
    } else if (s.ckd === 'needsAcr' && isNum(r.input.egfr) && r.checks.ckd === 'none') {
      box.appendChild(el('p', { class: 'hint', text: t('checklist.ckdNeedsAcr') }));
    }
    if (s.diabetesSevereTod === true && !r.checks.diabetesSevereTod) {
      suggestion(t('checklist.todSuggest'), () => { field('diabetesSevereTod').checked = true; });
    }
    if (s.markedFactor && !r.checks.markedFactor) {
      suggestion(t('checklist.markedSuggest'), () => { field('markedFactor').checked = true; });
    }
  }

  function renderAxenita(a, r) {
    const line = E.axenita.buildLine(a, r.input, lang);
    const box = $('axenita-line');
    box.value = line || '';
    box.placeholder = t('axenita.empty');
    box.style.height = 'auto';
    box.style.height = (box.scrollHeight + 2) + 'px';
    const btn = $('btn-copy');
    btn.disabled = !line;
    btn.textContent = t('actions.copy');
  }

  /** Copia negli appunti; ripiega sul vecchio metodo se l'API non è disponibile (es. file://). */
  function copyLine() {
    const box = $('axenita-line');
    const text = box.value;
    if (!text) return;
    const done = () => {
      const btn = $('btn-copy');
      btn.textContent = '✓ ' + t('actions.copied');
      setTimeout(() => { btn.textContent = t('actions.copy'); }, 1800);
    };
    const fallback = () => {
      box.focus();
      box.select();
      try { if (document.execCommand('copy')) done(); } catch (e) { /* il testo resta selezionato */ }
      box.setSelectionRange(0, 0);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  function update() {
    const r = readForm();
    updateVisibility(r);
    const a = E.assessment.assess(r.input, r.checks);
    lastAssessment = { assessment: a, read: r };
    renderResult(a, r);
    renderWhatIf(a);
    renderSuggestions(a, r);
    renderAxenita(a, r);
  }

  // ---------------------------------------------------------------- nuovo paziente
  function newPatient() {
    form.reset();
    field('visitDate').value = E.age.formatSwissDate(E.age.today());
    update();
    field('firstName').focus();
  }

  // ---------------------------------------------------------------- promemoria
  function renderReminders() {
    const data = (E.reminders && E.reminders[lang]) || E.reminders.it;
    const sources = E.reminders.sources;
    $('reminders-meta').textContent = t('reminders.updated', { date: data.updated }) + ' ' + t('reminders.notPrinted');
    const body = $('reminders-body');
    body.textContent = '';
    data.sections.forEach((sec) => {
      const ul = el('ul');
      sec.items.forEach((item) => {
        const li = el('li', null, [item.text, ' ']);
        item.sources.forEach((key) => {
          const src = sources[key];
          li.appendChild(el('a', {
            class: 'src', href: src.url, target: '_blank', rel: 'noopener noreferrer', title: src.cite,
            text: src.label[lang] || src.label.it
          }));
        });
        ul.appendChild(li);
      });
      body.appendChild(el('section', { class: 'reminder-section' }, [el('h3', { text: sec.title }), ul]));
    });
  }

  function toggleReminders(open) {
    const d = $('reminders');
    const show = open === undefined ? d.hidden : open;
    d.hidden = !show;
    $('btn-reminders').setAttribute('aria-expanded', String(show));
    if (show) $('btn-reminders-close').focus();
  }

  // ---------------------------------------------------------------- impostazioni
  const sform = $('settings-form');
  const PRACTICE = ['name', 'doctors', 'specialty', 'address', 'phone', 'email'];

  function fillSettingsForm() {
    sform.elements.uiLanguage.value = settings.uiLanguage;
    sform.elements.sheetLanguage.value = settings.sheetLanguage;
    sform.elements.region.value = settings.region;
    PRACTICE.forEach((f) => { sform.elements[f].value = settings.practice[f]; });
    const prev = $('s-logo-preview');
    prev.hidden = !settings.practice.logo;
    if (settings.practice.logo) prev.src = settings.practice.logo; else prev.removeAttribute('src');
    $('s-logo-remove').hidden = !settings.practice.logo;
    $('s-storage-note').textContent = E.settings.storageAvailable() ? t('settings.storageNote') : t('settings.storageUnavailable');
  }

  function persist(message) {
    E.settings.save(settings);
    $('s-status').textContent = message || '';
  }

  function applySettings() {
    const langChanged = lang !== settings.uiLanguage;
    lang = settings.uiLanguage;
    if (langChanged) applyTranslations();
    fillSettingsForm();
    update();
  }

  function readSettingsForm() {
    settings.uiLanguage = sform.elements.uiLanguage.value;
    settings.sheetLanguage = sform.elements.sheetLanguage.value;
    settings.region = sform.elements.region.value;
    PRACTICE.forEach((f) => { settings.practice[f] = sform.elements[f].value; });
    settings = E.settings.sanitize(settings, E.settings.defaults());
  }

  function bindSettings() {
    $('btn-settings').addEventListener('click', () => {
      fillSettingsForm();
      $('s-status').textContent = '';
      $('settings').showModal();
    });
    sform.addEventListener('input', (e) => {
      if (e.target.type === 'file') return;
      readSettingsForm(); persist(); applySettings();
    });
    sform.addEventListener('change', (e) => {
      if (e.target.type === 'file') return;
      readSettingsForm(); persist(); applySettings();
    });

    $('s-logo').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (file.size > E.settings.MAX_LOGO_BYTES) { $('s-status').textContent = t('settings.logoTooBig'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        if (!E.settings.isValidLogo(reader.result)) { $('s-status').textContent = t('settings.importError'); return; }
        settings.practice.logo = reader.result;
        persist(); fillSettingsForm();
      };
      reader.readAsDataURL(file);
    });
    $('s-logo-remove').addEventListener('click', () => {
      settings.practice.logo = '';
      persist(); fillSettingsForm();
    });

    $('s-export').addEventListener('click', () => {
      const blob = new Blob([E.settings.exportJson(settings)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = el('a', { href: url, download: 'score2-impostazioni.json' });
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    $('s-import').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          settings = E.settings.importJson(String(reader.result));
          persist(); applySettings();
          $('s-status').textContent = t('settings.imported');
        } catch (err) {
          $('s-status').textContent = t('settings.importError');
        }
      };
      reader.readAsText(file);
    });
    $('s-reset').addEventListener('click', () => {
      if (!window.confirm(t('settings.resetConfirm'))) return;
      E.settings.clear();
      settings = E.settings.defaults();
      applySettings();
    });
  }

  // ---------------------------------------------------------------- avvio
  function init() {
    applyTranslations();
    field('visitDate').value = E.age.formatSwissDate(E.age.today());

    form.addEventListener('submit', (e) => e.preventDefault());
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    ['birthDate', 'visitDate'].forEach((n) => field(n).addEventListener('blur', () => { normalizeDateField(n); update(); }));

    document.querySelectorAll('input[name="uiLanguage"]').forEach((r) => {
      r.addEventListener('change', () => {
        settings.uiLanguage = r.value;
        persist();
        applySettings();
      });
    });

    $('btn-new').addEventListener('click', newPatient);
    $('btn-copy').addEventListener('click', copyLine);
    $('btn-reminders').addEventListener('click', () => toggleReminders());
    $('btn-reminders-close').addEventListener('click', () => toggleReminders(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('reminders').hidden) toggleReminders(false); });

    bindSettings();
    update();
  }

  // Per le fasi successive (riga Axenita, foglio paziente) e per i test manuali
  E.ui = { getState: () => lastAssessment, getSettings: () => settings, update: update };

  init();
})();
