// Formatos para mostrar datos de la API en las tablas

/** La API devuelve fechas ISO (yyyy-MM-ddTHH:mm:ss); se muestran en formato local */
export function formatFecha(val: string | null | undefined): string {
  if (!val) return '';
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatMoneda(val: number | null | undefined): string {
  if (val === null || val === undefined) return '';
  return val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}
