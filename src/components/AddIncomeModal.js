import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addTransactionStart, addTransactionSuccess, addTransactionFailure } from '../store/slices/transactionSlice';
import { addTransaction } from '../services/api';
import { FiX } from 'react-icons/fi';

const AddIncomeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    comment: '',
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.transactions);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      dispatch(addTransactionStart());

      const transactionData = {
        type: 'income',
        amount: parseFloat(formData.amount),
        date: formData.date,
        comment: formData.comment || '',
        categoryId: null
      };

      const response = await addTransaction(transactionData);
      dispatch(addTransactionSuccess(response.data));
      toast.success('Income added successfully');
      onClose();
    } catch (err) {
      console.error('Error adding income:', err);
      dispatch(addTransactionFailure(err.message));
      toast.error(err.response?.data?.message || 'Failed to add income');
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1f1b2e] text-white w-full max-w-md rounded-2xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-300">Add Income</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Amount</label>
              <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full p-3 bg-[#2a233d] text-white rounded-lg border border-purple-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Date</label>
              <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#2a233d] text-white rounded-lg border border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Comment (Optional)</label>
              <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-3 bg-[#2a233d] text-white rounded-lg border border-purple-500 focus:outline-none"
                  placeholder="Add a note..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 shadow-md"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:brightness-110"
                  disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Income'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddIncomeModal;
