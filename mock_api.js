// Mock sencillo de la API (sin MySQL) para probar la app: node mock_api.js  -> http://localhost:3000/api
const http = require('http');
const PORT = process.env.PORT || 3000;
let users = [
  { id: 1, nombre: 'Administrador', email: 'admin@barbertime.com', telefono: '3001112233', rol: 'admin', foto: null, created_at: '2026-09-01', password: 'Admin123!' },
  { id: 2, nombre: 'David Silva Ortega', email: 'david@correo.com', telefono: '3105556677', rol: 'cliente', foto: null, created_at: '2026-09-10', password: 'Cliente123!' },
  { id: 3, nombre: 'Laura Rojas Pardo', email: 'laura@correo.com', telefono: '3157778899', rol: 'cliente', foto: null, created_at: '2026-09-12', password: 'Cliente123!' },
  { id: 4, nombre: 'Camilo Pérez Gil', email: 'camilo@correo.com', telefono: '3201234567', rol: 'cliente', foto: null, created_at: '2026-09-15', password: 'Cliente123!' },
];
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
let citas = [
  { id: 1, user_id: 2, servicio: 'Corte clásico', barbero: 'Julián Torres', fecha: d(2), hora: '11:00', estado: 'confirmada', notas: 'Degradado bajo a los lados, arriba más largo.', audio: null, created_at: d(-1) },
  { id: 2, user_id: 2, servicio: 'Corte + barba', barbero: 'Andrés Mora', fecha: d(4), hora: '16:00', estado: 'pendiente', notas: '', audio: null, created_at: d(-1) },
  { id: 3, user_id: 3, servicio: 'Barba', barbero: 'Julián Torres', fecha: d(7), hora: '10:00', estado: 'confirmada', notas: '', audio: null, created_at: d(-1) },
  { id: 4, user_id: 2, servicio: 'Corte niño', barbero: 'Andrés Mora', fecha: d(-5), hora: '14:00', estado: 'confirmada', notas: '', audio: null, created_at: d(-9) },
  { id: 5, user_id: 2, servicio: 'Barba', barbero: 'Julián Torres', fecha: d(9), hora: '12:00', estado: 'cancelada', notas: '', audio: null, created_at: d(-3) },
];
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const sign = (u) => `${b64({ alg: 'none' })}.${b64({ id: u.id, rol: u.rol })}.mock`;
const pub = ({ password, ...u }) => u;
const conNombre = (c) => ({ ...c, nombre_cliente: (users.find((u) => u.id === c.user_id) || {}).nombre });
let nid = { u: 10, c: 10 };

http.createServer((req, res) => {
  const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(obj)); };
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' }); return res.end(); }
  let raw = []; req.on('data', (c) => raw.push(c));
  req.on('end', () => {
    const url = req.url.split('?')[0].replace(/^\/api/, '');
    const isJson = (req.headers['content-type'] || '').includes('json');
    let body = {}; if (isJson) { try { body = JSON.parse(Buffer.concat(raw).toString() || '{}'); } catch {} }
    const m = req.method; const p = url.split('/').filter(Boolean);
    let me = null; const tk = (req.headers.authorization || '').replace('Bearer ', '');
    if (tk) { try { me = users.find((u) => u.id === JSON.parse(Buffer.from(tk.split('.')[1], 'base64url')).id); } catch {} }
    console.log(m, req.url, me ? me.email : '-');
    if (p[0] === 'auth') {
      if (p[1] === 'login') { const u = users.find((x) => x.email === body.email && x.password === body.password); return u ? send(200, { token: sign(u), user: pub(u) }) : send(401, { error: 'Credenciales inválidas' }); }
      if (p[1] === 'register') { if (users.some((x) => x.email === body.email)) return send(409, { error: 'El correo ya está registrado' }); const u = { id: nid.u++, rol: 'cliente', foto: null, created_at: d(0), ...body }; users.push(u); return send(201, { token: sign(u), user: pub(u) }); }
    }
    if (!me) return send(401, { error: 'Token requerido' });
    const admin = me.rol === 'admin';
    if (p[0] === 'users') {
      const id = Number(p[1]);
      if (!p[1]) { if (!admin) return send(403, { error: 'Solo administradores' }); if (m === 'GET') return send(200, users.map(pub)); if (m === 'POST') { const u = { id: nid.u++, foto: null, created_at: d(0), rol: 'cliente', ...body }; users.push(u); return send(201, pub(u)); } }
      const u = users.find((x) => x.id === id); if (!u) return send(404, { error: 'No encontrado' });
      if (!admin && me.id !== id) return send(403, { error: 'Sin permiso' });
      if (p[2] === 'foto' && m === 'POST') { u.foto = 'foto_demo.jpg'; return send(200, pub(u)); }
      if (m === 'GET') return send(200, pub(u));
      if (m === 'PUT') { Object.assign(u, body, admin ? {} : { rol: u.rol }); return send(200, pub(u)); }
      if (m === 'DELETE') { if (!admin) return send(403, { error: 'Solo administradores' }); users = users.filter((x) => x.id !== id); return send(200, { ok: true }); }
    }
    if (p[0] === 'citas') {
      const vis = admin ? citas : citas.filter((c) => c.user_id === me.id);
      if (!p[1]) { if (m === 'GET') return send(200, vis.map(conNombre)); if (m === 'POST') { const c = { id: nid.c++, user_id: admin && body.user_id ? body.user_id : me.id, estado: 'pendiente', audio: null, notas: '', created_at: d(0), ...body }; citas.push(c); return send(201, conNombre(c)); } }
      const id = Number(p[1]); const c = vis.find((x) => x.id === id); if (!c) return send(404, { error: 'Cita no encontrada' });
      if (p[2] === 'audio') { c.audio = 'nota_demo.m4a'; return send(200, conNombre(c)); }
      if (p[2] === 'estado') { if (!admin) return send(403, { error: 'Solo administradores' }); c.estado = body.estado; return send(200, conNombre(c)); }
      if (m === 'GET') return send(200, conNombre(c));
      if (m === 'PUT') { Object.assign(c, body); return send(200, conNombre(c)); }
      if (m === 'DELETE') { citas = citas.filter((x) => x.id !== id); return send(200, { ok: true }); }
    }
    send(404, { error: 'Ruta no encontrada' });
  });
}).listen(PORT, () => console.log('Mock API BarberTime en http://localhost:' + PORT + '/api'));
