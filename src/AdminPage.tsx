import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { isReservableDate, toIsoDate } from './reservationDates'
import { isSupabaseConfigured, supabase } from './supabase'

type ReservationStatus =
  | 'requested'
  | 'confirmed'
  | 'cancelled'
  | 'declined'
  | 'no_show'

type ReservationRow = {
  id: string
  reservation_date: string
  start_time: string
  guest_count: number
  customer_name: string
  customer_email: string | null
  customer_phone: string
  note: string | null
  area: 'inside' | 'outside'
  status: ReservationStatus
  source: 'online' | 'phone' | 'admin'
  cafe_tables: { name: string; zone: string } | null
}

type PageStatus = 'idle' | 'loading' | 'success' | 'error'

const statusLabels: Record<ReservationStatus, string> = {
  requested: 'Angefragt',
  confirmed: 'Bestätigt',
  cancelled: 'Storniert',
  declined: 'Abgelehnt',
  no_show: 'Nicht erschienen',
}

const zoneLabels: Record<string, string> = {
  inside: 'Drinnen',
  terrace: 'Terrasse',
  garden: 'Garten',
}

function getNextReservableDate() {
  const date = new Date()

  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = new Date(date)
    candidate.setDate(date.getDate() + offset)
    if (isReservableDate(candidate, date)) {
      return toIsoDate(candidate)
    }
  }

  return toIsoDate(date)
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null)
  const [isStaff, setIsStaff] = useState<boolean | null>(null)
  const [loginStatus, setLoginStatus] = useState<PageStatus>('idle')
  const [selectedDate, setSelectedDate] = useState(getNextReservableDate)
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [listStatus, setListStatus] = useState<PageStatus>('idle')
  const [formStatus, setFormStatus] = useState<PageStatus>('idle')
  const [formMessage, setFormMessage] = useState('')

  const checkStaffAccess = useCallback(async () => {
    if (!supabase) {
      return
    }

    const { data, error } = await supabase.rpc('is_staff')
    setIsStaff(!error && data === true)
  }, [])

  const loadReservations = useCallback(async () => {
    if (!supabase || !isStaff) {
      return
    }

    setListStatus('loading')
    const { data, error } = await supabase
      .from('reservations')
      .select(
        'id,reservation_date,start_time,guest_count,customer_name,customer_email,customer_phone,note,area,status,source,cafe_tables(name,zone)',
      )
      .eq('reservation_date', selectedDate)
      .order('start_time')

    if (error) {
      setListStatus('error')
      return
    }

    setReservations((data ?? []) as unknown as ReservationRow[])
    setListStatus('success')
  }, [isStaff, selectedDate])

  useEffect(() => {
    if (!supabase) {
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSignedInEmail(data.session?.user.email ?? null)
      if (data.session) {
        void checkStaffAccess()
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedInEmail(session?.user.email ?? null)
        setIsStaff(session ? null : false)
        if (session) {
          void checkStaffAccess()
        }
      },
    )

    return () => subscription.subscription.unsubscribe()
  }, [checkStaffAccess])

  useEffect(() => {
    void loadReservations()
  }, [loadReservations])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      return
    }

    setLoginStatus('loading')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoginStatus(error ? 'error' : 'success')
  }

  async function handleLogout() {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setReservations([])
    setIsStaff(false)
  }

  async function handleManualReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      return
    }

    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setFormStatus('loading')
    setFormMessage('')

    const { data, error } = await supabase.rpc('staff_create_reservation', {
      p_area: String(values.area),
      p_date: String(values.date),
      p_time: String(values.time),
      p_guests: Number(values.guests),
      p_customer_name: String(values.customerName),
      p_customer_email: String(values.customerEmail || ''),
      p_customer_phone: String(values.customerPhone),
      p_note: String(values.note || ''),
    })

    if (error) {
      setFormStatus('error')
      setFormMessage(
        error.message.includes('slot_unavailable')
          ? 'Für diese Personenzahl ist zu dieser Zeit kein Tisch mehr frei.'
          : 'Die Reservierung konnte nicht gespeichert werden.',
      )
      return
    }

    const assignedTable = data?.[0]?.assigned_table
    form.reset()
    setFormStatus('success')
    setFormMessage(
      assignedTable
        ? `Reservierung gespeichert. Zugewiesener Tisch: ${assignedTable}.`
        : 'Reservierung gespeichert.',
    )
    await loadReservations()
  }

  async function updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
  ) {
    if (!supabase) {
      return
    }

    const updates: { status: ReservationStatus; updated_at: string; cancelled_at?: string } = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', reservationId)

    if (!error) {
      await loadReservations()
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <h1>Reservierungsverwaltung</h1>
          <p>Die Datenbankverbindung ist noch nicht konfiguriert.</p>
        </section>
      </main>
    )
  }

  if (!signedInEmail) {
    return (
      <main className="admin-shell">
        <section className="admin-panel admin-login">
          <p className="eyebrow">Café Brandtschatz</p>
          <h1>Reservierungsverwaltung</h1>
          <p>Melden Sie sich mit dem freigeschalteten Mitarbeiterkonto an.</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="admin-email">E-Mail-Adresse</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="admin-password">Passwort</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button className="btn btn-primary" disabled={loginStatus === 'loading'}>
              {loginStatus === 'loading' ? 'Anmeldung läuft …' : 'Anmelden'}
            </button>
            {loginStatus === 'error' && (
              <p className="form-status is-error" role="alert">
                Anmeldung fehlgeschlagen. Bitte prüfen Sie E-Mail und Passwort.
              </p>
            )}
          </form>
          <a className="text-link" href="#kontakt">Zur Website</a>
        </section>
      </main>
    )
  }

  if (isStaff === null) {
    return <main className="admin-shell"><p>Zugang wird geprüft …</p></main>
  }

  if (!isStaff) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <h1>Zugang noch nicht freigeschaltet</h1>
          <p>{signedInEmail} ist angemeldet, steht aber noch nicht in der Mitarbeiterliste.</p>
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Abmelden
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Café Brandtschatz</p>
          <h1>Reservierungsverwaltung</h1>
        </div>
        <div className="admin-account">
          <span>{signedInEmail}</span>
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </header>

      <section className="admin-grid">
        <article className="admin-panel">
          <h2>Telefonische Reservierung</h2>
          <form className="admin-form" onSubmit={handleManualReservation}>
            <div className="admin-form-row">
              <label>
                Bereich
                <select name="area" defaultValue="inside" required>
                  <option value="inside">Drinnen</option>
                  <option value="outside">Draußen</option>
                </select>
              </label>
              <label>
                Datum
                <input
                  name="date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  required
                />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Uhrzeit
                <select name="time" defaultValue="12:00" required>
                  {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                    <option value={time} key={time}>{time} Uhr</option>
                  ))}
                </select>
              </label>
              <label>
                Personen
                <input name="guests" type="number" min="1" max="60" required />
              </label>
            </div>
            <label>
              Name
              <input name="customerName" type="text" maxLength={120} required />
            </label>
            <label>
              Telefonnummer
              <input name="customerPhone" type="tel" maxLength={40} required />
            </label>
            <label>
              E-Mail-Adresse (optional)
              <input name="customerEmail" type="email" maxLength={254} />
            </label>
            <label>
              Hinweis (optional)
              <textarea name="note" rows={3} maxLength={2000} />
            </label>
            <button className="btn btn-primary" disabled={formStatus === 'loading'}>
              {formStatus === 'loading' ? 'Wird gespeichert …' : 'Reservierung eintragen'}
            </button>
            {formStatus !== 'idle' && formMessage && (
              <p
                className={`form-status ${formStatus === 'success' ? 'is-success' : 'is-error'}`}
                role={formStatus === 'error' ? 'alert' : 'status'}
              >
                {formMessage}
              </p>
            )}
          </form>
        </article>

        <article className="admin-panel admin-reservations">
          <div className="admin-list-heading">
            <h2>Reservierungen</h2>
            <input
              aria-label="Reservierungen für Datum"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          {listStatus === 'loading' && <p>Reservierungen werden geladen …</p>}
          {listStatus === 'error' && (
            <p className="form-status is-error">Reservierungen konnten nicht geladen werden.</p>
          )}
          {listStatus === 'success' && reservations.length === 0 && (
            <p>Für diesen Tag sind noch keine Reservierungen eingetragen.</p>
          )}
          <div className="admin-reservation-list">
            {reservations.map((reservation) => (
              <article className="admin-reservation" key={reservation.id}>
                <div className="admin-reservation-main">
                  <strong>{reservation.start_time.slice(0, 5)} Uhr · {reservation.customer_name}</strong>
                  <span>{reservation.guest_count} Personen · {reservation.cafe_tables?.name ?? 'Ohne Tisch'}</span>
                  <span>{zoneLabels[reservation.cafe_tables?.zone ?? reservation.area] ?? reservation.area}</span>
                  <a href={`tel:${reservation.customer_phone}`}>{reservation.customer_phone}</a>
                  {reservation.customer_email && (
                    <a href={`mailto:${reservation.customer_email}`}>{reservation.customer_email}</a>
                  )}
                  {reservation.note && <small>{reservation.note}</small>}
                </div>
                <div className="admin-reservation-actions">
                  <span className={`reservation-status status-${reservation.status}`}>
                    {statusLabels[reservation.status]}
                  </span>
                  {reservation.status === 'requested' && (
                    <button type="button" onClick={() => updateReservationStatus(reservation.id, 'confirmed')}>
                      Bestätigen
                    </button>
                  )}
                  {['requested', 'confirmed'].includes(reservation.status) && (
                    <button type="button" onClick={() => updateReservationStatus(reservation.id, 'cancelled')}>
                      Stornieren
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}
