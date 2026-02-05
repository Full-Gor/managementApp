import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, transactionsAPI, cardsAPI, recipientsAPI, financeAPI } from '../utils/api';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactionList, setTransactionList] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [recipientList, setRecipientList] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load user
      const userRes = await authAPI.getMe();
      if (userRes.user) {
        setUser(userRes.user);
      }

      // Load transactions
      const txRes = await transactionsAPI.getAll();
      if (txRes.success && txRes.data) {
        setTransactionList(txRes.data);

        let totalIncome = 0;
        let totalExpenses = 0;
        const incomeList = [];
        const expenseList = [];

        txRes.data.forEach(tx => {
          if (tx.amount > 0) {
            totalIncome += tx.amount;
            incomeList.push(tx);
          } else {
            totalExpenses += Math.abs(tx.amount);
            expenseList.push(tx);
          }
        });

        setIncome(totalIncome);
        setExpenses(totalExpenses);
        setBalance(totalIncome - totalExpenses);
        setIncomeHistory(incomeList);
        setExpenseHistory(expenseList);
      }

      // Load cards
      const cardsRes = await cardsAPI.getAll();
      if (cardsRes.success && cardsRes.data) {
        setCardList(cardsRes.data);
      }

      // Load recipients
      const recipRes = await recipientsAPI.getAll();
      if (recipRes.success && recipRes.data) {
        setRecipientList(recipRes.data);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const newTx = {
        ...transaction,
        date: new Date().toISOString(),
      };

      const res = await transactionsAPI.create(newTx);
      if (res.success) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const transfer = async (recipient, amount, note) => {
    if (amount > balance) {
      return { success: false, message: 'Insufficient balance' };
    }

    const result = await addTransaction({
      name: `Transfer to ${recipient}`,
      amount: -amount,
      icon: 'send',
      color: '#0066ff',
      note,
      type: 'transfer',
    });

    return result.success
      ? { success: true, message: 'Transfer successful' }
      : result;
  };

  const addCard = async (card) => {
    try {
      const res = await cardsAPI.create(card);
      if (res.success) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      if (res.token) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: res.error || 'Erreur connexion' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register(name, email, password);
      if (res.token) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: res.error || 'Erreur inscription' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    authAPI.logout();
    setUser(null);
    setTransactionList([]);
    setCardList([]);
    setRecipientList([]);
    setBalance(0);
    setIncome(0);
    setExpenses(0);
  };

  const value = {
    loading,
    user,
    balance,
    income,
    expenses,
    transactions: transactionList,
    expenseHistory,
    incomeHistory,
    cards: cardList,
    recipients: recipientList,
    addTransaction,
    transfer,
    addCard,
    login,
    register,
    logout,
    refresh: loadData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
