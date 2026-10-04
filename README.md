# Café Brandtschatz

Website für das Café am Ankersee in Lankau/OT Anker. React, TypeScript und Vite
werden lokal für die Entwicklung verwendet. Der Build liefert eine statische,
auch ohne JavaScript lesbare Startseite sowie eigene Impressums-, Datenschutz-
und Fehlerseiten für den bestehenden Webserver.

## Entwicklung

```sh
npm ci
npm run dev
```

Bilder erzeugen: `npm run images:optimize`. Produktion bauen: `npm run build`.
Vorschau der fertigen Dateien: `npm run preview`.

## Prüfung und Upload-Paket

```sh
npx playwright install chromium firefox webkit
npm run release
```

`npm run release` führt Lint, Build und 18 Browserprüfungen aus. Danach entstehen
`release/brandtschatz-upload.zip`, Dateiprüfsummen und die Upload-Anleitung.
Der Server benötigt nur die Inhalte des ZIP, einschließlich `.htaccess`.
Das Verpacken nutzt `zip`, das auf macOS vorhanden ist.

## Dokumentation

- [Aktueller Status](docs/website-status.md)
- [Veröffentlichung auf dem bestehenden Server](docs/veroeffentlichung.md)
- [Noch zu bestätigende rechtliche Angaben](docs/rechtliches-offen.md)
- [Inhalte und Bilder pflegen](docs/pflege.md)
- [Bildauswahl und Optimierung](docs/bilder.md)

Finale Werbetexte kommen später. Die Rechtstexte sind vorbereitet, müssen anhand
der noch unbekannten Unternehmens- und Hostingangaben abschließend geprüft
werden. Die endgültige Live-Prüfung erfolgt nach dem manuellen Upload.

Die Online-Reservierung liegt auf `codex/reservierungen-pausiert` und bleibt
zurückgestellt. Eine spätere Astro-Migration ist für diesen Stand nicht nötig.
