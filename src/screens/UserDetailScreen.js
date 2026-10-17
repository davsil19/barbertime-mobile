// Ver usuario por ID (GET /users/:id) + eliminar (DELETE /users/:id)
import React, { useCallback, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Header, Txt, Card, Avatar, Badge, Button, Confirm, ErrorBox } from '../components/ui';
import { colors } from '../theme';
import { usersService } from '../services/users';
import { useAuth } from '../controllers/AuthContext';

export default function UserDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { user: yo } = useAuth();
  const [u, setU] = useState(null);
  const [error, setError] = useState('');
  const [dlg, setDlg] = useState(false);
  const [busy, setBusy] = useState(false);
  const cargar = useCallback(() => { usersService.get(id).then(setU).catch((e) => setError(e.message)); }, [id]);
  useFocusEffect(cargar);

  const eliminar = async () => {
    setBusy(true);
    try { await usersService.remove(id); setDlg(false); navigation.goBack(); }
    catch (e) { setError(e.message); setDlg(false); }
    setBusy(false);
  };
  if (!u) return <Screen><Header title="Usuario" onBack={() => navigation.goBack()} />{!!error && <ErrorBox text={error} onRetry={cargar} />}</Screen>;
  const rows = [['ID', `#${u.id}`], ['Correo', u.email], ['Teléfono', u.telefono || '—'], ['Registro', String(u.created_at || '').slice(0, 10)]];
  return (
    <Screen>
      <Header title="Usuario" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Avatar user={u} size={96} ring />
        <Txt w="sb" size={22} style={{ marginTop: 12 }}>{u.nombre}</Txt>
        <View style={{ marginTop: 8 }}><Badge type={u.rol} /></View>
        <Card style={{ width: '100%', marginTop: 20, paddingVertical: 4 }}>
          {rows.map(([k, v], i) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, gap: 10, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: colors.line }}>
              <Txt color={colors.mut}>{k}</Txt><Txt w="m" style={{ flexShrink: 1, textAlign: 'right' }}>{v}</Txt>
            </View>))}
        </Card>
        {!!error && <Txt size={13} color={colors.err} style={{ marginTop: 12 }}>{error}</Txt>}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 12, padding: 20 }}>
        <Button title="Editar" icon="edit" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate('UserForm', { id })} />
        {yo?.id !== u.id && <Button title="Eliminar" icon="trash" variant="dangerSoft" style={{ flex: 1 }} onPress={() => setDlg(true)} />}
      </View>
      <Confirm visible={dlg} title="¿Eliminar usuario?" text={`Se eliminará a ${u.nombre} y sus datos. Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar" onConfirm={eliminar} onCancel={() => setDlg(false)} loading={busy} />
    </Screen>
  );
}
