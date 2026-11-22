/*
 * Fonti citate nei promemoria per il medico. Indipendenti dalla lingua.
 * Quando una linea guida cambia: aggiornare qui la fonte e, nei file reminders.<lingua>.js,
 * le voci che la citano.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var SOURCES = {
    esc2019lip: {
      label: 'ESC/EAS 2019 Dislipidemie',
      cite: 'Mach F et al. Eur Heart J 2020;41:111-188',
      url: 'https://doi.org/10.1093/eurheartj/ehz455'
    },
    esc2021prev: {
      label: 'ESC 2021 Prevenzione CV',
      cite: 'Visseren FLJ et al. Eur Heart J 2021;42:3227-3337',
      url: 'https://doi.org/10.1093/eurheartj/ehab484'
    },
    esc2023dm: {
      label: 'ESC 2023 Diabete',
      cite: 'Marx N et al. Eur Heart J 2023;44:4043-4140',
      url: 'https://doi.org/10.1093/eurheartj/ehad192'
    },
    esc2024htn: {
      label: 'ESC 2024 Ipertensione',
      cite: 'McEvoy JW et al. Eur Heart J 2024;45:3912-4018',
      url: 'https://doi.org/10.1093/eurheartj/ehae178'
    },
    esc2025lip: {
      label: 'ESC/EAS 2025 Aggiornamento dislipidemie',
      cite: 'Mach F et al. Eur Heart J 2025;46:4359',
      url: 'https://academic.oup.com/eurheartj/article/46/42/4359/8234482'
    },
    esc2026ckd: {
      label: 'ESC/ERA 2026 Malattia CV e IRC',
      cite: 'Eur Heart J 2026, doi:10.1093/eurheartj/ehag098',
      url: 'https://doi.org/10.1093/eurheartj/ehag098'
    }
  };

  if (isNode) module.exports = SOURCES;
  else {
    var NS = (root.ESCScore = root.ESCScore || {});
    NS.reminders = NS.reminders || {};
    NS.reminders.sources = SOURCES;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
