import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  isLoading: false,
  error: null,
  currentBalance: 0,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.isLoading = false;
      state.transactions = action.payload;
      state.currentBalance = action.payload.reduce((acc, transaction) => {
        return transaction.type === 'income' 
          ? acc + transaction.amount 
          : acc - transaction.amount;
      }, 0);
    },
    fetchTransactionsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTransactionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addTransactionSuccess: (state, action) => {
      state.isLoading = false;
      state.transactions.push(action.payload);
      state.currentBalance = action.payload.type === 'income'
        ? state.currentBalance + action.payload.amount
        : state.currentBalance - action.payload.amount;
    },
    addTransactionFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteTransactionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteTransactionSuccess: (state, action) => {
      state.isLoading = false;
      const deletedTransaction = state.transactions.find(t => t.id === action.payload);
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
      if (deletedTransaction) {
        state.currentBalance = deletedTransaction.type === 'income'
          ? state.currentBalance - deletedTransaction.amount
          : state.currentBalance + deletedTransaction.amount;
      }
    },
    deleteTransactionFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateTransactionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateTransactionSuccess: (state, action) => {
      state.isLoading = false;
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        state.currentBalance = oldTransaction.type === 'income'
          ? state.currentBalance - oldTransaction.amount
          : state.currentBalance + oldTransaction.amount;
        
        state.currentBalance = action.payload.type === 'income'
          ? state.currentBalance + action.payload.amount
          : state.currentBalance - action.payload.amount;
          
        state.transactions[index] = action.payload;
      }
    },
    updateTransactionFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  addTransactionStart,
  addTransactionSuccess,
  addTransactionFailure,
  deleteTransactionStart,
  deleteTransactionSuccess,
  deleteTransactionFailure,
  updateTransactionStart,
  updateTransactionSuccess,
  updateTransactionFailure,
} = transactionSlice.actions;

export default transactionSlice.reducer; 