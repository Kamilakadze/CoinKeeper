import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addCategoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addCategorySuccess: (state, action) => {
      state.categories.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    addCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteCategoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      state.isLoading = false;
      state.error = null;
    },
    deleteCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCategoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCategorySuccess: (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    updateCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategoryStart,
  addCategorySuccess,
  addCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
} = categorySlice.actions;

export default categorySlice.reducer; 