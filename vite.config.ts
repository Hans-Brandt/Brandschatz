import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { isReservableDate } from './src/reservationDates'

function reservationApiForDevelopment(): Plugin {
  return {
    name: 'reservation-api-development',
    configureServer(server) {
      server.middlewares.use('/api/reservation.php', (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        let body = ''

        request.on('data', (chunk) => {
          body += chunk
        })

        request.on('end', () => {
          response.setHeader('Content-Type', 'application/json; charset=utf-8')

          try {
            const data = JSON.parse(body) as Record<string, string>
            const requiredFields = [
              'reservationLocation',
              'name',
              'email',
              'phone',
              'guests',
              'date',
              'time',
              'consent',
            ]
            const isComplete = requiredFields.every((field) => data[field])
            const requestedDate = new Date(`${data.date}T12:00:00`)
            const validLocation = ['inside', 'outside'].includes(
              data.reservationLocation,
            )
            const validDate =
              !Number.isNaN(requestedDate.getTime())
              && isReservableDate(requestedDate)
            const validTime = [
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
            ].includes(data.time)

            if (!isComplete || !validLocation || !validDate || !validTime) {
              response.statusCode = 422
              response.end(JSON.stringify({ success: false }))
              return
            }

            response.statusCode = 200
            response.end(JSON.stringify({ success: true, development: true }))
          } catch {
            response.statusCode = 400
            response.end(JSON.stringify({ success: false }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reservationApiForDevelopment()],
})
