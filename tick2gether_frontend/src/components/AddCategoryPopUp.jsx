import React, { useState, useRef, useEffect } from 'react';

export default function AddCategoryPopUp({ onAddCategory, onClose, userId }) {
  const [categoryName, setCategoryName] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClose]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (categoryName.trim() === '') {
      setShowTooltip(true);
      return;
    }
    const newCategory = {
      name: categoryName,
      userId: userId,
    };

    await onAddCategory(newCategory);

    setShowTooltip(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div ref={ref} className="bg-white rounded-large shadow-custom relative p-1.5 border border-gray-300 w-full max-w-md">
        <form onSubmit={handleAddCategory} className="flex items-center justify-between space-x-2 relative w-full h-[42px]">
          <input
            type="text"
            placeholder="Enter category name"
            className={`flex-grow h-full p-2 border rounded-custom bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blueCustom ${showTooltip ? 'border-red-500' : 'border-gray-300'}`}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {showTooltip && (
            <div className="absolute top-full mt-2 text-sm text-red-500 bg-white border border-red-500 rounded-custom p-2 shadow-lg w-auto left-0 font-semibold">
              Category name cannot be empty.
            </div>
          )}
          <button
            type="submit"
            className="inline-flex h-full px-4 justify-center items-center gap-1 flex-shrink-0 rounded-custom text-blueCustom font-medium bg-blueCustom-light hover:bg-blue-200"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
