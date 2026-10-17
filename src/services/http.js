// Cliente HTTP: pone la URL base, el header Authorization y convierte errores
import { API_URL } from '../config/api';
import { TOKEN_KEY } from '../config/constants';
import { storage } from './storage';

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

export async function request(path, { method = 'GET', body, form, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (auth) {
    const token = await storage.get(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let payload;
  if (form) payload = form; // multipart: NO poner Content-Type, fetch lo calcula
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload, signal: ctrl.signal });
  } catch (e) {
    throw new ApiError('No se pudo conectar con el servidor. Revisa la IP en src/config/api.js y que el backend esté encendido.', 0);
  } finally { clearTimeout(t); }

  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    if (res.status === 401 && auth && onUnauthorized) onUnauthorized();
    throw new ApiError((data && (data.error || data.message)) || `Error ${res.status}`, res.status);
  }
  return data;
}

// Arma un FormData para subir un archivo (cámara / micrófono)
export async function archivoForm(campo, uri, nombre, tipo) {
  const form = new FormData();
  if (uri.startsWith('file:') || uri.startsWith('content:')) {
    form.append(campo, { uri, name: nombre, type: tipo }); // React Native
  } else {
    const blob = await (await fetch(uri)).blob(); // web
    form.append(campo, blob, nombre);
  }
  return form;
}
