import { supabase } from './supabase'

export type ReservationArea = 'inside' | 'outside'

export type AvailableSlot = {
  time: string
  available: boolean
}

export type ReservationInput = {
  area: ReservationArea
  date: string
  time: string
  guests: number
  customerName: string
  customerEmail: string
  customerPhone: string
  note?: string
}

export type CreatedReservation = {
  id: string
  status: 'requested'
  cancellationToken: string
}

export async function getAvailableSlots(
  date: string,
  area: ReservationArea,
  guests: number,
): Promise<AvailableSlot[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase.rpc('get_available_slots', {
    p_date: date,
    p_area: area,
    p_guests: guests,
  })

  if (error) {
    throw error
  }

  return (data ?? []).map(
    (slot: { slot_time: string; available: boolean }) => ({
      time: slot.slot_time.slice(0, 5),
      available: slot.available,
    }),
  )
}

export async function createReservation(
  input: ReservationInput,
): Promise<CreatedReservation> {
  if (!supabase) {
    throw new Error('Supabase ist nicht konfiguriert.')
  }

  const { data, error } = await supabase.rpc('create_reservation', {
    p_area: input.area,
    p_date: input.date,
    p_time: input.time,
    p_guests: input.guests,
    p_customer_name: input.customerName,
    p_customer_email: input.customerEmail,
    p_customer_phone: input.customerPhone,
    p_note: input.note || null,
  })

  if (error) {
    throw error
  }

  const reservation = data?.[0] as
    | {
        reservation_id: string
        reservation_status: 'requested'
        cancellation_token: string
      }
    | undefined

  if (!reservation) {
    throw new Error('Die Reservierung wurde nicht angelegt.')
  }

  return {
    id: reservation.reservation_id,
    status: reservation.reservation_status,
    cancellationToken: reservation.cancellation_token,
  }
}

export async function cancelReservation(
  reservationId: string,
  cancellationToken: string,
): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { data, error } = await supabase.rpc('cancel_reservation', {
    p_reservation_id: reservationId,
    p_cancellation_token: cancellationToken,
  })

  if (error) {
    throw error
  }

  return data === true
}
