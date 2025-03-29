import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL + '/functions/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  },
});

export default api;