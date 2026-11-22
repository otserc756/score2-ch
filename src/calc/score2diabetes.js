/*
 * SCORE2-Diabetes (40–69 anni, diabete tipo 2 senza ASCVD né danno d'organo severo).
 * Fonte: SCORE2-Diabetes working group, Eur Heart J 2023;44:2544-2556.
 * Coefficienti verificati su RiskScorescvd ed esempi ESC.
 *
 * Variabili centrate come SCORE2, più:
 *   cdmage=(età alla diagnosi-50)/5; chba1c=(HbA1c mmol/mol-31)/9.34;
 *   cegfr=(ln(eGFR)-4.5)/0.15; diabete=1.
 * Nei termini di interazione "età" = cage. Ricalibrazione con le scale di SCORE2.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var calibration = isNode ? require('./calibration.js') : root.ESCScore.calibration;

  var COEF = {
    male: {
      age: 0.5368, smoking: 0.4774, sbp: 0.1322, diabetes: 0.6457, tc: 0.1102, hdl: -0.1087,
      ageSmoking: -0.0672, ageSbp: -0.0268, ageDiabetes: -0.0983, ageTc: -0.0181, ageHdl: 0.0095,
      diabetesAgeDx: -0.0998, hba1c: 0.0955, egfr: -0.0591, egfr2: 0.0058,
      hba1cAge: -0.0134, egfrAge: 0.0115,
      s0: 0.9605
    },
    female: {
      age: 0.6624, smoking: 0.6139, sbp: 0.1421, diabetes: 0.8096, tc: 0.1127, hdl: -0.1568,
      ageSmoking: -0.1122, ageSbp: -0.0167, ageDiabetes: -0.1272, ageTc: -0.0200, ageHdl: 0.0186,
      diabetesAgeDx: -0.118, hba1c: 0.1173, egfr: -0.0640, egfr2: 0.0062,
      hba1cAge: -0.0196, egfrAge: 0.0169,
      s0: 0.9776
    }
  };

  /**
   * @param {{age:number, sex:'male'|'female', smoker:boolean, sbp:number, totalChol:number,
   *          hdl:number, ageAtDiagnosis:number, hba1c:number, egfr:number, region:string}} p
   *        colesterolo in mmol/L, HbA1c in mmol/mol, eGFR in mL/min/1.73 m²
   * @returns {{uncalibrated:number, risk:number, linearPredictor:number}} rischi 0–1
   */
  function compute(p) {
    var c = COEF[p.sex];
    if (!c) throw new Error('Sesso non valido: ' + p.sex);
    var cage = (p.age - 60) / 5;
    var csbp = (p.sbp - 120) / 20;
    var ctc = p.totalChol - 6;
    var chdl = (p.hdl - 1.3) / 0.5;
    var cdmage = (p.ageAtDiagnosis - 50) / 5;
    var chba1c = (p.hba1c - 31) / 9.34;
    var cegfr = (Math.log(p.egfr) - 4.5) / 0.15;
    var smk = p.smoker ? 1 : 0;
    var dm = 1;

    var lp = c.age * cage + c.smoking * smk + c.sbp * csbp + c.diabetes * dm +
      c.tc * ctc + c.hdl * chdl +
      c.ageSmoking * cage * smk + c.ageSbp * cage * csbp + c.ageDiabetes * cage * dm +
      c.ageTc * cage * ctc + c.ageHdl * cage * chdl +
      c.diabetesAgeDx * dm * cdmage + c.hba1c * chba1c + c.egfr * cegfr + c.egfr2 * cegfr * cegfr +
      c.hba1cAge * chba1c * cage + c.egfrAge * cegfr * cage;

    var uncalibrated = 1 - Math.pow(c.s0, Math.exp(lp));
    var scales = calibration.getScales(calibration.SCORE2_SCALES, p.region || 'low', p.sex);
    return { uncalibrated: uncalibrated, risk: calibration.calibrate(uncalibrated, scales), linearPredictor: lp };
  }

  var api = { COEF: COEF, compute: compute };
  if (isNode) module.exports = api;
  else root.ESCScore.score2diabetes = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
