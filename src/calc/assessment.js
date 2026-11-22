/*
 * Valutazione completa: score + categoria + checklist + lipidi derivati + scenari.
 * È il punto d'ingresso che userà l'interfaccia.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var risk = isNode ? require('./risk.js') : NS.risk;
  var categories = isNode ? require('./categories.js') : NS.categories;
  var checklist = isNode ? require('./checklist.js') : NS.checklist;
  var units = isNode ? require('./units.js') : NS.units;
  var whatif = isNode ? require('./whatif.js') : NS.whatif;

  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  /**
   * @param {object} input input normalizzato (vedi risk.js), più facoltativi:
   *   triglycerides, ldlMeasured (mmol/L), dbp (mmHg), acr + acrUnit ('mg/mmol' | 'mg/g')
   * @param {object} checks caselle della checklist (vedi checklist.evaluate)
   */
  function assess(input, checks) {
    var calc = risk.calculate(input);

    var lipids = { nonHdl: null, ldl: null, ldlSource: null };
    if (isNum(input.totalChol) && isNum(input.hdl)) {
      lipids.nonHdl = units.nonHdl(input.totalChol, input.hdl);
      if (isNum(input.ldlMeasured)) {
        lipids.ldl = input.ldlMeasured; lipids.ldlSource = 'measured';
      } else {
        var f = units.friedewaldLdl(input.totalChol, input.hdl, input.triglycerides);
        if (f !== null) { lipids.ldl = f; lipids.ldlSource = 'friedewald'; }
        else if (isNum(input.triglycerides)) lipids.ldlSource = 'friedewaldNotValid';
      }
    }

    var suggestions = checklist.suggest({
      diabetes: input.diabetes, egfr: input.egfr, acr: input.acr, acrUnit: input.acrUnit,
      microvascular3Sites: checks && checks.microvascular3Sites,
      totalChol: input.totalChol, ldl: lipids.ldl, sbp: input.sbp, dbp: input.dbp
    });
    var checked = checklist.evaluate(checks, { diabetes: input.diabetes });

    var score = calc.ok ? categories.fromScore(calc.model, input.age, calc.risk) : null;
    var finalCategory = categories.worst(score && score.category, checked.category);

    return {
      calc: calc,
      score: score,                     // categoria dallo score (null se non calcolabile)
      checklist: checked,               // condizioni spuntate e loro effetto
      suggestions: suggestions,         // caselle che i valori suggeriscono di spuntare
      category: finalCategory,          // categoria finale (la più grave)
      categoryFromConditions: !!checked.category && (!score || categories.RANK[checked.category] > categories.RANK[score.category]),
      ldlTarget: finalCategory ? categories.ldlTarget(finalCategory) : null,
      lipids: lipids,
      whatIf: calc.ok ? whatif.scenarios(input) : null
    };
  }

  var api = { assess: assess };
  if (isNode) module.exports = api;
  else NS.assessment = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
