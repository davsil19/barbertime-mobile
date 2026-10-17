import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Screen, Header, Field, Button, Txt } from '../components/ui';
import { colors } from '../theme';
import { useAuth } from '../controllers/AuthContext';
import { emailValido } from '../models';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [f, setF] = useState({ nombre: '', email: '', telefono: '', password: '' });
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const crear = async () => {
    const e = {};
    if (f.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre completo.';
    if (!emailValido(f.email)) e.email = 'Ingresa un correo válido.';
    if (!/^\d{7,10}$/.test(f.telefono)) e.telefono = 'Teléfono de 7 a 10 dígitos.';
    if (f.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    setErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try { await register({ ...f, email: f.email.trim().toLowerCase() }); }
    catch (x) { setErr({ general: x.message }); }
    setLoading(false);
  };
  return (
    <Screen>
      <Header title="Crear cuenta" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Txt color={colors.mut} style={{ marginBottom: 18 }}>Regístrate para agendar tus citas. Tu perfil será de Cliente.</Txt>
        <Field label="Nombre completo" icon="user" value={f.nombre} onChangeText={set('nombre')} error={err.nombre} />
        <Field label="Correo electrónico" icon="mail" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" error={err.email} />
        <Field label="Teléfono" icon="phone" value={f.telefono} onChangeText={set('telefono')} keyboardType="phone-pad" error={err.telefono} />
        <Field label="Contraseña" icon="lock" value={f.password} onChangeText={set('password')} secureTextEntry error={err.password} />
        {!!err.general && <Txt size={13} color={colors.err} style={{ marginBottom: 10, textAlign: 'center' }}>{err.general}</Txt>}
        <Button title="Registrarme" variant="primary" onPress={crear} loading={loading} />
      </ScrollView>
    </Screen>
  );
}
