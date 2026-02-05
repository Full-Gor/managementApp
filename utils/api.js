// API Service pour cloud1
import { config } from '../constants/config';

const API_BASE = config.API_BASE_URL;
const APP_ID = config.APP_ID;

let authToken = null;

// --- Auth ---
export const setToken = (token) => {
  authToken = token;
};

export const getToken = () => authToken;

const headers = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
});

// --- Auth API ---
export const authAPI = {
  async register(email, password, name) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, appId: APP_ID }),
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, appId: APP_ID }),
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: headers() });
    return res.json();
  },

  logout() {
    authToken = null;
  },
};

// --- CRUD generique pour collections ---
const createCRUD = (collection) => ({
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/db/${collection}?${query}`, { headers: headers() });
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_BASE}/db/${collection}/${id}`, { headers: headers() });
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_BASE}/db/${collection}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${API_BASE}/db/${collection}/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/db/${collection}/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    return res.json();
  },
});

// --- Collections specifiques ---
export const transactionsAPI = createCRUD('transactions');
export const cardsAPI = createCRUD('cards');
export const recipientsAPI = createCRUD('recipients');

// --- Finance Stats ---
export const financeAPI = {
  async getStats() {
    // Calcule balance, income, expenses depuis les transactions
    const res = await transactionsAPI.getAll();
    if (!res.success) return { balance: 0, income: 0, expenses: 0 };

    const transactions = res.data || [];
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      if (t.amount > 0) income += t.amount;
      else expenses += Math.abs(t.amount);
    });

    return {
      balance: income - expenses,
      income,
      expenses,
      transactions,
    };
  },
};

export default {
  auth: authAPI,
  transactions: transactionsAPI,
  cards: cardsAPI,
  recipients: recipientsAPI,
  finance: financeAPI,
  setToken,
  getToken,
};
