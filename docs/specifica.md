Vorrei creare un'app per calcolare il rischio cardiovascolare a 10 anni con SCORE2, SCORE2-OP e SCORE2-Diabetes (ESC), calibrata per la Svizzera. La userò in studio medico (medicina generale, Ticino). Prima di scrivere codice, proponimi un piano e aspetta la mia conferma.

OBIETTIVO
- Il medico inserisce i dati del paziente e ottiene il rischio a 10 anni e la categoria di rischio. Poi copia una riga di testo per la cartella clinica (Axenita) e stampa un foglio A4 colorato da consegnare al paziente.
- Il progetto vive su GitHub e deve essere installabile in modo semplice su altri Mac e, se possibile, su Windows.

ARCHITETTURA (proposta, discutibile)
- App web statica: HTML + CSS + JavaScript vanilla (ES modules), senza backend, senza build step, senza dipendenze a runtime.
- Privacy: tutto il calcolo avviene nel browser. Nessun dato lascia il computer: niente analytics, niente CDN, niente font esterni. I dati del paziente non vengono salvati da nessuna parte (né localStorage né file). Pulsante "Nuovo paziente" che azzera tutto. Si possono salvare solo le impostazioni dello studio.
- Distribuzione: GitHub Pages + PWA (manifest + service worker per l'uso offline). Si installa come app da Chrome/Edge (Mac e Windows) e da Safari (Archivio > Aggiungi al Dock). Deve funzionare anche aprendo index.html da una cartella scaricata (zip della release).
- Valuta e dimmi se ha senso, in una fase successiva, un pacchetto desktop con Tauri (.dmg / .msi). Non implementarlo ora.

INPUT
- Paziente: nome, cognome, data di nascita (formato svizzero gg.mm.aaaa). L'età si calcola dalla data di nascita alla data della visita, modificabile e predefinita a oggi. Questi dati compaiono solo sul foglio paziente e nell'interfaccia, mai nella riga per Axenita.
- Sesso, pressione sistolica (mmHg), colesterolo totale e HDL (mmol/L, con conversione opzionale da mg/dL), trigliceridi (facoltativi), fumatore attuale sì/no, diabete tipo 2 sì/no.
- Se diabete: età alla diagnosi, HbA1c (in % o mmol/mol, con conversione mmol/mol = (% − 2.15) × 10.929), eGFR (mL/min/1.73 m²). Come opzione, calcolo dell'eGFR da creatinina (µmol/L) con CKD-EPI 2021 senza razza.

SCELTA DEL MODELLO (automatica, con indicazione visibile del modello usato)
- 40–69 anni, senza diabete: SCORE2
- 40–69 anni, con diabete tipo 2: SCORE2-Diabetes
- 70–89 anni (con o senza diabete): SCORE2-OP (il diabete entra come variabile)
- Fuori da 40–89 anni: nessun calcolo, solo un messaggio
- Regione di rischio predefinita "Low" (Svizzera), modificabile in un'impostazione avanzata.

CATEGORIE DI RISCHIO
- SCORE2 / SCORE2-OP (ESC 2021 prevenzione):
  <50 anni: <2.5% basso-moderato, 2.5–<7.5% alto, ≥7.5% molto alto
  50–69 anni: <5%, 5–<10%, ≥10%
  ≥70 anni: <7.5%, 7.5–<15%, ≥15%
- SCORE2-Diabetes (ESC 2023 diabete): <5% basso, 5–<10% moderato, 10–<20% alto, ≥20% molto alto.
  Nota: in un diabetico con ASCVD o danno d'organo severo il rischio è molto alto per definizione, indipendentemente dallo score.

CONTROLLO PRELIMINARE (checklist prima del calcolo)
Caselle da spuntare: ASCVD accertata, danno d'organo severo da diabete, IRC moderata o severa, ipercolesterolemia familiare, fattore singolo marcatamente elevato. Se una è spuntata, l'app mostra la categoria di rischio che ne deriva, spiega perché lo score non si applica o va interpretato con cautela, e segnala la cosa sulla riga per Axenita.

PROMEMORIA PER IL MEDICO (pannello laterale o a scomparsa, non stampato sul foglio paziente)
Ogni voce deve riportare la linea guida da cui proviene. Verifica tutti i contenuti con le linee guida ESC più recenti (prevenzione CV 2021, diabete 2023, ipertensione 2024, dislipidemie ESC/EAS 2019 e relativo aggiornamento 2025) e segnalami le differenze rispetto al testo qui sotto.

Rischio molto alto senza bisogno di score:
- ASCVD documentata clinicamente (SCA, rivascolarizzazione, ictus/TIA, arteriopatia periferica, aneurisma aortico) o inequivocabile all'imaging (placca significativa a coronarografia/CT coronarica o eco carotidea)
- Diabete tipo 2 con ASCVD o danno d'organo severo: eGFR <45; eGFR 45–59 con UACR 30–300 mg/g; UACR >300 mg/g; malattia microvascolare in almeno 3 distretti (es. microalbuminuria + retinopatia + neuropatia)
- IRC severa: eGFR <30, oppure eGFR 30–44 con ACR >30 mg/g
- Ipercolesterolemia familiare con ASCVD o con un altro fattore di rischio maggiore

Rischio alto:
- IRC moderata: eGFR 30–44 con ACR <30 mg/g, oppure 45–59 con ACR 30–300 mg/g, oppure ≥60 con ACR >300 mg/g
- Ipercolesterolemia familiare senza altri fattori maggiori
- Fattore singolo marcatamente elevato: CT >8 mmol/L, LDL >4.9 mmol/L, PA ≥180/110 mmHg

Danno d'organo da ipertensione (HMOD): ipertrofia ventricolare sinistra (ECG/eco), eGFR <60 o albuminuria, retinopatia ipertensiva avanzata, indice caviglia-braccio <0.9, PWV carotido-femorale >10 m/s, placche carotidee, calcio coronarico elevato.

Modificatori di rischio: familiarità per malattia CV precoce, Lp(a) elevata (>180 mg/dL ≈ >430 nmol/L), calcio coronarico, malattie infiammatorie croniche/autoimmuni, HIV, malattie psichiatriche gravi, OSAS, complicanze ostetriche (preeclampsia, ipertensione gestazionale), stato socioeconomico basso.

Obiettivi terapeutici:
- LDL: molto alto <1.4 mmol/L e riduzione ≥50%; alto <1.8 mmol/L e ≥50%; moderato <2.6; basso <3.0
- Pressione: obiettivo sistolico 120–129 mmHg se tollerato (ESC 2024)
- Fumo: cessazione completa

FUNZIONI DI OUTPUT
1. Risultato: percentuale, categoria con colore, modello usato, non-HDL. LDL con Friedewald solo se ci sono i trigliceridi e sono <4.5 mmol/L. Obiettivo LDL corrispondente alla categoria.
2. Avvisi: lo score non si applica alle condizioni della checklist; i valori fuori dal range del modello vanno segnalati.
3. "Cosa cambia se…": ricalcola il rischio smettendo di fumare, con PAS 130 mmHg e con colesterolo totale ridotto di 1 mmol/L. Per i diabetici aggiungi HbA1c a 53 mmol/mol (7%). Indica chiaramente che sono stime indicative: il modello non è stato costruito per prevedere l'effetto di un intervento.
4. Riga per Axenita, testo semplice con pulsante Copia e senza dati anagrafici. Esempio: "SCORE2 (regione a basso rischio): 12.9% a 10 anni – rischio molto alto (M, 69 a, fumatore, PAS 140, CT 5.23, HDL 1.24, non-HDL 3.99 mmol/L). Obiettivo LDL <1.4 mmol/L."
5. Foglio paziente A4 (CSS @media print, window.print, salvabile come PDF dal dialogo di stampa):
   - intestazione dello studio, configurabile in un file config.json;
   - nome, cognome, data di nascita e data della visita;
   - indicatore colorato del rischio (verde, giallo, arancio, rosso);
   - i valori del paziente accanto agli obiettivi;
   - il riquadro "cosa cambia se";
   - 3–4 consigli pratici in linguaggio semplice, con il "Lei";
   - una nota che il risultato va discusso con il medico.
   Il foglio deve essere gradevole e leggibile anche stampato in bianco e nero, e stare su una sola pagina.
6. Lingue: italiano e tedesco, per interfaccia e foglio paziente, con la lingua del foglio scelta indipendentemente dall'interfaccia. In tedesco sempre "ss", mai "ß" (convenzione svizzera). Struttura i testi in un file di traduzioni, così da poter aggiungere il francese.

COEFFICIENTI (fonte: pacchetto R RiskScorescvd, verificato sugli esempi pubblicati dall'ESC; controlla comunque con le pubblicazioni originali)

Calibrazione regionale SCORE2 e SCORE2-Diabetes (scale1, scale2):
  Low: U -0.5699, 0.7476; D -0.7380, 0.7019
  Moderate: U -0.1565, 0.8009; D -0.3143, 0.7701
  High: U 0.3207, 0.9360; D 0.5710, 0.9369
  Very high: U 0.5836, 0.8294; D 0.9412, 0.8329

SCORE2 (40–69 anni)
cage=(età-60)/5; csbp=(PAS-120)/20; ctc=CT-6; chdl=(HDL-1.3)/0.5
Uomini: età 0.3742; fumo 0.6012; PAS 0.2777; diabete 0.6457; CT 0.1458; HDL -0.2698; età×fumo -0.0755; età×PAS -0.0255; età×CT -0.0281; età×HDL 0.0426; età×diabete -0.0983. S0=0.9605
Donne: età 0.4648; fumo 0.7744; PAS 0.3131; diabete 0.8096; CT 0.1002; HDL -0.2606; età×fumo -0.1088; età×PAS -0.0277; età×CT -0.0226; età×HDL 0.0613; età×diabete -0.1272. S0=0.9776
Rischio non calibrato = 1 - S0^exp(LP)

SCORE2-Diabetes (40–69 anni, diabete tipo 2)
Variabili centrate come SCORE2, più: cdmage=(età alla diagnosi-50)/5; chba1c=(HbA1c mmol/mol-31)/9.34; cegfr=(ln(eGFR)-4.5)/0.15; diabete=1
Uomini: età 0.5368; fumo 0.4774; PAS 0.1322; diabete 0.6457; CT 0.1102; HDL -0.1087; età×fumo -0.0672; età×PAS -0.0268; età×diabete -0.0983; età×CT -0.0181; età×HDL 0.0095; diabete×cdmage -0.0998; chba1c 0.0955; cegfr -0.0591; cegfr² 0.0058; chba1c×età -0.0134; cegfr×età 0.0115. S0=0.9605
Donne: età 0.6624; fumo 0.6139; PAS 0.1421; diabete 0.8096; CT 0.1127; HDL -0.1568; età×fumo -0.1122; età×PAS -0.0167; età×diabete -0.1272; età×CT -0.0200; età×HDL 0.0186; diabete×cdmage -0.118; chba1c 0.1173; cegfr -0.0640; cegfr² 0.0062; chba1c×età -0.0196; cegfr×età 0.0169. S0=0.9776
Rischio non calibrato = 1 - S0^exp(LP)
("età" nei termini di interazione = cage)

SCORE2-OP (70–89 anni)
a=età-73; s=PAS-150; t=CT-6; h=HDL-1.4
Uomini: età 0.0634; diabete 0.4245; fumo 0.3524; PAS 0.0094; CT 0.0850; HDL -0.3564; età×diabete -0.0174; età×fumo -0.0247; età×PAS -0.0005; età×CT 0.0073; età×HDL 0.0091. S0=0.7576, LP medio 0.0929
Donne: età 0.0789; diabete 0.6010; fumo 0.4921; PAS 0.0102; CT 0.0605; HDL -0.3040; età×diabete -0.0107; età×fumo -0.0255; età×PAS -0.0004; età×CT -0.0009; età×HDL 0.0154. S0=0.8082, LP medio 0.229
Rischio non calibrato = 1 - S0^exp(LP - LP medio)
Calibrazione SCORE2-OP:
  Low: U -0.34, 1.19; D -0.52, 1.01
  Moderate: U 0.01, 1.25; D -0.10, 1.10
  High: U 0.08, 1.15; D 0.38, 1.09
  Very high: U 0.05, 0.70; D 0.38, 0.69

Rischio calibrato (tutti i modelli) = 1 - exp(-exp(scale1 + scale2 × ln(-ln(1 - rischio non calibrato))))

TEST (node:test, nessuna dipendenza). Tolleranza ±0.1 punti percentuali.
Esempi ufficiali (materiale supplementare ESC, grafici dei paper):
- SCORE2, Low, 50 anni, fumatore, PAS 140, CT 6.3, HDL 1.4: M 6.3, F 4.3
- SCORE2, stessi dati, Moderate: M 8.1, F 5.2; High: M 8.8, F 7.1; Very high: M 15.1, F 14.1
- SCORE2-OP, Low, 75 anni, fumatore, PAS 140, CT 5.5, HDL 1.3: M 18.6, F 15.2
- SCORE2-Diabetes, Low, 60 anni, non fumatore, PAS 140, CT 5.5, HDL 1.3, diagnosi a 60 anni, HbA1c 50, eGFR 90: M 8.4, F 6.1
- stessi dati ma diagnosi a 50 anni, HbA1c 70, eGFR 60: M 12.9, F 9.8
- come il primo caso diabete ma fumatore: M 11.8, F 9.2
Altri casi (Low, non diabetici). Formato: età, sesso, fumo, PAS, CT, HDL → atteso %
45 M non fumatore 130 5.5 1.2 → 2.4
45 F fumatrice 130 5.5 1.5 → 2.6
55 M fumatore 140 6.0 1.1 → 8.5
55 F non fumatrice 125 5.0 1.6 → 2.0
69 M fumatore 140 5.23 1.24 → 12.9
69 F fumatrice 150 6.5 1.3 → 11.5
70 M non fumatore 140 5.5 1.3 → 9.3
75 M fumatore 150 6.0 1.2 → 22.2
75 F non fumatrice 140 6.0 1.6 → 9.5
82 F fumatrice 160 5.0 1.4 → 23.5
85 M non fumatore 130 4.5 1.1 → 22.4
SCORE2-Diabetes, Low:
55 M fumatore 145 5.8 1.0, diagnosi 48, HbA1c 58, eGFR 75 → 14.0
65 F non fumatrice 135 5.0 1.5, diagnosi 60, HbA1c 53, eGFR 55 → 9.2
45 M non fumatore 130 6.2 1.1, diagnosi 42, HbA1c 64, eGFR 95 → 5.5
Aggiungi test su:
- confini di età (39, 40, 69, 70, 89, 90) e scelta del modello;
- calcolo dell'età dalla data di nascita (anche il giorno del compleanno);
- validazione degli input;
- assegnazione delle categorie (incluse quelle di SCORE2-Diabetes);
- conversioni mg/dL e HbA1c %;
- CKD-EPI 2021, se implementato.

REPOSITORY
- Struttura chiara: /src (logica dei calcoli separata dall'interfaccia, moduli puri e testabili: score2.js, score2op.js, score2diabetes.js, categories.js), /tests, /docs.
- I testi del promemoria vanno in un file separato (es. reminders.it.json / reminders.de.json), facili da aggiornare quando cambiano le linee guida.
- README in italiano con: cos'è, fonti scientifiche con riferimenti, limiti d'uso, installazione su Mac e Windows passo per passo (per utenti non tecnici), come aggiornare.
- Disclaimer: strumento di supporto alla decisione clinica, non un dispositivo medico certificato.
- Licenza MIT (chiedimi conferma).
- GitHub Action che esegue i test e pubblica su GitHub Pages.
- Commit piccoli e descrittivi. Il repository GitHub lo creo io: dimmi tu quando e con che nome.

Alla fine, confronta alcuni casi con MDCalc (SCORE2, SCORE2-OP, SCORE2-Diabetes) e dimmi quali valori devo verificare io a mano.