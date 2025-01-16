import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { PlanTaskIcon, PlannedIcon, AddTodoIcon } from '../icons';
import Calendar from './Calendar';

export default function EditTaskPopUp({ task, onSaveTask, onClose }) {
  const [taskText, setTaskText] = useState(task.text);
  const [planDate, setPlanDate] = useState(task.planDate ? new Date(task.planDate) : null);
  const [deadlineDate, setDeadlineDate] = useState(task.deadlineDate ? new Date(task.deadlineDate) : null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [calendarPurpose, setCalendarPurpose] = useState(null); // 'plan' or 'deadline'
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

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (taskText.trim() === '') {
      setShowTooltip(true);
      return;
    }
    const updatedTask = {
      ...task,
      text: taskText,
      planDate: planDate ? format(planDate, 'yyyy-MM-dd') : null,
      deadlineDate: deadlineDate ? format(deadlineDate, 'yyyy-MM-dd') : null,
    };

    await onSaveTask(updatedTask);
    onClose();
  };

  const handleDateChange = (date) => {
    if (calendarPurpose === 'plan') {
      setPlanDate(date);
    } else if (calendarPurpose === 'deadline') {
      setDeadlineDate(date);
    }
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div ref={ref} className="bg-white rounded-large shadow-custom relative p-1.5 border border-gray-300 w-full max-w-lg">
        <form className="flex flex-col space-y-4" onSubmit={handleSaveTask}>
          <input
            type="text"
            placeholder="Type in what you have to do"
            className={`flex-grow p-2 border rounded-custom bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blueCustom ${showTooltip ? 'border-red-500' : 'border-gray-300'}`}
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            style={{ minWidth: '300px' }} // Adjust the minimum width for larger screens
          />
          {showTooltip && (
            <div className="text-sm text-red-500 bg-white border border-red-500 rounded-custom p-2 shadow-lg w-auto left-0 font-semibold">
              To Do Input cannot be empty.
            </div>
          )}
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex items-center justify-center gap-1 flex-grow h-10 rounded-custom text-grayCustom-dark font-medium bg-[#0000000D] hover:bg-gray-200"
              onClick={() => {
                setCalendarPurpose('deadline');
                setShowCalendar(true);
              }}
              style={{ flex: '1 1 0' }}
            >
              <PlanTaskIcon className="h-5 w-5" />
              {deadlineDate ? format(new Date(deadlineDate), 'MMMM d') : 'Deadline'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCalendarPurpose('plan');
                setShowCalendar(true);
              }}
              className="flex items-center justify-center gap-1 flex-grow h-10 rounded-custom text-pinkCustom font-medium bg-pinkCustom-light hover:bg-pink-200"
              style={{ flex: '1 1 0' }}
            >
              <PlannedIcon className="h-5 w-5 text-pinkCustom" />
              {planDate ? format(new Date(planDate), 'MMMM d') : 'Plan'}
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-1 flex-grow h-10 rounded-custom text-blueCustom font-medium bg-blueCustom-light hover:bg-blue-200"
              style={{ flex: '1 1 0' }}
            >
              <AddTodoIcon className="h-5 w-5" />
              Save Task
            </button>
          </div>
          {showCalendar && (
            <div className="absolute right-0 mt-2">
              <Calendar
                selectedDate={calendarPurpose === 'plan' ? planDate : deadlineDate}
                setSelectedDate={handleDateChange}
                setShowCalendar={setShowCalendar}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}