/* Testi dell'interfaccia in italiano. Le chiavi devono essere le stesse in tutte le lingue. */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var IT = {
    langName: 'Italiano',
    app: {
      title: 'Rischio cardiovascolare a 10 anni',
      subtitle: 'SCORE2 · SCORE2-OP · SCORE2-Diabetes (ESC)',
      disclaimer: 'Strumento di supporto alla decisione clinica, non è un dispositivo medico certificato. Il risultato va interpretato dal medico.',
      privacy: 'Tutti i calcoli avvengono in questo computer. I dati del paziente non vengono salvati né inviati.'
    },
    actions: {
      newPatient: 'Nuovo paziente',
      settings: 'Impostazioni',
      reminders: 'Promemoria',
      close: 'Chiudi',
      apply: 'Applica',
      copy: 'Copia',
      copied: 'Copiato',
      print: 'Stampa foglio paziente'
    },
    sections: {
      patient: 'Paziente',
      risk: 'Fattori di rischio',
      diabetes: 'Diabete tipo 2',
      kidney: 'Funzione renale',
      more: 'Altri valori',
      checklist: 'Controllo preliminare',
      result: 'Risultato',
      whatIf: 'Cosa cambia se…',
      axenita: 'Riga per la cartella clinica'
    },
    fields: {
      firstName: 'Nome',
      lastName: 'Cognome',
      birthDate: 'Data di nascita',
      visitDate: 'Data della visita',
      age: 'Età',
      sex: 'Sesso',
      male: 'Uomo',
      female: 'Donna',
      smoker: 'Fumatore attuale',
      diabetes: 'Diabete tipo 2',
      yes: 'Sì',
      no: 'No',
      sbp: 'Pressione sistolica',
      dbp: 'Pressione diastolica',
      totalChol: 'Colesterolo totale',
      hdl: 'Colesterolo HDL',
      triglycerides: 'Trigliceridi',
      ldlMeasured: 'LDL misurato',
      lipidUnit: 'Unità dei lipidi',
      ageAtDiagnosis: 'Età alla diagnosi',
      hba1c: 'HbA1c',
      egfr: 'eGFR',
      egfrFromCreatinine: 'Calcola l\'eGFR dalla creatinina (CKD-EPI 2021)',
      creatinine: 'Creatinina',
      acr: 'Albumina/creatinina urinaria (ACR)',
      region: 'Regione'
    },
    hints: {
      dateFormat: 'gg.mm.aaaa',
      ageFromBirth: 'calcolata dalla data di nascita',
      ageManual: 'inserisci la data di nascita o l\'età',
      optional: 'facoltativo',
      requiredDiabetes: 'necessario per SCORE2-Diabetes',
      egfrComputed: 'calcolato: {value}',
      years: 'anni'
    },
    checklist: {
      intro: 'Condizioni che definiscono il rischio senza bisogno dello score.',
      ascvd: 'ASCVD accertata (clinica o all\'imaging)',
      diabetesSevereTod: 'Danno d\'organo severo da diabete',
      microvascular3: 'Malattia microvascolare in almeno 3 distretti',
      ckd: 'Insufficienza renale cronica',
      ckdNone: 'no',
      ckdModerate: 'moderata',
      ckdSevere: 'severa',
      fh: 'Ipercolesterolemia familiare',
      fhNone: 'no',
      fhOnly: 'sì, senza altri fattori maggiori',
      fhPlus: 'sì, con ASCVD o un altro fattore maggiore',
      markedFactor: 'Fattore singolo marcatamente elevato (CT > 8 o LDL > 4.9 mmol/L, PA ≥ 180/110 mmHg)',
      suggested: 'Suggerito dai valori inseriti: {what}',
      ckdNeedsAcr: 'Con eGFR ≥ 45 serve l\'ACR per classificare l\'IRC.',
      ckdSuggestModerate: 'IRC moderata',
      ckdSuggestSevere: 'IRC severa',
      todSuggest: 'danno d\'organo severo da diabete',
      markedSuggest: 'fattore singolo marcatamente elevato'
    },
    conditions: {
      ascvd: 'ASCVD accertata: rischio molto alto per definizione, lo score non si applica.',
      diabetesSevereTod: 'Diabete con danno d\'organo severo: rischio molto alto per definizione, lo score non si applica.',
      ckdSevere: 'IRC severa: rischio molto alto, lo score non si applica.',
      ckdModerate: 'IRC moderata: rischio alto, lo score non si applica.',
      fhWithRiskFactor: 'Ipercolesterolemia familiare con ASCVD o altro fattore maggiore: rischio molto alto, lo score non si applica.',
      fh: 'Ipercolesterolemia familiare: rischio alto, lo score sottostima il rischio e non si applica.',
      markedFactor: 'Fattore singolo marcatamente elevato: rischio almeno alto. Lo score è calcolato ma va interpretato con cautela.'
    },
    categories: {
      low: 'basso',
      lowModerate: 'basso-moderato',
      moderate: 'moderato',
      high: 'alto',
      veryHigh: 'molto alto',
      label: 'Rischio {category}'
    },
    regions: {
      low: 'Bassa (Svizzera)',
      moderate: 'Moderata',
      high: 'Alta',
      veryHigh: 'Molto alta',
      lowShort: 'regione a basso rischio',
      moderateShort: 'regione a rischio moderato',
      highShort: 'regione ad alto rischio',
      veryHighShort: 'regione a rischio molto alto'
    },
    result: {
      empty: 'Inserisci i dati del paziente per calcolare il rischio.',
      tenYear: 'rischio a 10 anni di eventi CV fatali e non fatali',
      model: 'Modello',
      nonHdl: 'Non-HDL',
      ldl: 'LDL',
      ldlFriedewald: 'Friedewald',
      ldlMeasured: 'misurato',
      ldlNotValid: 'LDL non calcolabile con Friedewald: trigliceridi ≥ 4.5 mmol/L.',
      ldlTarget: 'Obiettivo LDL',
      ldlTargetValue: '< {value} mmol/L',
      ldlReduction: 'e riduzione ≥ {pct}% dal basale',
      ldlAltLow: '(< {value} mmol/L se il rischio è basso)',
      fromConditions: 'Categoria definita dal controllo preliminare.',
      scoreIndicative: 'Valore dello score solo indicativo.',
      noScore: 'Score non calcolabile.',
      missing: 'Mancano: {fields}.',
      thresholds: 'Soglie per {age}: {t}'
    },
    errors: {
      required: '{field}: campo obbligatorio.',
      not_a_number: '{field}: valore non valido.',
      implausible: '{field}: valore non plausibile (accettato {min}–{max}).',
      hdl_not_below_total: 'L\'HDL deve essere inferiore al colesterolo totale.',
      age_below_40: 'Gli score ESC si applicano dai 40 anni: nessun calcolo.',
      age_above_89: 'Oltre gli 89 anni SCORE2-OP non è applicabile: nessun calcolo.',
      age_missing: 'Manca l\'età.',
      after_current_age: 'L\'età alla diagnosi supera l\'età attuale.',
      invalid: '{field}: valore non valido.',
      invalidDate: '{field}: data non valida (gg.mm.aaaa).',
      visitBeforeBirth: 'La data della visita precede la data di nascita.'
    },
    warnings: {
      outside_model_range: '{field}: {value} è fuori dall\'intervallo tipico del modello ({min}–{max}). Interpretare con cautela.',
      op_diabetes: 'Diabete dai 70 anni: si usa SCORE2-OP, che considera il diabete ma non HbA1c, eGFR ed età alla diagnosi (SCORE2-Diabetes è previsto fino a 69 anni).'
    },
    whatIf: {
      quitSmoking: 'Smettendo di fumare',
      sbp130: 'Con PAS a 130 mmHg',
      tcMinus1: 'Con colesterolo totale −1 mmol/L',
      hba1c53: 'Con HbA1c a 53 mmol/mol (7%)',
      all: 'Con tutti i cambiamenti',
      now: 'Oggi',
      risk: 'Rischio',
      change: 'Differenza',
      points: '{value} punti',
      none: 'Nessuno scenario applicabile a questo paziente.',
      disclaimer: 'Stime indicative: il modello non è stato costruito per prevedere l\'effetto di un intervento.'
    },
    settings: {
      title: 'Impostazioni',
      general: 'Generale',
      uiLanguage: 'Lingua dell\'interfaccia',
      sheetLanguage: 'Lingua del foglio paziente',
      region: 'Regione di rischio',
      regionHelp: 'La Svizzera appartiene ai paesi a basso rischio (ESC 2021). Cambiala solo per pazienti di altri paesi.',
      practice: 'Intestazione dello studio',
      practiceName: 'Nome dello studio',
      doctors: 'Medico o medici',
      specialty: 'Specialità',
      address: 'Indirizzo',
      phone: 'Telefono',
      email: 'Email',
      logo: 'Logo',
      logoHelp: 'Immagine PNG, JPG o SVG, massimo 300 KB.',
      logoRemove: 'Rimuovi logo',
      logoTooBig: 'Il logo supera 300 KB.',
      backup: 'Salvataggio',
      export: 'Esporta impostazioni',
      import: 'Importa impostazioni',
      reset: 'Ripristina le impostazioni predefinite',
      resetConfirm: 'Ripristinare le impostazioni predefinite? L\'intestazione dello studio verrà cancellata.',
      importError: 'File non valido: impostazioni non importate.',
      imported: 'Impostazioni importate.',
      storageNote: 'Le impostazioni restano solo in questo browser. Esportale per trasferirle su un altro computer. I dati dei pazienti non vengono mai salvati.',
      storageUnavailable: 'Questo browser non permette di salvare le impostazioni: valgono solo fino alla chiusura della pagina.'
    },
    reminders: {
      title: 'Promemoria per il medico',
      updated: 'Contenuti verificati sulle linee guida ESC al {date}.',
      notPrinted: 'Non compare sul foglio del paziente.'
    },
    axenita: {
      help: 'Testo senza dati anagrafici, da incollare nella cartella clinica.',
      empty: 'La riga compare quando c\'è un risultato.',
      male: 'M',
      female: 'F',
      age: '{age} a',
      smokerM: 'fumatore',
      smokerF: 'fumatrice',
      nonSmokerM: 'non fumatore',
      nonSmokerF: 'non fumatrice',
      diabetes: 'diabete tipo 2',
      diabetesDx: 'diabete tipo 2 dai {age} a',
      hba1c: 'HbA1c {value} mmol/mol',
      sbp: 'PAS {value}',
      bp: 'PA {sbp}/{dbp}',
      egfr: 'eGFR {value}',
      acr: 'ACR {value} {unit}',
      tc: 'CT',
      nonHdl: 'non-HDL',
      ldlCalc: 'LDL calc.',
      ldlMeasured: 'LDL',
      tenYear: 'a 10 anni',
      notApplicable: 'score non applicabile',
      risk: 'rischio {category}',
      dueTo: 'per {list}',
      alsoChecked: 'controllo preliminare: {list}',
      noScore: 'Rischio CV {category} per {list}; score non calcolabile',
      outOfRange: 'Valori fuori dall\'intervallo del modello: {list}.',
      ldlTarget: 'Obiettivo LDL <{value} mmol/L',
      ldlReduction: ' e riduzione ≥{pct}%',
      ldlAltLow: ' (<{value} se rischio basso)',
      cond: {
        ascvd: 'ASCVD accertata',
        diabetesSevereTod: 'danno d\'organo severo da diabete',
        ckdSevere: 'IRC severa',
        ckdModerate: 'IRC moderata',
        fhWithRiskFactor: 'ipercolesterolemia familiare con fattore maggiore',
        fh: 'ipercolesterolemia familiare',
        markedFactor: 'fattore singolo marcatamente elevato'
      },
      field: {
        sbp: 'PAS',
        totalChol: 'CT',
        hdl: 'HDL',
        hba1c: 'HbA1c',
        egfr: 'eGFR'
      }
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

  if (isNode) module.exports = IT;
  else {
    var NS = (root.ESCScore = root.ESCScore || {});
    (NS.i18nData = NS.i18nData || {}).it = IT;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
