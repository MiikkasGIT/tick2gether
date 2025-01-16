import React, { useState } from 'react';
import { AddTodoIcon, DeleteIcon } from '../icons';

export default function ToDoActions({
  toggleAddTaskModal,
  toggleDeleteMode,
  selectedCategoryId,
  userId,
  toggleAddCategoryModal
}) {
  const [deleteModeActive, setDeleteModeActive] = useState(false);

  const handleDeleteModeToggle = () => {
    setDeleteModeActive(prevMode => !prevMode);
    toggleDeleteMode();
  };

  return (
    <div className="mt-8">
      <hr className="mb-4" style={{ borderColor: '#0000000D' }} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-grow">
          <button
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg hover:bg-blue-100"
            style={{ background: 'rgba(3, 116, 250, 0.15)', borderRadius: '15px' }}
            onClick={() => {
              if (!selectedCategoryId) {
                console.error('No category selected.');
                return;
              }
              toggleAddTaskModal();
            }}
          >
            <AddTodoIcon className="h-5 w-5" />
            <span className="text-blue-500 font-medium hidden sm:block">Add Task</span>
            <span className="text-blue-500 font-medium block sm:hidden">Add</span>
          </button>
        </div>
        <button
          className={`flex items-center justify-center h-10 w-10 rounded-lg ml-4 ${deleteModeActive ? 'bg-red-100 hover:bg-red-200' : 'hover:bg-gray-200'}`}
          style={{ background: deleteModeActive ? 'rgba(252, 94, 94, 0.15)' : 'rgba(0, 0, 0, 0.05)', borderRadius: '15px' }}
          onClick={handleDeleteModeToggle}
        >
          <DeleteIcon className={`h-5 w-5 ${deleteModeActive ? 'text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>
    </div>
  );
}
