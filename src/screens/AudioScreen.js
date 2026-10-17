// Nota de voz con expo-audio: pide permiso de micrófono, graba (máx 60 s) y adjunta a la cita
import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState, useAudioPlayer } from 'expo-audio';
import { Screen, Header, Txt, Button } from '../components/ui';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { draft } from '../controllers/draft';
import { citasService } from '../services/citas';

const LIMITE = 60;
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const BARS = [10,18,26,14,32,22,40,28,18,36,44,24,16,34,26,12,30,20,38,14,22,28,16,10];

export default function AudioScreen({ navigation, route }) {
  const citaId = route.params?.citaId;
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const st = useAudioRecorderState(recorder, 250);
  const [uri, setUri] = useState(draft.audioUri);
  const [seg, setSeg] = useState(draft.audioSeg);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const player = useAudioPlayer(uri);
  const [sonando, setSonando] = useState(false);
  const grabando = st.isRecording;
  const dur = Math.floor((st.durationMillis || 0) / 1000);

  useEffect(() => { if (grabando && dur >= LIMITE) detener(); }, [dur, grabando]);

  const iniciar = async () => {
    setMsg('');
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync();
      if (!perm.granted) return setMsg('Permiso de micrófono denegado. Actívalo en Ajustes del teléfono.');
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (e) { setMsg('No se pudo iniciar la grabación: ' + e.message); }
  };
  const detener = async () => {
    try { await recorder.stop(); setUri(recorder.uri); setSeg(dur || 1); } catch (e) { setMsg(e.message); }
  };
  const borrar = () => { setUri(null); setSeg(0); draft.audioUri = null; draft.audioSeg = 0; };
  const reproducir = () => { if (sonando) player.pause(); else { player.seekTo(0); player.play(); } setSonando(!sonando); };
  const adjuntar = async () => {
    draft.audioUri = uri; draft.audioSeg = seg;
    if (citaId) { // cita ya existente: sube de una vez
      setBusy(true);
      try { await citasService.subirAudio(citaId, uri); draft.reset(); } catch (e) { setBusy(false); return setMsg(e.message); }
      setBusy(false);
    }
    navigation.goBack();
  };

  return (
    <Screen>
      <Header title="Nota de voz" onBack={() => navigation.goBack()} />
      <View style={{ padding: 20, gap: 18 }}>
        <Txt color={colors.mut}>Grábale al barbero tus indicaciones para el corte. Máximo 60 segundos.</Txt>
        <View style={{ backgroundColor: colors.ink, borderRadius: 24, padding: 24, alignItems: 'center', gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: grabando ? '#FF5A4D' : '#555' }} />
            <Txt color="#E4DDCE">{grabando ? 'Grabando…' : uri ? 'Nota lista' : 'Listo para grabar'}</Txt>
          </View>
          <Txt w="r" size={56} color={colors.gold} style={{ lineHeight: 64 }}>{mmss(grabando ? dur : seg)}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 50 }}>
            {BARS.map((h, i) => <View key={i} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: i < (grabando || uri ? 14 : 0) ? colors.gold : '#D8D0BC' }} />)}
          </View>
          <Txt size={14} color="#9AA0A9">Límite {mmss(LIMITE)}</Txt>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
          <Pressable onPress={borrar} style={ctl}><Icon name="trash" size={24} /></Pressable>
          <Pressable testID="btn-rec" onPress={grabando ? detener : iniciar} style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#EBCFCB', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.err, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={grabando ? 'stop' : 'mic'} size={30} color="#fff" />
            </View>
          </Pressable>
          <Pressable onPress={uri ? reproducir : undefined} style={ctl}><Icon name={sonando ? 'pause' : 'play'} size={22} /></Pressable>
        </View>
        {!!msg && <Txt size={13} color={colors.err} style={{ textAlign: 'center' }}>{msg}</Txt>}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ padding: 20 }}>
        <Button title="Adjuntar a mi cita" variant="accent" disabled={!uri || grabando} loading={busy} onPress={adjuntar} />
      </View>
    </Screen>
  );
}
const ctl = { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' };
