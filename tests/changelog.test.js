/*
 * La versione dell'app deve avere le sue note in CHANGELOG.md (solo in Node: legge i file).
 */
(function () {
  'use strict';
  if (typeof require !== 'function') return;
  var h = require('./harness.js');
  var test = h.test, assert = h.assert;
  var fs = require('node:fs');
  var path = require('node:path');
  var ROOT = path.join(__dirname, '..');

  var version = fs.readFileSync(path.join(ROOT, 'src/version.js'), 'utf8').match(/app: '([^']+)'/)[1];
  var changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  var pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

  test('Versione: src/version.js e package.json coincidono', function () {
    assert.equal(pkg.version, version);
  });

  test('Versione: CHANGELOG.md ha le note della versione corrente, in cima', function () {
    var first = changelog.match(/^## \[([^\]]+)\]/m);
    assert.ok(first, 'nessuna versione in CHANGELOG.md');
    assert.equal(first[1], version);
  });
})();
