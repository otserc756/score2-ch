/*
 * Calibrazione regionale dei modelli SCORE2, SCORE2-Diabetes e SCORE2-OP.
 *
 * Fonti:
 * - SCORE2 working group and ESC Cardiovascular risk collaboration.
 *   Eur Heart J 2021;42:2439-2454. doi:10.1093/eurheartj/ehab309
 * - SCORE2-OP working group and ESC Cardiovascular risk collaboration.
 *   Eur Heart J 2021;42:2455-2467. doi:10.1093/eurheartj/ehab312
 * - SCORE2-Diabetes working group and ESC Cardiovascular risk collaboration.
 *   Eur Heart J 2023;44:2544-2556. doi:10.1093/eurheartj/ehad260
 * - Coefficienti verificati sul pacchetto R RiskScorescvd e sugli esempi ESC.
 *
 * Rischio calibrato = 1 - exp(-exp(scale1 + scale2 * ln(-ln(1 - rischio non calibrato))))
 *
 * Funziona sia nel browser (window.ESCScore.calibration) sia in Node (require).
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var REGIONS = ['low', 'moderate', 'high', 'veryHigh'];

  // [scale1, scale2] per SCORE2 e SCORE2-Diabetes
  var SCORE2_SCALES = {
    low:      { male: [-0.5699, 0.7476], female: [-0.7380, 0.7019] },
    moderate: { male: [-0.1565, 0.8009], female: [-0.3143, 0.7701] },
    high:     { male: [ 0.3207, 0.9360], female: [ 0.5710, 0.9369] },
    veryHigh: { male: [ 0.5836, 0.8294], female: [ 0.9412, 0.8329] }
  };

  // [scale1, scale2] per SCORE2-OP
  var SCORE2_OP_SCALES = {
    low:      { male: [-0.34, 1.19], female: [-0.52, 1.01] },
    moderate: { male: [ 0.01, 1.25], female: [-0.10, 1.10] },
    high:     { male: [ 0.08, 1.15], female: [ 0.38, 1.09] },
    veryHigh: { male: [ 0.05, 0.70], female: [ 0.38, 0.69] }
  };

  function getScales(table, region, sex) {
    if (!table[region]) throw new Error('Regione di rischio sconosciuta: ' + region);
    if (sex !== 'male' && sex !== 'female') throw new Error('Sesso non valido: ' + sex);
    return table[region][sex];
  }

  /** Applica la ricalibrazione regionale a un rischio non calibrato (0–1). */
  function calibrate(uncalibrated, scales) {
    var s1 = scales[0], s2 = scales[1];
    return 1 - Math.exp(-Math.exp(s1 + s2 * Math.log(-Math.log(1 - uncalibrated))));
  }

  var api = {
    REGIONS: REGIONS,
    SCORE2_SCALES: SCORE2_SCALES,
    SCORE2_OP_SCALES: SCORE2_OP_SCALES,
    getScales: getScales,
    calibrate: calibrate
  };

  if (isNode) module.exports = api;
  else (root.ESCScore = root.ESCScore || {}).calibration = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
