# BarberTime Móvil (Expo / React Native)
Prototipo del tercer corte – Computación Móvil, UNIMINUTO. David Santiago Silva Ortega (ID 751640).

## Requisitos
Node 18+, backend BarberTime corriendo (Node/Express + MySQL en XAMPP, puerto 3000), Expo Go en el teléfono (misma red WiFi).

## Ejecutar
```bash
cd barbertime-mobile
npm install
# poner la IP del PC (ipconfig -> IPv4), una de dos:
#   a) editar HOST en src/config/api.js
#   b) copiar .env.example a .env y editar EXPO_PUBLIC_API_URL
npx expo start          # escanear el QR con Expo Go
npx expo start --tunnel # si la red bloquea la conexión
```
Emulador Android: usar la IP `10.0.2.2` y pulsar `a`.

## Sin backend (prueba rápida)
```bash
node mock_api.js        # API simulada en el puerto 3000 (PORT=3999 para otro)
EXPO_PUBLIC_API_URL=http://localhost:3000/api npx expo start --web
```
Usuarios: `admin@barbertime.com` / `Admin123!`; en el mock también `david@correo.com` / `Cliente123!`.

## Estructura
`src/{config,theme,models,services,controllers,components,navigation,screens}` (ver la guía de sustentación).

## Cámara y audio
`expo-image-picker` (foto) y `expo-audio` (nota de voz; reemplaza a expo-av en SDK 58). Permisos en `app.json`.

## Verificado / no verificado
Verificado: `expo export` Android y web compilan; recorrido completo en versión web contra mock. No verificado: teléfono físico, cámara y micrófono reales, backend MySQL real.
