import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transactionsAPI, cardsAPI, recipientsAPI, financeAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les donnees quand l'utilisateur est connecte
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      // Charger toutes les donnees en parallele
      const [statsRes, cardsRes, recipientsRes] = await Promise.all([
        financeAPI.getStats(),
        cardsAPI.getAll(),
        recipientsAPI.getAll(),
      ]);

      setBalance(statsRes.balance || 0);
      setIncome(statsRes.income || 0);
      setExpenses(statsRes.expenses || 0);
      setTransactions(statsRes.transactions || []);
      setCards(cardsRes.data || []);
      setRecipients(recipientsRes.data || []);
    } catch (e) {
      console.error('Error loading finance data:', e);
      setError('Erreur de chargement des donnees');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Transactions ---
  const addTransaction = async (transaction) => {
    try {
      const newTransaction = {
        ...transaction,
        date: new Date().toISOString(),
        userId: user?.id,
      };

      const res = await transactionsAPI.create(newTransaction);
      if (res.success) {
        // Mettre a jour l'etat local
        const created = res.data;
        setTransactions([created, ...transactions]);

        if (created.amount > 0) {
          setIncome(income + created.amount);
          setBalance(balance + created.amount);
        } else {
          setExpenses(expenses + Math.abs(created.amount));
          setBalance(balance + created.amount);
        }

        return { success: true, data: created };
      }
      return { success: false, error: res.error };
    } catch (e) {
      console.error('Error adding transaction:', e);
      return { success: false, error: 'Erreur reseau' };
    }
  };

  const transfer = async (recipientName, amount, note) => {
    if (amount > balance) {
      return { success: false, message: 'Solde insuffisant' };
    }

    const result = await addTransaction({
      name: `Transfert vers ${recipientName}`,
      amount: -amount,
      icon: 'send',
      color: '#0066ff',
      note,
      type: 'transfer',
    });

    if (result.success) {
      return { success: true, message: 'Transfert effectue' };
    }
    return { success: false, message: result.error || 'Erreur' };
  };

  // --- Cards ---
  const addCard = async (card) => {
    try {
      const res = await cardsAPI.create({
        ...card,
        userId: user?.id,
      });
      if (res.success) {
        setCards([...cards, res.data]);
        return { success: true, data: res.data };
      }
      return { success: false, error: res.error };
    } catch (e) {
      return { success: false, error: 'Erreur reseau' };
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const res = await cardsAPI.delete(cardId);
      if (res.success) {
        setCards(cards.filter(c => c.id !== cardId));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (e) {
      return { success: false, error: 'Erreur reseau' };
    }
  };

  // --- Recipients ---
  const addRecipient = async (recipient) => {
    try {
      const res = await recipientsAPI.create({
        ...recipient,
        userId: user?.id,
      });
      if (res.success) {
        setRecipients([...recipients, res.data]);
        return { success: true, data: res.data };
      }
      return { success: false, error: res.error };
    } catch (e) {
      return { success: false, error: 'Erreur reseau' };
    }
  };

  // Filtres pour historique
  const expenseHistory = transactions.filter(t => t.amount < 0);
  const incomeHistory = transactions.filter(t => t.amount > 0);

  const value = {
    balance,
    income,
    expenses,
    transactions,
    expenseHistory,
    incomeHistory,
    cards,
    recipients,
    user,
    loading,
    error,
    addTransaction,
    transfer,
    addCard,
    deleteCard,
    addRecipient,
    refresh: loadData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
