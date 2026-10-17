// Borrador compartido entre pantallas (audio grabado / foto de estilo antes de guardar la cita)
export const draft = { audioUri: null, audioSeg: 0, estiloUri: null,
  reset() { this.audioUri = null; this.audioSeg = 0; this.estiloUri = null; } };
