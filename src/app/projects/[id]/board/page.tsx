'use client';

import CreateNewTaskSheet from "@/components/CreateNewTaskSheet";
import KanbanBoardItem from "@/components/Kanban/KanbanBoardItem";
import { useProject } from "@/context/ProjectContext";
import { fetchAllTasks } from "@/lib/supabase/client";
import { se } from "date-fns/locale";
import { TicketPlus } from "lucide-react";
import { useParams } from "next/navigation";
import {  useEffect, useState } from "react";

export default function Board () {
    const params = useParams();
    const projectId = Number(params.id);
    const { activeBoardTab, setActiveBoardTab } = useProject();
    const [taskList, setTaskList] = useState<any[] | null>(null);
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
            setTaskList(tasks);
            setLoading(false);
        }

        fetchTaskList();
    }, [])

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
                            <KanbanBoardItem kanbanType='To-Do' kanbanTotalItems={toDoTasks?.length} />
                            <KanbanBoardItem kanbanType='In-Progress' kanbanTotalItems={inProgressTasks?.length} />
                            <KanbanBoardItem kanbanType='In-Review' kanbanTotalItems={inReviewTasks?.length} />
                            <KanbanBoardItem kanbanType='Completed' kanbanTotalItems={completedTasks?.length} />
                        </div>
                    )
                )
            }
        </>
    )
}