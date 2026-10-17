import React, { useMemo, useState } from 'react';
import { View, FlatList, Pressable, RefreshControl } from 'react-native';
import { Screen, Header, IconBtn, Fab, Txt, Empty, ErrorBox } from '../components/ui';
import CitaCard from '../components/CitaCard';
import { colors } from '../theme';
import { useCitas } from '../controllers/hooks';
import { useAuth } from '../controllers/AuthContext';
import { esPasada, parseFecha } from '../models';

const TABS = [['prox', 'Próximas'], ['pas', 'Pasadas'], ['can', 'Canceladas']];

export default function CitasScreen({ navigation }) {
  const { esAdmin } = useAuth();
  const { data, loading, error, recargar } = useCitas();
  const [tab, setTab] = useState('prox');
  const [q, setQ] = useState(false);

  const lista = useMemo(() => {
    const f = (c) => tab === 'can' ? c.estado === 'cancelada'
      : tab === 'prox' ? c.estado !== 'cancelada' && !esPasada(c)
      : c.estado !== 'cancelada' && esPasada(c);
    const r = data.filter(f).sort((a, b) => (parseFecha(a.fecha) - parseFecha(b.fecha)) || a.hora.localeCompare(b.hora));
    return tab === 'prox' ? r : r.reverse();
  }, [data, tab]);

  return (
    <Screen>
      <Header title={esAdmin ? 'Todas las citas' : 'Mis citas'} />
      <View style={{ marginHorizontal: 20, padding: 6, backgroundColor: '#E8E0CC', borderRadius: 18, flexDirection: 'row' }}>
        {TABS.map(([k, l]) => (
          <Pressable key={k} onPress={() => setTab(k)} style={{ flex: 1, paddingVertical: 11, borderRadius: 13, alignItems: 'center', backgroundColor: tab === k ? colors.ink : 'transparent' }}>
            <Txt w={tab === k ? 'sb' : 'm'} size={14} color={tab === k ? colors.gold : colors.mut}>{l}</Txt>
          </Pressable>
        ))}
      </View>
      {error ? <ErrorBox text={error} onRetry={recargar} /> : (
        <FlatList data={lista} keyExtractor={(c) => String(c.id)} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={recargar} />}
          ListEmptyComponent={!loading && <Empty text="No hay citas en esta pestaña." />}
          renderItem={({ item }) => <CitaCard cita={item} mostrarCliente={esAdmin} onPress={() => navigation.navigate('CitaDetail', { id: item.id })} />} />
      )}
      <Fab onPress={() => navigation.navigate('CitaForm')} />
    </Screen>
  );
}
