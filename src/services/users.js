import { request, archivoForm } from './http';

export const usersService = {
  list: () => request('/users'),
  get: (id) => request(`/users/${id}`),
  create: (d) => request('/users', { method: 'POST', body: d }),
  update: (id, d) => request(`/users/${id}`, { method: 'PUT', body: d }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  async subirFoto(id, uri) {
    const form = await archivoForm('foto', uri, `foto_${id}.jpg`, 'image/jpeg');
    return request(`/users/${id}/foto`, { method: 'POST', form });
  },
};
