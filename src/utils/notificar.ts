import { Notify } from 'quasar';

export function notificarError(mensaje: string) {
  Notify.create({ type: 'negative', message: mensaje, position: 'top' });
}

export function notificarExito(mensaje: string) {
  Notify.create({ type: 'positive', message: mensaje, position: 'top' });
}