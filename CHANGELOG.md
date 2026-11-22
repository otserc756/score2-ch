# Note di versione

Qui trovi cosa cambia in ogni versione dell'app.
Le versioni 0.x sono **beta**, in prova in studio. Su GitHub sono pubblicate come «pre-release».

Il formato di ogni versione è: **Aggiunto** (funzioni nuove), **Modificato** (cambiamenti a funzioni esistenti), **Corretto** (errori risolti), **Contenuti clinici** (cambiamenti di soglie, obiettivi o testi basati sulle linee guida).

## [0.9.2] – 22.11.2026

### Aggiunto
- **Avviso al primo avvio**, in italiano o tedesco:
  - strumento di supporto alla decisione clinica per medici, non un dispositivo medico certificato;
  - il risultato va interpretato dal medico, sotto la sua responsabilità;
  - è una versione beta;
  - i dati dei pazienti non vengono salvati né inviati.

  Si conferma una volta per browser. Se il testo dell'avviso cambia in modo sostanziale, viene richiesto di nuovo.

### Modificato
- **Fuori dai motori di ricerca:** il sito chiede ai motori di ricerca di non indicizzare né archiviare la pagina. Chi ha il link la usa come prima.
- **Sito pubblicato senza README e licenza:** restano nel repository e nello zip della release.

## [0.9.1] – 22.11.2026

### Aggiunto
- **Confronto con le soglie ESC/EAS 2025.**
  - Quando la categoria calcolata con le soglie fisse dell'aggiornamento ESC/EAS 2025 sulle dislipidemie è diversa da quella principale, il risultato mostra una nota per il medico con l'obiettivo LDL corrispondente.
  - La nota non compare per SCORE2-Diabetes, né quando la categoria è decisa dal controllo preliminare.
- **Opzione per la riga Axenita.** Nelle Impostazioni si può aggiungere «(ESC/EAS 2025: …)» alla riga per la cartella clinica. Di serie è disattivata.
- **Note di versione** nel file `CHANGELOG.md`; le release su GitHub riportano lo stesso testo.

### Contenuti clinici
- **Categoria principale invariata:** restano le soglie per età di ESC 2021, in linea con AGLA 2025, con la guida per la medicina di famiglia USZ 2026 e con il calcolatore ESC HeartScore.
- **Obiettivo non-HDL per il rischio basso:** < 3.8 mmol/L (guida USZ 2026). Compare sul foglio paziente e nei promemoria.
- **Promemoria nuovi:**
  - le due classificazioni (2021 e 2025) e come comportarsi nei casi discordanti;
  - gli obiettivi secondari non-HDL per tutte le categorie.
- **Nuova fonte:** Rosemann A et al., DIM-USZ, «Hausärztliche Guideline Dyslipidämie», 08/2026.

### Verifiche
- **Confronto con MDCalc:** 36 casi su 36 identici, per SCORE2, SCORE2-OP e SCORE2-Diabetes in tutte le regioni di rischio. I casi nuovi sono entrati nei test automatici (vedi `docs/confronto-mdcalc.md`).
- **Test automatici:** 208.

## [0.9.0] – 22.11.2026

Prima versione beta.

### Aggiunto
- **Calcolo del rischio cardiovascolare a 10 anni:**
  - SCORE2 per 40–69 anni;
  - SCORE2-Diabetes per 40–69 anni con diabete tipo 2;
  - SCORE2-OP per 70–89 anni.

  Il modello si sceglie in automatico, con la regione a basso rischio (Svizzera) di serie e le altre 3 regioni selezionabili.
- **Categorie di rischio** ESC 2021 (soglie per età) ed ESC 2023 per il diabete, con l'obiettivo LDL di ogni categoria.
- **Controllo preliminare:** ASCVD, danno d'organo severo da diabete, IRC (classificazione ESC/ERA 2026 con ACR in mg/mmol o mg/g), ipercolesterolemia familiare, fattore singolo marcatamente elevato. L'app propone le caselle deducibili dai valori inseriti.
- **Strumenti di calcolo:**
  - eGFR dalla creatinina (CKD-EPI 2021);
  - LDL con Friedewald;
  - non-HDL;
  - conversioni mg/dL ↔ mmol/L e HbA1c % ↔ mmol/mol.
- **«Cosa cambia se…»:** smettere di fumare, PAS 130 mmHg, colesterolo totale −1 mmol/L, HbA1c 53 mmol/mol, e tutti i cambiamenti insieme.
- **Riga per la cartella clinica (Axenita)**, senza dati anagrafici, con il pulsante Copia.
- **Foglio A4 per il paziente**, a colori e leggibile in bianco e nero, su una sola pagina, salvabile in PDF.
- **Promemoria per il medico** con le fonti ESC per ogni voce.
- **Interfaccia e foglio paziente in italiano e tedesco**, con la lingua del foglio scelta a parte.
- **Impostazioni dello studio:** intestazione, logo, lingue e regione, con esportazione e importazione su file.
- **Installazione come app** (Chrome, Edge, Safari), funzionamento offline e aggiornamenti automatici. In alternativa si può usare lo zip da aprire in una cartella.
- **Privacy:** nessun dato del paziente salvato o inviato; la pagina blocca qualsiasi connessione verso l'esterno.

[0.9.2]: https://github.com/otserc756/score2-ch/releases/tag/v0.9.2
[0.9.1]: https://github.com/otserc756/score2-ch/releases/tag/v0.9.1
[0.9.0]: https://github.com/otserc756/score2-ch/releases/tag/v0.9.0
