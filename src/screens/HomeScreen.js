// Inicio (cliente) / Panel (admin): resumen con datos reales de la API
import React, { useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { usersService } from '../services/users';
import { View, ScrollView } from 'react-native';
import { Screen, Header, Txt, Card, Button, Section } from '../components/ui';
import CitaCard from '../components/CitaCard';
import { colors } from '../theme';
import { useCitas } from '../controllers/hooks';
import { useAuth } from '../controllers/AuthContext';
import { esPasada, parseFecha } from '../models';

const Stat = ({ n, l }) => (
  <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
    <Txt w="b" size={28} color={colors.goldD}>{n}</Txt><Txt size={12} color={colors.mut}>{l}</Txt>
  </Card>);

export default function HomeScreen({ navigation }) {
  const { user, esAdmin } = useAuth();
  const { data: citas } = useCitas();
  const { data: users } = useUsuarios_(esAdmin);
  const prox = useMemo(() => citas.filter((c) => c.estado !== 'cancelada' && !esPasada(c))
    .sort((a, b) => parseFecha(a.fecha) - parseFecha(b.fecha) || a.hora.localeCompare(b.hora)), [citas]);
  return (
    <Screen>
      <Header title={`Hola, ${user?.nombre?.split(' ')[0] || ''}`} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Stat n={prox.length} l="Próximas" />
          <Stat n={citas.filter((c) => c.estado === 'pendiente').length} l="Pendientes" />
          {esAdmin ? <Stat n={users.length} l="Usuarios" /> : <Stat n={citas.filter((c) => c.estado === 'confirmada').length} l="Confirmadas" />}
        </View>
        <Section>{esAdmin ? 'Próximas citas del negocio' : 'Tu próxima cita'}</Section>
        {prox.slice(0, esAdmin ? 4 : 1).map((c) => <CitaCard key={c.id} cita={c} mostrarCliente={esAdmin} onPress={() => navigation.navigate('CitaDetail', { id: c.id })} />)}
        {!prox.length && <Txt color={colors.mut} style={{ marginBottom: 12 }}>No tienes citas próximas.</Txt>}
        <Button title="Agendar nueva cita" variant="accent" icon="plus" onPress={() => navigation.navigate('CitaForm')} style={{ marginTop: 8 }} />
      </ScrollView>
    </Screen>
  );
}
// el cliente no puede listar usuarios (403): solo el admin pide /users
function useUsuarios_(esAdmin) {
  const [data, setData] = useState([]);
  useFocusEffect(useCallback(() => { if (esAdmin) usersService.list().then(setData).catch(() => {}); }, [esAdmin]));
  return { data };
}
