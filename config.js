/*
 * Impostazioni predefinite dell'app.
 *
 * Si possono cambiare qui (utile per l'installazione da cartella locale) oppure
 * direttamente nell'app, da "Impostazioni": quelle salvate nell'app hanno la precedenza.
 * Non scrivere qui dati di pazienti.
 */
window.ESC_CONFIG = {
  uiLanguage: 'it',      // 'it' | 'de'
  sheetLanguage: 'it',   // lingua del foglio paziente: 'it' | 'de'
  region: 'low',         // 'low' (Svizzera) | 'moderate' | 'high' | 'veryHigh'
  practice: {
    name: '',            // es. 'Studio medico ...'
    doctors: '',         // es. 'Dr. med. ...'
    specialty: '',       // es. 'Medicina interna generale FMH'
    address: '',
    phone: '',
    email: '',
    logo: ''             // data URL di un'immagine (meglio caricarla dalle impostazioni dell'app)
  }
};
