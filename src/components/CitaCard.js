import React from 'react';
import { View } from 'react-native';
import { Card, Txt, Badge } from './ui';
import Icon from './Icon';
import { colors } from '../theme';
import { diaMes, hora12 } from '../models';

export default function CitaCard({ cita, onPress, mostrarCliente }) {
  const { dia, mes } = diaMes(cita.fecha);
  return (
    <Card onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
      <View style={{ width: 62, height: 62, borderRadius: 18, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
        <Txt w="b" size={24} color={colors.gold} style={{ lineHeight: 28 }}>{dia}</Txt>
        <Txt w="m" size={11} color={colors.gold} style={{ letterSpacing: 1 }}>{mes}</Txt>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt w="sb" size={16}>{cita.servicio}</Txt>
        <Txt size={13} color={colors.mut} numberOfLines={1}>
          {mostrarCliente && cita.nombre_cliente ? `${cita.nombre_cliente} · ` : ''}{cita.barbero?.split(' ')[0]} · {hora12(cita.hora?.slice(0, 5))}
        </Txt>
        <View style={{ flexDirection: 'row', marginTop: 4 }}><Badge type={cita.estado} /></View>
      </View>
      <Icon name="next" size={18} color={colors.mut} />
    </Card>
  );
}
