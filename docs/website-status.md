# Website-Status

Stand: 4. Oktober 2026.

- [ ] 1. Finale Texte übernehmen; die Texte werden später geliefert.
- [x] 2. Angaben bestätigen: Öffnungszeiten, Saison, Adresse, Kontaktdaten und weitere Café-Angaben wurden vom Nutzer bestätigt.
- [x] 3. Bildauswahl und Optimierung: WebP-Dateien in passenden Größen eingebunden; die aktuelle Auswahl wurde bestätigt.
- [x] 4. Gestaltung und Navigation prüfen: Abstände und Klickflächen korrigiert, Smartphone-, Tablet- und Desktop-Darstellung geprüft.
- [ ] 5. Rechtliche Prüfung abschließen: Impressum und Datenschutzseite sind vorbereitet. Unbekannte Angaben stehen in [rechtliches-offen.md](rechtliches-offen.md).
- [x] 6. Barrierefreiheit und Kontaktlinks prüfen: Tastaturbedienung, Kontraste, Kartenfreigabe, Bilder und Links in Chrome, Firefox und WebKit getestet.
- [x] 7. Suchmaschinenangaben, Social-Media-Vorschau und Fehlerseite fertigstellen: Metadaten, strukturierte Café-Angaben, Sitemap, lokale Vorschau und echte 404 im Produktionspreview vorhanden.
- [ ] 8. Veröffentlichung: Der fertige Stand ist lokal gesichert und das Upload-Paket erstellt. Der Nutzer kopiert die Dateien auf den bestehenden Server; Livegang steht noch aus.
- [ ] 9. Live-Prüfung nach dem Upload: Die Pflege- und Prüfanleitung ist fertig, die Prüfung der neuen öffentlichen Website steht noch aus.

## Bestätigte Gestaltung

Die Galerie enthält vier Bilder: Kastanienbaum, Gaststube, Außenansicht mit
Oldtimer und Luftaufnahme. Die beiden übrigen Gartenbilder sind entfernt.
Die kleinen umrandeten Beschriftungen über den Abschnittsüberschriften sind
auf der gesamten Seite entfernt.

Navigation und Fußzeilenlinks haben mindestens 44 Pixel hohe Klickflächen.
Textkarten und Öffnungszeiten werden nicht unnötig auf die Höhe benachbarter
Karten gestreckt. Die Absätze im Über-uns-Bereich haben gleichmäßige Abstände.
Tastaturfokus ist sichtbar; der Café-Name verlinkt den Anfang der gesamten Seite.

Die gebaute Website wurde in Chrome, Firefox und WebKit bei 320, 390, 680,
681, 820, 930, 931, 1120, 1121 und 1440 Pixeln Breite geprüft. WebKit ist die
Browser-Engine von Safari; dies ist keine Prüfung auf einem echten iPhone.
Die Galerie und alle Fotos laden, Sprungziele und die Rückkehr zum Seitenanfang
funktionieren. Es wurden keine horizontalen Überläufe oder JavaScript-Fehler
festgestellt. Alle 18 Playwright-Prüfungen sowie Build und Lint sind erfolgreich.
Die Axe-Prüfung ergab keine Befunde für die geprüften WCAG-A/AA-Regeln auf
Startseite, Impressum, Datenschutz und Fehlerseite sowie bei aktivierter Karte.
Dies bestätigt keine vollständige WCAG-Konformität.

## Datenschutz und Technik

Schriften und Fotos kommen vom eigenen Webserver. Die Seite verwendet selbst
keine Cookies, Analyse, Werbung oder dauerhaften Browserspeicher. Die
OpenStreetMap-Karte wird ausschließlich nach Freigabe geladen; die Freigabe
lässt sich auf derselben Seite widerrufen und wird nicht dauerhaft gespeichert.
Die komplette Startseite und die rechtlichen Seiten sind ohne JavaScript lesbar.

Die bisherige ungeprüfte Umsatzsteuer-ID wurde aus der öffentlichen Darstellung
entfernt. Register, Erlaubnis, Identifikationsnummer, Verbraucherschlichtung und
die tatsächlichen Hostingangaben müssen noch bestätigt werden. Die
Datenschutzerklärung ist bis zur Prüfung dieser Angaben ein Entwurf.

## Upload und Pflege

`release/brandtschatz-upload.zip` enthält ausschließlich die gebauten Website-Dateien
einschließlich `.htaccess`. Es wurde auf Vollständigkeit und übereinstimmende
SHA-256-Prüfsummen geprüft. [veroeffentlichung.md](veroeffentlichung.md) beschreibt
Sicherung, Upload, Live-Prüfung und Rückkehr zur bisherigen Version.
[pflege.md](pflege.md) beschreibt spätere Text- und Bildänderungen.

Die vorhandene öffentliche Domain ist über HTTPS erreichbar. Die neue Version
wurde noch nicht auf den Server hochgeladen; ihre Domainweiterleitungen,
serverseitige Fehlerseite und tatsächlichen Linkvorschauen müssen danach geprüft
werden. Es wird kein neues Hosting eingerichtet.

## Zurückgestellt

Die Online-Reservierung einschließlich Verwaltung, Bestätigungsmails und
Stornierung liegt auf `codex/reservierungen-pausiert` und bleibt zurückgestellt.
Die mögliche spätere Astro-Migration ist für diese Fertigstellung nicht erforderlich.
