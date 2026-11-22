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
      label: { it: 'ESC/EAS 2019 Dislipidemie', de: 'ESC/EAS 2019 Dyslipidämien' },
      cite: 'Mach F et al. Eur Heart J 2020;41:111-188',
      url: 'https://doi.org/10.1093/eurheartj/ehz455'
    },
    esc2021prev: {
      label: { it: 'ESC 2021 Prevenzione CV', de: 'ESC 2021 Kardiovaskuläre Prävention' },
      cite: 'Visseren FLJ et al. Eur Heart J 2021;42:3227-3337',
      url: 'https://doi.org/10.1093/eurheartj/ehab484'
    },
    esc2023dm: {
      label: { it: 'ESC 2023 Diabete', de: 'ESC 2023 Diabetes' },
      cite: 'Marx N et al. Eur Heart J 2023;44:4043-4140',
      url: 'https://doi.org/10.1093/eurheartj/ehad192'
    },
    esc2024htn: {
      label: { it: 'ESC 2024 Ipertensione', de: 'ESC 2024 Hypertonie' },
      cite: 'McEvoy JW et al. Eur Heart J 2024;45:3912-4018',
      url: 'https://doi.org/10.1093/eurheartj/ehae178'
    },
    esc2025lip: {
      label: { it: 'ESC/EAS 2025 Aggiornamento dislipidemie', de: 'ESC/EAS 2025 Update Dyslipidämien' },
      cite: 'Mach F et al. Eur Heart J 2025;46:4359',
      url: 'https://academic.oup.com/eurheartj/article/46/42/4359/8234482'
    },
    esc2026ckd: {
      label: { it: 'ESC/ERA 2026 Malattia CV e IRC', de: 'ESC/ERA 2026 Kardiovaskuläre Erkrankung und CKD' },
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
