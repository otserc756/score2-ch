/*
 * "Cosa cambia se…": ricalcolo del rischio modificando un fattore alla volta, più lo
 * scenario con tutti i cambiamenti insieme.
 *
 * ATTENZIONE: stime indicative. I modelli SCORE2 predicono il rischio di una persona con
 * quei valori; non sono stati costruiti per stimare l'effetto di un intervento.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var risk = isNode ? require('./risk.js') : NS.risk;
  var categories = isNode ? require('./categories.js') : NS.categories;

  var TARGET_SBP = 130;          // mmHg
  var TC_REDUCTION = 1;          // mmol/L
  var TARGET_HBA1C = 53;         // mmol/mol (7%)

  /** Scenari applicabili al paziente (input normalizzato come in risk.calculate). */
  function applicableChanges(input, model) {
    var list = [];
    if (input.smoker) list.push({ id: 'quitSmoking', patch: { smoker: false } });
    if (input.sbp > TARGET_SBP) list.push({ id: 'sbp130', patch: { sbp: TARGET_SBP } });
    if (input.totalChol - TC_REDUCTION > input.hdl) {
      list.push({ id: 'tcMinus1', patch: { totalChol: input.totalChol - TC_REDUCTION } });
    }
    if (model === risk.MODELS.SCORE2_DIABETES && input.hba1c > TARGET_HBA1C) {
      list.push({ id: 'hba1c53', patch: { hba1c: TARGET_HBA1C } });
    }
    return list;
  }

  /**
   * @param {object} input input normalizzato
   * @returns {{basePercent:number, scenarios:Array<{id:string, percent:number, deltaPoints:number}>}|null}
   *          null se il calcolo di base non è possibile
   */
  function scenarios(input) {
    var base = risk.calculate(input);
    if (!base.ok) return null;
    var basePct = categories.roundPercent(base.risk);
    var changes = applicableChanges(input, base.model);

    function run(id, patch) {
      var r = risk.calculate(Object.assign({}, input, patch));
      if (!r.ok) return null;
      var pct = categories.roundPercent(r.risk);
      return { id: id, percent: pct, deltaPoints: Math.round((pct - basePct) * 10) / 10 };
    }

    var out = changes.map(function (c) { return run(c.id, c.patch); }).filter(Boolean);
    if (changes.length >= 2) {
      var all = changes.reduce(function (acc, c) { return Object.assign(acc, c.patch); }, {});
      var combined = run('all', all);
      if (combined) out.push(combined);
    }
    return { basePercent: basePct, model: base.model, scenarios: out };
  }

  var api = {
    TARGET_SBP: TARGET_SBP,
    TC_REDUCTION: TC_REDUCTION,
    TARGET_HBA1C: TARGET_HBA1C,
    applicableChanges: applicableChanges,
    scenarios: scenarios
  };

  if (isNode) module.exports = api;
  else NS.whatif = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
