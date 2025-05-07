import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import {
  addCategoryStart, addCategorySuccess, addCategoryFailure,
  deleteCategoryStart, deleteCategorySuccess, deleteCategoryFailure,
  updateCategoryStart, updateCategorySuccess, updateCategoryFailure,
} from '../store/slices/categorySlice';
import { addCategory, deleteCategory, updateCategory } from '../services/api';

const Settings = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.error('Please enter a category name');

    try {
      dispatch(addCategoryStart());
      const res = await addCategory({ name: newCategory.trim() });
      dispatch(addCategorySuccess(res.data));
      setNewCategory('');
      toast.success('Category added');
    } catch (err) {
      dispatch(addCategoryFailure(err.message));
      toast.error('Error adding category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      dispatch(deleteCategoryStart());
      await deleteCategory(id);
      dispatch(deleteCategorySuccess(id));
      toast.success('Deleted');
    } catch (err) {
      dispatch(deleteCategoryFailure(err.message));
      toast.error('Error deleting category');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return toast.error('Name required');

    try {
      dispatch(updateCategoryStart());
      const res = await updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
      });
      dispatch(updateCategorySuccess(res.data));
      setEditingCategory(null);
      toast.success('Updated');
    } catch (err) {
      dispatch(updateCategoryFailure(err.message));
      toast.error('Error updating category');
    }
  };

  return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-[#1f1b2e] p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-xl font-bold mb-6 text-purple-300">Category Settings</h2>

            {/* Add Category */}
            <form onSubmit={handleAddCategory} className="mb-8 flex space-x-4">
              <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#1f1d2b] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:border-pink-400 transition-all"
                  disabled={isLoading}
              />
              <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-indigo-500 px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:brightness-110 transition"
                  disabled={isLoading}
              >
                <FiPlus className="inline mr-2" />
                Add
              </button>
            </form>

            {/* List */}
            <div className="space-y-4">
              {categories.map((cat) => (
                  <div key={cat.id} className="bg-[#29243d] p-4 rounded-xl flex justify-between items-center">
                    {editingCategory?.id === cat.id ? (
                        <form onSubmit={handleUpdateCategory} className="flex w-full space-x-4">
                          <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className="flex-1 px-4 py-2 rounded-lg bg-[#1f1d2b] text-white border border-pink-400"
                              autoFocus
                          />
                          <button className="bg-indigo-500 px-4 py-2 rounded-lg text-white">Save</button>
                          <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-300 hover:text-gray-100">
                            Cancel
                          </button>
                        </form>
                    ) : (
                        <>
                          <span>{cat.name}</span>
                          <div className="flex space-x-2">
                            <button onClick={() => setEditingCategory(cat)} className="hover:text-yellow-400">
                              <FiEdit2 />
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="hover:text-red-400">
                              <FiTrash2 />
                            </button>
                          </div>
                        </>
                    )}
                  </div>
              ))}
              {categories.length === 0 && (
                  <p className="text-center text-gray-400">No categories yet.</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
  );
};

export default Settings;
