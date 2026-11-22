/* Texte der Benutzeroberfläche auf Deutsch (Schweizer Schreibweise: immer "ss", nie Eszett). */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var DE = {
    langName: 'Deutsch',
    app: {
      title: 'Kardiovaskuläres 10-Jahres-Risiko',
      subtitle: 'SCORE2 · SCORE2-OP · SCORE2-Diabetes (ESC)',
      disclaimer: 'Hilfsmittel zur klinischen Entscheidungsfindung, kein zertifiziertes Medizinprodukt. Das Ergebnis muss ärztlich beurteilt werden.',
      privacy: 'Alle Berechnungen erfolgen auf diesem Computer. Patientendaten werden weder gespeichert noch übermittelt.'
    },
    actions: {
      newPatient: 'Neuer Patient',
      settings: 'Einstellungen',
      reminders: 'Hinweise',
      close: 'Schliessen',
      apply: 'Übernehmen',
      copy: 'Kopieren',
      copied: 'Kopiert',
      print: 'Patientenblatt drucken'
    },
    sections: {
      patient: 'Patient/in',
      risk: 'Risikofaktoren',
      diabetes: 'Diabetes Typ 2',
      kidney: 'Nierenfunktion',
      more: 'Weitere Werte',
      checklist: 'Vorabkontrolle',
      result: 'Ergebnis',
      whatIf: 'Was ändert sich, wenn…',
      axenita: 'Zeile für die Krankengeschichte'
    },
    fields: {
      firstName: 'Vorname',
      lastName: 'Name',
      birthDate: 'Geburtsdatum',
      visitDate: 'Datum der Konsultation',
      age: 'Alter',
      sex: 'Geschlecht',
      male: 'Mann',
      female: 'Frau',
      smoker: 'Aktuell rauchend',
      diabetes: 'Diabetes Typ 2',
      yes: 'Ja',
      no: 'Nein',
      sbp: 'Systolischer Blutdruck',
      dbp: 'Diastolischer Blutdruck',
      totalChol: 'Gesamtcholesterin',
      hdl: 'HDL-Cholesterin',
      triglycerides: 'Triglyzeride',
      ldlMeasured: 'LDL gemessen',
      lipidUnit: 'Einheit der Lipide',
      ageAtDiagnosis: 'Alter bei Diagnose',
      hba1c: 'HbA1c',
      egfr: 'eGFR',
      egfrFromCreatinine: 'eGFR aus Kreatinin berechnen (CKD-EPI 2021)',
      creatinine: 'Kreatinin',
      acr: 'Albumin/Kreatinin im Urin (ACR)',
      region: 'Region'
    },
    hints: {
      dateFormat: 'tt.mm.jjjj',
      ageFromBirth: 'aus dem Geburtsdatum berechnet',
      ageManual: 'Geburtsdatum oder Alter eingeben',
      optional: 'fakultativ',
      requiredDiabetes: 'nötig für SCORE2-Diabetes',
      egfrComputed: 'berechnet: {value}',
      years: 'Jahre'
    },
    checklist: {
      intro: 'Zustände, die das Risiko ohne Score festlegen.',
      ascvd: 'Gesicherte ASCVD (klinisch oder in der Bildgebung)',
      diabetesSevereTod: 'Schwerer diabetesbedingter Endorganschaden',
      microvascular3: 'Mikrovaskuläre Erkrankung in mindestens 3 Organen',
      ckd: 'Chronische Nierenkrankheit',
      ckdNone: 'nein',
      ckdModerate: 'mittelschwer',
      ckdSevere: 'schwer',
      fh: 'Familiäre Hypercholesterinämie',
      fhNone: 'nein',
      fhOnly: 'ja, ohne weitere Hauptrisikofaktoren',
      fhPlus: 'ja, mit ASCVD oder einem weiteren Hauptrisikofaktor',
      markedFactor: 'Einzelner stark erhöhter Risikofaktor (GC > 8 oder LDL > 4.9 mmol/L, BD ≥ 180/110 mmHg)',
      suggested: 'Von den eingegebenen Werten nahegelegt: {what}',
      ckdNeedsAcr: 'Bei eGFR ≥ 45 braucht es die ACR, um die Nierenkrankheit einzuteilen.',
      ckdSuggestModerate: 'mittelschwere Nierenkrankheit',
      ckdSuggestSevere: 'schwere Nierenkrankheit',
      todSuggest: 'schwerer diabetesbedingter Endorganschaden',
      markedSuggest: 'einzelner stark erhöhter Risikofaktor'
    },
    conditions: {
      ascvd: 'Gesicherte ASCVD: definitionsgemäss sehr hohes Risiko, der Score ist nicht anwendbar.',
      diabetesSevereTod: 'Diabetes mit schwerem Endorganschaden: definitionsgemäss sehr hohes Risiko, der Score ist nicht anwendbar.',
      ckdSevere: 'Schwere Nierenkrankheit: sehr hohes Risiko, der Score ist nicht anwendbar.',
      ckdModerate: 'Mittelschwere Nierenkrankheit: hohes Risiko, der Score ist nicht anwendbar.',
      fhWithRiskFactor: 'Familiäre Hypercholesterinämie mit ASCVD oder weiterem Hauptrisikofaktor: sehr hohes Risiko, der Score ist nicht anwendbar.',
      fh: 'Familiäre Hypercholesterinämie: hohes Risiko, der Score unterschätzt das Risiko und ist nicht anwendbar.',
      markedFactor: 'Einzelner stark erhöhter Risikofaktor: mindestens hohes Risiko. Der Score wird berechnet, ist aber mit Vorsicht zu interpretieren.'
    },
    categories: {
      low: 'niedrig',
      lowModerate: 'niedrig bis moderat',
      moderate: 'moderat',
      high: 'hoch',
      veryHigh: 'sehr hoch',
      label: 'Risiko {category}'
    },
    regions: {
      low: 'Niedrig (Schweiz)',
      moderate: 'Moderat',
      high: 'Hoch',
      veryHigh: 'Sehr hoch',
      lowShort: 'Region mit niedrigem Risiko',
      moderateShort: 'Region mit moderatem Risiko',
      highShort: 'Region mit hohem Risiko',
      veryHighShort: 'Region mit sehr hohem Risiko'
    },
    result: {
      empty: 'Patientendaten eingeben, um das Risiko zu berechnen.',
      tenYear: '10-Jahres-Risiko für tödliche und nicht tödliche kardiovaskuläre Ereignisse',
      model: 'Modell',
      nonHdl: 'Non-HDL',
      ldl: 'LDL',
      ldlFriedewald: 'Friedewald',
      ldlMeasured: 'gemessen',
      ldlNotValid: 'LDL nach Friedewald nicht berechenbar: Triglyzeride ≥ 4.5 mmol/L.',
      ldlTarget: 'LDL-Zielwert',
      ldlTargetValue: '< {value} mmol/L',
      ldlReduction: 'und Senkung ≥ {pct}% gegenüber dem Ausgangswert',
      ldlAltLow: '(< {value} mmol/L bei niedrigem Risiko)',
      fromConditions: 'Kategorie durch die Vorabkontrolle festgelegt.',
      scoreIndicative: 'Score-Wert nur als Orientierung.',
      noScore: 'Score nicht berechenbar.',
      missing: 'Es fehlen: {fields}.',
      thresholds: 'Grenzwerte für {age}: {t}'
    },
    errors: {
      required: '{field}: Pflichtfeld.',
      not_a_number: '{field}: ungültiger Wert.',
      implausible: '{field}: unplausibler Wert (zulässig {min}–{max}).',
      hdl_not_below_total: 'HDL muss tiefer sein als das Gesamtcholesterin.',
      age_below_40: 'Die ESC-Scores gelten ab 40 Jahren: keine Berechnung.',
      age_above_89: 'Über 89 Jahre ist SCORE2-OP nicht anwendbar: keine Berechnung.',
      age_missing: 'Das Alter fehlt.',
      after_current_age: 'Das Alter bei Diagnose ist höher als das aktuelle Alter.',
      invalid: '{field}: ungültiger Wert.',
      invalidDate: '{field}: ungültiges Datum (tt.mm.jjjj).',
      visitBeforeBirth: 'Das Datum der Konsultation liegt vor dem Geburtsdatum.'
    },
    warnings: {
      outside_model_range: '{field}: {value} liegt ausserhalb des typischen Bereichs des Modells ({min}–{max}). Mit Vorsicht interpretieren.',
      op_diabetes: 'Diabetes ab 70 Jahren: verwendet wird SCORE2-OP, der den Diabetes berücksichtigt, nicht aber HbA1c, eGFR und Alter bei Diagnose (SCORE2-Diabetes ist bis 69 Jahre vorgesehen).'
    },
    whatIf: {
      quitSmoking: 'Mit Rauchstopp',
      sbp130: 'Mit systolischem BD 130 mmHg',
      tcMinus1: 'Mit Gesamtcholesterin −1 mmol/L',
      hba1c53: 'Mit HbA1c 53 mmol/mol (7%)',
      all: 'Mit allen Änderungen',
      now: 'Heute',
      risk: 'Risiko',
      change: 'Differenz',
      points: '{value} Punkte',
      none: 'Für diese Person ist kein Szenario anwendbar.',
      disclaimer: 'Orientierende Schätzungen: Das Modell wurde nicht entwickelt, um die Wirkung einer Intervention vorherzusagen.'
    },
    settings: {
      title: 'Einstellungen',
      general: 'Allgemein',
      uiLanguage: 'Sprache der Benutzeroberfläche',
      sheetLanguage: 'Sprache des Patientenblatts',
      region: 'Risikoregion',
      regionHelp: 'Die Schweiz gehört zu den Ländern mit niedrigem Risiko (ESC 2021). Nur für Personen aus anderen Ländern ändern.',
      practice: 'Briefkopf der Praxis',
      practiceName: 'Name der Praxis',
      doctors: 'Ärztin/Arzt',
      specialty: 'Fachrichtung',
      address: 'Adresse',
      phone: 'Telefon',
      email: 'E-Mail',
      logo: 'Logo',
      logoHelp: 'Bild im Format PNG, JPG oder SVG, höchstens 300 KB.',
      logoRemove: 'Logo entfernen',
      logoTooBig: 'Das Logo ist grösser als 300 KB.',
      backup: 'Sicherung',
      export: 'Einstellungen exportieren',
      import: 'Einstellungen importieren',
      reset: 'Standardeinstellungen wiederherstellen',
      resetConfirm: 'Standardeinstellungen wiederherstellen? Der Briefkopf der Praxis wird gelöscht.',
      importError: 'Ungültige Datei: Einstellungen nicht importiert.',
      imported: 'Einstellungen importiert.',
      storageNote: 'Die Einstellungen bleiben nur in diesem Browser. Exportieren Sie sie, um sie auf einen anderen Computer zu übertragen. Patientendaten werden nie gespeichert.',
      storageUnavailable: 'Dieser Browser erlaubt das Speichern der Einstellungen nicht: Sie gelten nur, bis die Seite geschlossen wird.'
    },
    reminders: {
      title: 'Hinweise für die Ärztin / den Arzt',
      updated: 'Inhalte am {date} anhand der ESC-Leitlinien überprüft.',
      notPrinted: 'Erscheint nicht auf dem Patientenblatt.'
    },
    units: {
      mmHg: 'mmHg',
      mmolL: 'mmol/L',
      mgdl: 'mg/dL',
      percent: '%',
      mmolMol: 'mmol/mol',
      egfr: 'mL/min/1.73 m²',
      umolL: 'µmol/L',
      mgMmol: 'mg/mmol',
      mgG: 'mg/g'
    }
  };

  if (isNode) module.exports = DE;
  else {
    var NS = (root.ESCScore = root.ESCScore || {});
    (NS.i18nData = NS.i18nData || {}).de = DE;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
