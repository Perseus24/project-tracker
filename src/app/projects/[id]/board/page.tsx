'use client';

import CreateNewTaskSheet from "@/components/CreateNewTaskSheet";
import KanbanBoardItem from "@/components/Kanban/KanbanBoardItem";
import { useProject } from "@/context/ProjectContext";
import { fetchAllTasks } from "@/lib/supabase/client";
import { TicketPlus } from "lucide-react";
import { useParams } from "next/navigation";
import {  useEffect, useState } from "react";
import { Task } from "@/lib/interface";
import { formatDate, getDifferenceDate } from "@/lib/utils";

export default function Board () {
    const params = useParams();
    const projectId = Number(params.id);
    const { activeBoardTab, setActiveBoardTab } = useProject();
    const [taskList, setTaskList] = useState<Task[] | null>(null);
    const [loading, setLoading] = useState(true);

    const inProgressTasks = (taskList as any)?.["In Progress"];
    const toDoTasks = (taskList as any)?.["To Do"];
    const inReviewTasks = (taskList as any)?.["In Review"];
    const completedTasks = (taskList as any)?.["Completed"];

    useEffect(() => {
        const fetchTaskList = async () => {
            setLoading(true);
            if (projectId === null) return;
            const { tasks, error } = await fetchAllTasks(projectId);
            if (error) return;

            const updatedTasks = Object.keys(tasks).reduce((acc: any, status) => {
                // For each status, map over the tasks and update the `updated_at` field
                acc[status] = tasks[status].map((task: any) => ({
                    ...task,
                    updated_at: getDifferenceDate(formatDate(task.updated_at), new Date()),  // Transforming each task's `updated_at`
                    progress: calculateTaskProgress(task.project_subtasks),
                }));
                return acc;
            }, {});

            setTaskList(updatedTasks);
            setLoading(false);
        }

        fetchTaskList();
    }, [])
    
    const calculateTaskProgress = (subtasks: any[]) => {
        if (subtasks.length > 0) {
            const completedSubtasks = subtasks.filter((subtask) => subtask.subtask_status === 'Completed');
            return (completedSubtasks.length / subtasks.length) * 100;
        }
        return 0;
    }

    if(loading) return <div className="h-full w-full flex justify-center items-center text-xs">Loading...</div>;

    return (
        <>           
            {
                Object.keys(taskList || {}).length === 0  ? (
                    <div className="h-full w-full flex justify-center items-center text-xs">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm">There is no currently active tasks for this project.</p>
                            <CreateNewTaskSheet sheetTrigger={
                                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer flex gap-2 items-center justify-center text-xs">
                                    <TicketPlus size={20} />
                                    Create Task</div>
                            } />
                        </div>
                    </div>
                ) : (
                    activeBoardTab === 1 && (
                        <div className="grid grid-cols-4 gap-x-4">
                            <KanbanBoardItem kanbanType='To-Do' items={toDoTasks} />
                            <KanbanBoardItem kanbanType='In-Progress' items={inProgressTasks} />
                            <KanbanBoardItem kanbanType='In-Review' items={inReviewTasks} />
                            <KanbanBoardItem kanbanType='Completed' items={completedTasks} />
                        </div>
                    )
                )
            }
        </>
    )
}