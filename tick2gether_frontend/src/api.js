import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchSharedUsers = async (taskId) => {
  try {
    const response = await api.get(`/api/v1/task/sharedUsers/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shared users:', error);
    throw new Error('Fetching shared users failed');
  }
};

export const registerUser = async (user) => {
  try {
    const response = await api.post('/auth/register', user);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const accessToken = response.data;
    if (accessToken) {
      localStorage.setItem('jwtToken', accessToken);
    }
    return { accessToken };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const fetchEmail = async () => {
  try {
    const response = await api.get('/auth/email');
    return response.data;
  } catch (error) {
    console.error('Error fetching email:', error);
    throw new Error('Fetching email failed');
  }
};

export const fetchUserId = async (email) => {
  try {
    const response = await api.get(`/api/v1/user/useridByEmail?email=${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw new Error('Fetching user ID failed');
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/api/v1/user/getAllUsers');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Fetching users failed');
  }
};

export const fetchTasks = async () => {
  try {
    const response = await api.get('/api/v1/task/getTasks');
    const tasks = response.data.map(task => ({
      ...task,
      assignedUsers: Array.isArray(task.sharedUserIds) ? task.sharedUserIds : []
    }));
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchCategories = async (userId) => {
  try {
    const response = await api.get(`/api/v1/category/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (category) => {
  try {
    const response = await api.post(`/api/v1/category/save`, category);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/api/v1/category/delete/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error.response?.data || error.message);
    throw error;
  }
};

export const addTask = async (task, userId) => {
  try {
    const taskData = {
      ...task,
      userId,
      categoryId: task.categoryId
    };

    const response = await api.post('/api/v1/task/save', taskData);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchTasksForCategory = async (categoryId) => {
  try {
    const response = await fetch(`/api/tasks?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/api/v1/task/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await api.get(`/api/v1/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const response = await api.put('/api/v1/user/update', user);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/v1/user/deleteuser/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const shareCategoryWithUser = async (categoryId, userId) => {
  try {
    const response = await api.post(`/api/v1/token/generateForCategory`, null, { params: { categoryId, userId } });
    return response.data;
  } catch (error) {
    console.error('Error sharing category:', error);
    throw error;
  }
};

export const generateTokenForCategory = async (categoryId, userId) => {
  try {
    const response = await api.post('/api/v1/token/generateForCategory', null, {
      params: {
        categoryId: Number(categoryId),
        userId: Number(userId)
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating token for category:', error.response?.data || error.message);
    throw error;
  }
};

export const generateTokenForTask = async (taskId, userId) => {
  try {
    const response = await api.post('/api/v1/token/generateForTask', null, {
      params: {
        taskId: taskId,
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error generating token for task:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('jwtToken');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
