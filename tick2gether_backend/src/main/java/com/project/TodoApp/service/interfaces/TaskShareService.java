package com.project.TodoApp.service.interfaces;

import java.util.List;

public interface TaskShareService {
    void addSharedUsers(Long taskId, List<Long> userIds);
}
