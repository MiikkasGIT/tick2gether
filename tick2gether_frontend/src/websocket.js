import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws';

let stompClient = null;

const connectWebSocket = (userId, taskIds, categoryIds, onMessageReceived) => {
  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);

  const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  stompClient.connect(headers, () => {
    console.log('Connected to WebSocket');
    stompClient.subscribe('/topic/tasks', (message) => handleMessage(message, onMessageReceived));
    //stompClient.subscribe(`/user/${userId}/queue/tasks`, (message) => handleMessage(message, onMessageReceived));

  }, (error) => {
    console.error('Error connecting to WebSocket:', error);
    setTimeout(() => connectWebSocket(userId, taskIds, categoryIds, onMessageReceived), 5000); 
  });
};

const handleMessage = (message, onMessageReceived) => {
  if (message.body) {
    try {
      const parsedMessage = JSON.parse(message.body);
      onMessageReceived(parsedMessage);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
};

const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log('Disconnected from WebSocket');
    });
  }
};

const sendWebSocketMessage = (destination, message) => {
  if (stompClient && stompClient.connected) {
    const token = localStorage.getItem('jwtToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log('Sending message to', destination);
    try {
      stompClient.send(destination, headers, JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  }
};

export { connectWebSocket, disconnectWebSocket, sendWebSocketMessage };

export const sendUpdateTaskMessage = (taskDTO) => {
  taskDTO.completed = taskDTO.completed ?? false;
  console.log('Sending update task message:', taskDTO);
  sendWebSocketMessage(`/app/updateTask/${taskDTO.taskId}`, { ...taskDTO, type: 'TASK_UPDATE' });
};
