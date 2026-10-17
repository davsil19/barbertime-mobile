// Componentes reutilizables con el estilo de la guía (botones, campos, chips, tarjetas...)
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, Image, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme';
import Icon from './Icon';
import { iniciales } from '../models';
import { fileUrl } from '../config/api';

export const Txt = ({ w = 'r', size = 14, color = colors.ink, style, ...p }) => (
  <Text {...p} style={[{ fontFamily: fonts[w], fontSize: size, color }, style]} />
);

export function Screen({ children, scroll, style }) {
  return <SafeAreaView edges={['top']} style={[{ flex: 1, backgroundColor: colors.cream }, style]}>{children}</SafeAreaView>;
}

export function Header({ title, onBack, right }) {
  return (
    <View style={s.header}>
      {onBack && (
        <Pressable onPress={onBack} style={s.iconBtn} accessibilityLabel="Volver"><Icon name="back" size={20} /></Pressable>
      )}
      <Txt w="sb" size={onBack ? 20 : 24} style={{ flex: 1, letterSpacing: -0.4 }}>{title}</Txt>
      {right}
    </View>
  );
}

export const IconBtn = ({ name, onPress, ...p }) => (
  <Pressable onPress={onPress} style={s.iconBtn} {...p}><Icon name={name} size={20} /></Pressable>
);

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style, testID }) {
  const v = {
    primary: { bg: colors.ink, fg: colors.gold, bd: colors.ink },
    accent: { bg: colors.gold, fg: colors.ink, bd: colors.gold },
    outline: { bg: 'transparent', fg: colors.ink, bd: colors.ink },
    danger: { bg: colors.err, fg: '#fff', bd: colors.err },
    dangerSoft: { bg: 'transparent', fg: colors.err, bd: colors.err },
  }[variant];
  return (
    <Pressable testID={testID} onPress={onPress} disabled={disabled || loading}
      style={({ pressed }) => [s.btn, { backgroundColor: v.bg, borderColor: v.bd, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}>
      {loading ? <ActivityIndicator color={v.fg} /> : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon && <Icon name={icon} size={20} color={v.fg} />}
          <Txt w="sb" size={17} color={v.fg}>{title}</Txt>
        </View>
      )}
    </Pressable>
  );
}

export function Field({ label, icon, error, right, style, ...p }) {
  const [focus, setFocus] = useState(false);
  const ref = useRef(null);
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {label && <Txt w="m" size={14} style={{ marginBottom: 6, color: colors.ink2 }}>{label}</Txt>}
      <Pressable onPress={() => ref.current && ref.current.focus()} style={[s.input, focus && s.inputFocus, !!error && { borderColor: colors.err }]}>
        {icon && <View style={{ flexShrink: 0 }}><Icon name={icon} size={20} color={colors.mut} /></View>}
        <TextInput {...p} ref={ref} placeholderTextColor="#9AA0A9"
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={[{ flex: 1, minWidth: 0, fontFamily: fonts.r, fontSize: 15, color: colors.ink, outlineStyle: 'none' }]} />
        {right}
      </Pressable>
      {!!error && <Txt size={12.5} color={colors.err} style={{ marginTop: 4 }}>{error}</Txt>}
    </View>
  );
}

export const Section = ({ children, style }) => (
  <Txt w="sb" size={11.5} color={colors.goldD} style={[{ letterSpacing: 0.9, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }, style]}>{children}</Txt>
);

export const Chip = ({ label, on, onPress }) => (
  <Pressable onPress={onPress} style={[s.chip, on && { backgroundColor: colors.ink, borderColor: colors.ink }]}>
    <Txt w="m" size={13.5} color={on ? colors.gold : colors.ink}>{label}</Txt>
  </Pressable>
);

export function Badge({ type }) {
  const m = {
    confirmada: [colors.okBg, '#1d7a4f', 'Confirmada'], pendiente: [colors.warnBg, '#8a6200', 'Pendiente'],
    cancelada: [colors.errBg, colors.err, 'Cancelada'], admin: [colors.ink, colors.gold, 'Administrador'],
    cliente: [colors.clienteBg, '#7a5c1e', 'Cliente'],
  }[type] || [colors.line, colors.mut, type];
  return <View style={[s.badge, { backgroundColor: m[0] }]}><Txt w="sb" size={12.5} color={m[1]}>{m[2]}</Txt></View>;
}

const AV = [['#14161A', colors.gold], ['#3b4252', '#fff'], [colors.gold, colors.ink], ['#7a5c1e', '#fff']];
export function Avatar({ user, size = 48, ring }) {
  const nombre = user?.nombre || '?';
  const [bg, fg] = AV[(user?.id || 0) % AV.length];
  const uri = fileUrl(user?.foto);
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
      ring && { borderWidth: 3, borderColor: colors.gold }]}>
      {uri ? <Image source={{ uri }} style={{ width: size, height: size }} />
        : <Txt w="b" size={size * 0.34} color={fg}>{iniciales(nombre)}</Txt>}
    </View>
  );
}

export const Card = ({ children, style, onPress }) => {
  const C = onPress ? Pressable : View;
  return <C onPress={onPress} style={[s.card, style]}>{children}</C>;
};

export const Fab = ({ onPress, icon = 'plus' }) => (
  <Pressable onPress={onPress} style={s.fab} accessibilityLabel="Nuevo"><Icon name={icon} size={26} /></Pressable>
);

export const Empty = ({ text }) => <Txt color={colors.mut} style={{ textAlign: 'center', marginTop: 40 }}>{text}</Txt>;
export const ErrorBox = ({ text, onRetry }) => (
  <View style={{ alignItems: 'center', marginTop: 30, gap: 12, paddingHorizontal: 20 }}>
    <Txt color={colors.err} style={{ textAlign: 'center' }}>{text}</Txt>
    {onRetry && <Button title="Reintentar" variant="outline" onPress={onRetry} style={{ height: 44, paddingHorizontal: 24 }} />}
  </View>
);

// Diálogo de confirmación (cerrar sesión, eliminar, cancelar)
export function Confirm({ visible, icon = 'trash', title, text, confirmText, danger = true, onConfirm, onCancel, loading }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={s.overlay}>
        <View style={s.dlg}>
          <View style={[s.dlgIcon, { backgroundColor: danger ? colors.errBg : colors.clienteBg }]}>
            <Icon name={icon} size={26} color={danger ? colors.err : colors.goldD} />
          </View>
          <Txt w="sb" size={18}>{title}</Txt>
          <Txt size={13.5} color={colors.mut} style={{ textAlign: 'center' }}>{text}</Txt>
          <View style={{ width: '100%', gap: 10, marginTop: 8 }}>
            <Button title={confirmText} variant={danger ? 'danger' : 'primary'} onPress={onConfirm} loading={loading} style={{ height: 48 }} />
            <Button title="Volver" variant="outline" onPress={onCancel} style={{ height: 48 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  btn: { height: 54, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  input: { height: 50, borderRadius: 14, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 },
  inputFocus: { borderColor: colors.gold, shadowColor: colors.gold, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } },
  chip: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 99, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 99 },
  card: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 14, ...shadow },
  fab: { position: 'absolute', right: 20, bottom: 18, width: 58, height: 58, borderRadius: 19, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', shadowColor: colors.goldD, shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  overlay: { flex: 1, backgroundColor: 'rgba(20,22,26,0.55)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  dlg: { backgroundColor: colors.paper, borderRadius: 24, padding: 22, width: '100%', maxWidth: 360, alignItems: 'center', gap: 10 },
  dlgIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
