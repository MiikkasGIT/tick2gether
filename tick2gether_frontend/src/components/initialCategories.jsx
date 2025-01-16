import {
    AllTasksIcon,
    AnyTimeIcon,
    PersonalIcon,
    PlannedIcon,
    TodayIcon,
    WorkIcon,
    BookIcon,
    AllTasksLightIcon,
    AnyTimeLightIcon,
    PersonalLightIcon,
    PlannedLightIcon,
    TodayLightIcon,
    WorkLightIcon,
    BookLightIcon,
  } from '../icons';
  
  export const initialCategoriesStyling = {
    'All Tasks': { icon: AllTasksIcon, lightIcon: AllTasksLightIcon, color: 'text-gray-400', selectedColor: 'text-white' },
    'Today': { icon: TodayIcon, lightIcon: TodayLightIcon, color: 'text-white', selectedColor: 'text-white' },
    'Planned': { icon: PlannedIcon, lightIcon: PlannedLightIcon, color: 'text-pink-500', selectedColor: 'text-white' },
    'Any Time': { icon: AnyTimeIcon, lightIcon: AnyTimeLightIcon, color: 'text-orange-500', selectedColor: 'text-white' },
    'Work': { icon: WorkIcon, lightIcon: WorkLightIcon, color: 'text-red-500', selectedColor: 'text-white' },
    'Personal': { icon: PersonalIcon, lightIcon: PersonalLightIcon, color: 'text-blue-500', selectedColor: 'text-white' },
    'Logbook': { icon: BookIcon, lightIcon: BookLightIcon, color: 'text-green-500', selectedColor: 'text-white' },
  };
  
  export const initialCategories = [
    { id: 1, name: 'All Tasks', icon: PlannedIcon },
    { id: 2, name: 'Today', icon: PlannedIcon },
    { id: 3, name: 'Planned', icon: PlannedIcon },
    { id: 4, name: 'Any Time', icon: PlannedIcon },
    { id: 5, name: 'Work', icon: PlannedIcon },
    { id: 6, name: 'Personal', icon: PlannedIcon },
    { id: 7, name: 'Logbook', icon: PlannedIcon },
  ];
  