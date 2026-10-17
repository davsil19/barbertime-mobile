import { request, archivoForm } from './http';

export const citasService = {
  list: () => request('/citas'),
  get: (id) => request(`/citas/${id}`),
  create: (d) => request('/citas', { method: 'POST', body: d }),
  update: (id, d) => request(`/citas/${id}`, { method: 'PUT', body: d }),
  estado: (id, estado) => request(`/citas/${id}/estado`, { method: 'PATCH', body: { estado } }),
  remove: (id) => request(`/citas/${id}`, { method: 'DELETE' }),
  async subirAudio(id, uri) {
    const web = !uri.startsWith('file:');
    const form = await archivoForm('audio', uri, web ? `nota_${id}.webm` : `nota_${id}.m4a`, web ? 'audio/webm' : 'audio/mp4');
    return request(`/citas/${id}/audio`, { method: 'POST', form });
  },
};
