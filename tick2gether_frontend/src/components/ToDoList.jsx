import React, { useState } from 'react';
import ToDo from './ToDo';
import { sendWebSocketMessage } from '../websocket';

export default function ToDoList({ todos = [], setTasks, isDeleteMode, onEditTodo, handleDeleteTask, userId, users }) {
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  const handleCheckboxChange = async (taskId) => {
    const updatedTodos = todos.map(todo => {
      if (todo.taskId === taskId) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        return updatedTodo;
      }
      return todo;
    });
  
    setTasks(updatedTodos);
  
    const updatedTask = updatedTodos.find(todo => todo.taskId === taskId);
    try {
      console.log('Sending WebSocket message:', `/app/updateTask/${taskId}`, { ...updatedTask, userId, categoryId: parseInt(updatedTask.categoryId, 10) });
      sendWebSocketMessage(`/app/updateTask/${taskId}`, { ...updatedTask, userId, categoryId: parseInt(updatedTask.categoryId, 10) });
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  };

  const handleDateChange = async (taskId, date, purpose) => {
    const updatedTodos = todos.map(todo => {
      if (todo.taskId === taskId) {
        return {
          ...todo,
          [`${purpose}Date`]: date ? new Date(date).toISOString() : null,
        };
      }
      return todo;
    });

    setTasks(updatedTodos);

    const updatedTask = updatedTodos.find(todo => todo.taskId === taskId);
    try {
      console.log('Sending WebSocket message for date update:', `/app/updateTask/${taskId}`, { ...updatedTask, userId });
      sendWebSocketMessage(`/app/updateTask/${taskId}`, { ...updatedTask, userId });
    } catch (error) {
      console.error('Error sending WebSocket message for date update:', error);
    }
  };

  const handleDeleteClick = async (taskId) => {
    try {
      await handleDeleteTask(taskId);
      console.log('Sending WebSocket message for delete:', `/app/deleteTask/${taskId}`, { taskId });
      sendWebSocketMessage(`/app/deleteTask/${taskId}`, { taskId });
    } catch (error) {
      console.error('Error deleting task:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <fieldset>
      <legend className="sr-only">Tasks</legend>
      <div className="space-y-1">
        {todos.map(todo => (
          <ToDo
            key={todo.taskId}
            todo={todo}
            handleCheckboxChange={() => handleCheckboxChange(todo.taskId)}
            handleTodoClick={() => setSelectedTodoId(todo.taskId === selectedTodoId ? null : todo.taskId)}
            handleDelete={() => handleDeleteClick(todo.taskId)}
            handleEditClick={() => onEditTodo ? onEditTodo(todo) : null}
            isSelected={todo.taskId === selectedTodoId}
            onDateChange={handleDateChange}
            isDeleteMode={isDeleteMode}
            userId={userId}
            users={users}
          />
        ))}
      </div>
    </fieldset>
  );
}
