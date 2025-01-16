import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Categories from '../components/Categories';
import ToDoList from '../components/ToDoList';
import ToDoActions from '../components/ToDoActions';
import Navbar from '../components/Navbar';
import EditTaskPopUp from '../components/EditTaskPopUp';
import AddTaskPopUp from '../components/AddTaskPopUp';
import AddCategoryPopUp from '../components/AddCategoryPopUp';
import { fetchTasks, addTask, deleteTask, fetchUserId, fetchEmail, addCategory, fetchCategories, deleteCategory, fetchAllUsers } from '../api';
import { connectWebSocket, disconnectWebSocket, sendUpdateTaskMessage } from '../websocket';
import { iconMap, customCategoryIcon } from '../icons';

function Dashboard() {
  const [showEditTaskPopUp, setShowEditTaskPopUp] = useState(false);
  const [showAddCategoryPopUp, setShowAddCategoryPopUp] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [showAddTaskPopUp, setShowAddTaskPopUp] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const initializeDashboard = useCallback(async () => {
    try {
      const email = await fetchEmail();
      const fetchedUserId = await fetchUserId(email);

      if (fetchedUserId) {
        setUserId(fetchedUserId);

        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);

        const fetchedCategories = await fetchCategories(fetchedUserId);
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);

        const uniqueCategories = fetchedCategories.reduce((acc, category) => {
          if (!acc.some(cat => cat.categoryId === category.categoryId)) {
            acc.push({
              ...category,
              icon: iconMap[category.name] || customCategoryIcon,
            });
          }
          return acc;
        }, []).sort((a, b) => a.categoryId - b.categoryId);

        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        } else {
          setSelectedCategory(null);
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  const filteredTasks = useMemo(() => {
    if (!selectedCategory) return tasks;
    switch (selectedCategory.name) {
      case 'All Tasks':
        return tasks.filter(task => task.categoryId !== 7 && !task.completed);
      case 'Today':
        return tasks.filter(task => task.categoryId === selectedCategory.categoryId && !task.completed);
      case 'Any Time':
        return tasks.filter(task => task.categoryId === selectedCategory.categoryId && !task.completed);
      case 'Work':
        return tasks.filter(task => task.categoryId === selectedCategory.categoryId && !task.completed);
      case 'Personal':
        return tasks.filter(task => task.categoryId === selectedCategory.categoryId && !task.completed);
      case 'Planned':
        return tasks.filter(task => task.planDate !== null && !task.completed);
      case 'Logbook':
        return tasks.filter(task => task.completed);
      default:
        return tasks.filter(task => task.categoryId === selectedCategory.categoryId && !task.completed);
    }
  }, [tasks, selectedCategory]);

  useEffect(() => {
    const handleWebSocketMessage = (message) => {
      const { type, taskId, sharedUserIds = [], ...updatedData } = message;

      if (!sharedUserIds.includes(userId)) {
        return;
      }

      setTasks(prevTasks => {
        if (type === 'TASK_UPDATE') {
          const taskIndex = prevTasks.findIndex(task => task.taskId === taskId);
          if (taskIndex !== -1) {
            const updatedTasks = [...prevTasks];
            updatedTasks[taskIndex] = { ...prevTasks[taskIndex], ...updatedData };
            return updatedTasks;
          } else {
            return [...prevTasks, { taskId, ...updatedData }];
          }
        }
        return prevTasks;
      });
    };

    if (userId) {
      const fetchIds = async () => {
        try {
          const fetchedTasks = await fetchTasks();
          const fetchedCategories = await fetchCategories(userId);
          const taskIds = fetchedTasks.map(task => task.taskId);
          const categoryIds = Array.isArray(fetchedCategories) ? fetchedCategories.map(category => category.categoryId) : [];
          connectWebSocket(userId, taskIds, categoryIds, handleWebSocketMessage);
        } catch (error) {
          console.error('Error fetching IDs for WebSocket:', error);
        }
      };

      fetchIds();

      return () => {
        disconnectWebSocket();
      };
    }
  }, [userId]);

  const handleAddNewTask = async (newTask) => {
    if (!selectedCategory) return;

    try {
      const formattedTask = {
        ...newTask,
        categoryId: selectedCategory.categoryId,
        userId: userId,
      };

      const addedTask = await addTask(formattedTask, userId);
      setShowAddTaskPopUp(false);

      setTasks(prevTasks => [...prevTasks, addedTask]);
      sendUpdateTaskMessage(addedTask);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const taskToUpdate = {
        ...updatedTask,
        userId: userId,
        taskId: currentTask.taskId,
        categoryId: currentTask.categoryId,
      };
      setShowEditTaskPopUp(false);
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => (task.taskId === taskToUpdate.taskId ? taskToUpdate : task));
        return updatedTasks;
      });
      sendUpdateTaskMessage(taskToUpdate);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.taskId !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const data = await addCategory(newCategory);
      const newCategoryObject = {
        categoryId: data.categoryId,
        name: data.name,
        icon: customCategoryIcon,
      };
      setCategories(prevCategories => [...prevCategories, newCategoryObject]);
      setSelectedCategory(newCategoryObject);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(prevCategories => prevCategories.filter(category => category.categoryId !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(prevMode => !prevMode);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowEditTaskPopUp(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-8 mt-8">
      <div className="w-full">
        <div className="flex justify-between items-center max-w-5xl mx-auto rounded-2xl">
          <Navbar />
        </div>
      </div>
      <div className="h-16" />
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full max-w-5xl mx-auto">
        <div className="w-full lg:w-1/3 lg:mr-8 mb-8 lg:mb-0">
          <Categories
            onSelectCategory={setSelectedCategory}
            userId={userId}
            categoriesFromBackend={categories}
          />
        </div>
        <div className="flex-1 w-full">
          <div className="bg-white border p-8 rounded-large flex flex-col justify-between h-full">
            <div className="flex items-center gap-1.5 mb-4">
              {selectedCategory && selectedCategory.icon && <selectedCategory.icon className="h-6 w-6" />}
              <span className="font-bold text-grayCustom-dark">{selectedCategory?.name}</span>
            </div>
            <ToDoList
              todos={filteredTasks}
              setTasks={setTasks}
              isDeleteMode={isDeleteMode}
              onEditTodo={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              userId={userId}
              users={users} // Pass users to ToDoList
            />
            <ToDoActions
              toggleAddTaskModal={() => setShowAddTaskPopUp(true)}
              toggleDeleteMode={toggleDeleteMode}
              toggleAddCategoryModal={() => setShowAddCategoryPopUp(true)}
              handleDeleteCategory={handleDeleteCategory}
              selectedCategoryId={selectedCategory ? selectedCategory.categoryId : null}
              userId={userId}
            />
          </div>
        </div>
      </div>
      {showAddTaskPopUp && (
        <AddTaskPopUp
          onAddTask={handleAddNewTask}
          categories={categories}
          onClose={() => setShowAddTaskPopUp(false)}
        />
      )}
      {showEditTaskPopUp && (
        <EditTaskPopUp
          task={currentTask}
          onSaveTask={handleSaveTask}
          onClose={() => setShowEditTaskPopUp(false)}
        />
      )}
      {showAddCategoryPopUp && (
        <AddCategoryPopUp
          onAddCategory={handleAddCategory}
          onClose={() => setShowAddCategoryPopUp(false)}
          userId={userId}
        />
      )}
    </div>
  );
}

export default Dashboard;
