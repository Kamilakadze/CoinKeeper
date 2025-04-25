import { addCategory } from '../services/api';

const defaultExpenseCategories = [
  'Продукты',
  'Еда вне дома',
  'Транспорт',
  'Покупки',
  'Дом',
  'Развлечения',
  'Услуги'
];

export const addDefaultCategories = async () => {
  try {
    const promises = defaultExpenseCategories.map(categoryName => 
      addCategory({ name: categoryName })
    );
    
    await Promise.all(promises);
    console.log('Default categories added successfully');
    return true;
  } catch (error) {
    console.error('Error adding default categories:', error);
    return false;
  }
};

export default defaultExpenseCategories; 