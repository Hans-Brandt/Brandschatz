import { useState } from 'react'
import { getHolidayName, isReservableDate, toIsoDate } from './reservationDates'

type ReservationCalendarProps = {
  value: string
  onChange: (value: string) => void
}

const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const monthFormatter = new Intl.DateTimeFormat('de-DE', {
  month: 'long',
  year: 'numeric',
})
const selectedDateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7
  const firstCalendarDay = new Date(firstDay)
  firstCalendarDay.setDate(firstDay.getDate() - mondayBasedOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCalendarDay)
    date.setDate(firstCalendarDay.getDate() + index)
    return date
  })
}

export default function ReservationCalendar({
  value,
  onChange,
}: ReservationCalendarProps) {
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const [visibleMonth, setVisibleMonth] = useState(currentMonth)
  const calendarDays = getCalendarDays(visibleMonth)
  const selectedDate = value ? new Date(`${value}T12:00:00`) : null
  const selectedHoliday = selectedDate ? getHolidayName(selectedDate) : undefined
  const isCurrentMonth =
    visibleMonth.getFullYear() === currentMonth.getFullYear()
    && visibleMonth.getMonth() === currentMonth.getMonth()

  function changeMonth(offset: number) {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    )
  }

  return (
    <div className="reservation-calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-navigation"
          onClick={() => changeMonth(-1)}
          disabled={isCurrentMonth}
          aria-label="Vorheriger Monat"
        >
          ‹
        </button>
        <strong aria-live="polite">{monthFormatter.format(visibleMonth)}</strong>
        <button
          type="button"
          className="calendar-navigation"
          onClick={() => changeMonth(1)}
          aria-label="Nächster Monat"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid" role="grid" aria-label="Reservierungskalender">
        {weekdays.map((weekday) => (
          <span className="calendar-weekday" key={weekday} role="columnheader">
            {weekday}
          </span>
        ))}
        {calendarDays.map((date) => {
          const isoDate = toIsoDate(date)
          const holiday = getHolidayName(date)
          const isInVisibleMonth = date.getMonth() === visibleMonth.getMonth()
          const isAvailable = isInVisibleMonth && isReservableDate(date, today)
          const isSelected = value === isoDate

          return (
            <button
              type="button"
              className={`calendar-day ${isSelected ? 'is-selected' : ''} ${holiday && isAvailable ? 'is-holiday' : ''}`}
              key={isoDate}
              disabled={!isAvailable}
              onClick={() => onChange(isoDate)}
              aria-pressed={isSelected}
              aria-label={`${selectedDateFormatter.format(date)}${holiday ? `, ${holiday}` : ''}${isAvailable ? ', verfügbar' : ', nicht verfügbar'}`}
              role="gridcell"
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <input type="hidden" name="date" value={value} />
      <p className="calendar-selection" aria-live="polite">
        {selectedDate ? (
          <>
            Ausgewählt: <strong>{selectedDateFormatter.format(selectedDate)}</strong>
            {selectedHoliday ? ` · ${selectedHoliday}` : ''}
          </>
        ) : (
          'Bitte wählen Sie einen verfügbaren Tag aus.'
        )}
      </p>
      <p className="calendar-legend">
        Buchbar sind Samstage, Sonntage und gesetzliche Feiertage in
        Schleswig-Holstein.
      </p>
    </div>
  )
}
