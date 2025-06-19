export interface Users {
    id: string;
    created_at: string;
    email: string;
    name: string;
}

export interface ProjectMember {
    users: Users;
}

export interface Project {
    id: number;
    created_at: string; // ISO date string
    project_title: string;
    project_start_date: string; // ISO date string or just date string
    project_end_date: string; // ISO date string or just date string
    project_description: string;
    client: string;
    project_type: string;
    project_priority: string;
    created_by: string; // UUID string
    created_by_user: Users;
    project_tags: string[]; // assuming project_tags is an array of strings (empty in your example)
    project_members: ProjectMember[];
    project_status: string;
}

// for creating a new task
export interface TaskTable {
    projectId: number;  // Assuming projectId is a string or number
    taskTitle: string;
    taskDescription: string;
    taskDeadline: Date | undefined;  
    taskPriority: string;  // Assuming taskPriority is a string
}

// TASKS

interface TaskTag {
    task_tags_list: {
        tag_text: string;
        tag_category: string;
    };
}

interface ProjectSubtasks {
    subtask_text: string;
    subtask_status: string;
}

export interface Task {
    id: string; // UUID string
    created_at: string; // ISO date string
    project_id: number; // assuming project_id is a number
    task_title: string;
    task_description: string;
    task_deadline: string; // ISO date string
    task_priority: string;
    created_by: string; // UUID string
    updated_at: string; // ISO date string
    task_status: string;
    project_task_tags: TaskTag[];
    project_subtasks: ProjectSubtasks[];
    progress?: number;
}
