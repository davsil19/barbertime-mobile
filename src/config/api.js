// =====================================================================
//  CONFIGURACION DE LA API  (el unico archivo que hay que tocar)
// =====================================================================
//  El celular NO entiende "localhost" (seria el propio celular).
//  Hay que poner la IP del computador donde corre el backend (XAMPP/Node):
//    1) En Windows abre CMD y escribe:  ipconfig   -> copia "Direccion IPv4"
//       (ej. 192.168.1.15). Celular y PC deben estar en la MISMA red WiFi.
//    2) Cambia la constante HOST de abajo, o (mejor) crea un archivo .env con:
//         EXPO_PUBLIC_API_URL=http://192.168.1.15:3000/api
//  Emulador Android de Android Studio: usa 10.0.2.2 en lugar de la IP.
// =====================================================================
const HOST = '192.168.1.X'; // <-- CAMBIAR por la IP de tu PC
const PORT = 3000;

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${HOST}:${PORT}/api`;

// Los archivos subidos (fotos, audios) cuelgan de /uploads en el mismo servidor
export const FILES_URL = API_URL.replace(/\/api\/?$/, '');
export const fileUrl = (name) =>
  !name ? null : /^https?:/.test(name) || name.startsWith('file:') || name.startsWith('blob:')
    ? name
    : `${FILES_URL}/uploads/${name}`;
