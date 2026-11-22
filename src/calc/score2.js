/*
 * SCORE2 (40–69 anni, senza diabete): rischio a 10 anni di eventi CV fatali e non fatali.
 * Fonte: SCORE2 working group, Eur Heart J 2021;42:2439-2454 (tabella dei coefficienti
 * nel materiale supplementare). Coefficienti verificati su RiskScorescvd ed esempi ESC.
 *
 * Variabili centrate: cage=(età-60)/5; csbp=(PAS-120)/20; ctc=CT-6; chdl=(HDL-1.3)/0.5
 * Rischio non calibrato = 1 - S0^exp(LP), poi ricalibrazione regionale.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var calibration = isNode ? require('./calibration.js') : root.ESCScore.calibration;

  var COEF = {
    male: {
      age: 0.3742, smoking: 0.6012, sbp: 0.2777, diabetes: 0.6457, tc: 0.1458, hdl: -0.2698,
      ageSmoking: -0.0755, ageSbp: -0.0255, ageTc: -0.0281, ageHdl: 0.0426, ageDiabetes: -0.0983,
      s0: 0.9605
    },
    female: {
      age: 0.4648, smoking: 0.7744, sbp: 0.3131, diabetes: 0.8096, tc: 0.1002, hdl: -0.2606,
      ageSmoking: -0.1088, ageSbp: -0.0277, ageTc: -0.0226, ageHdl: 0.0613, ageDiabetes: -0.1272,
      s0: 0.9776
    }
  };

  /**
   * @param {{age:number, sex:'male'|'female', smoker:boolean, sbp:number,
   *          totalChol:number, hdl:number, region:string}} p  (colesterolo in mmol/L)
   * @returns {{uncalibrated:number, risk:number, linearPredictor:number}} rischi 0–1
   */
  function compute(p) {
    var c = COEF[p.sex];
    if (!c) throw new Error('Sesso non valido: ' + p.sex);
    var cage = (p.age - 60) / 5;
    var csbp = (p.sbp - 120) / 20;
    var ctc = p.totalChol - 6;
    var chdl = (p.hdl - 1.3) / 0.5;
    var smk = p.smoker ? 1 : 0;
    var dm = p.diabetes ? 1 : 0; // nel modello pubblicato; l'app usa SCORE2 solo senza diabete

    var lp = c.age * cage + c.smoking * smk + c.sbp * csbp + c.diabetes * dm +
      c.tc * ctc + c.hdl * chdl +
      c.ageSmoking * cage * smk + c.ageSbp * cage * csbp + c.ageTc * cage * ctc +
      c.ageHdl * cage * chdl + c.ageDiabetes * cage * dm;

    var uncalibrated = 1 - Math.pow(c.s0, Math.exp(lp));
    var scales = calibration.getScales(calibration.SCORE2_SCALES, p.region || 'low', p.sex);
    return { uncalibrated: uncalibrated, risk: calibration.calibrate(uncalibrated, scales), linearPredictor: lp };
  }

  var api = { COEF: COEF, compute: compute };
  if (isNode) module.exports = api;
  else root.ESCScore.score2 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
