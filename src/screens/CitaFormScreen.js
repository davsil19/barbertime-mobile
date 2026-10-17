// Registrar (POST /citas) o actualizar (PUT /citas/:id) una cita. Incluye cámara y audio.
import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Header, Txt, Section, Chip, Button, Field, Avatar, ErrorBox } from '../components/ui';
import Icon from '../components/Icon';
import { colors, fonts } from '../theme';
import { SERVICIOS, BARBEROS, HORAS, DIAS, MESES } from '../config/constants';
import { citasService } from '../services/citas';
import { usersService } from '../services/users';
import { useAuth } from '../controllers/AuthContext';
import { draft } from '../controllers/draft';
import { fechaISO, dinero, precioDe } from '../models';

const proximosDias = () => {
  const out = []; const d = new Date(); d.setHours(0, 0, 0, 0);
  while (out.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)); }
  return out;
};

export default function CitaFormScreen({ navigation, route }) {
  const editId = route?.params?.id;
  const { esAdmin } = useAuth();
  const dias = React.useMemo(proximosDias, []);
  const [servicio, setServicio] = useState(SERVICIOS[0].nombre);
  const [barbero, setBarbero] = useState(BARBEROS[0].nombre);
  const [fecha, setFecha] = useState(fechaISO(dias[0]));
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [ocupadas, setOcupadas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [aud, setAud] = useState(null);
  const [estilo, setEstilo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { // modo edición: carga la cita
    if (!editId) return;
    citasService.get(editId).then((c) => {
      setServicio(c.servicio); setBarbero(c.barbero); setFecha(String(c.fecha).slice(0, 10));
      setHora(String(c.hora).slice(0, 5)); setNotas(c.notas || '');
    }).catch((e) => setError(e.message));
  }, [editId]);

  useEffect(() => { // admin puede elegir cliente
    if (esAdmin && !editId) usersService.list().then((u) => setClientes(u.filter((x) => x.rol === 'cliente'))).catch(() => {});
  }, [esAdmin, editId]);

  useEffect(() => { // horas ya tomadas ese día con ese barbero
    citasService.list().then((l) => setOcupadas(
      l.filter((c) => String(c.fecha).slice(0, 10) === fecha && c.barbero === barbero && c.estado !== 'cancelada' && String(c.id) !== String(editId))
        .map((c) => String(c.hora).slice(0, 5)))).catch(() => {});
  }, [fecha, barbero, editId]);

  useFocusEffect(useCallback(() => { // al volver de Audio/Cámara
    setAud(draft.audioUri ? { uri: draft.audioUri, seg: draft.audioSeg } : null);
    setEstilo(draft.estiloUri);
  }, []));

  const confirmar = async () => {
    if (!hora) return setError('Elige una hora.');
    if (esAdmin && !editId && !userId) return setError('Elige el cliente de la cita.');
    setError(''); setLoading(true);
    try {
      const body = { servicio, barbero, fecha, hora, notas };
      let cita;
      if (editId) cita = await citasService.update(editId, body);
      else cita = await citasService.create(esAdmin ? { ...body, user_id: userId } : body);
      const id = cita?.id || editId;
      if (draft.audioUri) { try { await citasService.subirAudio(id, draft.audioUri); } catch (e) { setError('La cita se creó, pero el audio no se subió: ' + e.message); } }
      draft.reset();
      navigation.navigate(editId ? 'CitaDetail' : 'Tabs', editId ? { id } : { screen: 'Citas' });
      if (!editId) { setHora(''); setNotas(''); setAud(null); setEstilo(null); }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const sv = precioDe(servicio);
  return (
    <Screen>
      <Header title={editId ? 'Modificar cita' : 'Agendar cita'} onBack={editId ? () => navigation.goBack() : undefined} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {esAdmin && !editId && (<>
          <Section style={{ marginTop: 0 }}>Cliente</Section>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {clientes.map((c) => <Chip key={c.id} label={c.nombre} on={userId === c.id} onPress={() => setUserId(c.id)} />)}
          </ScrollView>
        </>)}
        <Section style={{ marginTop: esAdmin && !editId ? 14 : 0 }}>Servicio</Section>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SERVICIOS.map((s) => <Chip key={s.nombre} label={s.nombre} on={servicio === s.nombre} onPress={() => setServicio(s.nombre)} />)}
        </View>
        <Section>Barbero</Section>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {BARBEROS.map((b, i) => (
            <Pressable key={b.nombre} onPress={() => setBarbero(b.nombre)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: barbero === b.nombre ? colors.gold : colors.line }}>
              <Avatar user={{ id: i === 0 ? 2 : 1, nombre: b.nombre }} size={42} />
              <View><Txt w="sb" size={14.5}>{b.corto}</Txt><Txt size={12} color={colors.mut}>★ {b.rating}</Txt></View>
            </Pressable>
          ))}
        </View>
        <Section>Fecha · {MESES[dias[0].getMonth()][0] + MESES[dias[0].getMonth()].slice(1).toLowerCase()} {dias[0].getFullYear()}</Section>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {dias.map((d) => { const on = fechaISO(d) === fecha; return (
            <Pressable key={fechaISO(d)} onPress={() => setFecha(fechaISO(d))} style={{ width: 62, paddingVertical: 10, alignItems: 'center', borderRadius: 16, backgroundColor: on ? colors.ink : colors.paper, borderWidth: 1.5, borderColor: on ? colors.ink : colors.line }}>
              <Txt size={12} color={on ? '#bfae80' : colors.mut}>{DIAS[d.getDay()]}</Txt>
              <Txt w="b" size={20} color={on ? colors.gold : colors.ink}>{d.getDate()}</Txt>
            </Pressable>); })}
        </ScrollView>
        <Section>Hora</Section>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {HORAS.map((h) => { const oc = ocupadas.includes(h); const on = hora === h; return (
            <Pressable key={h} disabled={oc} onPress={() => setHora(h)} style={{ width: '23.5%', paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: on ? colors.gold : oc ? '#EFEAE0' : colors.paper, borderWidth: 1.5, borderColor: on ? colors.gold : colors.line }}>
              <Txt w={on ? 'sb' : 'r'} size={14.5} color={oc ? '#A9A59B' : colors.ink} style={oc && { textDecorationLine: 'line-through' }}>{h.replace(/^0/, '')}</Txt>
            </Pressable>); })}
        </View>
        <Field label="" placeholder="Notas para el barbero (opcional)" value={notas} onChangeText={setNotas} style={{ marginTop: 14, marginBottom: 10 }} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={() => navigation.navigate('Camera', { modo: 'estilo' })} style={{ flex: 1, height: 50, borderRadius: 16, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: estilo ? colors.gold : colors.line, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 }}>
            {estilo ? <Image source={{ uri: estilo }} style={{ width: 30, height: 30, borderRadius: 8 }} /> : <Icon name="camera" size={22} />}
            <Txt color={estilo ? colors.ink : '#9AA0A9'} numberOfLines={1}>{estilo ? 'Foto añadida' : 'Foto del estilo'}</Txt>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Audio', { citaId: editId })} style={{ flex: 1, height: 50, borderRadius: 16, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: aud ? colors.gold : colors.line, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 }}>
            <Icon name="mic" size={22} />
            <Txt color={aud ? colors.ink : '#9AA0A9'} numberOfLines={1}>{aud ? `Nota ${aud.seg}s` : 'Nota de voz'}</Txt>
          </Pressable>
        </View>
        {!!error && <Txt size={13} color={colors.err} style={{ marginTop: 12 }}>{error}</Txt>}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: 14, paddingTop: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Txt color={colors.mut}>{servicio} · {sv.min} min</Txt><Txt w="b" size={22}>{dinero(sv.precio)}</Txt>
        </View>
        <Button title={editId ? 'Guardar cambios' : 'Confirmar cita'} onPress={confirmar} loading={loading} testID="btn-confirmar" />
      </View>
    </Screen>
  );
}
