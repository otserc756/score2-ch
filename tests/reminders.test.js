(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var S = L.reminders.sources;

  ['it', 'de'].forEach(function (lang) {
    var R = L.reminders[lang];

    test('Promemoria ' + lang + ': ogni fonte citata esiste in sources.js', function () {
      R.sections.forEach(function (sec) {
        sec.items.forEach(function (item) {
          item.sources.forEach(function (key) { assert.ok(S[key], sec.id + ': fonte sconosciuta ' + key); });
        });
      });
    });

    test('Promemoria ' + lang + ': ogni sezione ha titolo e voci', function () {
      assert.ok(R.sections.length > 0);
      R.sections.forEach(function (sec) {
        assert.ok(sec.id && sec.title, 'sezione senza id o titolo');
        assert.ok(sec.items.length > 0, sec.id + ' vuota');
        sec.items.forEach(function (item) { assert.ok(item.text && item.text.length > 10, sec.id + ': testo mancante'); });
      });
    });
  });
})();
