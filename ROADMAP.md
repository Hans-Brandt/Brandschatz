# Roadmap Café Brandtschatz

Stand: 7. September 2026

## 1. Reservierungen

- [x] Auswahl zwischen einem Platz drinnen und draußen einbauen
- [x] Kalender auf Samstage, Sonntage und Feiertage in Schleswig-Holstein begrenzen
- [x] Reservierungszeiten auf 12:00 bis 17:00 Uhr begrenzen
- [x] Name, E-Mail, Telefonnummer und Personenzahl als Pflichtangaben erfassen
- [x] Pflichtfelder im Browser und auf dem Server prüfen
- [x] Formular direkt auf der Website übertragen und eine Rückmeldung anzeigen
- [x] Serverseitigen Testversand an `hansbrandt6@web.de` vorbereiten
- [x] Echten Versand aus der lokalen Vorschau über FormSubmit aktivieren
- [ ] E-Mail-Versand auf dem endgültigen Webserver mit einer Testanfrage prüfen
- [ ] Mit dem Café abstimmen, welche Uhrzeiten und Angaben angeboten werden sollen
- [x] Anzahl, Bereich und Sitzplätze aller Tische erfassen
- [ ] Reservierungsdauer, Vorlaufzeit und Stornierungsfrist festlegen
- [x] Zentrale Datenbank für Tische, Reservierungen und gesperrte Termine einrichten
- [x] Verfügbarkeit ausschließlich auf dem Server prüfen und Doppelbuchungen verhindern
- [x] Passenden freien Tisch anhand der Personenzahl automatisch zuweisen
- [ ] Automatische Bestätigung an den Gast und Benachrichtigung an das Café senden
- [ ] Sicheren Stornierungslink ohne notwendiges Kundenkonto einbauen
- [x] Stornierungsseite und sichere, einmalig verwendbare Tokenlogik vorbereiten
- [ ] Interne, einfach bedienbare Verwaltungsseite für das Café bauen
- [ ] Telefonische Reservierungen manuell in der Verwaltungsseite erfassen können
- [ ] Reservierungen in der Verwaltungsseite ansehen, ändern, bestätigen und stornieren können
- [ ] Einzelne Tische, Uhrzeiten oder ganze Tage manuell sperren können
- [ ] Verwaltungsseite mit einem eigenen geschützten Zugang versehen
- [ ] Vor dem Produktivbetrieb Supabase/Resend mit vorhandenem PHP/MySQL-Hosting vergleichen
- [ ] Datenschutz, Auftragsverarbeitung, Löschfristen und Sicherungen für Reservierungsdaten festlegen

Die lokale Vorschau verschickt Testanfragen derzeit über FormSubmit. Nach der
Veröffentlichung kann zunächst `api/reservation.php` den Versand übernehmen;
dafür muss PHP mit E-Mail-Versand auf dem Webserver verfügbar sein. Für echte
Verfügbarkeiten, die manuelle Erfassung telefonischer Reservierungen und
Stornierungen wird anschließend eine zentrale Datenbank mit geschützter
Reservierungs-API benötigt.

Für einen ersten Prototyp sind Supabase und Resend voraussichtlich innerhalb
der kostenlosen Tarife nutzbar. Vor dem Livegang werden die dann gültigen
Tarife, Nutzungsgrenzen und die Zuverlässigkeit des kostenlosen Betriebs erneut
geprüft. Kosten für Domain und Website-Hosting bleiben davon unabhängig.

## 2. Texte überarbeiten

- [ ] Neue Texte vom Texter einsammeln und den jeweiligen Bereichen zuordnen
- [ ] Startseite, Über-uns-Bereich, Angebot, Diele am See und Kontakt überarbeiten
- [ ] Öffnungszeiten, Telefonnummern, E-Mail-Adresse und saisonale Angaben fachlich bestätigen
- [ ] Überschriften und Seitentitel für Suchmaschinen abstimmen

## 3. Bilder und Gestaltung

- [ ] Finale Bildauswahl treffen und Nutzungsrechte klären
- [ ] Bilder lokal im Projekt ablegen, optimieren und in passenden Größen ausliefern
- [ ] Darstellung auf Smartphone, Tablet und Desktop gemeinsam prüfen
- [ ] Navigation, Abstände, Kontraste und Ladeverhalten finalisieren

## 4. Rechtliches und Qualität

- [ ] Vollständiges Impressum und Datenschutzerklärung rechtlich prüfen lassen
- [ ] Barrierefreiheit mit Tastatur, Screenreader-Struktur und Kontrasten prüfen
- [ ] Reservierungsablauf, Telefon- und E-Mail-Links in den wichtigsten Browsern testen
- [ ] Fehlerseiten, Favicon und Social-Media-Vorschau ergänzen

## 5. Veröffentlichung

- [ ] Hosting und Domain-Ziel festlegen
- [ ] Produktionsversion bereitstellen und HTTPS prüfen
- [ ] Nach Veröffentlichung Formulare, Links, Bilder und mobile Ansicht erneut testen
- [ ] Einfachen Pflegeprozess für Texte, Öffnungszeiten und Bilder festhalten

## 6. Architektur und Performance

- [ ] React/Vite vor dem Livegang stabilisieren: React-Hook-Lintfehler beheben
- [ ] Öffentlichen Website-Bereich und Verwaltungsseite per Lazy Loading trennen
- [ ] Astro als Zielarchitektur für die öffentliche Website prüfen, React-Komponenten für Kalender, Reservierung und Verwaltung weiterverwenden
- [ ] Bei ausreichendem SEO- oder Performancebedarf von React/Vite auf Astro mit React-Islands migrieren
