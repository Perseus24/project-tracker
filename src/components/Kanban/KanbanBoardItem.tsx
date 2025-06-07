'use client';
import { Loader, MessageCircleMore } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
    kanbanType: string,
    kanbanTotalItems: number
}

const KanbanBoardItem: React.FC<Props> = ({kanbanType, kanbanTotalItems}) => {
    let kanbanColor = '';
    switch (kanbanType) {
        case 'To-Do':
            kanbanColor = 'bg-red-500';
            break;
        case 'In-Progress':
            kanbanColor = 'bg-yellow-500';
            break;
        case 'In-Review':
            kanbanColor = 'bg-orange-500';
            break;
        case 'Completed':
            kanbanColor = 'bg-green-500';
            break;
        default:
            kanbanColor = 'bg-red-500';
            break;
    }

    return (
        <div className='bg-slate-100 rounded-lg text-black py-3 px-2 flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <div className='flex gap-2 items-center'>
                    <div className={clsx(
                        'h-4 w-1 rounded-3xl',
                        kanbanColor
                    )}></div>
                    <p className='font-medium'>{kanbanType}</p>
                    <div className='text-gray-700 px-1.5 py-0.5 rounded bg-gray-200 text-sm shadow-2xl'>{kanbanTotalItems}</div>
                </div>
            </div>
            {
                Array.from({ length: kanbanTotalItems}).map((_, index) => (
                    <div key={index} className='bg-white rounded-lg flex flex-col p-2'>
                        {/* Task Category */}
                        <div className='mb-2 flex justify-between items-center'>
                            <div className='flex gap-2'>
                                <div className='text-[10px] bg-red-100 px-1.5 py-0.5 rounded text-red-500'>High</div>
                                <div className='text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-500'>Back-End</div>
                            </div>
                            <p className='text-xs text-gray-400'>D-149</p>
                        </div>
                        <p className='text-sm font-medium mb-1'>Develop API Endpoints</p>
                        <p className='text-xs font-light text-gray-500'>Build the necessary API endpoints</p>
                        {/* Progress Bar */}
                        <div className='flex flex-col gap-1 my-4'>
                            <div className='flex justify-between items-center text-[10px] text-gray-400'>
                                <div className='flex gap-1 items-center'>
                                    <Loader size={13} />
                                    <p>Progress</p>
                                </div>
                                <p>50%</p>
                            </div>
                            <div className='bg-gray-200 h-1.5 rounded-full'>
                                <div className='bg-[#3B82F6] h-1.5 rounded-full w-1/2'></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-gray-500 text-[10px]">
                            <p>Updated 3 hours ago</p>
                            <div className='flex gap-1 items-center'>
                                <MessageCircleMore size={16} />
                                <p>2</p>
                            </div>
                        </div>
                    </div>
                ))
            }
            
        </div>
    );
};

export default KanbanBoardItem;