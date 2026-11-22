/*
 * SCORE2-OP (70 anni e oltre; l'app lo usa fino a 89 anni), con o senza diabete.
 * Fonte: SCORE2-OP working group, Eur Heart J 2021;42:2455-2467.
 * Coefficienti verificati su RiskScorescvd ed esempi ESC.
 *
 * Variabili centrate: a=età-73; s=PAS-150; t=CT-6; h=HDL-1.4
 * Rischio non calibrato = 1 - S0^exp(LP - LP medio), poi ricalibrazione SCORE2-OP.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var calibration = isNode ? require('./calibration.js') : root.ESCScore.calibration;

  var COEF = {
    male: {
      age: 0.0634, diabetes: 0.4245, smoking: 0.3524, sbp: 0.0094, tc: 0.0850, hdl: -0.3564,
      ageDiabetes: -0.0174, ageSmoking: -0.0247, ageSbp: -0.0005, ageTc: 0.0073, ageHdl: 0.0091,
      s0: 0.7576, meanLp: 0.0929
    },
    female: {
      age: 0.0789, diabetes: 0.6010, smoking: 0.4921, sbp: 0.0102, tc: 0.0605, hdl: -0.3040,
      ageDiabetes: -0.0107, ageSmoking: -0.0255, ageSbp: -0.0004, ageTc: -0.0009, ageHdl: 0.0154,
      s0: 0.8082, meanLp: 0.229
    }
  };

  /**
   * @param {{age:number, sex:'male'|'female', smoker:boolean, diabetes:boolean, sbp:number,
   *          totalChol:number, hdl:number, region:string}} p  (colesterolo in mmol/L)
   * @returns {{uncalibrated:number, risk:number, linearPredictor:number}} rischi 0–1
   */
  function compute(p) {
    var c = COEF[p.sex];
    if (!c) throw new Error('Sesso non valido: ' + p.sex);
    var a = p.age - 73;
    var s = p.sbp - 150;
    var t = p.totalChol - 6;
    var h = p.hdl - 1.4;
    var smk = p.smoker ? 1 : 0;
    var dm = p.diabetes ? 1 : 0;

    var lp = c.age * a + c.diabetes * dm + c.smoking * smk + c.sbp * s + c.tc * t + c.hdl * h +
      c.ageDiabetes * a * dm + c.ageSmoking * a * smk + c.ageSbp * a * s +
      c.ageTc * a * t + c.ageHdl * a * h;

    var uncalibrated = 1 - Math.pow(c.s0, Math.exp(lp - c.meanLp));
    var scales = calibration.getScales(calibration.SCORE2_OP_SCALES, p.region || 'low', p.sex);
    return { uncalibrated: uncalibrated, risk: calibration.calibrate(uncalibrated, scales), linearPredictor: lp };
  }

  var api = { COEF: COEF, compute: compute };
  if (isNode) module.exports = api;
  else root.ESCScore.score2op = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
