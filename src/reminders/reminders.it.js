/*
 * Promemoria per il medico (italiano). Non compaiono sul foglio del paziente.
 * Ogni voce cita le fonti con le chiavi di sources.js.
 * Verificato sulle linee guida ESC il 22.11.2026 (vedi docs/linee-guida.md).
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var REMINDERS = {
    updated: '22.11.2026',
    sections: [
      {
        id: 'veryHighNoScore',
        title: 'Rischio molto alto senza bisogno di score',
        items: [
          {
            text: 'ASCVD documentata clinicamente (SCA, rivascolarizzazione, ictus/TIA, arteriopatia periferica, aneurisma aortico) o inequivocabile all\'imaging (placca significativa a coronarografia/CT coronarica o eco carotidea).',
            sources: ['esc2021prev']
          },
          {
            text: 'Diabete tipo 2 con ASCVD o danno d\'organo severo: eGFR < 45; eGFR 45–59 con microalbuminuria (UACR 3–30 mg/mmol = 30–300 mg/g); proteinuria (UACR > 30 mg/mmol = > 300 mg/g); malattia microvascolare in ≥ 3 distretti (es. microalbuminuria + retinopatia + neuropatia).',
            sources: ['esc2023dm']
          },
          {
            text: 'IRC severa: eGFR < 30 con qualsiasi albuminuria; eGFR 30–44 con ACR 3–30 mg/mmol (30–300 mg/g); ACR > 30 mg/mmol (> 300 mg/g) con qualsiasi eGFR.',
            sources: ['esc2026ckd']
          },
          {
            text: 'Ipercolesterolemia familiare con ASCVD o con un altro fattore di rischio maggiore.',
            sources: ['esc2019lip']
          }
        ]
      },
      {
        id: 'high',
        title: 'Rischio alto',
        items: [
          {
            text: 'IRC moderata: eGFR 30–44 con ACR < 3 mg/mmol (< 30 mg/g); eGFR 45–59 con ACR 3–30 mg/mmol (30–300 mg/g).',
            sources: ['esc2026ckd']
          },
          {
            text: 'Ipercolesterolemia familiare senza altri fattori di rischio maggiori.',
            sources: ['esc2019lip']
          },
          {
            text: 'Fattore singolo marcatamente elevato: CT > 8 mmol/L, LDL > 4.9 mmol/L, PA ≥ 180/110 mmHg.',
            sources: ['esc2019lip', 'esc2021prev']
          }
        ]
      },
      {
        id: 'hmod',
        title: 'Danno d\'organo da ipertensione (HMOD)',
        items: [
          { text: 'Ipertrofia ventricolare sinistra all\'ECG o all\'ecocardiogramma (criteri specifici per sesso).', sources: ['esc2024htn'] },
          { text: 'eGFR < 60 mL/min/1.73 m² oppure albuminuria ≥ 3 mg/mmol (≥ 30 mg/g).', sources: ['esc2024htn'] },
          { text: 'Retinopatia ipertensiva al fondo dell\'occhio.', sources: ['esc2024htn'] },
          { text: 'Calcio coronarico > 100 UA o ≥ 75° percentile per età e sesso.', sources: ['esc2024htn'] },
          { text: 'Placca carotidea (spessore ≥ 1.5 mm).', sources: ['esc2024htn'] },
          { text: 'Rigidità arteriosa: PWV carotido-femorale > 10 m/s (o brachio-caviglia > 14 m/s).', sources: ['esc2024htn'] },
          { text: 'Indice caviglia-braccio < 0.9: indica arteriopatia periferica, cioè ASCVD (rischio molto alto).', sources: ['esc2021prev'] }
        ]
      },
      {
        id: 'modifiers',
        title: 'Modificatori di rischio (utili vicino a una soglia o a rischio moderato)',
        items: [
          { text: 'Familiarità per malattia CV precoce (parente di 1° grado: uomo < 55 anni, donna < 60 anni).', sources: ['esc2021prev', 'esc2025lip'] },
          { text: 'Lp(a) > 50 mg/dL (≥ 105 nmol/L). Misurarla almeno una volta nella vita in ogni adulto. Valori > 180 mg/dL (> 430 nmol/L) comportano un rischio paragonabile all\'ipercolesterolemia familiare eterozigote.', sources: ['esc2025lip', 'esc2019lip'] },
          { text: 'hs-CRP persistentemente > 2 mg/L.', sources: ['esc2025lip'] },
          { text: 'Aterosclerosi subclinica all\'imaging o calcio coronarico elevato (interpretare con cautela in chi assume statine).', sources: ['esc2021prev', 'esc2025lip'] },
          { text: 'Malattie infiammatorie croniche o immunomediate, HIV, malattie psichiatriche gravi, apnee ostruttive del sonno.', sources: ['esc2021prev', 'esc2024htn', 'esc2025lip'] },
          { text: 'Condizioni specifiche della donna: preeclampsia, ipertensione o diabete gestazionale, parto pretermine, menopausa precoce.', sources: ['esc2021prev', 'esc2024htn'] },
          { text: 'Etnia ad alto rischio (es. Asia meridionale).', sources: ['esc2021prev', 'esc2024htn'] },
          { text: 'Stato socioeconomico basso, stress psicosociale, obesità, inattività fisica, fragilità.', sources: ['esc2021prev', 'esc2025lip'] }
        ]
      },
      {
        id: 'targets',
        title: 'Obiettivi terapeutici',
        items: [
          { text: 'LDL, rischio molto alto: < 1.4 mmol/L e riduzione ≥ 50% dal basale. Se c\'è un secondo evento vascolare entro 2 anni nonostante la terapia massimale con statina, si può considerare < 1.0 mmol/L.', sources: ['esc2019lip', 'esc2025lip'] },
          { text: 'LDL, rischio alto: < 1.8 mmol/L e riduzione ≥ 50%.', sources: ['esc2019lip', 'esc2025lip'] },
          { text: 'LDL, rischio moderato: < 2.6 mmol/L. Rischio basso: < 3.0 mmol/L.', sources: ['esc2019lip', 'esc2025lip'] },
          { text: 'Obiettivi secondari non-HDL: molto alto < 2.2, alto < 2.6, moderato < 3.4, basso < 3.8 mmol/L.', sources: ['esc2019lip', 'dimUsz2026'] },
          { text: 'SCORE2 basso-moderato: il trattamento dei fattori di rischio in genere non è raccomandato e la linea guida 2021 non fissa un obiettivo LDL esplicito; in pratica < 2.6 mmol/L (< 3.0 se il rischio è basso).', sources: ['esc2021prev', 'esc2019lip'] },
          { text: 'Pressione: sistolica 120–129 mmHg se tollerata, confermata con misurazioni fuori dallo studio; altrimenti il valore più basso ragionevolmente raggiungibile. Obiettivi meno stretti con ipotensione ortostatica sintomatica, età ≥ 85 anni, fragilità moderata-severa o aspettativa di vita limitata.', sources: ['esc2024htn'] },
          { text: 'PA "elevata" (120–139/70–89 mmHg): considerare i farmaci se il rischio è alto (IRC, malattia CV, HMOD, ipercolesterolemia familiare, diabete) o se SCORE2/SCORE2-OP è ≥ 10%.', sources: ['esc2024htn'] },
          { text: 'Fumo: cessazione completa.', sources: ['esc2021prev'] },
          { text: 'Statina indicata indipendentemente dai lipidi nell\'IRC con eGFR < 60 senza terapia sostitutiva renale e nelle persone con HIV dai 40 anni.', sources: ['esc2026ckd', 'esc2025lip'] }
        ]
      },
      {
        id: 'scoreNotes',
        title: 'Quando usare lo score',
        items: [
          { text: 'SCORE2 (40–69 anni) e SCORE2-OP (70–89 anni): persone senza malattia CV nota. Lo score non va usato in chi ha ASCVD e va interpretato con cautela in chi è già in terapia ipolipemizzante.', sources: ['esc2021prev', 'esc2025lip'] },
          { text: 'SCORE2-Diabetes: diabete tipo 2 senza ASCVD né danno d\'organo severo, 40–69 anni.', sources: ['esc2023dm'] },
          { text: 'Soglie di categoria: l\'app usa quelle per età di ESC 2021, come AGLA 2025, la guida USZ 2026 e il calcolatore ESC HeartScore. L\'aggiornamento ESC/EAS 2025 usa invece soglie fisse (< 2%, 2–< 10%, 10–< 20%, ≥ 20%), ottenute raddoppiando quelle del vecchio SCORE e non validate per SCORE2. Se le due classificazioni divergono, l\'app lo segnala; considerare anche il rischio sull\'intera vita (LIFE-CVD2) e i modificatori di rischio.', sources: ['esc2021prev', 'esc2025lip', 'dimUsz2026'] },
          { text: 'Gli scenari "cosa cambia se" sono stime indicative: il modello predice il rischio di chi ha quei valori, non l\'effetto di un intervento.', sources: [] }
        ]
      }
    ]
  };

  if (isNode) module.exports = REMINDERS;
  else {
    var NS = (root.ESCScore = root.ESCScore || {});
    NS.reminders = NS.reminders || {};
    NS.reminders.it = REMINDERS;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
