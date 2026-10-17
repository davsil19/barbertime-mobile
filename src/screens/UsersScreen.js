import React, { useMemo, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Screen, Header, Txt, Field, Chip, Card, Avatar, Badge, Fab, Empty, ErrorBox } from '../components/ui';
import { colors } from '../theme';
import { useUsuarios } from '../controllers/hooks';

export default function UsersScreen({ navigation }) {
  const { data, loading, error, recargar } = useUsuarios();
  const [q, setQ] = useState('');
  const [rol, setRol] = useState('todos');
  const lista = useMemo(() => data.filter((u) =>
    (rol === 'todos' || u.rol === rol) &&
    (u.nombre + u.email).toLowerCase().includes(q.toLowerCase())), [data, q, rol]);
  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingRight: 20 }}>
        <View style={{ flex: 1 }}><Header title="Usuarios" /></View>
        <Txt color={colors.mut}>{data.length} registros</Txt>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Field icon="search" placeholder="Buscar por nombre o correo" value={q} onChangeText={setQ} style={{ marginBottom: 10 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
          {[['todos', 'Todos'], ['cliente', 'Clientes'], ['admin', 'Administradores']].map(([k, l]) => <Chip key={k} label={l} on={rol === k} onPress={() => setRol(k)} />)}
        </View>
      </View>
      {error ? <ErrorBox text={error} onRetry={recargar} /> : (
        <FlatList data={lista} keyExtractor={(u) => String(u.id)} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={recargar} />}
          ListEmptyComponent={!loading && <Empty text="Sin resultados." />}
          renderItem={({ item: u }) => (
            <Card onPress={() => navigation.navigate('UserDetail', { id: u.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar user={u} size={48} />
              <View style={{ flex: 1 }}>
                <Txt w="sb" size={16} numberOfLines={1}>{u.nombre}</Txt>
                <Txt size={13} color={colors.mut} numberOfLines={1}>{u.email}</Txt>
              </View>
              <Badge type={u.rol} />
            </Card>)} />)}
      <Fab onPress={() => navigation.navigate('UserForm')} />
    </Screen>
  );
}
