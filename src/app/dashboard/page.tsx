'use client';
import KanbanBoardItem from '@/components/Kanban/KanbanBoardItem';
import { Ellipsis } from 'lucide-react';
import dynamic from 'next/dynamic';

// Disable SSR for the chart
const EChartPieComponent = dynamic(() => import('@/components/Echarts/EchartPieChart'), {
    ssr: false
});
const EChartBarComponent = dynamic(() => import('@/components/Echarts/EchartBarChart'), {
    ssr: false
});

const Dashboard = () => {
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
                <KanbanBoardItem kanbanType='To-Do' kanbanTotalItems={10} />
                <KanbanBoardItem kanbanType='In-Progress' kanbanTotalItems={3} />
                <KanbanBoardItem kanbanType='In-Review' kanbanTotalItems={0} />
                <KanbanBoardItem kanbanType='Completed' kanbanTotalItems={1} />
            </section>
        </div>
    );
}

export default Dashboard;