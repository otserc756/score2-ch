/*
 * Controllo preliminare: condizioni che definiscono il rischio senza bisogno dello score
 * (o che ne impongono un'interpretazione prudente).
 *
 * Il medico spunta le caselle; suggest() propone le caselle deducibili dai valori inseriti
 * (eGFR, UACR, CT, LDL, PA), ma non le spunta da sola: la decisione resta al medico.
 *
 * Fonti:
 * - ASCVD, FH, fattore singolo marcato: ESC 2021 prevenzione CV (tab. 4) ed
 *   ESC/EAS 2019 dislipidemie (tab. 4).
 * - IRC: ESC/ERA 2026 malattia CV e IRC (Recommendation Table 7), doi:10.1093/eurheartj/ehag098.
 * - Danno d'organo severo nel diabete: ESC 2023 diabete (tab. 7).
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var categories = isNode ? require('./categories.js') : NS.categories;

  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  // Soglie del "fattore singolo marcatamente elevato" (ESC/EAS 2019; ESC 2021)
  var MARKED = { totalChol: 8, ldl: 4.9, sbp: 180, dbp: 110 };

  /*
   * Albuminuria (rapporto albumina/creatinina, ACR/UACR). Le linee guida usano coppie di
   * soglie equivalenti per convenzione: 3 mg/mmol ≈ 30 mg/g e 30 mg/mmol ≈ 300 mg/g.
   * Per non spostare i casi al confine (3 mg/mmol = 26.5 mg/g con la conversione esatta),
   * il confronto si fa nell'unità inserita dal medico, con le soglie di quell'unità.
   */
  var ACR_THRESHOLDS = {
    'mg/mmol': { micro: 3, macro: 30 },
    'mg/g':    { micro: 30, macro: 300 }
  };

  /** Classe di albuminuria: 'A1' (< 3 mg/mmol), 'A2' (3–30), 'A3' (> 30), null se non nota. */
  function acrClass(acr, unit) {
    if (!isNum(acr)) return null;
    var t = ACR_THRESHOLDS[unit || 'mg/mmol'];
    if (!t) throw new Error('Unità ACR sconosciuta: ' + unit);
    if (acr > t.macro) return 'A3';
    if (acr >= t.micro) return 'A2';
    return 'A1';
  }

  /**
   * Classifica l'IRC secondo la linea guida ESC/ERA 2026 su malattia CV e IRC
   * (Recommendation Table 7), che aggiorna la tab. 4 di ESC 2021.
   *   severa   (rischio relativamente molto alto): eGFR < 30 con qualsiasi albuminuria;
   *            eGFR 30–44 con ACR 3–30 mg/mmol; ACR > 30 mg/mmol con qualsiasi eGFR
   *   moderata (rischio relativamente alto):       eGFR 30–44 con ACR < 3; eGFR 45–59 con ACR 3–30
   * @param {number} egfr mL/min/1.73 m²
   * @param {number|null} acr albumina/creatinina urinaria (null se non nota)
   * @param {'mg/mmol'|'mg/g'} [unit='mg/mmol']
   * @returns {'severe'|'moderate'|'none'|'needsAcr'|'unknown'}
   */
  function classifyCkd(egfr, acr, unit) {
    var a = acrClass(acr, unit);
    if (a === 'A3') return 'severe';
    if (!isNum(egfr)) return 'unknown';
    if (egfr < 30) return 'severe';
    if (egfr < 45) {
      if (a === null) return 'moderate'; // almeno moderata; con ACR ≥ 3 mg/mmol sarebbe severa
      return a === 'A2' ? 'severe' : 'moderate';
    }
    if (a === null) return 'needsAcr';
    if (egfr < 60) return a === 'A2' ? 'moderate' : 'none';
    return 'none';
  }

  /**
   * Danno d'organo severo nel diabete tipo 2 (ESC 2023, sez. 4.1): eGFR < 45; eGFR 45–59
   * con microalbuminuria (UACR 30–300 mg/g); proteinuria (UACR > 300 mg/g);
   * malattia microvascolare in ≥ 3 distretti.
   * @returns {boolean|null} null se i dati non bastano per escluderlo
   */
  function diabetesSevereTod(egfr, acr, unit, microvascular3Sites) {
    var a = acrClass(acr, unit);
    if (microvascular3Sites === true) return true;
    if (isNum(egfr) && egfr < 45) return true;
    if (a === 'A3') return true;
    if (isNum(egfr) && egfr < 60 && a === 'A2') return true;
    if (isNum(egfr) && a !== null) return false;
    return null;
  }

  /**
   * Suggerimenti per la checklist a partire dai valori inseriti.
   * @param {{diabetes?:boolean, egfr?:number, acr?:number, acrUnit?:string,
   *          microvascular3Sites?:boolean, totalChol?:number, ldl?:number, sbp?:number, dbp?:number}} v
   */
  function suggest(v) {
    v = v || {};
    var marked = [];
    if (isNum(v.totalChol) && v.totalChol > MARKED.totalChol) marked.push('totalChol');
    if (isNum(v.ldl) && v.ldl > MARKED.ldl) marked.push('ldl');
    if ((isNum(v.sbp) && v.sbp >= MARKED.sbp) || (isNum(v.dbp) && v.dbp >= MARKED.dbp)) marked.push('bp');
    var acr = isNum(v.acr) ? v.acr : null;
    return {
      ckd: classifyCkd(v.egfr, acr, v.acrUnit),
      diabetesSevereTod: v.diabetes ? diabetesSevereTod(v.egfr, acr, v.acrUnit, v.microvascular3Sites) : false,
      markedFactor: marked.length > 0,
      markedFactors: marked
    };
  }

  /*
   * Effetto di ogni condizione spuntata.
   *   scoreApplies: false     → lo score non si applica (la categoria è definita dalla condizione)
   *   scoreApplies: 'caution' → lo score si calcola, ma la categoria è almeno quella indicata
   */
  var RULES = {
    ascvd:             { category: 'veryHigh', scoreApplies: false },
    diabetesSevereTod: { category: 'veryHigh', scoreApplies: false },
    ckdSevere:         { category: 'veryHigh', scoreApplies: false },
    ckdModerate:       { category: 'high',     scoreApplies: false },
    fhWithRiskFactor:  { category: 'veryHigh', scoreApplies: false },
    fh:                { category: 'high',     scoreApplies: false },
    markedFactor:      { category: 'high',     scoreApplies: 'caution' }
  };

  /**
   * Valuta la checklist spuntata dal medico.
   * @param {{ascvd?:boolean, diabetesSevereTod?:boolean, ckd?:'none'|'moderate'|'severe',
   *          fh?:'none'|'fh'|'fhWithRiskFactor', markedFactor?:boolean}} c
   * @param {{diabetes?:boolean}} ctx
   * @returns {{conditions:Array<{code:string, category:string, scoreApplies:(boolean|string)}>,
   *            category:string|null, scoreApplies:boolean}}
   */
  function evaluate(c, ctx) {
    c = c || {};
    ctx = ctx || {};
    var codes = [];
    if (c.ascvd) codes.push('ascvd');
    if (c.diabetesSevereTod && ctx.diabetes) codes.push('diabetesSevereTod');
    if (c.ckd === 'severe') codes.push('ckdSevere');
    else if (c.ckd === 'moderate') codes.push('ckdModerate');
    if (c.fh === 'fhWithRiskFactor') codes.push('fhWithRiskFactor');
    else if (c.fh === 'fh') codes.push('fh');
    if (c.markedFactor) codes.push('markedFactor');

    var conditions = codes.map(function (code) {
      return { code: code, category: RULES[code].category, scoreApplies: RULES[code].scoreApplies };
    });
    var category = categories.worst.apply(null, conditions.map(function (x) { return x.category; }));
    var scoreApplies = conditions.every(function (x) { return x.scoreApplies !== false; });
    return { conditions: conditions, category: category, scoreApplies: scoreApplies };
  }

  var api = {
    MARKED: MARKED,
    RULES: RULES,
    ACR_THRESHOLDS: ACR_THRESHOLDS,
    acrClass: acrClass,
    classifyCkd: classifyCkd,
    diabetesSevereTod: diabetesSevereTod,
    suggest: suggest,
    evaluate: evaluate
  };

  if (isNode) module.exports = api;
  else NS.checklist = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
