/*
 * Foglio A4 per il paziente: prepara i contenuti (funzione pura, testabile) e li disegna.
 * La lingua del foglio è indipendente da quella dell'interfaccia.
 * Il foglio non contiene i promemoria per il medico.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var categories = isNode ? require('../calc/categories.js') : NS.categories;
  var units = isNode ? require('../calc/units.js') : NS.units;

  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  var SBP_TARGET_MAX = 129;   // ESC 2024: 120–129 mmHg se tollerata
  var HBA1C_TARGET = 53;      // ESC 2023: di regola < 53 mmol/mol (7%)
  var MAX_TIPS = 4;

  /**
   * Sceglie fino a 4 consigli, in ordine di priorità, adatti al paziente.
   * @returns {string[]} chiavi dei consigli (sheet.tips.<chiave>)
   */
  function chooseTips(input, a) {
    var tips = [];
    var cat = a.category;
    var highRisk = cat === 'high' || cat === 'veryHigh';
    var lipids = a.lipids || {};
    var ldlTarget = a.ldlTarget;
    var lipidAbove = (isNum(lipids.ldl) && ldlTarget && lipids.ldl >= ldlTarget.ldlBelow) ||
      (isNum(lipids.nonHdl) && categories.nonHdlTarget(cat) && lipids.nonHdl >= categories.nonHdlTarget(cat));

    if (input.smoker) tips.push('smoking');
    if (isNum(input.sbp) && input.sbp > SBP_TARGET_MAX) tips.push('bloodPressure');
    if (input.diabetes) tips.push('diabetes');
    if (lipidAbove || !isNum(lipids.ldl)) tips.push('diet');
    tips.push('activity');
    if (highRisk) tips.push('medication');
    tips.push('diet');
    tips.push('checkups');

    var unique = [];
    tips.forEach(function (k) { if (unique.indexOf(k) < 0) unique.push(k); });
    return unique.slice(0, MAX_TIPS);
  }

  function status(value, below) {
    if (!isNum(value) || !isNum(below)) return null;
    return value < below ? 'ok' : 'above';
  }

  /**
   * Prepara i contenuti del foglio.
   * @param {object} a        risultato di assessment.assess()
   * @param {object} read     dati letti dal modulo: { input, patient:{firstName,lastName,birth,visit} }
   * @param {object} settings impostazioni (sheetLanguage, region, practice)
   * @returns {object|null}   null se non c'è un risultato da stampare
   */
  function buildModel(a, read, settings) {
    if (!a || (!a.calc.ok && !a.category)) return null;
    var input = read.input;
    var cat = a.category;
    var scheme = a.score ? a.score.scheme : (input.diabetes && input.age < 70 ? 'ESC2023-DM' : 'ESC2021');
    var showScore = a.calc.ok && a.checklist.scoreApplies;
    var pct = a.calc.ok ? categories.roundPercent(a.calc.risk) : null;

    var rows = [];
    rows.push({
      key: 'sbp',
      value: isNum(input.sbp) ? Math.round(input.sbp) + (isNum(input.dbp) ? '/' + Math.round(input.dbp) : '') + ' mmHg' : null,
      target: 'sbp',
      status: isNum(input.sbp) ? (input.sbp <= SBP_TARGET_MAX ? 'ok' : 'above') : null
    });
    var ldlT = a.ldlTarget;
    rows.push({
      key: 'ldl',
      value: isNum(a.lipids.ldl) ? a.lipids.ldl.toFixed(1) + ' mmol/L' : null,
      ldlSource: a.lipids.ldlSource,
      targetValue: ldlT ? ldlT.ldlBelow : null,
      status: ldlT ? status(a.lipids.ldl, ldlT.ldlBelow) : null
    });
    var nhT = categories.nonHdlTarget(cat);
    rows.push({
      key: 'nonHdl',
      value: isNum(a.lipids.nonHdl) ? a.lipids.nonHdl.toFixed(1) + ' mmol/L' : null,
      targetValue: nhT,
      status: status(a.lipids.nonHdl, nhT)
    });
    if (input.diabetes && isNum(input.hba1c)) {
      rows.push({
        key: 'hba1c',
        value: Math.round(input.hba1c) + ' mmol/mol (' + units.hba1cMmolMolToPercent(input.hba1c).toFixed(1) + '%)',
        target: 'hba1c',
        status: input.hba1c < HBA1C_TARGET ? 'ok' : 'above'
      });
    }
    rows.push({
      key: 'smoking',
      value: input.smoker ? 'yes' : 'no',
      target: 'smoking',
      status: input.smoker ? 'above' : 'ok'
    });

    var whatIf = null;
    if (showScore && a.whatIf && a.whatIf.scenarios.length) {
      whatIf = {
        base: a.whatIf.basePercent,
        scenarios: a.whatIf.scenarios.map(function (s) { return { id: s.id, percent: s.percent }; })
      };
    }

    return {
      lang: settings.sheetLanguage,
      practice: settings.practice,
      patient: read.patient,
      risk: {
        category: cat,
        scale: categories.scaleFor(scheme),
        thresholds: a.score ? a.score.thresholds : null,
        scheme: scheme,
        percent: showScore ? pct : null,
        perHundred: showScore ? Math.round(pct) : null,
        fromConditions: !showScore
      },
      model: a.calc.ok ? a.calc.model : null,
      region: a.calc.region,
      rows: rows,
      whatIf: whatIf,
      tips: chooseTips(input, a)
    };
  }

  // ------------------------------------------------------------------ disegno (solo browser)

  function render(container, m, t, formatDate, today) {
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined && text !== null) n.textContent = text;
      return n;
    }
    function add(parent, child) { parent.appendChild(child); return child; }

    container.textContent = '';
    var page = add(container, el('div', 'sheet-page'));

    // Intestazione dello studio
    var p = m.practice || {};
    var practiceLines = [[p.doctors, p.specialty], [p.address, p.phone, p.email]]
      .map(function (parts) { return parts.filter(Boolean).join(' · '); })
      .filter(Boolean);
    if (p.logo || p.name || practiceLines.length) {
      var head = add(page, el('header', 'sheet-head'));
      if (p.logo) {
        var img = add(head, el('img', 'sheet-logo'));
        img.src = p.logo;
        img.alt = '';
      }
      var hp = add(head, el('div', 'sheet-practice'));
      if (p.name) add(hp, el('div', 'sheet-practice-name', p.name));
      practiceLines.forEach(function (line) { add(hp, el('div', null, line)); });
    }

    add(page, el('h1', 'sheet-title', t('sheet.title')));

    // Dati del paziente
    var pat = add(page, el('dl', 'sheet-patient'));
    var fullName = [m.patient.firstName, m.patient.lastName].filter(Boolean).join(' ');
    [
      ['sheet.patient', fullName],
      ['sheet.birthDate', m.patient.birth ? formatDate(m.patient.birth) : ''],
      ['sheet.visitDate', m.patient.visit ? formatDate(m.patient.visit) : '']
    ].forEach(function (r) {
      var d = add(pat, el('div'));
      add(d, el('dt', null, t(r[0])));
      add(d, el('dd', r[1] ? null : 'blank', r[1] || ''));
    });

    // Rischio
    var riskBox = add(page, el('section', 'sheet-risk'));
    add(riskBox, el('h2', null, t('sheet.yourRisk')));
    var riskMain = add(riskBox, el('div', 'sheet-risk-main'));
    if (m.risk.percent !== null) {
      var big = add(riskMain, el('div', 'sheet-risk-number'));
      add(big, el('span', 'sheet-risk-pct', m.risk.percent.toFixed(1) + '%'));
      add(big, el('span', 'sheet-risk-cap', t('sheet.inTenYears')));
    }
    var riskText = add(riskMain, el('div', 'sheet-risk-text'));
    add(riskText, el('p', 'sheet-risk-level', t('sheet.riskLevel', { category: t('categories.' + m.risk.category) })));
    if (m.risk.percent !== null) {
      add(riskText, el('p', null, m.risk.perHundred < 1
        ? t('sheet.perHundredLess1')
        : t('sheet.perHundred', { n: m.risk.perHundred })));
    } else {
      add(riskText, el('p', null, t('sheet.fromConditions', { category: t('categories.' + m.risk.category) })));
    }

    // Scala colorata: testo e marcatore leggibili anche in bianco e nero
    var scale = add(riskBox, el('div', 'sheet-scale sheet-scale-' + m.risk.scale.length));
    m.risk.scale.forEach(function (c, i) {
      var seg = add(scale, el('div', 'sheet-seg seg-' + c + (c === m.risk.category ? ' current' : '')));
      add(seg, el('span', 'sheet-seg-label', t('categories.' + c)));
      var th = m.risk.thresholds;
      if (th) {
        var range = rangeText(m.risk.scheme, th, i);
        if (range) add(seg, el('span', 'sheet-seg-range', range));
      }
      if (c === m.risk.category) add(seg, el('span', 'sheet-seg-marker', '▲ ' + t('sheet.you')));
    });

    // Valori e obiettivi
    var vals = add(page, el('section', 'sheet-values'));
    add(vals, el('h2', null, t('sheet.values')));
    var table = add(vals, el('table', 'sheet-table'));
    var thead = add(table, el('thead'));
    var hr = add(thead, el('tr'));
    ['', 'sheet.colValue', 'sheet.colTarget', ''].forEach(function (k) { add(hr, el('th', null, k ? t(k) : '')); });
    var tbody = add(table, el('tbody'));
    m.rows.forEach(function (r) {
      var tr = add(tbody, el('tr'));
      add(tr, el('th', null, t('sheet.row.' + r.key)));
      var v = r.value;
      if (r.key === 'smoking') v = t(r.value === 'yes' ? 'sheet.smokingYes' : 'sheet.smokingNo');
      else if (r.key === 'ldl' && v && r.ldlSource === 'friedewald') v += ' ' + t('sheet.ldlCalculated');
      add(tr, el('td', v ? null : 'muted', v || '—'));
      var target = r.target ? t('sheet.target.' + r.target)
        : (isNum(r.targetValue) ? t('sheet.target.below', { value: r.targetValue.toFixed(1) }) : '—');
      add(tr, el('td', null, target));
      add(tr, el('td', 'sheet-status ' + (r.status || ''),
        r.status === 'ok' ? '✓' : r.status === 'above' ? '✗' : ''));
    });
    add(vals, el('p', 'sheet-footnote', t('sheet.sbpNote')));

    // Cosa cambia se
    if (m.whatIf) {
      var wi = add(page, el('section', 'sheet-whatif'));
      add(wi, el('h2', null, t('sheet.whatIfTitle')));
      var ul = add(wi, el('ul'));
      var li0 = add(ul, el('li'));
      add(li0, el('span', null, t('sheet.whatIf.now')));
      add(li0, el('strong', null, t('sheet.outOf100', { n: fmt1(m.whatIf.base) })));
      m.whatIf.scenarios.forEach(function (s) {
        var li = add(ul, el('li', s.id === 'all' ? 'all' : null));
        add(li, el('span', null, t('sheet.whatIf.' + s.id)));
        add(li, el('strong', null, t('sheet.outOf100', { n: fmt1(s.percent) })));
      });
      add(wi, el('p', 'sheet-footnote', t('sheet.whatIfNote')));
    }

    // Consigli
    var tipsBox = add(page, el('section', 'sheet-tips'));
    add(tipsBox, el('h2', null, t('sheet.tipsTitle')));
    var ol = add(tipsBox, el('ul'));
    m.tips.forEach(function (k) {
      var li = add(ol, el('li'));
      add(li, el('strong', null, t('sheet.tips.' + k + '.title') + ' '));
      add(li, document.createTextNode(t('sheet.tips.' + k + '.text')));
    });

    add(page, el('p', 'sheet-discuss', t('sheet.discuss')));

    var foot = add(page, el('footer', 'sheet-foot'));
    var model = m.model && !m.risk.fromConditions
      ? t('sheet.footModel', { model: m.model, region: t('regions.' + m.region + 'Short') })
      : t('sheet.footNoModel');
    add(foot, el('span', null, model));
    add(foot, el('span', null, t('sheet.printed', { date: formatDate(today) })));
  }

  function fmt1(x) { return (Math.round(x * 10) / 10).toFixed(1); }

  /** Intervallo della categoria i-esima, es. "< 5%", "5–10%", "≥ 10%". */
  function rangeText(scheme, th, i) {
    if (scheme === 'ESC2023-DM') {
      return ['< ' + th.moderate + '%', th.moderate + '–' + th.high + '%', th.high + '–' + th.veryHigh + '%', '≥ ' + th.veryHigh + '%'][i];
    }
    return ['< ' + th.high + '%', th.high + '–' + th.veryHigh + '%', '≥ ' + th.veryHigh + '%'][i];
  }

  var api = { buildModel: buildModel, chooseTips: chooseTips, render: render, rangeText: rangeText, MAX_TIPS: MAX_TIPS };
  if (isNode) module.exports = api;
  else NS.sheet = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
