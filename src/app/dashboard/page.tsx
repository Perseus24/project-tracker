'use client';
import KanbanBoardItem from '@/components/Kanban/KanbanBoardItem';
import { fetchAllTasksFromAllProjects } from '@/lib/supabase/client';
import { Ellipsis } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Disable SSR for the chart
const EChartPieComponent = dynamic(() => import('@/components/Echarts/EchartPieChart'), {
    ssr: false
});
const EChartBarComponent = dynamic(() => import('@/components/Echarts/EchartBarChart'), {
    ssr: false
});

const Dashboard = () => {
    const [taskList, setTaskList] = useState<any[] | null>(null);
    const [toDoTaskList, setToDoTaskList] = useState<any[] | null>(null);
    const [inReviewTasks, setInReviewTasks] = useState<any[] | null>(null);
    const [inProgressTasks, setInProgressTasks] = useState<any[] | null>(null);
    const [completedTasks, setCompletedTasks] = useState<any[] | null>(null);

    useEffect(() => {
        const fetchAllTasks = async () => {
            const { projects } = await fetchAllTasksFromAllProjects();
            if (!projects) return;
            
            projects.map((proj: any) => {
                if (!proj.groupedTasksByStatus) return;
                if (proj.groupedTasksByStatus["To Do"]) setToDoTaskList([...(toDoTaskList || []), ...proj.groupedTasksByStatus["To Do"]]);
                if (proj.groupedTasksByStatus["In Review"]) setInReviewTasks([...(inReviewTasks || []), ...proj.groupedTasksByStatus["In Review"]]);
                if (proj.groupedTasksByStatus["In Progress"]) setInProgressTasks([...(inProgressTasks || []), ...proj.groupedTasksByStatus["In Progress"]]);
                if (proj.groupedTasksByStatus["Completed"]) setCompletedTasks([...(completedTasks || []), ...proj.groupedTasksByStatus["Completed"]]);
            })
        }
        fetchAllTasks();
    }, [])

    return (
        <div className='flex flex-1 flex-col gap-5 p-4 pt-0 overflow-hidden'>
            <div className='grid grid-cols-7 gap-4 h-[40vh]'>
                <div className="flex flex-col col-span-3 bg-white rounded-lg pb-3 py-1 border border-gray-200 ">
                    <div className='flex justify-between items-center text-gray-500 text-[14px] border-b py-1.5 border-b-gray-200'>
                        <p className='ml-4 font-semibold'>Chart</p>
                        <Ellipsis className='text-inherit mr-4' />
                    </div>
                    <EChartPieComponent />
                </div>
                <div className="flex col-span-4 flex-col bg-white rounded-lg pb-3 py-1 border border-gray-200">
                    <div className='flex justify-between items-center text-gray-500 text-[14px] border-b py-1.5 border-b-gray-200'>
                        <p className='ml-4 font-semibold'>Column</p>
                        <Ellipsis className='text-inherit mr-4' />
                    </div>
                    <EChartBarComponent />
                </div>
            </div>
            <section className="grid grid-cols-4 gap-x-4">
                <KanbanBoardItem kanbanType='To-Do' items={toDoTaskList} />
                <KanbanBoardItem kanbanType='In-Progress' items={inProgressTasks} />
                <KanbanBoardItem kanbanType='In-Review' items={inReviewTasks} />
                <KanbanBoardItem kanbanType='Completed' items={completedTasks} />
            </section>
        </div>
    );
}

export default Dashboard;