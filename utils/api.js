import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

const { BASE_URL, APP_ID } = API_CONFIG;

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

const authHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, appId: APP_ID }),
    });
    const data = await res.json();
    if (data.token) await AsyncStorage.setItem('token', data.token);
    return data;
  },

  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, appId: APP_ID }),
    });
    const data = await res.json();
    if (data.token) await AsyncStorage.setItem('token', data.token);
    return data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: await authHeaders(),
    });
    return res.json();
  },
};

const crud = (collection) => ({
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/db/${collection}`, {
      headers: await authHeaders(),
    });
    return res.json();
  },

  getOne: async (id) => {
    const res = await fetch(`${BASE_URL}/db/${collection}/${id}`, {
      headers: await authHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/db/${collection}`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/db/${collection}/${id}`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/db/${collection}/${id}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.json();
  },
});

export const transactionsAPI = crud('transactions');
export const cardsAPI = crud('cards');
export const recipientsAPI = crud('recipients');

export const financeAPI = {
  get: async () => {
    const res = await fetch(`${BASE_URL}/db/finance-stats`, {
      headers: await authHeaders(),
    });
    const data = await res.json();
    return data.data?.[0] || { balance: 0, income: 0, expenses: 0 };
  },

  update: async (stats) => {
    const existing = await financeStats.get();
    if (existing.id) {
      return crud('finance-stats').update(existing.id, stats);
    }
    return crud('finance-stats').create(stats);
  },
};
