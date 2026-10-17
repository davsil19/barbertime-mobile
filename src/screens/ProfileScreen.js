// Perfil: datos, foto (cámara) y cierre de sesión con confirmación
import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Screen, Header, Txt, Card, Avatar, Badge, Button, Confirm } from '../components/ui';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { useAuth } from '../controllers/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [dlg, setDlg] = useState(false);
  const Row = ({ icon, label, onPress, danger }) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15 }}>
      <Icon name={icon} size={22} color={danger ? colors.err : colors.ink} />
      <Txt w="m" style={{ flex: 1 }} color={danger ? colors.err : colors.ink}>{label}</Txt>
      <Icon name="next" size={16} color={colors.mut} />
    </Pressable>);
  return (
    <Screen>
      <Header title="Perfil" />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <View>
          <Avatar user={user} size={96} ring />
          <Pressable testID="btn-foto" onPress={() => navigation.navigate('Camera', { modo: 'perfil' })}
            style={{ position: 'absolute', right: -4, bottom: -2, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.cream }}>
            <Icon name="camera" size={17} /></Pressable>
        </View>
        <Txt w="sb" size={21} style={{ marginTop: 12 }}>{user?.nombre}</Txt>
        <Txt color={colors.mut} size={13.5}>{user?.email}</Txt>
        <View style={{ marginTop: 8 }}><Badge type={user?.rol} /></View>
        <Card style={{ width: '100%', marginTop: 22, paddingVertical: 2 }}>
          <Row icon="edit" label="Editar mis datos" onPress={() => navigation.navigate('UserForm', { id: user.id })} />
          <View style={{ height: 1, backgroundColor: colors.line }} />
          <Row icon="camera" label="Cambiar foto de perfil" onPress={() => navigation.navigate('Camera', { modo: 'perfil' })} />
          <View style={{ height: 1, backgroundColor: colors.line }} />
          <Row icon="logout" label="Cerrar sesión" danger onPress={() => setDlg(true)} />
        </Card>
      </ScrollView>
      <Confirm visible={dlg} icon="logout" title="¿Cerrar sesión?" text="Tendrás que ingresar de nuevo tu correo y contraseña para volver a entrar."
        confirmText="Sí, cerrar sesión" onConfirm={() => { setDlg(false); logout(); }} onCancel={() => setDlg(false)} />
    </Screen>
  );
}
