import { useEffect } from 'react'
import CafeMap from './CafeMap'
import {
  natureParkPartnerImage,
  lakeAerialImage,
  cafeExteriorImage,
  hallEntranceImage,
  hallInteriorImage,
  gardenPanoramaImage,
  guestRoomPanoramaImage,
  guestRoomImage,
  peachCakeImage,
  gooseberryCakeImage,
  type CafeImage,
} from './cafeImages'
import './App.css'

type Specialty = {
  title: string
  description: string
  image: CafeImage
  alt: string
  delayClass: string
}

type GalleryItem = {
  image: CafeImage
  alt: string
  delayClass: string
}

const specialties: Specialty[] = [
  {
    title: 'Frisch gebackene Torten & Kuchen',
    description:
      'Hausgemachte Torten und Kuchen aus dem Café Brandtschatz, serviert im Fachwerk-Strohdachhaus oder auf der Terrasse.',
    image: gooseberryCakeImage,
    alt: 'Stachelbeer-Baiser-Torte mit Kaffee im Garten des Café Brandtschatz',
    delayClass: 'reveal-delay-1',
  },
  {
    title: 'Deftiger Rettungsanker',
    description:
      'Stecknitz-Brötchen, Bismarck-Brötchen, Chili con Carne, Chili sin Carne und Quiche aus dem aktuellen Speiseangebot.',
    image: guestRoomPanoramaImage,
    alt: 'Gedeckte Tische in der Gaststube des Café Brandtschatz',
    delayClass: 'reveal-delay-2',
  },
  {
    title: 'Diele am See',
    description:
      'Veranstaltungsraum im denkmalgeschützten Fachhallenhaus aus dem 16. Jahrhundert für Feiern und Events bis zu 60 Personen.',
    image: hallEntranceImage,
    alt: 'Fachwerkfassade mit grünem Eingangstor der Diele am See',
    delayClass: 'reveal-delay-3',
  },
  {
    title: 'Hausgemachte Manufakturprodukte',
    description:
      'Im Sortiment: unter anderem Sauce, Chutneys und Holunderblütensaft, regional gedacht und ohne Zusatzstoffe.',
    image: peachCakeImage,
    alt: 'Hausgemachte Pfirsich-Buttermilch-Torte im Café Brandtschatz',
    delayClass: 'reveal-delay-4',
  },
]

const galleryItems: GalleryItem[] = [
  {
    image: gardenPanoramaImage,
    alt: 'Sitzplätze unter dem Kastanienbaum im Garten am Ankersee',
    delayClass: 'reveal-delay-1',
  },
  {
    image: guestRoomImage,
    alt: 'Innenraum der Gaststube',
    delayClass: 'reveal-delay-3',
  },
  {
    image: cafeExteriorImage,
    alt: 'Café Brandtschatz mit Terrasse und einem grünen Oldtimer im Vordergrund',
    delayClass: 'reveal-delay-2',
  },
  {
    image: lakeAerialImage,
    alt: 'Luftaufnahme des Ankersees und des Café Brandtschatz',
    delayClass: 'reveal-delay-3',
  },
]

const openingHours = [
  { day: 'Samstag', time: '12:00 - 18:00 Uhr' },
  { day: 'Sonntag', time: '12:00 - 18:00 Uhr' },
  { day: 'Feiertage', time: '12:00 - 18:00 Uhr' },
  { day: 'Saison', time: 'Mitte Januar bis Mitte Dezember' },
]

const cafeMapQuery = encodeURIComponent(
  'Café Brandtschatz, Hauptstraße 5, 23881 Lankau/OT Anker, Deutschland',
)

const cafeMapPosition = { latitude: 53.6875188, longitude: 10.6425722 }
const cafeMapUrl = `https://www.openstreetmap.org/?mlat=${cafeMapPosition.latitude}&mlon=${cafeMapPosition.longitude}#map=12/${cafeMapPosition.latitude}/${cafeMapPosition.longitude}`

function MapLinks() {
  return (
    <div className="location-actions">
      <a
        className="btn btn-primary"
        href={`https://www.google.com/maps/search/?api=1&query=${cafeMapQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Standort in Google Maps öffnen (neuer Tab)"
      >
        Google Maps
      </a>
      <a
        className="btn btn-secondary"
        href={`https://maps.apple.com/?q=${cafeMapQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Standort in Apple Karten öffnen (neuer Tab)"
      >
        Apple Karten
      </a>
    </div>
  )
}

function App() {
  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>('.reveal')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    document.documentElement.classList.add('js-reveal')

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            currentObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -12% 0px',
      },
    )

    revealElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('js-reveal')
    }
  }, [])

  return (
    <div id="top" className="site">
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <header className="site-header reveal is-visible">
        <a className="brand" href="#top">
          Café Brandtschatz
        </a>
        <nav className="header-nav" aria-label="Hauptnavigation">
          <a href="#ueber-uns">Über uns</a>
          <a href="#spezialitaeten">Angebot</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="section hero" aria-labelledby="hero-title">
          <div className="hero-copy reveal is-visible">
            <h1 id="hero-title">Café Brandtschatz am Ankersee</h1>
            <p>
              Herzlich willkommen in unserem Café am See in Anker. Genießen Sie
              Kaffee, frisch gebackene Torten und Kuchen im Fachwerk-
              Strohdachhaus, auf der sonnigen Terrasse und im Garten mit Blick
              auf den Ankersee.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="tel:+4916090647070">
                Café anrufen
              </a>
              <a
                className="btn btn-secondary"
                href="https://www.instagram.com/cafebrandtschatz/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="hero-visual reveal is-visible reveal-delay-1">
            <img
              {...lakeAerialImage}
              sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 930px) 90vw, 520px"
              alt="Luftaufnahme des Ankersees und des Café Brandtschatz"
              fetchPriority="high"
              decoding="async"
            />
            <aside className="hero-note reveal is-visible reveal-delay-2">
              <p>Öffnungszeiten</p>
              <strong>Sa, So, Feiertage 12:00 - 18:00</strong>
            </aside>
          </div>
        </section>

        <section id="ueber-uns" className="section about" aria-labelledby="about-title">
          <div className="section-head reveal">
            <h2 id="about-title">Fachwerkhaus, Garten und Blick auf den See</h2>
          </div>

          <div className="about-layout">
            <article className="about-text reveal reveal-delay-1">
              <p>
                Das Café Brandtschatz liegt in der Hauptstraße 5 in 23881
                Lankau/OT Anker am Elbe-Lübeck-Kanal, in der malerischen
                Umgebung des Naturparks Lauenburgische Seen.
              </p>
              <p>
                Geöffnet ist das Café von Mitte Januar bis Mitte Dezember. Seit
                Herbst 2024 ist Brandtschatz Naturpark-Partner des Naturpark
                Lauenburgische Seen.
              </p>
            </article>

            <div className="about-cards">
              <article className="info-card reveal reveal-delay-2">
                <p className="info-label">Standort</p>
                <h3>Hauptstraße 5, 23881 Lankau/OT Anker</h3>
                <p>Café am See mit Terrasse und Garten.</p>
                <MapLinks />
              </article>
              <article className="info-card reveal reveal-delay-3">
                <p className="info-label">Naturpark-Partner</p>
                <h3>Seit Herbst 2024</h3>
                <p>
                  <img
                    className="partner-badge"
                    {...natureParkPartnerImage}
                    sizes="208px"
                    alt="Naturpark-Partner Signet"
                    loading="lazy"
                    decoding="async"
                  />
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="spezialitaeten"
          className="section specialties"
          aria-labelledby="specialties-title"
        >
          <div className="section-head reveal">
            <h2 id="specialties-title">
              Torten, herzhafte Gerichte und Veranstaltungen in der Diele am See
            </h2>
          </div>

          <div className="specialties-grid">
            {specialties.map((item) => (
              <article
                className={`specialty-card reveal ${item.delayClass}`}
                key={item.title}
              >
                <img
                  {...item.image}
                  sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 1120px) 45vw, 280px"
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section atmosphere" aria-labelledby="atmosphere-title">
          <div className="atmosphere-image reveal">
            <img
              {...hallInteriorImage}
              sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 930px) 90vw, 560px"
              alt="Innenraum der Diele am See mit gedeckten Tischen und Fachwerk"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="atmosphere-copy reveal reveal-delay-1">
            <h2 id="atmosphere-title">Raum für Events bis zu 60 Personen</h2>
            <p>
              Die „Diele am See“ befindet sich in einem denkmalgeschützten
              Fachhallenhaus aus dem 16. Jahrhundert und bietet 86 qm mit
              restaurierten Fachwerkwänden, Eichenschwarten-Decke und beheiztem
              Ziegelfußboden.
            </p>
            <p>
              Für Anfragen zur Diele kontaktieren Sie Anja Brandt unter{' '}
              <a className="text-link" href="tel:+494543891012">04543/891012</a>{' '}
              oder buchen Sie über{' '}
              <a className="text-link" href="https://www.raumperle.de/raum/diele-am-see-615/" target="_blank" rel="noopener noreferrer">
                Raumperle
              </a>.
            </p>
          </div>
        </section>

        <section className="section gallery" aria-labelledby="gallery-title">
          <div className="section-head reveal">
            <h2 id="gallery-title">Café, Torten und Diele am See</h2>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <figure
                className={`gallery-item reveal ${item.delayClass}`}
                key={item.image.src}
              >
                <img
                  {...item.image}
                  sizes={`(max-width: 680px) calc(100vw - 32px), (max-width: 1120px) 45vw, ${index === 0 || index === 3 ? '720px' : '360px'}`}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </section>

        <section className="section visit" aria-labelledby="visit-title">
          <div className="section-head reveal">
            <h2 id="visit-title">Besuchen Sie uns in Anker/Lankau</h2>
          </div>

          <div className="visit-grid">
            <article className="visit-card reveal reveal-delay-1">
              <h3>Öffnungszeiten</h3>
              <ul className="hours-list">
                {openingHours.map((entry) => (
                  <li key={entry.day}>
                    <span>{entry.day}</span>
                    <strong>{entry.time}</strong>
                  </li>
                ))}
              </ul>
            </article>

            <article className="visit-card map-card reveal reveal-delay-2">
              <h3>Standort</h3>
              <p>Café Brandtschatz</p>
              <p>Hauptstraße 5, 23881 Lankau/OT Anker</p>
              <p>Am Elbe-Lübeck-Kanal in der Region Herzogtum Lauenburg.</p>
              <MapLinks />
              <a className="text-link" href="#kontakt">
                Kontakt aufnehmen
              </a>
              <figure className="location-map">
                <CafeMap {...cafeMapPosition} />
                <figcaption className="location-map-caption">
                  <span>Anker und Umgebung</span>
                  <a
                    className="text-link"
                    href={cafeMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Karte auf OpenStreetMap vergrößern (neuer Tab)"
                  >
                    Karte vergrößern
                  </a>
                </figcaption>
              </figure>
            </article>
          </div>
        </section>

        <section id="kontakt" className="section contact" aria-labelledby="contact-title">
          <div className="contact-copy reveal">
            <h2 id="contact-title">Wir freuen uns auf Ihren Besuch</h2>
            <p>
              Für Tischreservierungen sowie Buchungen der Diele am See rufen Sie
              uns gern an. Aktuelle Infos und Speiseangebote finden Sie auch auf
              Instagram.
            </p>
            <div className="contact-info">
              <p>
                Reservierung Café:{' '}
                <a href="tel:+4916090647070">0160 90647070</a>
              </p>
              <p>
                Diele am See / Anja Brandt:{' '}
                <a href="tel:+494543891012">04543/891012</a>
              </p>
              <p>
                E-Mail: <a href="mailto:info@brandtschatz.de">info@brandtschatz.de</a>
              </p>
              <p>
                Instagram:{' '}
                <a
                  href="https://www.instagram.com/cafebrandtschatz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  @cafebrandtschatz
                </a>
              </p>
            </div>
          </div>

          <article
            className="contact-card reveal reveal-delay-1"
            aria-labelledby="contact-card-title"
          >
            <h3 id="contact-card-title">Sprechen Sie uns an</h3>
            <p>
              Einen Tisch im Café reservieren Sie telefonisch. Für Ihre Feier
              in der Diele am See erreichen Sie Anja Brandt direkt.
            </p>
            <a className="btn btn-primary" href="tel:+4916090647070">
              Café: 0160 90647070
            </a>
            <a className="btn btn-secondary" href="tel:+494543891012">
              Diele am See: 04543 891012
            </a>
            <a className="text-link" href="mailto:info@brandtschatz.de">
              E-Mail schreiben
            </a>
          </article>
        </section>

        <section
          id="impressum"
          className="section imprint"
          aria-labelledby="imprint-title"
        >
          <div className="section-head reveal">
            <h2 id="imprint-title">Impressum</h2>
          </div>

          <article className="imprint-card reveal reveal-delay-1">
            <p>
              <strong>Café Brandtschatz</strong>
              <br />
              Inhaberin: Anja Brandt
              <br />
              Hauptstraße 5
              <br />
              23881 Lankau/Anker
            </p>
            <p>
              Telefon: <a href="tel:+494543891012">04543/891012</a>
              <br />
              E-Mail: <a href="mailto:info@brandtschatz.de">info@brandtschatz.de</a>
            </p>
            <p>Inhaltlich verantwortlich: Anja Brandt (Anschrift wie oben)</p>
            <p><a href="/impressum.html">Impressum als eigene Seite öffnen</a></p>
          </article>
        </section>
      </main>

      <footer className="site-footer reveal">
        <div>
          <p className="footer-brand">Café Brandtschatz</p>
          <p>© {new Date().getFullYear()} Café Brandtschatz</p>
        </div>
        <div className="footer-links">
          <a href="#ueber-uns">Über uns</a>
          <a href="#spezialitaeten">Angebot</a>
          <a href="#kontakt">Kontakt</a>
          <a href="#impressum">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
        </div>
      </footer>
    </div>
  )
}

export default App
