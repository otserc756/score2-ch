/*
 * Riga di testo per la cartella clinica (Axenita).
 * Mai dati anagrafici: niente nome, cognome né data di nascita (l'età sì).
 *
 * Esempio:
 *   SCORE2 (regione a basso rischio): 12.9% a 10 anni – rischio molto alto (M, 69 a, fumatore,
 *   PAS 140, CT 5.23, HDL 1.24, non-HDL 3.99 mmol/L). Obiettivo LDL <1.4 mmol/L e riduzione ≥50%.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var i18n = isNode ? require('../i18n/i18n.js') : NS.i18n;
  var categories = isNode ? require('../calc/categories.js') : NS.categories;

  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  /** Numero senza zeri finali inutili: 5.50 → "5.5", 5.23 → "5.23". */
  function n(x, digits) { return String(Number(x.toFixed(digits))); }

  /** Elenco dei valori del paziente, nell'ordine dell'esempio. */
  function details(input, lipids, t) {
    var d = [];
    var female = input.sex === 'female';
    if (input.sex) d.push(t(female ? 'axenita.female' : 'axenita.male'));
    if (isNum(input.age)) d.push(t('axenita.age', { age: input.age }));
    if (typeof input.smoker === 'boolean') {
      d.push(t('axenita.' + (input.smoker ? 'smoker' : 'nonSmoker') + (female ? 'F' : 'M')));
    }
    if (input.diabetes) {
      d.push(isNum(input.ageAtDiagnosis)
        ? t('axenita.diabetesDx', { age: input.ageAtDiagnosis })
        : t('axenita.diabetes'));
      if (isNum(input.hba1c)) d.push(t('axenita.hba1c', { value: n(input.hba1c, 0) }));
    }
    if (isNum(input.sbp)) {
      d.push(isNum(input.dbp)
        ? t('axenita.bp', { sbp: n(input.sbp, 0), dbp: n(input.dbp, 0) })
        : t('axenita.sbp', { value: n(input.sbp, 0) }));
    }
    if (isNum(input.egfr)) d.push(t('axenita.egfr', { value: n(input.egfr, 0) }));
    if (isNum(input.acr)) d.push(t('axenita.acr', { value: n(input.acr, 1), unit: input.acrUnit || 'mg/mmol' }));

    // Lipidi per ultimi, con l'unità una sola volta in fondo
    var lip = [];
    if (isNum(input.totalChol)) lip.push(t('axenita.tc') + ' ' + n(input.totalChol, 2));
    if (isNum(input.hdl)) lip.push('HDL ' + n(input.hdl, 2));
    if (isNum(lipids.nonHdl)) lip.push(t('axenita.nonHdl') + ' ' + n(lipids.nonHdl, 2));
    if (isNum(lipids.ldl)) {
      lip.push(t(lipids.ldlSource === 'measured' ? 'axenita.ldlMeasured' : 'axenita.ldlCalc') + ' ' + n(lipids.ldl, 2));
    }
    if (lip.length) d.push(lip.join(', ') + ' mmol/L');
    return d;
  }

  function ldlTargetText(target, t) {
    var s = t('axenita.ldlTarget', { value: n(target.ldlBelow, 1) });
    if (target.minReductionPct) s += t('axenita.ldlReduction', { pct: target.minReductionPct });
    if (target.alternativeLow) s += t('axenita.ldlAltLow', { value: n(target.alternativeLow, 1) });
    return s + '.';
  }

  /**
   * @param {object} a     risultato di assessment.assess()
   * @param {object} input input normalizzato passato ad assess()
   * @param {string} lang  'it' | 'de'
   * @returns {string|null} null se non c'è niente da riportare
   */
  function buildLine(a, input, lang) {
    var t = function (key, params) { return i18n.t(lang, key, params); };
    if (!a || (!a.calc.ok && !a.category)) return null;

    var conds = a.checklist.conditions.map(function (c) { return t('axenita.cond.' + c.code); }).join(', ');
    var det = details(input, a.lipids, t);
    var detText = det.length ? ' (' + det.join(', ') + ')' : '';
    var cat = t('categories.' + a.category);
    var line;

    if (a.calc.ok) {
      line = a.calc.model + ' (' + t('regions.' + a.calc.region + 'Short') + '): ' +
        categories.roundPercent(a.calc.risk).toFixed(1) + '% ' + t('axenita.tenYear');
      if (!a.checklist.scoreApplies) line += ', ' + t('axenita.notApplicable');
      line += ' – ' + t('axenita.risk', { category: cat });
      if (a.categoryFromConditions || !a.checklist.scoreApplies) line += ' ' + t('axenita.dueTo', { list: conds });
      else if (conds) line += '; ' + t('axenita.alsoChecked', { list: conds });
      line += detText + '.';
    } else {
      line = t('axenita.noScore', { category: cat, list: conds }) + detText + '.';
    }

    var outside = a.calc.warnings.filter(function (w) { return w.code === 'outside_model_range'; })
      .map(function (w) { return t('axenita.field.' + w.field); });
    if (outside.length) line += ' ' + t('axenita.outOfRange', { list: outside.join(', ') });

    if (a.ldlTarget) line += ' ' + ldlTargetText(a.ldlTarget, t);
    return line;
  }

  var api = { buildLine: buildLine };
  if (isNode) module.exports = api;
  else NS.axenita = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
