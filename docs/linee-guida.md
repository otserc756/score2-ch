# Verifica dei contenuti sulle linee guida ESC

Verifica fatta il 22.11.2026. Confronta il testo della specifica ([specifica.md](specifica.md)) con le linee guida ESC in vigore.

Le tabelle delle linee guida su academic.oup.com sono in gran parte immagini. Per questo alcuni punti sono confermati solo da fonti secondarie: sono segnati **[da verificare]** e vanno controllati a mano sul PDF.

## Linee guida in vigore

| Ambito | Linea guida | Note |
|---|---|---|
| Prevenzione CV | ESC 2021 (Visseren, Eur Heart J 2021;42:3227) | Nessuna versione più recente |
| Dislipidemie | ESC/EAS 2019 + aggiornamento mirato 2025 (Mach, Eur Heart J 2025;46:4359) | Esiste un erratum dell'aggiornamento (Atherosclerosis 2026) |
| Diabete | ESC 2023 (Marx, Eur Heart J 2023;44:4043) | |
| Ipertensione | ESC 2024 (McEvoy, Eur Heart J 2024;45:3912) | |
| **Malattia CV e IRC** | **ESC/ERA 2026** (doi:10.1093/eurheartj/ehag098) | **Nuova: sostituisce le categorie di IRC di ESC 2021** |

## Differenze rispetto alla specifica, già applicate nel codice

1. **IRC: classificazione ESC/ERA 2026.**
   - Severa (molto alto): eGFR < 30 con qualsiasi albuminuria; eGFR 30–44 con ACR 3–30 mg/mmol; **ACR > 30 mg/mmol con qualsiasi eGFR**.
   - Moderata (alto): eGFR 30–44 con ACR < 3 mg/mmol; eGFR 45–59 con ACR 3–30 mg/mmol.
   - Cosa cambia rispetto alla specifica (ESC 2021):
     - eGFR ≥ 60 con ACR > 30 mg/mmol passa da **alto** a **molto alto**;
     - eGFR 45–59 con ACR > 30 mg/mmol, che nel 2021 non era classificato, ora è **molto alto**.
   - L'ACR si può inserire in mg/mmol (uso svizzero) o in mg/g. Il confronto si fa con le soglie dell'unità scelta, cioè 3/30 mg/mmol oppure 30/300 mg/g, per non spostare i casi al confine.
2. **Lp(a):** il fattore di rischio scatta già a **> 50 mg/dL (≥ 105 nmol/L)** (aggiornamento 2025). Si raccomanda di misurarla almeno una volta nella vita. La soglia > 180 mg/dL (≈ FH eterozigote) viene dal 2019 e resta valida.
3. **Nuovo modificatore: hs-CRP persistentemente > 2 mg/L** (aggiornamento 2025).
4. **Obiettivo LDL < 1.0 mmol/L** dopo un secondo evento entro 2 anni in terapia massimale con statina. Viene dal 2019 ("si può considerare"); il 2025 non lo modifica.
5. **SCORE2 basso-moderato:** ESC 2021 non fissa un obiettivo LDL esplicito e in genere non raccomanda di trattare. L'app indica < 2.6 mmol/L (< 3.0 se il rischio è basso).
6. **Pressione (2024):**
   - 120–129 mmHg se tollerata, confermata con misurazioni fuori dallo studio;
   - altrimenti il valore più basso ragionevolmente raggiungibile;
   - obiettivi meno stretti con età ≥ 85 anni, fragilità moderata-severa, ipotensione ortostatica sintomatica o aspettativa di vita limitata.
   - Aggiunta la categoria "PA elevata" (120–139/70–89): si considerano i farmaci se SCORE2 è ≥ 10% o in presenza di condizioni ad alto rischio.
7. **HMOD (2024), soglie precisate:**
   - calcio coronarico > 100 UA o ≥ 75° percentile;
   - placca carotidea ≥ 1.5 mm;
   - PWV brachio-caviglia > 14 m/s in alternativa a quella carotido-femorale;
   - albuminuria ≥ 3 mg/mmol (≥ 30 mg/g).
   - La retinopatia ipertensiva è ancora nell'elenco.
   - Un indice caviglia-braccio < 0.9 indica arteriopatia periferica, cioè ASCVD; nei promemoria è riportato così.
8. **Modificatori aggiunti:** menopausa precoce, diabete gestazionale, parto pretermine, etnia ad alto rischio, fragilità, obesità, inattività fisica, stress psicosociale.
9. **Statina indipendentemente dai lipidi** nelle persone con HIV dai 40 anni (2025) e nell'IRC con eGFR < 60 senza terapia sostitutiva renale (2026).
10. **Uso dello score:** l'aggiornamento 2025 conferma SCORE2/SCORE2-OP tra 40 e 89 anni, solo senza malattia CV nota. Va interpretato con cautela in chi è già in terapia ipolipemizzante.

## Decisioni prese

- **A. Categorie SCORE2/SCORE2-OP: ESC 2021, soglie per età** (decisione del 22.11.2026).
  - L'aggiornamento 2025 sulle dislipidemie (tab. 3) usa soglie **uniche**: < 2% basso, 2–< 10% moderato, 10–< 20% alto, ≥ 20% molto alto **[da verificare: fonte secondaria]**.
  - Per esempio, un sessantenne al 12% è "molto alto" per ESC 2021 e "alto" per il 2025, con obiettivi LDL diversi (< 1.4 contro < 1.8 mmol/L).
  - L'app segue ESC 2021, che è la linea guida di prevenzione.

## Punti aperti

- **B. Diabetici di 70 anni o più.**
  - ESC 2023 indica SCORE2-Diabetes per 40–69 anni e non dice nulla oltre i 70.
  - La linea guida ESC/ERA 2026 su CV e IRC indica SCORE2-Diabetes **dai 40 anni, senza limite superiore**.
  - L'app usa SCORE2-OP oltre i 69 anni, come nella specifica, con le soglie per età di ESC 2021, e mostra un avviso (`op_diabetes`).
- **C. Componente IRC (CKD add-on).** La linea guida 2026 raccomanda SCORE2 / SCORE2-OP con il "CKD add-on", cioè con eGFR e albuminuria nel modello, nei pazienti con IRC. Non è implementato: richiede coefficienti aggiuntivi (Matsushita et al., 2023) da reperire e verificare.

## Da verificare a mano sul PDF

- Tabella 4 di ESC/EAS 2019 (FH e fattore singolo marcatamente elevato: CT > 8, LDL > 4.9, PA ≥ 180/110). Confermata da fonti secondarie e dai titoli delle tabelle del 2021.
- Tabella 7 e figura 10 di ESC 2023 diabete: soglie 5/10/20% e obiettivi LDL per categoria. Per il rischio basso nel diabete la linea guida dice che "non si possono dare raccomandazioni chiare"; l'app indica < 3.0 mmol/L come nella linea guida generale sulle dislipidemie.
- Intervalli per l'avviso "fuori dal range del modello". Gli articoli non pubblicano limiti di input. SCORE2-OP tronca i predittori al 1° e al 99° percentile, con i valori nel materiale supplementare. Per ora l'app usa intervalli prudenziali: PAS 100–200 mmHg, CT 3–10 mmol/L, HDL 0.5–3 mmol/L, HbA1c 20–150 mmol/mol, eGFR 15–150.
- Obiettivo diastolico 70–79 mmHg (ESC 2024): non confermato sul testo, quindi non è stato inserito.
