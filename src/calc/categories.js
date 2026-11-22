/*
 * Categorie di rischio e obiettivi LDL.
 *
 * SCORE2 / SCORE2-OP (ESC 2021 prevenzione CV, Visseren et al. Eur Heart J 2021;42:3227-3337):
 *   < 50 anni:   < 2.5% basso-moderato · 2.5–<7.5% alto · ≥ 7.5% molto alto
 *   50–69 anni:  < 5%                  · 5–<10%       · ≥ 10%
 *   ≥ 70 anni:   < 7.5%                · 7.5–<15%     · ≥ 15%
 * SCORE2-Diabetes (ESC 2023 diabete, Marx et al. Eur Heart J 2023;44:4043-4140):
 *   < 5% basso · 5–<10% moderato · 10–<20% alto · ≥ 20% molto alto
 *
 * La categoria si assegna sul valore arrotondato a un decimale, cioè su quello che il
 * medico vede: un rischio di 7.46% (mostrato 7.5%) a 45 anni è "molto alto".
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var risk = isNode ? require('./risk.js') : NS.risk;

  // Ordine di gravità: serve per combinare score e condizioni della checklist.
  var RANK = { low: 0, lowModerate: 1, moderate: 1, high: 2, veryHigh: 3 };

  var SCORE2_THRESHOLDS = [
    { maxAge: 49, high: 2.5, veryHigh: 7.5 },
    { maxAge: 69, high: 5, veryHigh: 10 },
    { maxAge: Infinity, high: 7.5, veryHigh: 15 }
  ];

  var DIABETES_THRESHOLDS = { moderate: 5, high: 10, veryHigh: 20 };

  /*
   * Obiettivi LDL (ESC/EAS 2019 dislipidemie, Mach et al. Eur Heart J 2020;41:111-188;
   * confermati da ESC 2021 e ESC 2023 diabete).
   * "lowModerate" (SCORE2, categoria unica basso-moderato): si indica <2.6 mmol/L,
   * l'obiettivo del rischio moderato, con <3.0 come alternativa per il rischio basso.
   */
  var LDL_TARGETS = {
    veryHigh:    { ldlBelow: 1.4, minReductionPct: 50 },
    high:        { ldlBelow: 1.8, minReductionPct: 50 },
    moderate:    { ldlBelow: 2.6, minReductionPct: null },
    lowModerate: { ldlBelow: 2.6, minReductionPct: null, alternativeLow: 3.0 },
    low:         { ldlBelow: 3.0, minReductionPct: null }
  };

  // Obiettivi secondari non-HDL (ESC/EAS 2019): molto alto < 2.2, alto < 2.6, moderato < 3.4 mmol/L
  var NON_HDL_TARGETS = { veryHigh: 2.2, high: 2.6, moderate: 3.4, lowModerate: 3.4, low: null };

  /** Rischio 0–1 → percentuale arrotondata a un decimale. */
  function roundPercent(r) { return Math.round(r * 1000) / 10; }

  /**
   * Categoria derivata dallo score.
   * @param {string} model 'SCORE2' | 'SCORE2-OP' | 'SCORE2-Diabetes'
   * @param {number} age
   * @param {number} riskFraction 0–1
   * @returns {{category:string, scheme:'ESC2021'|'ESC2023-DM', percent:number, thresholds:object}}
   */
  function fromScore(model, age, riskFraction) {
    var pct = roundPercent(riskFraction);
    if (model === risk.MODELS.SCORE2_DIABETES) {
      var t = DIABETES_THRESHOLDS;
      var cat = pct >= t.veryHigh ? 'veryHigh' : pct >= t.high ? 'high' : pct >= t.moderate ? 'moderate' : 'low';
      return { category: cat, scheme: 'ESC2023-DM', percent: pct, thresholds: t };
    }
    if (model !== risk.MODELS.SCORE2 && model !== risk.MODELS.SCORE2_OP) {
      throw new Error('Modello sconosciuto: ' + model);
    }
    var th = SCORE2_THRESHOLDS.filter(function (x) { return age <= x.maxAge; })[0];
    var c = pct >= th.veryHigh ? 'veryHigh' : pct >= th.high ? 'high' : 'lowModerate';
    return { category: c, scheme: 'ESC2021', percent: pct, thresholds: { high: th.high, veryHigh: th.veryHigh } };
  }

  /** La più grave fra più categorie (ignora null). */
  function worst() {
    var best = null;
    for (var i = 0; i < arguments.length; i++) {
      var c = arguments[i];
      if (c && (best === null || RANK[c] > RANK[best])) best = c;
    }
    return best;
  }

  function ldlTarget(category) { return LDL_TARGETS[category] || null; }
  function nonHdlTarget(category) { return NON_HDL_TARGETS[category] || null; }

  /** Categorie della scala mostrata al paziente, nell'ordine. */
  function scaleFor(scheme) {
    return scheme === 'ESC2023-DM' ? ['low', 'moderate', 'high', 'veryHigh'] : ['lowModerate', 'high', 'veryHigh'];
  }

  var api = {
    RANK: RANK,
    SCORE2_THRESHOLDS: SCORE2_THRESHOLDS,
    DIABETES_THRESHOLDS: DIABETES_THRESHOLDS,
    LDL_TARGETS: LDL_TARGETS,
    roundPercent: roundPercent,
    fromScore: fromScore,
    worst: worst,
    ldlTarget: ldlTarget,
    NON_HDL_TARGETS: NON_HDL_TARGETS,
    nonHdlTarget: nonHdlTarget,
    scaleFor: scaleFor
  };

  if (isNode) module.exports = api;
  else NS.categories = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
