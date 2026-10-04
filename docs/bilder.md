# Bildauswahl und Optimierung

Stand: 4. Oktober 2026. Die aktuelle Bildauswahl wurde vom Nutzer bestätigt.

Die neuen Café-Fotos liegen in `src/assets/cafe/`. Das Naturpark-Signet stammt
aus `BIlder/images/Signet_Naturpark-Partner_Web.jpg`. Die Originaldateien werden
bei der Optimierung nicht verändert.
Die Innenaufnahme der Diele stammt aus `BIlder/diele/diele_03.jpg`.

| Bereich | Bild |
| --- | --- |
| Titelbild | Pfirsich-Buttermilch-Torte |
| Torten und Kuchen | Stachelbeer-Baiser-Torte |
| Deftiger Rettungsanker | Gaststube-Panorama |
| Diele am See (Angebotskarte) | Fachwerk-Eingang |
| Diele am See (großes Bild) | Innenraum mit gedeckten Tischen |
| Manufakturprodukte | Pfirsich-Buttermilch-Torte |
| Galerie | Kastanienbaum, Gaststube, Café von außen mit Oldtimer, Luftaufnahme |
| Naturpark-Partnerschaft | Naturpark-Signet |

Die Gaststube beim herzhaften Angebot und das Tortenfoto bei den
Manufakturprodukten bleiben auf ausdrücklichen Wunsch in der Auswahl.
Eine Übersicht zeigt `bildauswahl.jpg` im selben Ordner.

Die Galerie zeigt vier Motive: Kastanienbaum, Gaststube, Außenansicht mit dem
Auto und Luftaufnahme. Die beiden weiteren Gartenfotos mit Seeblick wurden
auf Wunsch entfernt.

## Optimierung

`npm run images:optimize` erzeugt WebP-Dateien in
`src/assets/cafe/optimized/` sowie die Bilddaten in `src/cafeImages.ts`.
Die Fotos werden mit Qualitätsstufe 78 und in Breiten von 480, 800, 1200 und
höchstens 1600 Pixeln gespeichert. Kleine Quellen werden nicht vergrößert.
Für das Signet werden 200 und 400 Pixel verwendet.

Die Website wählt passende Dateien über `srcSet` und `sizes`. Das Titelbild
erhält hohe Ladepriorität. Die weiteren Bilder werden verzögert geladen.
Alle Bilder haben Breiten- und Höhenangaben und werden asynchron dekodiert.

## Prüfung

Bei der ursprünglichen Optimierung waren Build und Lint erfolgreich. In Chrome
wurden die gebaute Website und die damals 13 Bildpositionen geprüft; alle
Bilder laden, ohne Fehler oder horizontalen
Überlauf. Gemessen wurden die Bilddaten nach vollständigem Durchscrollen bei
leerem Browsercache, ohne Schriften und JavaScript. Diese Messung stammt vom
Stand mit sechs Galeriebildern, vor der Reduzierung auf vier und vor dem
Austausch des großen Diele-Bilds gegen die Innenaufnahme:

| Ansicht | Fensterbreite | Pixeldichte | Geladene Bilddaten |
| --- | --- | --- | --- |
| Desktop | 1440 Pixel | 1 | 0,64 MB |
| Tablet | 820 Pixel | 2 | 1,44 MB |
| Smartphone | 390 Pixel | 2 | 0,85 MB |

Zum Vergleich: Die elf unterschiedlichen Originaldateien umfassen zusammen
4,24 MB. Die größten WebP-Versionen umfassen zusammen 2,37 MB. Die tatsächliche
Datenmenge hängt von Fenstergröße, Pixeldichte und Browsercache ab.
