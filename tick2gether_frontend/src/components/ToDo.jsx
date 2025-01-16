import React, { useState } from 'react';
import AvatarGroup from './AvatarGroup';
import { XIcon, EditIcon, LinkIcon, LinkSelectedIcon, PlanTaskIcon, PlanTaskGreyIcon, PlannedIcon } from '../icons';
import Calendar from './Calendar';
import { generateTokenForTask } from '../api';

export default function ToDo({
  todo,
  handleCheckboxChange,
  handleTodoClick,
  handleDelete,
  handleEditClick,
  isDeleteMode,
  onDateChange,
  isTodayCategory,
  isSelected,
  userId,
  users
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPurpose, setCalendarPurpose] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShareTaskClick = async (e) => {
    e.stopPropagation();
    if (!todo.taskId) {
      return;
    }

    try {
      const response = await generateTokenForTask(todo.taskId, userId);
      const token = response.token;
      if (!token) throw new Error('Failed to generate token');

      const linkWithToken = `http://localhost:3000/share/${token}`;
      await navigator.clipboard.writeText(linkWithToken);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1000);
    } catch (err) {
      setShowTooltip(false);
    }
  };

  const handleDateClick = (e, purpose) => {
    e.stopPropagation();
    setCalendarPurpose(purpose);
    setShowCalendar(prev => !prev);
  };

  const handleDateChange = async (date) => {
    try {
      await onDateChange(todo.taskId, date, calendarPurpose);
      setShowCalendar(false);
    } catch (error) {
      // Handle error if necessary
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTodoClickInternal = (e) => {
    e.stopPropagation();
    handleTodoClick(todo.taskId);
  };

  return (
    <div
      className={`todo-item ${isSelected ? 'selected' : ''} p-2 rounded-lg transition-all duration-300 ease-in-out ${isHovered ? 'bg-gray-100' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTodoClickInternal}
    >
      <div className="flex items-start relative">
        <div className="flex h-6 items-center" onClick={(e) => e.stopPropagation()}>
          <input
            id={`checkbox-${todo.taskId}`}
            name={`checkbox-${todo.taskId}`}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
            checked={todo.completed || false}
            onChange={(e) => {
              e.stopPropagation();
              handleCheckboxChange(todo.taskId);
            }}
          />
        </div>
        <div className="ml-3 flex-grow text-sm leading-6 flex items-center justify-between">
          <div className="flex items-center">
            <label
              htmlFor={`checkbox-${todo.taskId}`}
              className={`font-medium cursor-pointer ${isHovered ? 'text-blueCustom' : ''}`}
            >
              {todo.text}
            </label>
          </div>
          <div className="flex items-center pl-2 space-x-2">
            <EditIcon
              className={`h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer ${isHovered ? 'block' : 'hidden'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(todo);
              }}
            />
            <div
              className="h-4 w-4 text-gray-500 cursor-pointer relative"
              onClick={handleShareTaskClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered ? (
                <LinkSelectedIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <LinkIcon className="h-4 w-4 text-gray-500" />
              )}
              {showTooltip && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-[#0673FA] bg-[#DEEAFF] rounded-xl">
                  Copied
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-3" style={{ marginRight: isDeleteMode ? '40px' : '0' }}>
        {todo.planDate && (
          <div className="flex items-center gap-1" onClick={(e) => handleDateClick(e, 'plan')}>
            <PlannedIcon className="h-5 w-5 cursor-pointer" />
            <span className={`font-medium text-sm cursor-pointer ${todo.completed ? 'text-gray-600' : 'text-gray-900'}`}>
              {new Date(todo.planDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1" onClick={(e) => handleDateClick(e, 'deadline')}>
          {todo.deadlineDate ? (
            <PlanTaskIcon className="h-5 w-5 cursor-pointer" />
          ) : (
            <PlanTaskGreyIcon className="h-5 w-5 cursor-pointer" />
          )}
          {todo.deadlineDate && (
            <span className={`font-medium text-sm cursor-pointer ${todo.completed ? 'text-gray-600' : 'text-gray-900'}`}>
              {new Date(todo.deadlineDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {showCalendar && (
            <div className="absolute mt-2">
              <Calendar
                selectedDate={todo[calendarPurpose === 'plan' ? 'planDate' : 'deadlineDate'] ? new Date(todo[calendarPurpose === 'plan' ? 'planDate' : 'deadlineDate']) : new Date()}
                setSelectedDate={handleDateChange}
                setShowCalendar={setShowCalendar}
              />
            </div>
          )}
        </div>
        <div className="pl-2">
          <AvatarGroup
            assignedUsers={todo.sharedUserIds || []}
            users={users}
            selected={false}
          />
        </div>
      </div>
      {isDeleteMode && (
        <button
          type="button"
          className="absolute right-2 text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(todo.taskId);
          }}
        >
          <XIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
