/*
 * Hinweise für die Ärztin / den Arzt (Deutsch, Schweizer Schreibweise ohne Eszett).
 * Gleiche Struktur und Quellen wie reminders.it.js.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var REMINDERS = {
    updated: '22.11.2026',
    sections: [
      {
        id: 'veryHighNoScore',
        title: 'Sehr hohes Risiko ohne Score',
        items: [
          {
            text: 'Klinisch dokumentierte ASCVD (ACS, Revaskularisation, Schlaganfall/TIA, periphere arterielle Verschlusskrankheit, Aortenaneurysma) oder eindeutig in der Bildgebung (signifikante Plaque in Koronarangiografie/Koronar-CT oder Karotis-Ultraschall).',
            sources: ['esc2021prev']
          },
          {
            text: 'Diabetes Typ 2 mit ASCVD oder schwerem Endorganschaden: eGFR < 45; eGFR 45–59 mit Mikroalbuminurie (UACR 3–30 mg/mmol = 30–300 mg/g); Proteinurie (UACR > 30 mg/mmol = > 300 mg/g); mikrovaskuläre Erkrankung in ≥ 3 Organen (z. B. Mikroalbuminurie + Retinopathie + Neuropathie).',
            sources: ['esc2023dm']
          },
          {
            text: 'Schwere Nierenkrankheit: eGFR < 30 bei jeder Albuminurie; eGFR 30–44 mit ACR 3–30 mg/mmol (30–300 mg/g); ACR > 30 mg/mmol (> 300 mg/g) bei jeder eGFR.',
            sources: ['esc2026ckd']
          },
          {
            text: 'Familiäre Hypercholesterinämie mit ASCVD oder einem weiteren Hauptrisikofaktor.',
            sources: ['esc2019lip']
          }
        ]
      },
      {
        id: 'high',
        title: 'Hohes Risiko',
        items: [
          {
            text: 'Mittelschwere Nierenkrankheit: eGFR 30–44 mit ACR < 3 mg/mmol (< 30 mg/g); eGFR 45–59 mit ACR 3–30 mg/mmol (30–300 mg/g).',
            sources: ['esc2026ckd']
          },
          {
            text: 'Familiäre Hypercholesterinämie ohne weitere Hauptrisikofaktoren.',
            sources: ['esc2019lip']
          },
          {
            text: 'Einzelner stark erhöhter Risikofaktor: Gesamtcholesterin > 8 mmol/L, LDL > 4.9 mmol/L, Blutdruck ≥ 180/110 mmHg.',
            sources: ['esc2019lip', 'esc2021prev']
          }
        ]
      },
      {
        id: 'hmod',
        title: 'Hypertensiver Endorganschaden (HMOD)',
        items: [
          { text: 'Linksventrikuläre Hypertrophie im EKG oder in der Echokardiografie (geschlechtsspezifische Kriterien).', sources: ['esc2024htn'] },
          { text: 'eGFR < 60 mL/min/1.73 m² oder Albuminurie ≥ 3 mg/mmol (≥ 30 mg/g).', sources: ['esc2024htn'] },
          { text: 'Hypertensive Retinopathie in der Fundoskopie.', sources: ['esc2024htn'] },
          { text: 'Koronarkalk > 100 AU oder ≥ 75. Perzentile für Alter und Geschlecht.', sources: ['esc2024htn'] },
          { text: 'Karotisplaque (Dicke ≥ 1.5 mm).', sources: ['esc2024htn'] },
          { text: 'Arterielle Steifigkeit: karotido-femorale PWV > 10 m/s (oder brachio-knöchel > 14 m/s).', sources: ['esc2024htn'] },
          { text: 'Knöchel-Arm-Index < 0.9: spricht für eine periphere arterielle Verschlusskrankheit, also ASCVD (sehr hohes Risiko).', sources: ['esc2021prev'] }
        ]
      },
      {
        id: 'modifiers',
        title: 'Risikomodifikatoren (nützlich nahe einer Schwelle oder bei moderatem Risiko)',
        items: [
          { text: 'Familienanamnese für frühe kardiovaskuläre Erkrankung (Verwandte 1. Grades: Mann < 55 Jahre, Frau < 60 Jahre).', sources: ['esc2021prev', 'esc2025lip'] },
          { text: 'Lp(a) > 50 mg/dL (≥ 105 nmol/L). Bei allen Erwachsenen mindestens einmal im Leben bestimmen. Werte > 180 mg/dL (> 430 nmol/L) bedeuten ein Risiko ähnlich wie bei heterozygoter familiärer Hypercholesterinämie.', sources: ['esc2025lip', 'esc2019lip'] },
          { text: 'hs-CRP anhaltend > 2 mg/L.', sources: ['esc2025lip'] },
          { text: 'Subklinische Atherosklerose in der Bildgebung oder erhöhter Koronarkalk (unter Statinen mit Vorsicht interpretieren).', sources: ['esc2021prev', 'esc2025lip'] },
          { text: 'Chronisch-entzündliche oder immunvermittelte Erkrankungen, HIV, schwere psychische Erkrankungen, obstruktive Schlafapnoe.', sources: ['esc2021prev', 'esc2024htn', 'esc2025lip'] },
          { text: 'Frauenspezifische Faktoren: Präeklampsie, Schwangerschaftshypertonie oder -diabetes, Frühgeburt, frühe Menopause.', sources: ['esc2021prev', 'esc2024htn'] },
          { text: 'Ethnische Herkunft mit hohem Risiko (z. B. Südasien).', sources: ['esc2021prev', 'esc2024htn'] },
          { text: 'Tiefer sozioökonomischer Status, psychosozialer Stress, Adipositas, körperliche Inaktivität, Gebrechlichkeit.', sources: ['esc2021prev', 'esc2025lip'] }
        ]
      },
      {
        id: 'targets',
        title: 'Therapieziele',
        items: [
          { text: 'LDL bei sehr hohem Risiko: < 1.4 mmol/L und Senkung ≥ 50% gegenüber dem Ausgangswert. Bei einem zweiten vaskulären Ereignis innerhalb von 2 Jahren trotz maximaler Statintherapie kann < 1.0 mmol/L erwogen werden.', sources: ['esc2019lip', 'esc2025lip'] },
          { text: 'LDL bei hohem Risiko: < 1.8 mmol/L und Senkung ≥ 50%.', sources: ['esc2019lip', 'esc2025lip'] },
          { text: 'LDL bei moderatem Risiko: < 2.6 mmol/L. Bei niedrigem Risiko: < 3.0 mmol/L.', sources: ['esc2019lip', 'esc2025lip'] },
          { text: 'Sekundäre Non-HDL-Zielwerte: sehr hoch < 2.2, hoch < 2.6, moderat < 3.4, niedrig < 3.8 mmol/L.', sources: ['esc2019lip', 'dimUsz2026'] },
          { text: 'SCORE2 niedrig bis moderat: Eine Behandlung der Risikofaktoren wird im Allgemeinen nicht empfohlen, und die Leitlinie 2021 legt keinen expliziten LDL-Zielwert fest; in der Praxis < 2.6 mmol/L (< 3.0 bei niedrigem Risiko).', sources: ['esc2021prev', 'esc2019lip'] },
          { text: 'Blutdruck: systolisch 120–129 mmHg, falls toleriert, bestätigt mit Messungen ausserhalb der Praxis; sonst so tief wie vernünftigerweise erreichbar. Weniger strenge Ziele bei symptomatischer orthostatischer Hypotonie, Alter ≥ 85 Jahre, mittelschwerer bis schwerer Gebrechlichkeit oder begrenzter Lebenserwartung.', sources: ['esc2024htn'] },
          { text: '"Erhöhter" Blutdruck (120–139/70–89 mmHg): Medikamente erwägen bei hohem Risiko (Nierenkrankheit, kardiovaskuläre Erkrankung, HMOD, familiäre Hypercholesterinämie, Diabetes) oder wenn SCORE2/SCORE2-OP ≥ 10% ist.', sources: ['esc2024htn'] },
          { text: 'Rauchen: vollständiger Rauchstopp.', sources: ['esc2021prev'] },
          { text: 'Statin unabhängig von den Lipidwerten bei Nierenkrankheit mit eGFR < 60 ohne Nierenersatztherapie und bei Menschen mit HIV ab 40 Jahren.', sources: ['esc2026ckd', 'esc2025lip'] }
        ]
      },
      {
        id: 'scoreNotes',
        title: 'Wann der Score angewendet wird',
        items: [
          { text: 'SCORE2 (40–69 Jahre) und SCORE2-OP (70–89 Jahre): Personen ohne bekannte kardiovaskuläre Erkrankung. Der Score wird bei ASCVD nicht angewendet und ist bei bereits laufender lipidsenkender Therapie mit Vorsicht zu interpretieren.', sources: ['esc2021prev', 'esc2025lip'] },
          { text: 'SCORE2-Diabetes: Diabetes Typ 2 ohne ASCVD und ohne schweren Endorganschaden, 40–69 Jahre.', sources: ['esc2023dm'] },
          { text: 'Kategoriengrenzen: Die App verwendet die altersabhängigen Grenzwerte von ESC 2021, wie AGLA 2025, die USZ-Guideline 2026 und der ESC-Rechner HeartScore. Das Update ESC/EAS 2025 verwendet dagegen fixe Grenzwerte (< 2%, 2–< 10%, 10–< 20%, ≥ 20%), die durch Verdoppelung der alten SCORE-Grenzen entstanden und für SCORE2 nicht validiert sind. Weichen die beiden Einteilungen ab, zeigt die App dies an; zusätzlich das Lebenszeitrisiko (LIFE-CVD2) und die Risikomodifikatoren berücksichtigen.', sources: ['esc2021prev', 'esc2025lip', 'dimUsz2026'] },
          { text: 'Die Szenarien "Was ändert sich, wenn…" sind orientierende Schätzungen: Das Modell sagt das Risiko von Personen mit diesen Werten vorher, nicht die Wirkung einer Intervention.', sources: [] }
        ]
      }
    ]
  };

  if (isNode) module.exports = REMINDERS;
  else {
    var NS = (root.ESCScore = root.ESCScore || {});
    NS.reminders = NS.reminders || {};
    NS.reminders.de = REMINDERS;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
