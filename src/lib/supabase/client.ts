
import { createBrowserClient } from '@supabase/ssr';
import { TaskTable } from '../interface';
import { formatDate, getDifferenceDate } from '../utils';

const supabaseUrl = 'https://msvpnuyubljgawdzsfoq.supabase.co'!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createSupabaseClient = () => {
    return createBrowserClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient()

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
}

export const registerUser = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { user: null, error: error.message}
    }

    const {  error: userError} = await supabase
        .from('users')
        .insert([{
            id: data?.user?.id,
            email: email,
            name: name,
        }]);

    if(userError){
        return { user: null, error: userError.message}
    }

    return { user: data?.user, error: null};
}

export const signInUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        let errorMessage = '';
        if (error.message === 'Invalid login credentials') {
            errorMessage = 'Invalid email or password';
        } else if (error.message === 'User does not exist') {
            errorMessage = 'User does not exist';
        } else if (error.message === 'Email not confirmed') {
            errorMessage = 'Check your email for the confirmation email';
        }
        return { user: null, error: errorMessage };
    }

    return { user: data?.user, error: null };
};

export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        return { error: error.message };
    }
    return { error: null };
}

export const getUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        return { users: null, error: error.message };
    }
    return { users: data, error: null };
}

// Function to write db data from creating a new project
export const newProjectForm = async (title: string, startDate: string, endDate: string, projectDescription: string, client: string, projectType: string, projectPriority: string, projectMembers: any[], tags: string[]
) => {
    const user = await getCurrentUser();
    let userId = '';
    if(user) userId = user.id;
    
    const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
            project_title: title,
            project_start_date: startDate,
            project_end_date: endDate,
            project_description: projectDescription,
            client: client,
            project_type: projectType,
            project_priority: projectPriority,
            created_by: userId
        }])
        .select();

    if (projectError) {
        return { error: projectError.message };
    }

    projectMembers.forEach(async (member) => {
        const { error: memberError } = await supabase
            .from('project_members')
            .insert([{
                project_id: projectData[0].id,
                member_id: member.id,
                role: member.role 
            }]);
        
        if (memberError) {
            return { error: memberError.message };
        }
    });

    tags.forEach(async (tag) => {
        const {error: tagError} = await supabase
            .from('project_tags')
            .insert([{
                'project_id': projectData[0].id,
                'tag_text': tag
            }])

        if (tagError) {
            return {  error: tagError.message };
        }
    })
    
    return { error: null };
}

// Function to get the user's projects or the projects they are involved in
export const getUserProjects = async () => {
    const user = await getCurrentUser();
    const { data, error } = await supabase
        .from('user_specific_projects')
        .select('*')
        .contains('member_ids', [user?.id])
        .order('created_at', { ascending: false });

    if (error) {
        return { projects: null, error: error.message };
    }

    return { projects: data, error: null };
}

// function to search for users
export const autocompleteUsersSearch = async (email: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .ilike('email', `%${email}%`)
        .limit(5);
    
    if (error) {
        return { users: null, error: error.message };
    }
    
    return { users: data, error: null };
}

export const getProjectMembers = async (projectId: number) => {
    const { data, error } = await supabase
        .from('project_members')
        .select(`
            id, role,
            users(id, name, email)
        `)
        .eq('project_id', projectId);
    
    if (error) {
        return { members: null, error: error.message };
    }

    // Flatten the nested `users` object
    const flattened = data?.map(member => ({
        ...member.users,
        role: member.role,
        table_id: member.id
    })) || [];
    
    return { members: flattened, error: null };
}

// update/ insert project members from the projects page
export const modifyProjectMembers = async (selectedMembers: any[], projectId: number) => {
    const { error } = await supabase
        .from('project_members')
        .upsert(
            selectedMembers.map(member => ({
                project_id: projectId,
                member_id: member.id,
                role: member.role,
            })),
        {
            onConflict: 'project_id,member_id',
        }
        );
    
    if (error) {
        return { error: error.message };
    }
    
    return { error: null };
}

export const fetchSpecificProject = async (projectId: number, titleOnly: boolean ) => {

    if (titleOnly) {
        const { data } = await supabase
            .from('projects')
            .select('project_title')
            .eq('id', projectId)
            .single(); 
        if (!data) {
            return null;
        }
        return data;
    }

    const { data } = await supabase
        .from('projects')
        .select(`
            *,
            created_by_user:created_by(name, email),
            project_tags(tag_text),
            project_members(users(name,email))`
        )
        .eq('id', projectId)
        .single(); 

    if (!data) {
        return null;
    }
    return data;
}

// get user data from the users table
export const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();
    if (userDataError) return null
    return userData
}

// function to create a new task
export const createProjectTask = async (taskTable: TaskTable, assignedMembers: any[], subtasks: any[], taskTags: number[]) => {
    const userId = (await getUser())?.id
    const {data: taskData, error: taskError} = await supabase
        .from('project_tasks')
        .insert([{
            project_id: taskTable.projectId,
            task_title: taskTable.taskTitle,
            task_description: taskTable.taskDescription,
            task_deadline: taskTable.taskDeadline,
            task_priority: taskTable.taskPriority,
            created_by: userId
        }])
        .select();
    if (taskError) {
        return { error: taskError.message };
    }
    
    assignedMembers.forEach( async(member) => {
        const { error: membersError} = await supabase
            .from('project_task_members')
            .insert([{
                project_task_id: taskData[0].id,
                user_id: member
        }]);
        if (membersError) {
            return { error: membersError.message };
        }
    })

    subtasks.forEach( async(subtask) => {
        const { error: subtaskTableError} = await supabase
            .from('project_subtasks')
            .insert([{
                project_task_id: taskData[0].id,
                subtask_text: subtask
        }]);
        if (subtaskTableError) {
            return { error: subtaskTableError.message };
        }
    })

    taskTags.forEach( async(tag) => {
        const { error: tagError} = await supabase
            .from('project_task_tags')
            .insert([{
                project_tasks_id: taskData[0].id,
                tag_id: tag
        }]);
        if (tagError) {
            return { error: tagError.message };
        }
    })

    return {error: null};
    
}

// function to get all the tasks related to the project
export const fetchAllTasks = async (projectId: number) => {
    const {data: taskData, error: taskError} = await supabase
        .from('project_tasks')
        .select(`
            *,
            project_task_tags(task_tags_list(tag_text, tag_category)),
            project_subtasks(subtask_text, subtask_status)
            ` )
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (taskError) {
        return { tasks:null, error: taskError.message };
    }
    const groupedByStatus = taskData.reduce((acc, task) => {
        const key = task.task_status || 'Unknown';
        acc[key] = acc[key] || [];
        acc[key].push(task);
        return acc;
    }, {} as Record<string, typeof taskData>);
    return { tasks: groupedByStatus, error: null };
}

// function to get all the tasks from all the projects the user is involved in
export const fetchAllTasksFromAllProjects = async () => {
    const userId = (await getUser())?.id
    const {data: taskData, error: taskError} = await supabase
        .from('projects')
        .select(`
            *,
            project_members(users(id))
            ` )
        .order('created_at', { ascending: false });

    // get only the projects the user is involved in
    const filteredProjects = taskData?.filter(project => {
        return project.project_members.some((member: any) => member.users.id === userId);
    });

    if (!filteredProjects) return {projects: null}
    const projectsWithTasks = await Promise.all(
        filteredProjects.map(async (project: any) => {
            // Get all the tasks for this project
            const { data: projectTasksData, error: taskError } = await supabase
                .from('project_tasks')
                .select(`
                    *,
                    project_task_tags(task_tags_list(tag_text, tag_category)),
                    project_subtasks(subtask_text, subtask_status)
                `)
                .eq('project_id', project.id)
                .order('created_at', { ascending: false });

            if (taskError) {
                // Handle error (optional)
                return { ...project, tasks: [] }; // Or handle as needed
            }

            // Group tasks by status
            const groupedByStatus = projectTasksData.reduce((acc, task) => {
                const key = task.task_status || 'Unknown'; // Default to 'Unknown' if no task_status
                acc[key] = acc[key] || [];
                acc[key].push({
                    ...task,
                    updated_at: getDifferenceDate(formatDate(task.updated_at), new Date()),
                    progress: calculateTaskProgress(task.project_subtasks)
                });
                return acc;
            }, {} as Record<string, typeof projectTasksData>);

            // Add grouped tasks to the project object
            return {
                ...project,
                groupedTasksByStatus: groupedByStatus
            };
        })
    );

    return { projects: projectsWithTasks };
}

const calculateTaskProgress = (subtasks: any[]) => {
    if (subtasks.length > 0) {
        const completedSubtasks = subtasks.filter((subtask) => subtask.subtask_status === 'Completed');
        return (completedSubtasks.length / subtasks.length) * 100;
    }
    return 0;
}
