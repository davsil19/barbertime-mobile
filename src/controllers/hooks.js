// Hooks de datos: cargan listas desde la API y manejan loading/error
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { citasService } from '../services/citas';
import { usersService } from '../services/users';

function useLista(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const recargar = useCallback(async () => {
    try { setError(''); setData(await fetcher()); }
    catch (e) { setError(e.message); }
    setLoading(false);
  }, [fetcher]);
  // se recarga cada vez que la pantalla toma foco (al volver de crear/editar)
  useFocusEffect(useCallback(() => { recargar(); }, [recargar]));
  return { data, loading, error, recargar };
}
export const useCitas = () => useLista(citasService.list);
export const useUsuarios = () => useLista(usersService.list);
