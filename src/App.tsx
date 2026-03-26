import { useEffect } from 'react'
import './App.css'

type Specialty = {
  title: string
  description: string
  image: string
  alt: string
  delayClass: string
}

type GalleryItem = {
  image: string
  alt: string
  delayClass: string
}

const specialties: Specialty[] = [
  {
    title: 'Frisch gebackene Torten & Kuchen',
    description:
      'Hausgemachte Torten und Kuchen aus dem Café Brandtschatz, serviert im Fachwerk-Strohdachhaus oder auf der Terrasse.',
    image: 'https://www.brandtschatz.de/torten/Apfel_krokant.jpg',
    alt: 'Apfel-Krokant-Torte aus dem Café Brandtschatz',
    delayClass: 'reveal-delay-1',
  },
  {
    title: 'Deftiger Rettungsanker',
    description:
      'Stecknitz-Brötchen, Bismarck-Brötchen, Chili con Carne, Chili sin Carne und Quiche aus dem aktuellen Speiseangebot.',
    image: 'https://www.brandtschatz.de/cafe/Kuchentafelweb.jpg',
    alt: 'Speisen im Café Brandtschatz',
    delayClass: 'reveal-delay-2',
  },
  {
    title: 'Diele am See',
    description:
      'Veranstaltungsraum im denkmalgeschützten Fachhallenhaus aus dem 16. Jahrhundert für Feiern und Events bis zu 60 Personen.',
    image: 'https://www.brandtschatz.de/diele/diele_03.jpg',
    alt: 'Die Diele am See als Veranstaltungsraum',
    delayClass: 'reveal-delay-3',
  },
  {
    title: 'Hausgemachte Manufakturprodukte',
    description:
      'Im Sortiment: unter anderem Sauce, Chutneys und Holunderblütensaft, regional gedacht und ohne Zusatzstoffe.',
    image: 'https://www.brandtschatz.de/torten/Blaubeer_01.jpg',
    alt: 'Hausgemachte Kuchen im Café Brandtschatz',
    delayClass: 'reveal-delay-4',
  },
]

const galleryItems: GalleryItem[] = [
  {
    image: 'https://www.brandtschatz.de/cafe/aussen.jpg',
    alt: 'Außenansicht des Café Brandtschatz',
    delayClass: 'reveal-delay-1',
  },
  {
    image: 'https://www.brandtschatz.de/cafe/Garten_Tisch_Gaeste.jpg',
    alt: 'Gartenbereich mit Gästen am Café Brandtschatz',
    delayClass: 'reveal-delay-2',
  },
  {
    image: 'https://www.brandtschatz.de/cafe/Gaststube_02.jpg',
    alt: 'Innenraum der Gaststube',
    delayClass: 'reveal-delay-3',
  },
  {
    image: 'https://www.brandtschatz.de/torten/Schoko_banane_01.jpg',
    alt: 'Schoko-Banane-Torte',
    delayClass: 'reveal-delay-1',
  },
  {
    image: 'https://www.brandtschatz.de/diele/haus_aussen.jpg',
    alt: 'Außenansicht der Diele am See',
    delayClass: 'reveal-delay-2',
  },
  {
    image: 'https://www.brandtschatz.de/diele/detail_diele.jpg',
    alt: 'Detailansicht der Diele am See',
    delayClass: 'reveal-delay-3',
  },
]

const openingHours = [
  { day: 'Samstag', time: '12:00 - 18:00 Uhr' },
  { day: 'Sonntag', time: '12:00 - 18:00 Uhr' },
  { day: 'Feiertage', time: '12:00 - 18:00 Uhr' },
  { day: 'Saison', time: 'Mitte Januar bis Mitte Dezember' },
]

function App() {
  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>('.reveal')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      return
    }

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

    return () => observer.disconnect()
  }, [])

  return (
    <div className="site">
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

      <main id="top">
        <section className="section hero" aria-labelledby="hero-title">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow">Originalinformationen von brandtschatz.de</p>
            <h1 id="hero-title">Café Brandtschatz am Ankersee</h1>
            <p>
              Herzlich willkommen in unserem Café am See in Anker. Genießen Sie
              Kaffee, frisch gebackene Torten und Kuchen im Fachwerk-
              Strohdachhaus, auf der sonnigen Terrasse und im Garten mit Blick
              auf den Ankersee.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#kontakt">
                Tisch reservieren
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
              src="https://www.brandtschatz.de/images/Kaffe_torte.jpg"
              alt="Kaffee und Torte im Café Brandtschatz"
            />
            <aside className="hero-note reveal is-visible reveal-delay-2">
              <p>Öffnungszeiten</p>
              <strong>Sa, So, Feiertage 12:00 - 18:00</strong>
            </aside>
          </div>
        </section>

        <section id="ueber-uns" className="section about" aria-labelledby="about-title">
          <div className="section-head reveal">
            <p className="eyebrow">Über das Café</p>
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
              </article>
              <article className="info-card reveal reveal-delay-3">
                <p className="info-label">Naturpark-Partner</p>
                <h3>Seit Herbst 2024</h3>
                <p>
                  <img
                    className="partner-badge"
                    src="https://www.brandtschatz.de/images/Signet_Naturpark-Partner_Web.jpg"
                    alt="Naturpark-Partner Signet"
                    loading="lazy"
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
            <p className="eyebrow">Angebot</p>
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
                <img src={item.image} alt={item.alt} loading="lazy" />
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
              src="https://www.brandtschatz.de/cafe/Fenster_Garten.jpg"
              alt="Blick aus dem Café in den Garten"
              loading="lazy"
            />
          </div>
          <div className="atmosphere-copy reveal reveal-delay-1">
            <p className="eyebrow">Diele am See</p>
            <h2 id="atmosphere-title">Raum für Events bis zu 60 Personen</h2>
            <p>
              Die „Diele am See“ befindet sich in einem denkmalgeschützten
              Fachhallenhaus aus dem 16. Jahrhundert und bietet 86 qm mit
              restaurierten Fachwerkwänden, Eichenschwarten-Decke und beheiztem
              Ziegelfußboden.
            </p>
            <p>
              Für Anfragen zur Diele kontaktieren Sie Anja Brandt unter
              04543/891012 oder buchen Sie über Raumperle.
            </p>
          </div>
        </section>

        <section className="section gallery" aria-labelledby="gallery-title">
          <div className="section-head reveal">
            <p className="eyebrow">Bilder aus dem Originalauftritt</p>
            <h2 id="gallery-title">Café, Torten und Diele am See</h2>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <figure
                className={`gallery-item reveal ${item.delayClass}`}
                key={item.image}
              >
                <img src={item.image} alt={item.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section className="section visit" aria-labelledby="visit-title">
          <div className="section-head reveal">
            <p className="eyebrow">Öffnungszeiten und Standort</p>
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
              <a className="text-link" href="#kontakt">
                Kontakt aufnehmen
              </a>
            </article>
          </div>
        </section>

        <section id="kontakt" className="section contact" aria-labelledby="contact-title">
          <div className="contact-copy reveal">
            <p className="eyebrow">Kontakt / Reservierung</p>
            <h2 id="contact-title">Reservieren oder Veranstaltung anfragen</h2>
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

          <form
            className="reservation-card reveal reveal-delay-1"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="Ihr Name" />

            <label htmlFor="guests">Personenzahl</label>
            <input
              id="guests"
              name="guests"
              type="number"
              min="1"
              placeholder="z. B. 4"
            />

            <label htmlFor="date">Wunschtermin</label>
            <input id="date" name="date" type="date" />

            <label htmlFor="message">Nachricht</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tischreservierung oder Anfrage für die Diele am See"
            />

            <button className="btn btn-primary" type="submit">
              Anfrage vorbereiten
            </button>
          </form>
        </section>

        <section
          id="impressum"
          className="section imprint"
          aria-labelledby="imprint-title"
        >
          <div className="section-head reveal">
            <p className="eyebrow">Rechtliches</p>
            <h2 id="imprint-title">Impressum (Kurzfassung)</h2>
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
            <p>Umsatzsteuer-Identifikationsnummer: DE 27/287/33321</p>
            <p>Inhaltlich verantwortlich: Anja Brandt (Anschrift wie oben)</p>
          </article>
        </section>
      </main>

      <footer className="site-footer reveal">
        <div>
          <p className="footer-brand">Café Brandtschatz</p>
          <p>Copyright © 2023 www.brandtschatz.de</p>
        </div>
        <div className="footer-links">
          <a href="#ueber-uns">Über uns</a>
          <a href="#spezialitaeten">Angebot</a>
          <a href="#kontakt">Kontakt</a>
          <a href="#impressum">Impressum</a>
        </div>
      </footer>
    </div>
  )
}

export default App
