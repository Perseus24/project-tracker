'use client';

import CreateNewTaskSheet from "@/components/CreateNewTaskSheet";
import KanbanBoardItem from "@/components/Kanban/KanbanBoardItem";
import { TicketPlus } from "lucide-react";
import {  useState } from "react";

export default function Board () {
    
    return (
        <div className="h-full w-full flex justify-center items-center text-xs">
            <div className="flex flex-col gap-2">
                <p className="text-sm">There is no currently active tasks for this project.</p>
                <CreateNewTaskSheet sheetTrigger={
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer flex gap-2 items-center justify-center text-xs">
                        <TicketPlus size={20} />
                        Create Task</div>
                } />
            </div>
            {/* Add Task Modal */}
                    

            {/* <CreateNewTask setCreateTaskButton={setCreateTaskButton} /> */}
        </div>
        
        // <section className="grid grid-cols-4 gap-x-4">
        //     <KanbanBoardItem kanbanType='To-Do' kanbanTotalItems={10} />
        //     <KanbanBoardItem kanbanType='In-Progress' kanbanTotalItems={3} />
        //     <KanbanBoardItem kanbanType='In-Review' kanbanTotalItems={0} />
        //     <KanbanBoardItem kanbanType='Completed' kanbanTotalItems={1} />
        // </section>
    )
}