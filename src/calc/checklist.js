/*
 * Controllo preliminare: condizioni che definiscono il rischio senza bisogno dello score
 * (o che ne impongono un'interpretazione prudente).
 *
 * Il medico spunta le caselle; suggest() propone le caselle deducibili dai valori inseriti
 * (eGFR, UACR, CT, LDL, PA), ma non le spunta da sola: la decisione resta al medico.
 *
 * Fonti:
 * - ASCVD, IRC, FH, fattore singolo marcato: ESC 2021 prevenzione CV (tab. 4 e 6) ed
 *   ESC/EAS 2019 dislipidemie (tab. 4).
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

  /**
   * Classifica l'IRC secondo ESC 2021 (tab. 4, da KDIGO).
   * @param {number} egfr mL/min/1.73 m²
   * @param {number|null} acrMgG albumina/creatinina urinaria in mg/g (null se non nota)
   * @returns {'severe'|'moderate'|'none'|'needsAcr'|'unknown'}
   *
   * severe:   eGFR < 30, oppure eGFR 30–44 con ACR > 30 mg/g
   * moderate: eGFR 30–44 con ACR < 30; 45–59 con ACR 30–300; ≥ 60 con ACR > 300
   * eGFR 45–59 con ACR > 300 mg/g non è elencato nella tabella ESC: KDIGO lo pone nel
   * rischio molto alto, quindi qui è classificato "severe" (vedi docs/linee-guida.md).
   */
  function classifyCkd(egfr, acrMgG) {
    if (!isNum(egfr)) return 'unknown';
    var hasAcr = isNum(acrMgG);
    if (egfr < 30) return 'severe';
    if (egfr < 45) {
      if (!hasAcr) return 'moderate'; // almeno moderata; con ACR > 30 sarebbe severa
      return acrMgG > 30 ? 'severe' : 'moderate';
    }
    if (!hasAcr) return 'needsAcr';
    if (egfr < 60) {
      if (acrMgG > 300) return 'severe';
      return acrMgG >= 30 ? 'moderate' : 'none';
    }
    return acrMgG > 300 ? 'moderate' : 'none';
  }

  /**
   * Danno d'organo severo nel diabete tipo 2 (ESC 2023): eGFR < 45; eGFR 45–59 con UACR
   * 30–300 mg/g; UACR > 300 mg/g; malattia microvascolare in ≥ 3 distretti.
   * @returns {boolean|null} null se i dati non bastano per escluderlo
   */
  function diabetesSevereTod(egfr, acrMgG, microvascular3Sites) {
    if (microvascular3Sites === true) return true;
    if (isNum(egfr) && egfr < 45) return true;
    if (isNum(acrMgG) && acrMgG > 300) return true;
    if (isNum(egfr) && egfr < 60 && isNum(acrMgG) && acrMgG >= 30) return true;
    if (isNum(egfr) && isNum(acrMgG)) return false;
    return null;
  }

  /**
   * Suggerimenti per la checklist a partire dai valori inseriti.
   * @param {{diabetes?:boolean, egfr?:number, acrMgG?:number, microvascular3Sites?:boolean,
   *          totalChol?:number, ldl?:number, sbp?:number, dbp?:number}} v
   */
  function suggest(v) {
    v = v || {};
    var marked = [];
    if (isNum(v.totalChol) && v.totalChol > MARKED.totalChol) marked.push('totalChol');
    if (isNum(v.ldl) && v.ldl > MARKED.ldl) marked.push('ldl');
    if ((isNum(v.sbp) && v.sbp >= MARKED.sbp) || (isNum(v.dbp) && v.dbp >= MARKED.dbp)) marked.push('bp');
    return {
      ckd: classifyCkd(v.egfr, isNum(v.acrMgG) ? v.acrMgG : null),
      diabetesSevereTod: v.diabetes ? diabetesSevereTod(v.egfr, v.acrMgG, v.microvascular3Sites) : false,
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
    classifyCkd: classifyCkd,
    diabetesSevereTod: diabetesSevereTod,
    suggest: suggest,
    evaluate: evaluate
  };

  if (isNode) module.exports = api;
  else NS.checklist = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
