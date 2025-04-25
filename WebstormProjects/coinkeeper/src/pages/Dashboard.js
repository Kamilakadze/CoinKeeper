import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { fetchTransactionsStart, fetchTransactionsSuccess, fetchTransactionsFailure } from '../store/slices/transactionSlice';
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } from '../store/slices/categorySlice';
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
        // Load categories
        dispatch(fetchCategoriesStart());
        const categoriesResponse = await getCategories();
        
        if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
          // If no categories exist, add default ones
          await addDefaultCategories();
          // Fetch categories again after adding defaults
          const updatedCategoriesResponse = await getCategories();
          dispatch(fetchCategoriesSuccess(updatedCategoriesResponse.data));
          toast.success('Default categories added successfully');
        } else {
          dispatch(fetchCategoriesSuccess(categoriesResponse.data));
        }

        // Load transactions
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Balance</h3>
            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentBalance)}
            </p>
          </div>
          <div className="card flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-sm text-gray-500">Add new transactions to keep track of your finances</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsIncomeModalOpen(true)}
                className="btn btn-success flex items-center"
              >
                <FiArrowUp className="mr-2" />
                Add Income
              </button>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="btn btn-danger flex items-center"
              >
                <FiArrowDown className="mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          
          {transactionsLoading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No transactions yet</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-4 ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <FiArrowUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <FiArrowDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.category_name || 'Income'}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </Layout>
  );
};

export default Dashboard; 