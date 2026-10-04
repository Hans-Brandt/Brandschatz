import { useEffect, useRef, useState } from 'react'
import type { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type CafeMapProps = {
  latitude: number
  longitude: number
}

export default function CafeMap({ latitude, longitude }: CafeMapProps) {
  const [enabled, setEnabled] = useState(false)
  const [failed, setFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return

    let map: Map | undefined
    let cancelled = false

    async function initializeMap() {
      const leaflet = await import('leaflet')
      if (cancelled || !container) return

      map = leaflet.map(container, {
        scrollWheelZoom: false,
        zoomControl: false,
      }).setView(
        [latitude, longitude],
        12,
      )
      leaflet.control.zoom({
        position: 'topright',
        zoomInTitle: 'Vergrößern',
        zoomOutTitle: 'Verkleinern',
      }).addTo(map)
      map.attributionControl.setPrefix(false)

      leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      }).addTo(map)

      leaflet.marker([latitude, longitude], {
        title: 'Café Brandtschatz',
        alt: 'Café Brandtschatz',
        icon: leaflet.divIcon({
          className: 'cafe-map-marker',
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 35C10 29 1 21 1 14a13 13 0 0 1 26 0c0 7-9 15-13 21Z" fill="#658449" stroke="#fff" stroke-width="2"/><circle cx="14" cy="14" r="4" fill="#fff"/></svg>',
          iconSize: [28, 36],
          iconAnchor: [14, 36],
          popupAnchor: [0, -36],
        }),
      })
        .bindPopup('<strong>Café Brandtschatz</strong><br>Hauptstraße 5, Anker')
        .addTo(map)
    }

    void initializeMap().catch(() => {
      if (!cancelled) setFailed(true)
    })

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [enabled, latitude, longitude])

  function hideMap() {
    setEnabled(false)
    setFailed(false)
    requestAnimationFrame(() => loadButtonRef.current?.focus())
  }

  return (
    <div className="map-wrapper">
      {enabled ? (
        <>
          <div
            ref={containerRef}
            className="location-map-frame"
            role="region"
            aria-label="Karte mit Café Brandtschatz in Anker und den umliegenden Orten"
          />
          {failed && (
            <p className="map-error" role="status">
              Die Karte konnte nicht geladen werden. Nutzen Sie gern den Link
              „Karte vergrößern“ oder die Routenplanung oben.
            </p>
          )}
          <button className="map-hide" onClick={hideMap}>
            Karte ausblenden und Freigabe widerrufen
          </button>
        </>
      ) : (
        <div className="map-consent">
          <h4>Ihr Weg zum Café</h4>
          <p>
            Nach Ihrem Klick lädt die Karte von OpenStreetMap. Dabei erhält der
            Anbieter Ihre IP-Adresse und Browserdaten; eine Verarbeitung
            außerhalb der EU ist möglich.
          </p>
          <button
            className="btn btn-primary"
            ref={loadButtonRef}
            onClick={() => setEnabled(true)}
          >
            Karte laden
          </button>
          <a className="text-link" href="/datenschutz.html#karte">
            Hinweise zum Datenschutz
          </a>
        </div>
      )}
    </div>
  )
}
