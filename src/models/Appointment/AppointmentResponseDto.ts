// Espejo de Agendify.Application.Dtos.Appointment.AppointmentResponseDto
export interface AppointmentResponseDto {
  id: number
  clientName: string | null
  barberName: string | null
  date: string
  notes: string | null
  total: number
  clientId: number
  barberId: number
}
