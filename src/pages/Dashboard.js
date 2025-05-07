import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure
} from '../store/slices/transactionSlice';
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure
} from '../store/slices/categorySlice';
import { getTransactions, getCategories } from '../services/api';
import { FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import AddIncomeModal from '../components/AddIncomeModal';
import AddExpenseModal from '../components/AddExpenseModal';
import { addDefaultCategories } from '../utils/defaultCategories';

const Dashboard = () => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { transactions, currentBalance, isLoading: transactionsLoading } = useSelector((state) => state.transactions);
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    const initializeData = async () => {
      try {
        dispatch(fetchCategoriesStart());
        const categoriesResponse = await getCategories();

        if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
          await addDefaultCategories();
          const updatedCategoriesResponse = await getCategories();
          dispatch(fetchCategoriesSuccess(updatedCategoriesResponse.data));
          toast.success('Default categories added successfully');
        } else {
          dispatch(fetchCategoriesSuccess(categoriesResponse.data));
        }

        dispatch(fetchTransactionsStart());
        const transactionsResponse = await getTransactions();
        dispatch(fetchTransactionsSuccess(transactionsResponse.data));
      } catch (err) {
        console.error('Error initializing data:', err);
        dispatch(fetchCategoriesFailure(err.message));
        dispatch(fetchTransactionsFailure(err.message));
        toast.error('Failed to load data');
      }
    };

    initializeData();
  }, [dispatch]);

  const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);

  const formatDate = (dateString) =>
      new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

  return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 py-10 text-white">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Баланс и действия */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[#1f1b2e] p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Current Balance</h3>
                <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(currentBalance)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#1f1b2e] p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Quick Actions</h3>
                  <p className="text-sm text-purple-400">Add new transactions to keep track of your finances</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                      onClick={() => setIsIncomeModalOpen(true)}
                      className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:brightness-110 transition shadow-lg flex items-center justify-center"
                  >
                    <FiArrowUp className="mr-2" />
                    Add Income
                  </button>
                  <button
                      onClick={() => setIsExpenseModalOpen(true)}
                      className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold hover:brightness-110 transition shadow-lg flex items-center justify-center"
                  >
                    <FiArrowDown className="mr-2" />
                    Add Expense
                  </button>
                </div>
              </div>
            </div>

            {/* Последние транзакции */}
            <div className="rounded-2xl bg-[#1f1b2e] p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Recent Transactions</h3>

              {transactionsLoading ? (
                  <div className="text-center py-4 text-purple-400">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-purple-400 text-lg">No transactions yet</p>
                    <p className="text-purple-500 text-sm mt-2">Add your first transaction to get started</p>
                  </div>
              ) : (
                  <div className="space-y-2">
                    {[...transactions]
                        .sort((a, b) => {
                          const dateComparison = new Date(b.date) - new Date(a.date);
                          return dateComparison === 0 ? b.id - a.id : dateComparison;
                        })
                        .map((transaction) => (
                            <div
                                key={transaction.id}
                                className="py-3 px-4 flex items-center justify-between bg-[#29243d] rounded-xl hover:bg-[#322d47] transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                    className={`p-2 rounded-lg ${
                                        transaction.type === 'income' ? 'bg-green-600/20' : 'bg-red-600/20'
                                    }`}
                                >
                                  {transaction.type === 'income' ? (
                                      <FiArrowUp className="h-5 w-5 text-green-400" />
                                  ) : (
                                      <FiArrowDown className="h-5 w-5 text-red-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-white">
                                    {transaction.category_name || 'Income'}
                                  </p>
                                  <p className="text-sm text-purple-400">
                                    {formatDate(transaction.date)}
                                  </p>
                                </div>
                              </div>
                              <div
                                  className={`font-semibold ${
                                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                  }`}
                              >
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </div>
                            </div>
                        ))}
                  </div>
              )}
            </div>
          </div>

          <AddIncomeModal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} />
          <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
        </div>
      </Layout>
  );
};

export default Dashboard;
