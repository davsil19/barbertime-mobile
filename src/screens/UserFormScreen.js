// Registrar usuario (POST /users) o actualizar (PUT /users/:id) — con selección de rol
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Screen, Header, Field, Button, Txt, Chip, Section } from '../components/ui';
import { colors } from '../theme';
import { usersService } from '../services/users';
import { useAuth } from '../controllers/AuthContext';
import { emailValido } from '../models';

export default function UserFormScreen({ navigation, route }) {
  const id = route.params?.id;
  const { esAdmin, user, setUser } = useAuth();
  const [f, setF] = useState({ nombre: '', email: '', telefono: '', password: '', rol: 'cliente' });
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  useEffect(() => { if (id) usersService.get(id).then((u) => setF({ nombre: u.nombre, email: u.email, telefono: u.telefono || '', password: '', rol: u.rol })).catch((e) => setErr({ general: e.message })); }, [id]);

  const guardar = async () => {
    const e = {};
    if (f.nombre.trim().length < 3) e.nombre = 'Escribe el nombre completo.';
    if (!emailValido(f.email)) e.email = 'Ingresa un correo válido.';
    if (f.telefono && !/^\d{7,10}$/.test(f.telefono)) e.telefono = 'Teléfono de 7 a 10 dígitos.';
    if (!id && f.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    if (id && f.password && f.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    setErr(e); if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const body = { nombre: f.nombre, email: f.email.trim().toLowerCase(), telefono: f.telefono };
      if (f.password) body.password = f.password;
      if (esAdmin) body.rol = f.rol;
      if (id) { const u = await usersService.update(id, body); if (user.id === Number(id)) setUser({ ...user, ...u }); }
      else await usersService.create(body);
      navigation.goBack();
    } catch (x) { setErr({ general: x.message }); }
    setLoading(false);
  };
  return (
    <Screen>
      <Header title={id ? 'Actualizar usuario' : 'Registrar usuario'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Field label="Nombre completo" icon="user" value={f.nombre} onChangeText={set('nombre')} error={err.nombre} />
        <Field label="Correo electrónico" icon="mail" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" error={err.email} />
        <Field label="Teléfono" icon="phone" value={f.telefono} onChangeText={set('telefono')} keyboardType="phone-pad" error={err.telefono} />
        <Field label={id ? 'Nueva contraseña (opcional)' : 'Contraseña'} icon="lock" value={f.password} onChangeText={set('password')} secureTextEntry error={err.password} />
        {esAdmin && (<>
          <Section style={{ marginTop: 0 }}>Rol</Section>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Chip label="Cliente" on={f.rol === 'cliente'} onPress={() => setF({ ...f, rol: 'cliente' })} />
            <Chip label="Administrador" on={f.rol === 'admin'} onPress={() => setF({ ...f, rol: 'admin' })} />
          </View></>)}
        {!!err.general && <Txt size={13} color={colors.err} style={{ marginBottom: 10 }}>{err.general}</Txt>}
        <Button title={id ? 'Guardar cambios' : 'Registrar usuario'} onPress={guardar} loading={loading} />
      </ScrollView>
    </Screen>
  );
}
