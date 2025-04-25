import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addTransactionStart, addTransactionSuccess, addTransactionFailure } from '../store/slices/transactionSlice';
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } from '../store/slices/categorySlice';
import { addTransaction, getCategories } from '../services/api';
import { FiX } from 'react-icons/fi';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    comment: '',
  });

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { isLoading } = useSelector((state) => state.transactions);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        dispatch(fetchCategoriesStart());
        const response = await getCategories();
        dispatch(fetchCategoriesSuccess(response.data));
      } catch (err) {
        dispatch(fetchCategoriesFailure(err.message));
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.categoryId || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      dispatch(addTransactionStart());

      const transactionData = {
        type: 'expense',
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        date: formData.date,
        comment: formData.comment || ''
      };

      const response = await addTransaction(transactionData);
      dispatch(addTransactionSuccess(response.data));
      toast.success('Expense added successfully');
      onClose();
    } catch (err) {
      console.error('Error adding expense:', err);
      dispatch(addTransactionFailure(err.message));
      toast.error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Add Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="input w-full"
            >
              <option value="">Select a category</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment (Optional)
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="2"
              className="input w-full"
              placeholder="Add a note..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal; 