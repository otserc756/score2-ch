/*
 * Controlla che il service worker metta in cache tutti i file usati da index.html
 * (altrimenti l'app non funzionerebbe offline). Solo in Node: legge i file dal disco.
 */
(function () {
  'use strict';
  if (typeof require !== 'function') return;
  var h = require('./harness.js');
  var test = h.test, assert = h.assert;
  var fs = require('node:fs');
  var path = require('node:path');
  var ROOT = path.join(__dirname, '..');

  function read(f) { return fs.readFileSync(path.join(ROOT, f), 'utf8'); }

  var html = read('index.html');
  var sw = read('sw.js');
  var listMatch = sw.match(/const FILES = \[([\s\S]*?)\];/);
  var files = listMatch ? (listMatch[1].match(/'([^']+)'/g) || []).map(function (s) { return s.slice(1, -1); }) : [];
  var manifest = JSON.parse(read('manifest.webmanifest'));

  test('PWA: il service worker elenca i file da mettere in cache', function () {
    assert.ok(files.length > 20, 'elenco FILES non trovato in sw.js');
  });

  test('PWA: ogni script e foglio di stile di index.html è nella cache del service worker', function () {
    var refs = [];
    html.replace(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g, function (m, ref) { refs.push(ref); return m; });
    assert.ok(refs.length > 20);
    refs.forEach(function (ref) { assert.ok(files.indexOf(ref) >= 0, 'manca in sw.js: ' + ref); });
  });

  test('PWA: tutti i file in cache esistono', function () {
    files.filter(function (f) { return f !== './'; }).forEach(function (f) {
      assert.ok(fs.existsSync(path.join(ROOT, f)), 'file inesistente: ' + f);
    });
  });

  test('PWA: le icone del manifest esistono e sono in cache', function () {
    manifest.icons.forEach(function (icon) {
      assert.ok(fs.existsSync(path.join(ROOT, icon.src)), icon.src);
      assert.ok(files.indexOf(icon.src) >= 0, 'icona non in cache: ' + icon.src);
    });
  });

  test('PWA: start_url e scope relativi (funziona in una sottocartella di GitHub Pages)', function () {
    assert.equal(manifest.start_url, './');
    assert.equal(manifest.scope, './');
  });
})();
