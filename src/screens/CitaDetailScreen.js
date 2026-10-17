// Ver cita por ID, modificar y cancelar/eliminar
import React, { useCallback, useState } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import { Screen, Header, Txt, Card, Badge, Button, Section, Confirm, ErrorBox } from '../components/ui';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { citasService } from '../services/citas';
import { useAuth } from '../controllers/AuthContext';
import { diaMes, hora12, dinero, precioDe } from '../models';
import { fileUrl } from '../config/api';

function AudioPlayer({ uri }) {
  const player = useAudioPlayer(uri);
  const [on, setOn] = useState(false);
  const toggle = () => { if (on) { player.pause(); } else { player.seekTo(0); player.play(); } setOn(!on); };
  return (
    <Pressable onPress={toggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={on ? 'pause' : 'play'} size={22} />
      </View>
      <Txt w="m" color={colors.mut}>Nota de voz · {on ? 'reproduciendo' : 'toca para oír'}</Txt>
    </Pressable>
  );
}

export default function CitaDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { esAdmin } = useAuth();
  const [c, setC] = useState(null);
  const [error, setError] = useState('');
  const [dlg, setDlg] = useState(false);
  const [busy, setBusy] = useState(false);

  const cargar = useCallback(() => { citasService.get(id).then(setC).catch((e) => setError(e.message)); }, [id]);
  useFocusEffect(cargar);

  const cancelar = async () => {
    setBusy(true);
    try {
      if (esAdmin) await citasService.estado(id, 'cancelada'); else await citasService.remove(id);
      setDlg(false); navigation.goBack();
    } catch (e) { setError(e.message); setDlg(false); }
    setBusy(false);
  };
  const eliminar = async () => { try { await citasService.remove(id); navigation.goBack(); } catch (e) { setError(e.message); } };
  const cambiar = async (estado) => { try { setC(await citasService.estado(id, estado)); } catch (e) { setError(e.message); } };

  if (!c) return <Screen><Header title="Detalle de cita" onBack={() => navigation.goBack()} />{error && <ErrorBox text={error} onRetry={cargar} />}</Screen>;
  const { dia, mes, anio, nombreDia } = diaMes(c.fecha);
  const hh = String(c.hora).slice(0, 5); const sv = precioDe(c.servicio);
  const rows = [['Cliente', c.nombre_cliente || 'Yo'], ['Servicio', c.servicio], ['Barbero', c.barbero], ['Valor', dinero(sv.precio)]];
  return (
    <Screen>
      <Header title="Detalle de cita" onBack={() => navigation.goBack()} right={<Badge type={c.estado} />} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8 }}>
        <View style={{ backgroundColor: colors.ink, borderRadius: 22, padding: 20 }}>
          <Txt size={14} color="#bfae80">Cita #CIT-{String(c.id).padStart(4, '0')}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 6 }}>
            <View><Txt w="b" size={44} color={colors.gold} style={{ lineHeight: 50 }}>{dia}</Txt><Txt size={14} color="#bfae80">{mes} {anio}</Txt></View>
            <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#3a3f47' }} />
            <View><Txt w="sb" size={22} color="#fff">{hora12(hh)}</Txt><Txt size={14} color="#bfae80">{nombreDia} · {sv.min} min</Txt></View>
          </View>
        </View>
        <Card style={{ marginTop: 14, paddingVertical: 4 }}>
          {rows.map(([k, v], i) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: colors.line }}>
              <Txt color={colors.mut}>{k}</Txt><Txt w="m">{v}</Txt>
            </View>))}
        </Card>
        {(c.audio || c.notas) && <Section>Referencias para el barbero</Section>}
        {c.audio && <Card><AudioPlayer uri={fileUrl(c.audio)} /></Card>}
        {!!c.notas && <View style={{ marginTop: 10, backgroundColor: '#EDE3C8', borderRadius: 14, padding: 14 }}><Txt color={colors.mut}>"{c.notas}"</Txt></View>}
        {esAdmin && c.estado !== 'confirmada' && c.estado !== 'cancelada' && (
          <Button title="Confirmar cita" variant="accent" onPress={() => cambiar('confirmada')} style={{ marginTop: 16 }} />)}
        {!!error && <Txt size={13} color={colors.err} style={{ marginTop: 12 }}>{error}</Txt>}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 12, padding: 20, paddingTop: 6 }}>
        <Button title="Modificar" icon="edit" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate('CitaForm', { id })} />
        <Button title={esAdmin && c.estado !== 'cancelada' ? 'Cancelar' : 'Eliminar'} icon={esAdmin && c.estado !== 'cancelada' ? 'x' : 'trash'} variant="dangerSoft" style={{ flex: 1 }}
          onPress={() => (esAdmin && c.estado === 'cancelada' ? eliminar() : setDlg(true))} />
      </View>
      <Confirm visible={dlg} title="¿Cancelar esta cita?" text={esAdmin ? 'La cita quedará marcada como cancelada.' : 'La cita se eliminará de tu agenda. Esta acción no se puede deshacer.'}
        confirmText="Sí, cancelar cita" onConfirm={cancelar} onCancel={() => setDlg(false)} loading={busy} />
    </Screen>
  );
}
