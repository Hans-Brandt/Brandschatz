import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import AdminPage from './AdminPage'
import ReservationCalendar from './ReservationCalendar'
import {
  cancelReservation,
  createReservation,
  getAvailableSlots,
  type ReservationArea,
} from './reservations'
import { isSupabaseConfigured } from './supabase'

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

const cafeTimes = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const testReservationEndpoint =
  'https://formsubmit.co/ajax/hansbrandt6@web.de'

type SubmissionStatus =
  | 'idle'
  | 'submitting'
  | 'activation'
  | 'success'
  | 'error'
type AvailabilityStatus = 'idle' | 'loading' | 'success' | 'error'
type CancellationStatus = 'idle' | 'submitting' | 'success' | 'error'

function getCancellationRequest() {
  const [section, query = ''] = window.location.hash.slice(1).split('?')

  if (section !== 'stornieren') {
    return null
  }

  const parameters = new URLSearchParams(query)
  const reservationId = parameters.get('id')
  const token = parameters.get('token')

  return reservationId && token ? { reservationId, token } : null
}

function App() {
  const [reservationLocation, setReservationLocation] =
    useState<ReservationArea>('inside')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityStatus>('idle')
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>('idle')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [reservationReference, setReservationReference] = useState('')
  const [cancellationRequest] = useState(getCancellationRequest)
  const [cancellationStatus, setCancellationStatus] =
    useState<CancellationStatus>('idle')

  if (window.location.hash.startsWith('#verwaltung')) {
    return <AdminPage />
  }

  async function handleCancellation() {
    if (!cancellationRequest) {
      return
    }

    setCancellationStatus('submitting')

    try {
      const wasCancelled = await cancelReservation(
        cancellationRequest.reservationId,
        cancellationRequest.token,
      )
      setCancellationStatus(wasCancelled ? 'success' : 'error')
    } catch {
      setCancellationStatus('error')
    }
  }

  useEffect(() => {
    const guests = Number.parseInt(guestCount, 10)

    if (
      !isSupabaseConfigured
      || !selectedDate
      || !Number.isInteger(guests)
      || guests < 1
    ) {
      setAvailableTimes([])
      setAvailabilityStatus('idle')
      return
    }

    let isCurrentRequest = true
    setAvailabilityStatus('loading')

    getAvailableSlots(selectedDate, reservationLocation, guests)
      .then((slots) => {
        if (!isCurrentRequest) {
          return
        }

        const freeTimes = slots
          .filter((slot) => slot.available)
          .map((slot) => slot.time)

        setAvailableTimes(freeTimes)
        setSelectedTime((currentTime) =>
          freeTimes.includes(currentTime) ? currentTime : '',
        )
        setAvailabilityStatus('success')
      })
      .catch(() => {
        if (!isCurrentRequest) {
          return
        }

        setAvailableTimes([])
        setSelectedTime('')
        setAvailabilityStatus('error')
      })

    return () => {
      isCurrentRequest = false
    }
  }, [guestCount, reservationLocation, selectedDate])

  async function handleReservationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = Object.fromEntries(new FormData(form))
    const isTestMode = import.meta.env.DEV
    const endpoint = isTestMode
      ? testReservationEndpoint
      : '/api/reservation.php'
    setSubmissionStatus('submitting')
    setSubmissionMessage('')
    setReservationReference('')

    try {
      let createdReservationId = ''

      if (isSupabaseConfigured) {
        const reservation = await createReservation({
          area: reservationLocation,
          date: String(formData.date),
          time: String(formData.time),
          guests: Number(formData.guests),
          customerName: String(formData.name),
          customerEmail: String(formData.email),
          customerPhone: String(formData.phone),
          note: String(formData.message || ''),
        })

        createdReservationId = reservation.id
        setReservationReference(reservation.id.slice(0, 8).toUpperCase())
      }

      const payload = isTestMode
        ? {
          _subject: `Probereservierung für ${String(formData.date)}`,
          _template: 'table',
          _captcha: 'false',
          _honey: String(formData.website || ''),
          _url: window.location.href,
          Ort:
            formData.reservationLocation === 'outside'
              ? 'Draußen'
              : 'Drinnen',
          Datum: String(formData.date),
          Uhrzeit: `${String(formData.time)} Uhr`,
          Name: String(formData.name),
          email: String(formData.email),
          Telefon: String(formData.phone),
          Personenzahl: String(formData.guests),
          Nachricht: String(formData.message || 'Keine Nachricht'),
          Reservierungsnummer: createdReservationId || 'Noch nicht vergeben',
        }
        : { ...formData, reservationId: createdReservationId }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('Benachrichtigung fehlgeschlagen.')
        }

        const result = (await response.json()) as {
          success?: boolean | string
          message?: string
        }
        const wasSuccessful =
          result.success === true || result.success === 'true'

        if (
          !createdReservationId
          && isTestMode
          && !wasSuccessful
          && result.message?.toLowerCase().includes('activation')
        ) {
          setSubmissionStatus('activation')
          return
        }

        if (!wasSuccessful && !createdReservationId) {
          throw new Error('Die Reservierungsanfrage konnte nicht übertragen werden.')
        }
      } catch (notificationError) {
        if (!createdReservationId) {
          throw notificationError
        }
      }

      form.reset()
      setReservationLocation('inside')
      setSelectedDate('')
      setSelectedTime('')
      setGuestCount('')
      setAvailableTimes([])
      setSubmissionStatus('success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ''
      setSubmissionMessage(
        errorMessage.includes('slot_unavailable')
          ? 'Dieser Termin wurde gerade vergeben. Bitte wählen Sie eine andere Uhrzeit.'
          : 'Die Anfrage konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.',
      )
      setSubmissionStatus('error')
    }
  }

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

        {cancellationRequest && (
          <section
            id="stornieren"
            className="section cancellation"
            aria-labelledby="cancellation-title"
          >
            <article className="cancellation-card">
              <p className="eyebrow">Reservierung</p>
              <h2 id="cancellation-title">Reservierung stornieren</h2>
              {cancellationStatus === 'success' ? (
                <p className="form-status is-success" role="status">
                  Ihre Reservierung wurde storniert. Der Tisch ist wieder
                  freigegeben.
                </p>
              ) : (
                <>
                  <p>
                    Wenn Sie den Termin nicht wahrnehmen können, können Sie die
                    Reservierung hier freigeben.
                  </p>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleCancellation}
                    disabled={cancellationStatus === 'submitting'}
                  >
                    {cancellationStatus === 'submitting'
                      ? 'Stornierung wird verarbeitet …'
                      : 'Reservierung verbindlich stornieren'}
                  </button>
                  {cancellationStatus === 'error' && (
                    <p className="form-status is-error" role="alert">
                      Dieser Stornierungslink ist ungültig oder wurde bereits
                      verwendet. Bitte rufen Sie uns bei Rückfragen an.
                    </p>
                  )}
                </>
              )}
            </article>
          </section>
        )}

        <section id="kontakt" className="section contact" aria-labelledby="contact-title">
          <div className="contact-copy reveal">
            <p className="eyebrow">Kontakt / Reservierung</p>
            <h2 id="contact-title">Reservieren oder Veranstaltung anfragen</h2>
            <p>
              Wählen Sie Ihren Wunschtermin aus und senden Sie die Anfrage
              direkt an uns. Die Reservierung ist verbindlich, sobald wir den
              Termin bestätigt haben.
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
            onSubmit={handleReservationSubmit}
            onChange={() => setSubmissionStatus('idle')}
          >
            {import.meta.env.DEV && (
              <p className="test-mode-note">
                Testmodus: Die Anfrage wird an hansbrandt6@web.de gesendet. Beim
                ersten Versand muss der Empfang einmal per E-Mail aktiviert werden.
              </p>
            )}

            <div className="form-heading">
              <p className="form-step">1. Reservierung auswählen</p>
              <h3>Wo möchten Sie reservieren?</h3>
            </div>

            <fieldset className="reservation-types">
              <legend className="sr-only">Ort der Reservierung</legend>
              <label
                className={`reservation-option ${reservationLocation === 'inside' ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="reservationLocation"
                  value="inside"
                  checked={reservationLocation === 'inside'}
                  onChange={() => setReservationLocation('inside')}
                />
                <span>
                  <strong>Drinnen</strong>
                  <small>In unserer gemütlichen Gaststube</small>
                </span>
              </label>
              <label
                className={`reservation-option ${reservationLocation === 'outside' ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="reservationLocation"
                  value="outside"
                  checked={reservationLocation === 'outside'}
                  onChange={() => setReservationLocation('outside')}
                />
                <span>
                  <strong>Draußen</strong>
                  <small>Auf unserer Terrasse oder im Garten</small>
                </span>
              </label>
            </fieldset>

            <div className="form-heading form-section-heading">
              <p className="form-step">2. Wunschtermin wählen</p>
            </div>

            <ReservationCalendar
              value={selectedDate}
              onChange={(value) => {
                setSelectedDate(value)
                setSubmissionStatus('idle')
              }}
            />

            <div className="form-field">
              <label htmlFor="guests">
                Personenzahl <span aria-hidden="true">*</span>
              </label>
              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="60"
                value={guestCount}
                onChange={(event) => {
                  setGuestCount(event.target.value)
                  setSubmissionStatus('idle')
                }}
                placeholder="z. B. 4"
                required
              />
            </div>

            <div className="form-field time-field">
              <label htmlFor="time">
                Gewünschte Uhrzeit <span aria-hidden="true">*</span>
              </label>
              <select
                id="time"
                name="time"
                value={selectedTime}
                onChange={(event) => {
                  setSelectedTime(event.target.value)
                  setSubmissionStatus('idle')
                }}
                disabled={
                  isSupabaseConfigured
                  && (!selectedDate
                    || !guestCount
                    || availabilityStatus === 'loading')
                }
                required
              >
                <option value="" disabled>
                  {availabilityStatus === 'loading'
                    ? 'Freie Zeiten werden geladen …'
                    : 'Bitte auswählen'}
                </option>
                {cafeTimes.map((time) => (
                  <option
                    value={time}
                    key={time}
                    disabled={
                      isSupabaseConfigured && !availableTimes.includes(time)
                    }
                  >
                    {time} Uhr
                    {isSupabaseConfigured
                      && availabilityStatus === 'success'
                      && !availableTimes.includes(time)
                      ? ' – nicht verfügbar'
                      : ''}
                  </option>
                ))}
              </select>
            </div>

            <p className="availability-note">
              {availabilityStatus === 'error'
                ? 'Die Verfügbarkeit konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut.'
                : Number(guestCount) > 5
                  ? 'Für Gruppen ab sechs Personen benötigen wir noch Regeln zum Zusammenstellen der Tische. Bitte rufen Sie uns bis dahin unter 0160 90647070 an.'
                : availabilityStatus === 'success' && availableTimes.length === 0
                  ? 'Für diese Auswahl ist aktuell keine Uhrzeit verfügbar.'
                  : isSupabaseConfigured
                    ? 'Es werden nur Uhrzeiten mit einem passenden freien Tisch angezeigt.'
                    : 'Die Auswahl ist eine Anfrage. Wir bestätigen den Termin persönlich.'}
            </p>

            <div className="form-heading form-section-heading">
              <p className="form-step">3. Kontaktdaten eintragen</p>
              <p className="required-note">* Pflichtfelder</p>
            </div>

            <label htmlFor="name">
              Vor- und Nachname <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Vor- und Nachname"
              maxLength={120}
              required
            />

            <label htmlFor="email">
              E-Mail-Adresse <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@beispiel.de"
              maxLength={254}
              required
            />

            <label htmlFor="phone">
              Telefonnummer <span aria-hidden="true">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Für kurzfristige Rückfragen"
              maxLength={40}
              required
            />

            <label htmlFor="message">Nachricht (optional)</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Besondere Wünsche oder Hinweise"
              maxLength={2000}
            />

            <label className="consent-field">
              <input type="checkbox" name="consent" value="accepted" required />
              <span>
                Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung
                der Reservierungsanfrage verwendet werden.
              </span>
            </label>

            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                !selectedDate
                || !selectedTime
                || submissionStatus === 'submitting'
              }
            >
              {submissionStatus === 'submitting'
                ? 'Anfrage wird übertragen …'
                : 'Reservierungsanfrage senden'}
            </button>

            {submissionStatus === 'success' && (
              <p className="form-status is-success" role="status">
                Vielen Dank! Ihre Reservierungsanfrage wurde gespeichert.
                {reservationReference
                  ? ` Ihre Reservierungsnummer lautet ${reservationReference}.`
                  : ' Wir melden uns zur Bestätigung bei Ihnen.'}
              </p>
            )}
            {submissionStatus === 'activation' && (
              <p className="form-status is-info" role="status">
                Die Aktivierungs-E-Mail wurde an hansbrandt6@web.de gesendet.
                Bitte dort „Activate Form“ anklicken und die Reservierung danach
                erneut absenden.
              </p>
            )}
            {submissionStatus === 'error' && (
              <p className="form-status is-error" role="alert">
                {submissionMessage
                  || 'Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns unter 0160 90647070 an.'}
              </p>
            )}
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
