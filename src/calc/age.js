/*
 * Date in formato svizzero (gg.mm.aaaa) ed età in anni compiuti.
 * Le date sono oggetti semplici {year, month, day} per evitare problemi di fuso orario.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  function isLeapYear(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }

  function daysInMonth(y, m) {
    return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  }

  /**
   * Interpreta "gg.mm.aaaa" (anche "g.m.aaaa"; accetta pure "/" o "-" come separatori).
   * Restituisce null se la data non esiste (es. 31.02.2020) o il formato non è valido.
   */
  function parseSwissDate(text) {
    if (typeof text !== 'string') return null;
    var m = text.trim().match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
    if (!m) return null;
    var day = +m[1], month = +m[2], year = +m[3];
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
    return { year: year, month: month, day: day };
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function formatSwissDate(d) {
    return pad2(d.day) + '.' + pad2(d.month) + '.' + d.year;
  }

  /** Data locale di oggi. */
  function today() {
    var now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  function compare(a, b) {
    return (a.year - b.year) || (a.month - b.month) || (a.day - b.day);
  }

  /**
   * Età in anni compiuti alla data della visita. Il giorno del compleanno conta già.
   * Chi è nato il 29 febbraio compie gli anni il 1° marzo negli anni non bisestili.
   * Restituisce null se la visita precede la nascita.
   */
  function ageInYears(birth, visit) {
    if (compare(visit, birth) < 0) return null;
    var age = visit.year - birth.year;
    if (visit.month < birth.month || (visit.month === birth.month && visit.day < birth.day)) age--;
    return age;
  }

  var api = {
    parseSwissDate: parseSwissDate,
    formatSwissDate: formatSwissDate,
    today: today,
    compare: compare,
    ageInYears: ageInYears,
    isLeapYear: isLeapYear
  };

  if (isNode) module.exports = api;
  else (root.ESCScore = root.ESCScore || {}).age = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
