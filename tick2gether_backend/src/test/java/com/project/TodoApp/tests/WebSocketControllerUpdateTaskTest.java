package com.project.TodoApp.tests;



import com.project.TodoApp.controller.WebSocketController;
import com.project.TodoApp.dto.TaskDTO;
import com.project.TodoApp.dto.TaskSaveDTO;
import com.project.TodoApp.service.interfaces.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class WebSocketControllerUpdateTaskTest {

    @InjectMocks
    private WebSocketController webSocketController;

    @Mock
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateTask() {
        Long taskId = 1L;
        TaskSaveDTO taskSaveDTO = new TaskSaveDTO();
        taskSaveDTO.setTaskId(taskId);
        taskSaveDTO.setText("Updated Task");

        TaskDTO updatedTaskDTO = new TaskDTO(
                1L, // userId
                taskId,
                "Updated Task",
                null,
                null,
                1L,
                false
        );

        when(taskService.updateTask(taskSaveDTO)).thenReturn(updatedTaskDTO);

        TaskDTO result = webSocketController.updateTask(taskId, taskSaveDTO);

        assertEquals(updatedTaskDTO, result);
    }
}
