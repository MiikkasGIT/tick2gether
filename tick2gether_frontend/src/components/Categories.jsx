import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  XIcon,
  DeleteIcon,
  AddIcon,
  iconMap,
  lightIconMap,
  customCategoryIcon,
  customCategoryLightIcon
} from '../icons';
import AddCategoryPopUp from './AddCategoryPopUp';
import { addCategory, deleteCategory as apiDeleteCategory } from '../api';
import { sendWebSocketMessage } from '../websocket';

const Categories = ({ onSelectCategory, userId, categoriesFromBackend }) => {
  const [categories, setCategories] = useState([]);
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const [showAddCategoryPopUp, setShowAddCategoryPopUp] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    if (categoriesFromBackend) {
      console.log('Categories from Backend:', categoriesFromBackend); // Debugging-Ausgabe
      const uniqueCategories = categoriesFromBackend.reduce((acc, category) => {
        if (!acc.some(cat => cat.categoryId === category.categoryId)) {
          acc.push({
            ...category,
            icon: iconMap[category.name] || customCategoryIcon,
            lightIcon: lightIconMap[category.name] || customCategoryLightIcon,
            color: 'text-gray-400',
            selectedColor: 'text-white',
            isSelected: false,
            showDelete: false,
          });
        }
        return acc;
      }, []);
      setCategories(uniqueCategories);
      console.log('Processed Categories:', uniqueCategories); // Debugging-Ausgabe
    }
  }, [categoriesFromBackend]);
  
  const updateSelection = useCallback((categoryList, categoryId) =>
    categoryList.map(category => ({
      ...category,
      isSelected: category.categoryId === categoryId,
    })),
    []
  );

  const selectCategory = useCallback(async (categoryId) => {
    try {
      console.log(`Selecting category ID: ${categoryId}`);

      const updatedCategories = updateSelection(categories, categoryId);
      setCategories(updatedCategories);

      const selectedCategory = updatedCategories.find(category => category.categoryId === categoryId);
      setSelectedCategoryId(categoryId);
      onSelectCategory(selectedCategory);

    } catch (error) {
      console.error('Error selecting category:', error);
    }
  }, [categories, onSelectCategory, updateSelection]);

  const handleAddCategory = useCallback(async (categoryData) => {
    try {
      const data = await addCategory({ ...categoryData, userId });
      const newCategory = {
        categoryId: data.categoryId,
        name: data.name,
        icon: customCategoryIcon,
        lightIcon: customCategoryLightIcon,
        color: 'text-gray-400',
        selectedColor: 'text-white',
        isSelected: false,
        showDelete: false,
        userId: data.userId,
      };

      // Ensure new category is unique
      if (!categories.some(cat => cat.categoryId === newCategory.categoryId)) {
        setCategories(prevCategories => [
          ...prevCategories,
          newCategory,
        ]);
      }

      sendWebSocketMessage('/topic/categories', { type: 'CATEGORY_UPDATE', category: newCategory });
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setShowAddCategoryPopUp(false);
    }
  }, [userId, categories]);

  const toggleDeleteIcons = useCallback(() => {
    const updatedCategories = categories.map(category => ({
      ...category,
      showDelete: !showDeleteIcons,
    }));

    setCategories(updatedCategories);
    setShowDeleteIcons(prev => !prev);
  }, [categories, showDeleteIcons]);

  const handleDeleteCategory = useCallback(async (categoryId) => {
    try {
      await apiDeleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));

      sendWebSocketMessage('/topic/categories', { type: 'CATEGORY_UPDATE', categoryId, message: "Category deleted successfully" });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, []);

  const allCategories = useMemo(() => {
    return categories.reduce((unique, category) => {
      if (!unique.some(cat => cat.categoryId === category.categoryId)) {
        unique.push(category);
      }
      return unique;
    }, []);
  }, [categories]);

  const isMaxCategories = allCategories.length >= 12;

  const getCategoryStyles = (category) => ({
    minWidth: category.fullWidth ? '100%' : '140px',
    maxWidth: '100%',
    height: category.fullWidth ? '60px' : '100px',
    borderRadius: '20px',
    backgroundColor: category.isSelected ? '#0374FA' : '#0000000D',
    ringColor: category.isSelected ? '#0374FA26' : '',
    padding: category.fullWidth ? '0 15px' : '15px',
  });

  useEffect(() => {
    if (allCategories.length > 0 && selectedCategoryId === null) {
      const defaultCategoryId = allCategories[0]?.categoryId;
      if (defaultCategoryId) {
        selectCategory(defaultCategoryId);
        setSelectedCategoryId(defaultCategoryId);
      }
    }
  }, [allCategories, selectedCategoryId, selectCategory]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {allCategories.map((category) => {
          const textColor = category.isSelected ? 'text-white' : 'text-gray-900';
          const IconComponent = category.isSelected ? category.lightIcon : category.icon;

          return (
            <div
              key={category.categoryId}
              className={`relative flex ${category.fullWidth ? 'flex-row' : 'flex-col'} justify-center items-center rounded-lg ${category.isSelected ? 'ring-2 ring-offset-2' : ''} ${category.fullWidth ? 'col-span-2' : ''}`}
              style={getCategoryStyles(category)}
              onClick={() => selectCategory(category.categoryId)}
            >
              {category.fullWidth ? (
                <>
                  <IconComponent className={`h-6 w-6 ${category.isSelected ? category.selectedColor : category.color}`} />
                  <span className={`ml-2 text-sm font-medium ${textColor}`}>{category.name}</span>
                </>
              ) : (
                <>
                  <div className="absolute top-2 left-2 p-2">
                    <IconComponent className={`h-6 w-6 ${category.isSelected ? category.selectedColor : category.color}`} />
                  </div>
                  <span className={`absolute bottom-2 left-2 p-2 text-sm font-medium ${textColor}`}>{category.name}</span>
                </>
              )}
              {category.showDelete && (
                <button
                  className="absolute top-2 right-2 p-2"
                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.categoryId); }}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          );
        })}

        <div className="col-span-2 flex items-center justify-center mt-3 gap-3">
          <div
            className={`flex-grow flex items-center justify-center rounded-lg bg-grayCustom.dark hover:bg-grayCustom.light focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blueCustom.DEFAULT cursor-pointer h-[50px] ${isMaxCategories ? 'opacity-50' : ''}`}
            style={{
              borderRadius: '20px',
              backgroundColor: '#0000000D',
              padding: '0 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowAddCategoryPopUp(true)}
          >
            <div className="flex items-center space-x-2 w-full justify-center">
              <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                <AddIcon className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-900">Add Category</span>
            </div>
          </div>
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-lg bg-grayCustom.dark hover:bg-grayCustom.light focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blueCustom.DEFAULT cursor-pointer w-[50px] h-[50px]"
            style={{
              borderRadius: '20px',
              backgroundColor: showDeleteIcons ? '#FC5E5E26' : '#0000000D',
              padding: '0 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={toggleDeleteIcons}
          >
            <div className="flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
              <DeleteIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
      {showAddCategoryPopUp && (
        <AddCategoryPopUp
          onAddCategory={handleAddCategory}
          onClose={() => setShowAddCategoryPopUp(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Categories;
