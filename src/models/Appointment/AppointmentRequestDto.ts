export interface AppointmentRequestDto {
  clientId: number
  barberId: number
  date: string
  notes: string | null
  total: number
}