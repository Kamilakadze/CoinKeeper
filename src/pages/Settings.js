import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import {
  addCategoryStart,
  addCategorySuccess,
  addCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
} from '../store/slices/categorySlice';
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from '../services/api';

const Settings = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      dispatch(addCategoryStart());
      const response = await addCategory({ name: newCategory.trim() });
      dispatch(addCategorySuccess(response.data));
      setNewCategory('');
      toast.success('Category added successfully');
    } catch (err) {
      dispatch(addCategoryFailure(err.message));
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      dispatch(deleteCategoryStart());
      await deleteCategory(id);
      dispatch(deleteCategorySuccess(id));
      toast.success('Category deleted successfully');
    } catch (err) {
      dispatch(deleteCategoryFailure(err.message));
      toast.error('Failed to delete category');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!editingCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      dispatch(updateCategoryStart());
      const response = await updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
      });
      dispatch(updateCategorySuccess(response.data));
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (err) {
      dispatch(updateCategoryFailure(err.message));
      toast.error('Failed to update category');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Category Settings</h2>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="mb-8">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="input flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isLoading}
              >
                <FiPlus className="mr-2" />
                Add Category
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                {editingCategory?.id === category.id ? (
                  <form
                    onSubmit={handleUpdateCategory}
                    className="flex-1 flex items-center space-x-4"
                  >
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="input flex-1"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span className="font-medium">{category.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50"
                        disabled={isLoading}
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No categories yet. Add your first category above.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 