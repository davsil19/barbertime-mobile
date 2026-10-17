// "Modelos": forma de los datos + utilidades para pintarlos
import { MESES, DIAS, SERVICIOS } from '../config/constants';

export const iniciales = (nombre = '') =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export const parseFecha = (f) => {
  const s = String(f).slice(0, 10);
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const fechaISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const diaMes = (f) => { const d = parseFecha(f); return { dia: String(d.getDate()).padStart(2, '0'), mes: MESES[d.getMonth()], anio: d.getFullYear(), nombreDia: DIAS[d.getDay()] }; };
export const hora12 = (h = '00:00') => {
  const [H, M] = h.split(':').map(Number);
  return `${H % 12 === 0 ? 12 : H % 12}:${String(M).padStart(2, '0')} ${H < 12 ? 'a. m.' : 'p. m.'}`;
};
export const precioDe = (servicio) => SERVICIOS.find((s) => s.nombre === servicio) || { precio: 0, min: 0 };
export const dinero = (n) => '$ ' + Number(n).toLocaleString('es-CO');
export const esPasada = (c) => {
  const f = parseFecha(c.fecha); const [H, M] = (c.hora || '00:00').split(':').map(Number);
  f.setHours(H, M); return f < new Date();
};
export const emailValido = (e) => /^\S+@\S+\.\S+$/.test(e || '');
