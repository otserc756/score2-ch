# SCORE2 · Rischio cardiovascolare a 10 anni

App per calcolare il rischio cardiovascolare a 10 anni con **SCORE2**, **SCORE2-OP** e **SCORE2-Diabetes** della Società Europea di Cardiologia (ESC). È calibrata per la Svizzera, che appartiene alla regione a basso rischio. È pensata per lo studio di medicina generale, in italiano e in tedesco.

> **Avvertenza.** È uno strumento di supporto alla decisione clinica, **non un dispositivo medico certificato**. Il risultato va interpretato dal medico, insieme alla situazione clinica del paziente.

> **Versione beta (0.9).** L'app è in fase di prova in studio. Le versioni 0.x sono pubblicate su GitHub come «pre-release»; la 1.0 arriverà dopo il periodo di test. Cosa cambia in ogni versione: [note di versione](CHANGELOG.md).

## Cosa fa

- **Sceglie il modello in automatico** e indica sempre quale ha usato:
  - SCORE2 tra 40 e 69 anni senza diabete;
  - SCORE2-Diabetes tra 40 e 69 anni con diabete tipo 2;
  - SCORE2-OP tra 70 e 89 anni.
- **Calcola** il rischio a 10 anni e la categoria (soglie per età ESC 2021, oppure ESC 2023 per il diabete), il non-HDL, l'LDL con Friedewald e l'obiettivo LDL.
- **Controllo preliminare** delle condizioni che definiscono il rischio senza bisogno dello score: ASCVD, danno d'organo da diabete, insufficienza renale cronica, ipercolesterolemia familiare, fattore singolo marcatamente elevato. L'app propone le caselle deducibili dai valori inseriti.
- **«Cosa cambia se…»:** stima del rischio smettendo di fumare, con PAS 130 mmHg, con il colesterolo totale ridotto di 1 mmol/L e, nel diabete, con HbA1c 53 mmol/mol.
- **Riga per la cartella clinica** (Axenita), da copiare con un clic, senza dati anagrafici.
- **Foglio A4 per il paziente**, a colori e leggibile anche in bianco e nero, da stampare o salvare in PDF.
- **Promemoria per il medico**, con le fonti delle linee guida ESC per ogni voce.
- **Due lingue**, italiano e tedesco. La lingua del foglio paziente si sceglie a parte da quella dell'interfaccia.

## Privacy

- Tutti i calcoli avvengono **nel computer**, dentro il browser. Nessun dato viene inviato in rete: la pagina blocca qualsiasi connessione verso l'esterno.
- **I dati del paziente non vengono salvati**: chiudendo la pagina o premendo «Nuovo paziente» spariscono.
- Si salvano solo le **impostazioni dello studio**, nel browser: lingue, regione di rischio, intestazione e logo. Oltre a queste, il browser ricorda solo che l'avviso iniziale è stato confermato.
- Durante la beta il sito chiede ai motori di ricerca di **non indicizzarlo**: per usarlo serve il link.
- Nessuna statistica d'uso, nessun font o script esterno.

## Installazione

Ci sono due modi. Il primo è il più comodo, perché si aggiorna da solo.

### A. Come app dal sito (consigliato)

L'indirizzo dell'app è: **https://otserc756.github.io/score2-ch/**

**Mac o Windows con Google Chrome o Microsoft Edge**
1. Apri l'indirizzo qui sopra.
2. Nella barra degli indirizzi, a destra, clicca sull'icona «Installa» (un monitor con una freccia). In alternativa: menu ⋮ → «Trasmetti, salva e condividi» → «Installa pagina come app» (Chrome), oppure menu … → «App» → «Installa questo sito come app» (Edge).
3. L'app compare nel Launchpad o nel Dock (Mac), oppure nel menu Start (Windows), con la sua icona.

**Mac con Safari** (macOS Sonoma 14 o più recente)
1. Apri l'indirizzo in Safari.
2. Menu **Archivio → Aggiungi al Dock…** e conferma.

Dopo la prima apertura l'app funziona anche **senza internet**.

### B. Da una cartella sul computer (senza internet)

1. Apri la pagina delle release del progetto su GitHub: **https://github.com/otserc756/score2-ch/releases**
2. Scarica il file `score2-ch-vX.Y.Z.zip` dell'ultima versione.
3. Fai doppio clic sullo zip per estrarlo e sposta la cartella `score2-ch` dove preferisci, per esempio in Documenti.
4. Apri la cartella e fai doppio clic su **`index.html`**: l'app si apre nel browser.
5. Per ritrovarla facilmente aggiungi la pagina ai preferiti, oppure crea un alias sulla scrivania: sul Mac tasto destro → «Crea alias», su Windows tasto destro → «Crea collegamento».

In questo modo l'app non si installa come app vera e propria e non si aggiorna da sola.

## Primo avvio: impostazioni dello studio

Clicca su **Impostazioni** in alto a destra e compila:
- nome dello studio, medico o medici, specialità, indirizzo, telefono, email;
- facoltativo: il logo, in PNG, JPG o SVG, fino a 300 KB;
- lingua del foglio paziente.

Le impostazioni restano **solo in quel browser e su quel computer**. Per portarle su un altro computer usa **Esporta impostazioni** e poi **Importa impostazioni**. Conviene esportarle anche come copia di sicurezza.

## Aggiornamenti

- **App dal sito (A):** si aggiorna da sola. Quando esce una nuova versione, il browser la scarica in sottofondo e la usa dalla riapertura successiva. La versione in uso si legge in fondo alle Impostazioni.
- **Cartella (B):** scarica lo zip nuovo e sostituisci la cartella. Le impostazioni restano nel browser. Se le perdi, reimportale dal file esportato.

## Fonti scientifiche

- SCORE2 working group and ESC Cardiovascular risk collaboration. *SCORE2 risk prediction algorithms.* Eur Heart J 2021;42:2439-2454. doi:10.1093/eurheartj/ehab309
- SCORE2-OP working group and ESC Cardiovascular risk collaboration. *SCORE2-OP risk prediction algorithms.* Eur Heart J 2021;42:2455-2467. doi:10.1093/eurheartj/ehab312
- SCORE2-Diabetes working group and ESC Cardiovascular risk collaboration. *SCORE2-Diabetes.* Eur Heart J 2023;44:2544-2556. doi:10.1093/eurheartj/ehad260
- Visseren FLJ et al. *2021 ESC Guidelines on cardiovascular disease prevention in clinical practice.* Eur Heart J 2021;42:3227-3337. doi:10.1093/eurheartj/ehab484
- Marx N et al. *2023 ESC Guidelines for the management of cardiovascular disease in patients with diabetes.* Eur Heart J 2023;44:4043-4140. doi:10.1093/eurheartj/ehad192
- McEvoy JW et al. *2024 ESC Guidelines for the management of elevated blood pressure and hypertension.* Eur Heart J 2024;45:3912-4018. doi:10.1093/eurheartj/ehae178
- Mach F et al. *2019 ESC/EAS Guidelines for the management of dyslipidaemias.* Eur Heart J 2020;41:111-188. doi:10.1093/eurheartj/ehz455
- Mach F et al. *2025 Focused Update of the 2019 ESC/EAS Guidelines for the management of dyslipidaemias.* Eur Heart J 2025;46:4359.
- *2026 ESC/ERA Guidelines on cardiovascular disease and chronic kidney disease.* Eur Heart J 2026. doi:10.1093/eurheartj/ehag098
- Inker LA et al. *New creatinine- and cystatin C-based equations to estimate GFR without race* (CKD-EPI 2021). N Engl J Med 2021;385:1737-1749.

I coefficienti dei modelli sono stati confrontati con il pacchetto R RiskScorescvd e con gli esempi pubblicati dall'ESC. Il confronto puntuale con le linee guida, le scelte fatte e i punti aperti sono in [docs/linee-guida.md](docs/linee-guida.md).

## Limiti d'uso

- Vale per **persone senza malattia cardiovascolare nota**, tra 40 e 89 anni. Fuori da questa fascia d'età lo score non viene calcolato.
- In presenza di ASCVD, danno d'organo severo da diabete, IRC moderata o severa o ipercolesterolemia familiare **lo score non si applica**: la categoria è data dalla condizione.
- In chi assume già farmaci ipolipemizzanti, il rischio va interpretato con cautela.
- Gli scenari «cosa cambia se» sono **stime indicative**: i modelli predicono il rischio di chi ha quei valori, non l'effetto di un intervento.
- Per i diabetici dai 70 anni si usa SCORE2-OP, che considera il diabete ma non HbA1c, eGFR ed età alla diagnosi.
- L'app non sostituisce la valutazione clinica né le linee guida originali.

## Per chi sviluppa

- **Nessuna dipendenza e nessun passaggio di compilazione.** HTML, CSS e JavaScript semplice, che funzionano anche aprendo `index.html` da una cartella.
- **Struttura del codice:**
  - `src/calc/`: il motore di calcolo, con funzioni pure e testabili (modelli, categorie, checklist, scenari, conversioni, eGFR);
  - `src/ui/`: l'interfaccia, la riga per Axenita, il foglio paziente, le impostazioni e la registrazione dell'app installabile;
  - `src/i18n/`: i testi dell'interfaccia. Per aggiungere il francese: copiare `it.js` in `fr.js`, tradurlo e aggiungere `'fr'` in `i18n.js`, `settings.js` e `index.html`;
  - `src/reminders/`: i promemoria per il medico e le fonti, facili da aggiornare quando cambiano le linee guida;
  - `config.js`: le impostazioni predefinite;
  - `docs/`: la specifica e la verifica sulle linee guida.
- **Test**, con due possibilità:
  - con Node.js:
    ```bash
    node --test tests/*.test.js
    ```
  - senza Node: aprire `tests/index.html` nel browser.
- **Prova in locale:**
  ```bash
  python3 -m http.server 8765
  ```
  Poi aprire http://localhost:8765. Con `?anteprima` nell'indirizzo si vede il foglio A4 a schermo; con `?sw` si attiva la modalità offline anche in locale.
- **Pubblicazione.** A ogni modifica sul branch `main`, una GitHub Action esegue i test e pubblica il sito su GitHub Pages. Un tag `vX.Y.Z` crea una release con lo zip da scaricare.

## Licenza

[MIT](LICENSE). Il software è fornito «così com'è», senza garanzie.
