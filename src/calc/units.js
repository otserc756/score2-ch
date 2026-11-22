/*
 * Conversioni di unità e valori derivati (non-HDL, LDL di Friedewald).
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var CHOL_MGDL_PER_MMOL = 38.67;   // colesterolo (totale, HDL, LDL)
  var TG_MGDL_PER_MMOL = 88.57;     // trigliceridi
  var CREAT_UMOL_PER_MGDL = 88.4;   // creatinina
  var FRIEDEWALD_MAX_TG = 4.5;      // mmol/L: oltre questa soglia Friedewald non è valido

  /** Legge un numero scritto con virgola o punto decimale ("5,23" o "5.23"). */
  function parseDecimal(value) {
    if (typeof value === 'number') return isFinite(value) ? value : NaN;
    if (value === null || value === undefined) return NaN;
    var s = String(value).trim().replace(/\s+/g, '').replace(',', '.');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
  }

  function cholMgdlToMmol(mgdl) { return mgdl / CHOL_MGDL_PER_MMOL; }
  function cholMmolToMgdl(mmol) { return mmol * CHOL_MGDL_PER_MMOL; }
  function tgMgdlToMmol(mgdl) { return mgdl / TG_MGDL_PER_MMOL; }
  function tgMmolToMgdl(mmol) { return mmol * TG_MGDL_PER_MMOL; }

  /** HbA1c: % (NGSP/DCCT) → mmol/mol (IFCC). mmol/mol = (% − 2.15) × 10.929 */
  function hba1cPercentToMmolMol(percent) { return (percent - 2.15) * 10.929; }
  function hba1cMmolMolToPercent(mmolMol) { return mmolMol / 10.929 + 2.15; }

  function creatinineUmolToMgdl(umol) { return umol / CREAT_UMOL_PER_MGDL; }
  function creatinineMgdlToUmol(mgdl) { return mgdl * CREAT_UMOL_PER_MGDL; }

  /** Colesterolo non-HDL (mmol/L). */
  function nonHdl(totalChol, hdl) { return totalChol - hdl; }

  /**
   * LDL stimato con Friedewald (mmol/L): CT − HDL − TG/2.2.
   * Restituisce null se mancano i trigliceridi o se TG ≥ 4.5 mmol/L.
   */
  function friedewaldLdl(totalChol, hdl, triglycerides) {
    if (triglycerides === null || triglycerides === undefined || !isFinite(triglycerides)) return null;
    if (triglycerides >= FRIEDEWALD_MAX_TG) return null;
    return totalChol - hdl - triglycerides / 2.2;
  }

  var api = {
    CHOL_MGDL_PER_MMOL: CHOL_MGDL_PER_MMOL,
    TG_MGDL_PER_MMOL: TG_MGDL_PER_MMOL,
    CREAT_UMOL_PER_MGDL: CREAT_UMOL_PER_MGDL,
    FRIEDEWALD_MAX_TG: FRIEDEWALD_MAX_TG,
    parseDecimal: parseDecimal,
    cholMgdlToMmol: cholMgdlToMmol,
    cholMmolToMgdl: cholMmolToMgdl,
    tgMgdlToMmol: tgMgdlToMmol,
    tgMmolToMgdl: tgMmolToMgdl,
    hba1cPercentToMmolMol: hba1cPercentToMmolMol,
    hba1cMmolMolToPercent: hba1cMmolMolToPercent,
    creatinineUmolToMgdl: creatinineUmolToMgdl,
    creatinineMgdlToUmol: creatinineMgdlToUmol,
    nonHdl: nonHdl,
    friedewaldLdl: friedewaldLdl
  };

  if (isNode) module.exports = api;
  else (root.ESCScore = root.ESCScore || {}).units = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
