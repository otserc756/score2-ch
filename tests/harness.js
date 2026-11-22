/*
 * Piccolo strato comune per i test: gli stessi file di test girano
 *  - in Node con node:test  →  `node --test`
 *  - nel browser            →  aprire tests/index.html (anche da file://, senza Node)
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  function nearMessage(actual, expected, tol, msg) {
    return (msg ? msg + ': ' : '') + 'atteso ' + expected + ' ± ' + tol + ', ottenuto ' + actual;
  }

  if (isNode) {
    var nodeTest = require('node:test');
    var nodeAssert = require('node:assert/strict');
    var assert = Object.create(nodeAssert);
    assert.near = function (actual, expected, tol, msg) {
      nodeAssert.ok(Math.abs(actual - expected) <= tol, nearMessage(actual, expected, tol, msg));
    };
    module.exports = {
      test: nodeTest.test,
      assert: assert,
      lib: {
        calibration: require('../src/calc/calibration.js'),
        score2: require('../src/calc/score2.js'),
        score2op: require('../src/calc/score2op.js'),
        score2diabetes: require('../src/calc/score2diabetes.js'),
        units: require('../src/calc/units.js'),
        egfr: require('../src/calc/egfr.js'),
        age: require('../src/calc/age.js'),
        risk: require('../src/calc/risk.js'),
        categories: require('../src/calc/categories.js'),
        checklist: require('../src/calc/checklist.js'),
        whatif: require('../src/calc/whatif.js'),
        assessment: require('../src/calc/assessment.js')
      }
    };
    return;
  }

  // --- Browser ---
  var tests = [];

  function fail(msg) { throw new Error(msg); }
  var browserAssert = {
    ok: function (v, m) { if (!v) fail(m || 'atteso un valore vero'); },
    equal: function (a, b, m) { if (a !== b) fail((m ? m + ': ' : '') + 'atteso ' + JSON.stringify(b) + ', ottenuto ' + JSON.stringify(a)); },
    deepEqual: function (a, b, m) {
      var ja = JSON.stringify(a), jb = JSON.stringify(b);
      if (ja !== jb) fail((m ? m + ': ' : '') + 'atteso ' + jb + ', ottenuto ' + ja);
    },
    throws: function (fn, m) {
      var threw = false;
      try { fn(); } catch (e) { threw = true; }
      if (!threw) fail(m || 'attesa un\'eccezione');
    },
    near: function (actual, expected, tol, msg) {
      if (!(Math.abs(actual - expected) <= tol)) fail(nearMessage(actual, expected, tol, msg));
    }
  };

  function run(container) {
    var passed = 0, failed = 0, lines = [];
    tests.forEach(function (t) {
      try { t.fn(); passed++; lines.push({ ok: true, name: t.name }); }
      catch (e) { failed++; lines.push({ ok: false, name: t.name, error: e.message }); }
    });
    if (container) {
      var summary = document.createElement('p');
      summary.className = failed ? 'summary fail' : 'summary pass';
      summary.textContent = (failed ? '✗ ' : '✓ ') + passed + ' superati, ' + failed + ' falliti, ' + tests.length + ' in totale';
      container.appendChild(summary);
      var ul = document.createElement('ul');
      lines.forEach(function (l) {
        var li = document.createElement('li');
        li.className = l.ok ? 'pass' : 'fail';
        li.textContent = (l.ok ? '✓ ' : '✗ ') + l.name + (l.error ? ' — ' + l.error : '');
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
    return { passed: passed, failed: failed, total: tests.length, results: lines };
  }

  root.ESCTest = {
    test: function (name, fn) { tests.push({ name: name, fn: fn }); },
    assert: browserAssert,
    lib: root.ESCScore,
    run: run
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
