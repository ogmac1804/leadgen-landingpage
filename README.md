# LeadGen Landingpage

B2B Whitepaper-Landingpage mit direkter Brevo-Integration. Keine Datenbank, kein Backend – nur statische Dateien + Brevo JavaScript Tracker.

## Features

- Professionelle Whitepaper-Download Landingpage (responsive)
- Formular-Daten gehen direkt an Brevo (kein eigener Server noetig)
- Brevo Conversations Chatbot integriert
- Bot-Schutz (Honeypot + Timing-Check)
- DSGVO-konformes Consent-Handling
- Client-seitige Validierung
- Conversion Tracking (Google Analytics + LinkedIn ready)

## Struktur

```
LeadGen-Landingpage/
├── starten.bat          Doppelklick → startet lokalen Webserver + Browser
├── index.html           Landingpage mit Formular + Chatbot
├── bestaetigt.html      Bestaetigungsseite nach DOI
├── css/
│   └── landing.css      Styling (DM Sans + DM Serif Display)
└── js/
    └── leadform.js      Formular-Handler mit Brevo Tracker
```

## Schnellstart

1. **Doppelklick auf `starten.bat`** – startet einen lokalen Webserver auf Port 3000 und oeffnet den Browser
2. Die Landingpage ist unter **http://localhost:3000** erreichbar

### Voraussetzungen

- Python 3.x (fuer den lokalen Webserver via `python -m http.server`)
- Brevo Account mit aktiviertem Conversations-Widget und Automation

## Konfiguration

### Brevo Client Key

In `js/leadform.js` den Client Key anpassen (falls noetig):

```javascript
var BREVO_CLIENT_KEY = 'DEIN_KEY_HIER';
```

Den Key findest du unter: **Brevo Dashboard → Automation → Settings**

### Brevo Conversations

Die Conversations-ID ist in `index.html` und `bestaetigt.html` konfiguriert:

```javascript
w.BrevoConversationsID = 'DEINE_ID_HIER';
```

### Brevo Automation (empfohlen)

Richte in Brevo einen Automation-Workflow ein:

1. **Trigger:** Website-Event `whitepaper_request`
2. **Aktion:** Kontakt zu Liste hinzufuegen
3. **Aktion:** E-Mail mit Whitepaper-Download senden

## Deployment

Die Seite besteht aus statischen Dateien und kann ueberall gehostet werden:

- **Netlify** – Ordner einfach per Drag & Drop hochladen
- **GitHub Pages** – Direkt aus diesem Repo
- **Beliebiger Webserver** – Dateien kopieren, fertig

## Technologie

- HTML5, CSS3, Vanilla JavaScript (kein Framework)
- [Brevo JavaScript Tracker](https://developers.brevo.com/docs/getting-started-with-js-implementation) fuer Kontakt-Erstellung
- [Brevo Conversations](https://www.brevo.com/products/conversations/) fuer Live-Chat
- Google Fonts (DM Sans, DM Serif Display)

## Lizenz

MIT
