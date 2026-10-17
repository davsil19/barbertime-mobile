// Cámara con expo-image-picker: foto de perfil (se sube al servidor) o foto de estilo (adjunta a la cita)
import React, { useState } from 'react';
import { View, Pressable, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Txt, Button } from '../components/ui';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { useAuth } from '../controllers/AuthContext';
import { usersService } from '../services/users';
import { draft } from '../controllers/draft';

export default function CameraScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const [modo, setModo] = useState(route.params?.modo || 'perfil');
  const [foto, setFoto] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [frontal, setFrontal] = useState(modo === 'perfil');

  const opciones = { mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1],
    cameraType: frontal ? ImagePicker.CameraType.front : ImagePicker.CameraType.back };

  const tomar = async () => {
    setMsg('');
    try {
      if (Platform.OS === 'web') return galeria(); // el navegador no tiene cámara nativa
      const p = await ImagePicker.requestCameraPermissionsAsync();
      if (!p.granted) return setMsg('Permiso de cámara denegado. Actívalo en Ajustes del teléfono.');
      const r = await ImagePicker.launchCameraAsync(opciones);
      if (!r.canceled) setFoto(r.assets[0].uri);
    } catch (e) { setMsg(e.message); }
  };
  const galeria = async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync(opciones);
      if (!r.canceled) setFoto(r.assets[0].uri);
    } catch (e) { setMsg(e.message); }
  };
  const usar = async () => {
    if (modo === 'estilo') { draft.estiloUri = foto; return navigation.goBack(); }
    setBusy(true);
    try { const u = await usersService.subirFoto(user.id, foto); setUser({ ...user, ...u }); navigation.goBack(); }
    catch (e) { setMsg(e.message); }
    setBusy(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E2229' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
        <Pressable onPress={() => navigation.goBack()} style={dk}><Icon name="x" color="#fff" size={20} /></Pressable>
        <Txt w="sb" size={19} color="#fff">{modo === 'perfil' ? 'Foto de perfil' : 'Foto de referencia'}</Txt>
        <View style={dk} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {foto ? <Image source={{ uri: foto }} style={{ width: 260, height: 260, borderRadius: modo === 'perfil' ? 130 : 24 }} /> : (
          <View style={{ width: 250, height: 330, borderRadius: 125, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="camera" size={56} color="#8a8470" stroke={1.4} />
          </View>)}
        <View style={{ marginTop: 18, backgroundColor: 'rgba(0,0,0,.45)', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 14 }}>
          <Txt color="#fff" size={14}>{foto ? '¿Usar esta foto?' : 'Encuadra tu rostro dentro del óvalo'}</Txt>
        </View>
        {!!msg && <Txt size={13} color="#ff8f84" style={{ marginTop: 10, textAlign: 'center', paddingHorizontal: 24 }}>{msg}</Txt>}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        {[['perfil', 'Foto de perfil'], ['estilo', 'Estilo de corte']].map(([k, l]) => (
          <Pressable key={k} onPress={() => setModo(k)} style={{ paddingVertical: 11, paddingHorizontal: 20, borderRadius: 99, backgroundColor: modo === k ? colors.gold : '#343840' }}>
            <Txt size={14.5} color={modo === k ? colors.ink : '#fff'}>{l}</Txt></Pressable>))}
      </View>
      {foto ? (
        <View style={{ flexDirection: 'row', gap: 12, padding: 20 }}>
          <Button title="Repetir" variant="outline" style={{ flex: 1, borderColor: '#fff' }} onPress={() => setFoto(null)} />
          <Button title="Usar foto" variant="accent" style={{ flex: 1 }} loading={busy} onPress={usar} />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 30, paddingBottom: 30 }}>
          <Pressable onPress={galeria} style={{ width: 52, height: 52, borderRadius: 12, borderWidth: 2, borderColor: '#fff', backgroundColor: '#555', alignItems: 'center', justifyContent: 'center' }}><Icon name="grid" color="#fff" size={22} /></Pressable>
          <Pressable testID="btn-shutter" onPress={tomar} style={{ width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' }} /></Pressable>
          <Pressable onPress={() => setFrontal(!frontal)} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#343840', alignItems: 'center', justifyContent: 'center' }}><Icon name="flip" color="#fff" size={24} /></Pressable>
        </View>)}
    </SafeAreaView>
  );
}
const dk = { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,.12)', alignItems: 'center', justifyContent: 'center' };
