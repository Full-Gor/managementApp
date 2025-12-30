import React, { createContext, useContext, useState } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(2567.78);
  const [income, setIncome] = useState(13000);
  const [expenses, setExpenses] = useState(2438);

  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Shopping', amount: -120, icon: 'cart', color: '#ff6b6b', date: 'Today' },
    { id: 2, name: 'Transfer', amount: 500, icon: 'arrow-up-right', color: '#00c853', date: 'Today' },
    { id: 3, name: 'Netflix', amount: -15, icon: 'tv', color: '#e50914', date: 'Today' },
  ]);

  const [expenseHistory, setExpenseHistory] = useState([
    { id: 1, name: 'Grocery', amount: -85.50, date: 'Dec 28' },
    { id: 2, name: 'Transport', amount: -25.00, date: 'Dec 27' },
    { id: 3, name: 'Restaurant', amount: -65.00, date: 'Dec 26' },
  ]);

  const [incomeHistory, setIncomeHistory] = useState([
    { id: 1, name: 'Salary', amount: 2000, date: 'Dec 25' },
    { id: 2, name: 'Freelance', amount: 450, date: 'Dec 20' },
    { id: 3, name: 'Investment', amount: 117.78, date: 'Dec 15' },
  ]);

  const [cards, setCards] = useState([
    { id: 1, number: '•••• •••• •••• 4589', holder: 'John Dev', expires: '12/28' },
  ]);

  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Alex', avatar: null },
    { id: 2, name: 'Emma', avatar: null },
    { id: 3, name: 'Mike', avatar: null },
    { id: 4, name: 'Sara', avatar: null },
  ]);

  const [user, setUser] = useState({
    name: 'Mr John Dev',
    email: 'john.dev@email.com',
    avatar: null,
  });

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: 'Today',
    };
    setTransactions([newTransaction, ...transactions]);

    if (transaction.amount > 0) {
      setIncome(income + transaction.amount);
      setBalance(balance + transaction.amount);
    } else {
      setExpenses(expenses + Math.abs(transaction.amount));
      setBalance(balance + transaction.amount);
    }
  };

  const transfer = (recipient, amount, note) => {
    if (amount > balance) {
      return { success: false, message: 'Insufficient balance' };
    }

    addTransaction({
      name: `Transfer to ${recipient}`,
      amount: -amount,
      icon: 'send',
      color: '#0066ff',
    });

    return { success: true, message: 'Transfer successful' };
  };

  const addCard = (card) => {
    setCards([...cards, { id: Date.now(), ...card }]);
  };

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
    addTransaction,
    transfer,
    addCard,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
