import { request } from './http';
import { storage } from './storage';
import { TOKEN_KEY } from '../config/constants';

export const authService = {
  async login(email, password) {
    const r = await request('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    await storage.set(TOKEN_KEY, r.token);
    return r.user;
  },
  async register(datos) {
    const r = await request('/auth/register', { method: 'POST', body: datos, auth: false });
    await storage.set(TOKEN_KEY, r.token);
    return r.user;
  },
  async logout() { await storage.remove(TOKEN_KEY); },
  token: () => storage.get(TOKEN_KEY),
  me: (id) => request(`/users/${id}`),
};
