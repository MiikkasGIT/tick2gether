import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { format, add, sub, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PlanTaskPopUp({ onPlanTask, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlanTask(selectedDate);
  };

  const previousMonth = () => {
    setCurrentMonth(sub(currentMonth, { months: 1 }));
  };

  const nextMonth = () => {
    setCurrentMonth(add(currentMonth, { months: 1 }));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <div className="relative p-8" style={{ padding: '30px' }}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="flex items-center">
        <h2 className="flex-auto text-sm font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button
          type="button"
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={previousMonth}
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={nextMonth}
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="mt-2 grid grid-cols-7 text-sm">
        {days.map((day, dayIdx) => (
          <div key={day.toString()} className={classNames(dayIdx > 6 && 'border-t border-gray-200', 'py-2')}>
            <button
              type="button"
              className={classNames(
                isSameDay(day, selectedDate) && 'text-white',
                !isSameDay(day, selectedDate) && isSameDay(day, today) && 'text-indigo-600',
                !isSameDay(day, selectedDate) && !isSameDay(day, today) && isSameMonth(day, currentMonth) && 'text-gray-900',
                !isSameDay(day, selectedDate) && !isSameDay(day, today) && !isSameMonth(day, currentMonth) && 'text-gray-400',
                isSameDay(day, selectedDate) && isSameDay(day, today) && 'bg-indigo-600',
                isSameDay(day, selectedDate) && !isSameDay(day, today) && 'bg-gray-900',
                !isSameDay(day, selectedDate) && 'hover:bg-gray-200',
                (isSameDay(day, selectedDate) || isSameDay(day, today)) && 'font-semibold',
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
              )}
              onClick={() => handleDateClick(day)}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-8 w-full rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        onClick={handleSubmit}
      >
        Plan Task
      </button>
    </div>
  );
}