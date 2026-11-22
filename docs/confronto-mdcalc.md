# Confronto con MDCalc

Confronto fatto il 22.11.2026 con i calcolatori MDCalc:
- [SCORE2](https://www.mdcalc.com/calc/10499/systematic-coronary-risk-evaluation-score2)
- [SCORE2-OP](https://www.mdcalc.com/calc/10503/score2-older-persons-score2-op)
- [SCORE2-Diabetes](https://www.mdcalc.com/calc/10510/score2-diabetes)

I valori di MDCalc sono stati inseriti nei loro moduli e letti dal risultato. I valori dell'app vengono dal suo motore di calcolo, arrotondati a un decimale come nell'interfaccia.

**Risultato: 36 casi su 36 identici, con differenza 0.0 punti percentuali.**

I casi che non vengono dagli esempi ESC sono stati aggiunti ai test automatici ([tests/mdcalc.test.js](../tests/mdcalc.test.js)).

## SCORE2

Colonne: età, sesso, fumo, PAS (mmHg), CT e HDL (mmol/L), regione.

| Età | Sesso | Fumo | PAS | CT | HDL | Regione | MDCalc | App |
|---|---|---|---|---|---|---|---|---|
| 69 | M | sì | 140 | 5.23 | 1.24 | bassa | 12.9% | 12.9% |
| 50 | M | sì | 140 | 6.3 | 1.4 | bassa | 6.3% | 6.3% |
| 50 | F | sì | 140 | 6.3 | 1.4 | bassa | 4.3% | 4.3% |
| 50 | M | sì | 140 | 6.3 | 1.4 | moderata | 8.1% | 8.1% |
| 50 | F | sì | 140 | 6.3 | 1.4 | alta | 7.1% | 7.1% |
| 50 | M | sì | 140 | 6.3 | 1.4 | molto alta | 15.1% | 15.1% |
| 45 | M | no | 130 | 5.5 | 1.2 | bassa | 2.4% | 2.4% |
| 45 | F | sì | 130 | 5.5 | 1.5 | bassa | 2.6% | 2.6% |
| 55 | M | sì | 140 | 6.0 | 1.1 | bassa | 8.5% | 8.5% |
| 55 | F | no | 125 | 5.0 | 1.6 | bassa | 2.0% | 2.0% |
| 69 | F | sì | 150 | 6.5 | 1.3 | bassa | 11.5% | 11.5% |
| 40 | F | no | 110 | 4.2 | 1.8 | bassa | 0.4% | 0.4% |
| 62 | M | no | 175 | 7.8 | 0.9 | bassa | 12.9% | 12.9% |

## SCORE2-OP

| Età | Sesso | Diabete | Fumo | PAS | CT | HDL | Regione | MDCalc | App |
|---|---|---|---|---|---|---|---|---|---|
| 75 | M | no | sì | 140 | 5.5 | 1.3 | bassa | 18.6% | 18.6% |
| 75 | F | no | sì | 140 | 5.5 | 1.3 | bassa | 15.2% | 15.2% |
| 70 | M | no | no | 140 | 5.5 | 1.3 | bassa | 9.3% | 9.3% |
| 75 | M | no | sì | 150 | 6.0 | 1.2 | bassa | 22.2% | 22.2% |
| 75 | F | no | no | 140 | 6.0 | 1.6 | bassa | 9.5% | 9.5% |
| 82 | F | no | sì | 160 | 5.0 | 1.4 | bassa | 23.5% | 23.5% |
| 85 | M | no | no | 130 | 4.5 | 1.1 | bassa | 22.4% | 22.4% |
| 78 | F | sì | no | 145 | 5.2 | 1.3 | bassa | 21.4% | 21.4% |
| 72 | M | sì | sì | 155 | 6.1 | 1.0 | bassa | 35.2% | 35.2% |
| 89 | M | sì | no | 170 | 4.0 | 1.0 | bassa | 32.3% | 32.3% |
| 75 | M | no | sì | 140 | 5.5 | 1.3 | alta | 27.8% | 27.8% |

## SCORE2-Diabetes

Colonne aggiuntive: età alla diagnosi (anni), HbA1c (mmol/mol), eGFR (mL/min/1.73 m²).

| Età | Sesso | Fumo | PAS | CT | HDL | Diagnosi | HbA1c | eGFR | Regione | MDCalc | App |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 60 | M | no | 140 | 5.5 | 1.3 | 60 | 50 | 90 | bassa | 8.4% | 8.4% |
| 60 | F | no | 140 | 5.5 | 1.3 | 60 | 50 | 90 | bassa | 6.1% | 6.1% |
| 60 | M | no | 140 | 5.5 | 1.3 | 50 | 70 | 60 | bassa | 12.9% | 12.9% |
| 60 | F | no | 140 | 5.5 | 1.3 | 50 | 70 | 60 | bassa | 9.8% | 9.8% |
| 60 | M | sì | 140 | 5.5 | 1.3 | 60 | 50 | 90 | bassa | 11.8% | 11.8% |
| 60 | F | sì | 140 | 5.5 | 1.3 | 60 | 50 | 90 | bassa | 9.2% | 9.2% |
| 55 | M | sì | 145 | 5.8 | 1.0 | 48 | 58 | 75 | bassa | 14.0% | 14.0% |
| 65 | F | no | 135 | 5.0 | 1.5 | 60 | 53 | 55 | bassa | 9.2% | 9.2% |
| 45 | M | no | 130 | 6.2 | 1.1 | 42 | 64 | 95 | bassa | 5.5% | 5.5% |
| 50 | F | sì | 160 | 6.8 | 0.9 | 40 | 86 | 35 | bassa | 27.5% | 27.5% |
| 68 | M | no | 120 | 4.0 | 1.6 | 66 | 44 | 110 | bassa | 9.3% | 9.3% |
| 60 | M | no | 140 | 5.5 | 1.3 | 50 | 70 | 60 | moderata | 17.2% | 17.2% |

## Differenze di impostazione rispetto a MDCalc

Non riguardano i numeri, ma come vengono interpretati.

1. **Categorie di rischio di SCORE2.**
   - MDCalc usa le soglie uniche dell'aggiornamento ESC/EAS 2025 sulle dislipidemie: < 2% basso, 2–< 10% moderato, 10–< 20% alto, ≥ 20% molto alto.
   - L'app usa, per scelta, le soglie per età di ESC 2021 prevenzione (vedi [linee-guida.md](linee-guida.md), decisione A).
   - Esempio: 69 anni, 12.9% → per l'app è «molto alto» (obiettivo LDL < 1.4 mmol/L), per MDCalc è «alto» (< 1.8 mmol/L).
   - La pagina MDCalc conferma così anche le soglie della tabella 3 del 2025, che nella verifica precedente risultavano solo da fonte secondaria.
2. **Diabetici dai 70 anni.** Anche MDCalc indica SCORE2-Diabetes fino a 69 anni e rimanda a SCORE2-OP dai 70 anni, come l'app.
3. **IRC.** MDCalc riprende le categorie del 2025: IRC moderata con eGFR 30–59, severa con eGFR < 30. L'app segue la linea guida ESC/ERA 2026, che tiene conto anche dell'albuminuria.
4. **Limiti di età.** MDCalc accetta età fuori da 40–69 anni (SCORE2) e da 70–89 anni (SCORE2-OP) senza bloccare il calcolo. L'app invece non calcola fuori da 40–89 anni.

## Cosa resta da verificare a mano

Le formule coincidono con due fonti indipendenti (esempi ESC e MDCalc). Restano da controllare le parti che nessun calcolatore esterno copre.

1. **Un caso con il calcolatore ufficiale ESC.** Usa l'app «ESC CVD Risk Calculation» o il sito heartscore.escardio.org, regione «Low risk». Prova per esempio 69 M fumatore, PAS 140, CT 5.23, HDL 1.24: atteso 12.9%. È una terza fonte, quella ufficiale.
2. **Categorie al confine.** Inserisci nell'app casi vicini alle soglie e controlla la categoria. Per esempio:
   - 49 anni al 2.5% → «alto»;
   - 50 anni al 4.9% → «basso-moderato»;
   - 70 anni al 7.5% → «alto».
3. **IRC con ACR in mg/mmol** (classificazione ESC/ERA 2026). Inserisci nell'app i casi seguenti e controlla quale classe propone il suggerimento:
   - eGFR 40 con ACR 2 → moderata;
   - eGFR 40 con ACR 5 → severa;
   - eGFR 75 con ACR 35 → severa;
   - eGFR 50 senza ACR → l'app chiede l'ACR.
4. **eGFR CKD-EPI 2021.** Confronta 2–3 creatinine con il calcolatore NKF o con quello del laboratorio. Per esempio 80 µmol/L, uomo di 60 anni, oppure 140 µmol/L, uomo di 60 anni. Attenzione: il laboratorio a volte usa ancora CKD-EPI 2009.
5. **LDL Friedewald e conversioni.** Controlla un caso: CT 5.5, HDL 1.3, TG 1.5 → LDL 3.52 mmol/L. Poi le conversioni: HbA1c 7% → 53 mmol/mol; colesterolo 200 mg/dL → 5.17 mmol/L.
6. **Testi clinici.**
   - Rileggi i promemoria e il foglio paziente.
   - Fai rileggere la versione tedesca a un collega di lingua tedesca, in particolare i consigli e la frase «Von 100 Personen…».
7. **Punti aperti delle linee guida** (vedi [linee-guida.md](linee-guida.md)): le tabelle ESC 2019 e ESC 2023 da controllare sul PDF, e gli intervalli che fanno scattare l'avviso «fuori dal range del modello».
8. **Uso reale in studio.** Prova la riga incollata in Axenita, la stampa sulla stampante dello studio e l'installazione sugli altri computer, Mac e Windows.
