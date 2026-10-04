# Inhalte pflegen

## Texte und Angaben

Die Texte der Startseite, Öffnungszeiten, Telefonnummern und Galerie stehen in
`src/App.tsx`. Nach einer Änderung `npm run dev` für die Vorschau starten.
Wenn Adresse, Kontakt oder andere Unternehmensangaben geändert werden, auch
`public/impressum.html`, `public/datenschutz.html` und die strukturierten Angaben
in `index.html` prüfen. Die Öffnungszeiten im Beschreibungstext und in der
Linkvorschau müssen zur Seite passen; saisonale Ausnahmen ausdrücklich ergänzen.

## Bilder

Die freigegebene Galerie hat vier Fotos. Die Gaststubenaufnahme beim herzhaften
Angebot und die Torte bei den Manufakturprodukten bleiben wie gewünscht bestehen.
Neue Originalbilder in `src/assets/cafe` speichern, die Zuordnung in
`scripts/optimize-images.mjs` anpassen und `npm run images:optimize` ausführen.
`src/cafeImages.ts` wird automatisch erzeugt und sollte nicht direkt bearbeitet
werden. Alt-Texte in `src/App.tsx` passend zum tatsächlichen Bild formulieren.
Weitere Einzelheiten: `docs/bilder.md`.

## Veröffentlichung und Kontrolle

`npm run release` erzeugt eine geprüfte Version. Das ZIP wie in
`docs/veroeffentlichung.md` beschrieben hochladen. Nach jeder Veröffentlichung
Startseite, Bilder, Kontaktlinks, Rechtstexte und Karte auf Handy und Desktop prüfen.
Bei einer Änderung eingebundener Dienste muss auch die Datenschutzerklärung
angepasst werden. Derzeit gibt es keine Online-Buchung und keine Nutzungsanalyse.

Die Browserprüfungen decken Kartenfreigabe und Widerruf, einen Ladefehler,
Tastaturbedienung, zehn Bildschirmbreiten, alle Bilder, Barrierefreiheitsbefunde,
Darstellung ohne JavaScript, Suchmaschinenangaben und die Fehlerseite ab.
Die automatische Prüfung ersetzt keine vollständige Prüfung mit assistiven
Hilfsmitteln und keine rechtliche Prüfung.

WebKit testet die Browser-Engine von Safari. Auf macOS wird Option+Tab für Links
verwendet, entsprechend der üblichen Safari-Tastatureinstellung. Für den
heruntergeladenen Firefox-Testbrowser richtet das Testskript auf macOS 27 einen
separaten Testnamen ein, um einen bekannten Startfehler zu umgehen. Persönliche
Browserprofile oder macOS-Datenschutzfreigaben werden dabei nicht geändert.
