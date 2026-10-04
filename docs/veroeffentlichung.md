# Website auf den bestehenden Server kopieren

Das Paket ist für die Hauptadresse `https://www.brandtschatz.de/` vorbereitet.
Die Website besteht aus statischen Dateien; auf dem Server werden weder Node.js
noch eine Datenbank benötigt. Die Online-Reservierung bleibt zurückgestellt.

## Vor dem Upload

Die Punkte in `RECHTLICHES-NOCH-PRUEFEN.md` beziehungsweise
`docs/rechtliches-offen.md` klären und die Rechtstexte bei Bedarf ergänzen.
Finale Werbetexte können später übernommen werden.

Im Webverzeichnis des bestehenden Servers die bisherige Website herunterladen
und als Sicherung behalten. Die vorhandene `.htaccess` ebenfalls sichern:
Falls sie zusätzliche Regeln enthält, diese mit der neuen Datei abgleichen.
Domain-, HTTPS- und E-Mail-Einstellungen bleiben im bestehenden Hosting.

## Upload

1. `brandtschatz-upload.zip` lokal entpacken.
2. Den **Inhalt** des entpackten Pakets in das Webverzeichnis der Domain kopieren,
   also dorthin, wo die bisherige `index.html` liegt. Die neue `index.html`
   muss direkt dort liegen, nicht in einem zusätzlichen Ordner `dist`.
3. Alle Unterordner und Dateien übertragen, einschließlich `assets`, `fonts`
   und der versteckten `.htaccess`. In Finder zeigt Cmd+Shift+. versteckte Dateien.
4. Bereits vorhandene gleichnamige Website-Dateien ersetzen. Alte Dateien und
   zusätzliche Serverkonfiguration erst nach erfolgreicher Prüfung bereinigen;
   E-Mail- oder Hostingdateien nicht löschen.

Die Anleitung und die rechtlichen Prüfpunkte liegen **neben** dem ZIP und
gehören nicht ins öffentliche Webverzeichnis. `src`, `node_modules`, `BIlder`,
Tests und interne Dokumentation sind nicht im ZIP enthalten.

## Direkt nach dem Upload

- `https://www.brandtschatz.de/` in einem privaten Browserfenster öffnen.
  Die Galerie muss Kastanienbaum, Gaststube, Oldtimer und Luftaufnahme zeigen.
- Auf Handy und Desktop Über uns, Angebot, Kontakt und den Café-Namen anklicken.
  Telefonnummern, E-Mail und Routenplanung kontrollieren.
- `https://www.brandtschatz.de/impressum.html` und
  `https://www.brandtschatz.de/datenschutz.html` öffnen.
- Prüfen, dass die Karte zunächst ausgeschaltet ist, per Klick lädt und
  wieder ausgeblendet werden kann.
- `https://www.brandtschatz.de/absichtlich-nicht-vorhanden` öffnen. Die eigene
  Fehlerseite muss mit HTTP-Status 404 erscheinen. Apache benötigt dafür
  die Unterstützung der `.htaccess`-Direktive `ErrorDocument`.
- Kontrollieren, dass Domainvarianten und HTTP auf die gewählte HTTPS-Adresse
  zeigen. Bestehende Weiterleitungen im Hosting prüfen; bei Bedarf dort korrigieren.
- `https://www.brandtschatz.de/social-preview.jpg`, `/robots.txt` und `/sitemap.xml`
  öffnen. Die tatsächliche Linkvorschau externer Plattformen ist erst nach
  Veröffentlichung prüfbar; solche Plattformen können alte Vorschauen zwischenspeichern.

Bei einem Fehler die gesicherten Website-Dateien zurückkopieren. Die endgültige
Live-Prüfung ist vor dem Upload noch nicht möglich.

## Neue Version erzeugen

Im Projekt einmal `npm ci` und `npx playwright install chromium firefox webkit`
ausführen. Danach `npm run release`: Der Befehl prüft den Code, baut die Website,
testet drei Browser und erzeugt das ZIP sowie eine Liste der Dateiprüfsummen
unter `release/`. Das Verpacken verwendet das auf macOS vorhandene Programm `zip`.

Nach einem erfolgreichen Upload die geänderten Dateien und das neue Paket
zusammen mit einem Datum aufbewahren. Pflegehinweise stehen in `docs/pflege.md`.
