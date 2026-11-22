/*
 * eGFR con l'equazione CKD-EPI 2021 basata sulla creatinina, senza coefficiente per la razza.
 * Fonte: Inker LA et al. N Engl J Med 2021;385:1737-1749. doi:10.1056/NEJMoa2102953
 *
 * eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^età × 1.012 [se donna]
 * Scr in mg/dL; κ = 0.7 (donne) / 0.9 (uomini); α = −0.241 (donne) / −0.302 (uomini)
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var units = isNode ? require('./units.js') : root.ESCScore.units;

  var PARAMS = {
    female: { kappa: 0.7, alpha: -0.241, factor: 1.012 },
    male:   { kappa: 0.9, alpha: -0.302, factor: 1 }
  };

  /**
   * @param {number} creatinineUmol creatinina sierica in µmol/L
   * @param {number} age anni
   * @param {'male'|'female'} sex
   * @returns {number} eGFR in mL/min/1.73 m² (non arrotondato)
   */
  function ckdEpi2021(creatinineUmol, age, sex) {
    var p = PARAMS[sex];
    if (!p) throw new Error('Sesso non valido: ' + sex);
    if (!(creatinineUmol > 0)) throw new Error('Creatinina non valida: ' + creatinineUmol);
    var ratio = units.creatinineUmolToMgdl(creatinineUmol) / p.kappa;
    return 142 *
      Math.pow(Math.min(ratio, 1), p.alpha) *
      Math.pow(Math.max(ratio, 1), -1.2) *
      Math.pow(0.9938, age) *
      p.factor;
  }

  var api = { ckdEpi2021: ckdEpi2021 };
  if (isNode) module.exports = api;
  else root.ESCScore.egfr = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
