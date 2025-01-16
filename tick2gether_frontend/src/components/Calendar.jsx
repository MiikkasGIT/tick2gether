import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { format, add, sub, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isBefore } from 'date-fns';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Calendar({ selectedDate, setSelectedDate, setShowCalendar }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate || startOfToday()));
  const today = startOfToday();

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

  const handleDateClick = (date) => {
    if (!isBefore(date, today)) {
      if (isSameDay(date, selectedDate)) {
        setSelectedDate(null); // Unselect the date if it's the same
      } else {
        setSelectedDate(date);
      }
      setShowCalendar(false); // Close the calendar after selecting a date
    }
  };

  return (
    <div className="relative z-10 mt-2" style={{ right: '0' }}>
      <div className="absolute bg-white shadow-lg rounded-large p-4" style={{ width: '300px', right: 0 }}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={previousMonth}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <h2 className="flex-auto text-sm font-semibold text-gray-900 text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={nextMonth}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 grid grid-cols-7 text-center text-xs leading-6 text-gray-500 font-bold">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="mt-1.5 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div key={day.toString()} className={classNames(dayIdx > 6 && 'border-t border-gray-200', 'py-1')}>
              <button
                type="button"
                disabled={isBefore(day, today)}
                className={classNames(
                  isBefore(day, today) && 'opacity-50 cursor-not-allowed',
                  isSameDay(day, selectedDate) && 'text-white',
                  !isSameDay(day, selectedDate) && isSameDay(day, today) && 'text-grayCustom-dark',
                  !isSameDay(day, selectedDate) && !isSameDay(day, today) && isSameMonth(day, currentMonth) && 'text-gray-900',
                  !isSameDay(day, selectedDate) && !isSameDay(day, today) && !isSameMonth(day, currentMonth) && 'text-gray-400',
                  isSameDay(day, selectedDate) && 'bg-blueCustom',
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
      </div>
    </div>
  );
}
