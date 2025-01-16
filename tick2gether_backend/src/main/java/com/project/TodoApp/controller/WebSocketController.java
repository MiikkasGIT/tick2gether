package com.project.TodoApp.controller;

import com.project.TodoApp.dto.TaskDTO;
import com.project.TodoApp.dto.TaskSaveDTO;
import com.project.TodoApp.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private TaskService taskService;

    @MessageMapping("/updateTask/{taskId}")
    @SendTo("/topic/tasks")
    public TaskDTO updateTask(@DestinationVariable Long taskId, TaskSaveDTO taskSaveDTO) {
        taskSaveDTO.setTaskId(taskId);
        TaskDTO updatedTask = taskService.updateTask(taskSaveDTO);
        return updatedTask;
    }
}