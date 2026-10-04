const fixedHolidays: Record<string, string> = {
  '01-01': 'Neujahr',
  '05-01': 'Tag der Arbeit',
  '10-03': 'Tag der Deutschen Einheit',
  '10-31': 'Reformationstag',
  '12-25': '1. Weihnachtstag',
  '12-26': '2. Weihnachtstag',
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function getEasterSunday(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return new Date(year, month - 1, day)
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getHolidayName(date: Date) {
  const fixedHoliday = fixedHolidays[toIsoDate(date).slice(5)]

  if (fixedHoliday) {
    return fixedHoliday
  }

  const easterSunday = getEasterSunday(date.getFullYear())
  const movableHolidays = new Map([
    [toIsoDate(addDays(easterSunday, -2)), 'Karfreitag'],
    [toIsoDate(addDays(easterSunday, 1)), 'Ostermontag'],
    [toIsoDate(addDays(easterSunday, 39)), 'Christi Himmelfahrt'],
    [toIsoDate(addDays(easterSunday, 50)), 'Pfingstmontag'],
  ])

  return movableHolidays.get(toIsoDate(date))
}

export function isReservableDate(date: Date, today = new Date()) {
  const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  return dateAtMidnight >= todayAtMidnight && (isWeekend || Boolean(getHolidayName(date)))
}
