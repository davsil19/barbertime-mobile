import React, { useState } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import Icon from '../components/Icon';
import { Txt, Field, Button } from '../components/ui';
import { useAuth } from '../controllers/AuthContext';
import { emailValido } from '../models';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ver, setVer] = useState(false);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);

  const entrar = async () => {
    const e = {};
    if (!emailValido(email)) e.email = 'Ingresa un correo válido.';
    if (!password) e.password = 'Ingresa tu contraseña.';
    setErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try { await login(email.trim().toLowerCase(), password); }
    catch (x) { setErr({ general: x.message }); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 32, paddingTop: 40 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <View style={{ width: 76, height: 76, borderRadius: 24, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8 }}>
              <Icon name="scissors" size={38} color={colors.gold} />
            </View>
            <Txt w="b" size={30} style={{ marginTop: 18, letterSpacing: -0.8 }}>Barber<Txt w="b" size={30} color={colors.goldD}>Time</Txt></Txt>
            <Txt size={14} color={colors.mut} style={{ marginTop: 4 }}>Tu cita, a tu hora.</Txt>
          </View>
          <Field label="Correo electrónico" icon="mail" value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com"
            autoCapitalize="none" keyboardType="email-address" error={err.email} testID="email" />
          <Field label="Contraseña" icon="lock" value={password} onChangeText={setPassword} placeholder="••••••••"
            secureTextEntry={!ver} error={err.password} testID="password"
            right={<Pressable onPress={() => setVer(!ver)}><Icon name="eye" size={20} color={colors.mut} /></Pressable>} />
          {!!err.general && <Txt size={13} color={colors.err} style={{ marginBottom: 10, textAlign: 'center' }}>{err.general}</Txt>}
          <Button title="Iniciar sesión" onPress={entrar} loading={loading} testID="btn-login" style={{ marginTop: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} /><Txt color={colors.mut}>o</Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          </View>
          <Button title="Crear cuenta nueva" variant="outline" onPress={() => navigation.navigate('Register')} />
          <Txt size={12.5} color={colors.mut} style={{ textAlign: 'center', marginTop: 24 }}>
            Al continuar aceptas los Términos y la Política de privacidad.</Txt>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
