'use client';
import { Ellipsis, Loader, MessageCircleMore } from 'lucide-react';
import { clsx } from 'clsx';
import { Task } from "@/lib/interface";

interface Props {
    kanbanType: string,
    items: Task[] | null,
}

const KanbanBoardItem: React.FC<Props> = ({kanbanType, items}) => {
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
    
    if (items) {
        console.log("TAGS: ", items[0].project_task_tags[0].task_tags_list);
    }

    return (
        <div className='bg-slate-100 rounded-lg text-black p-3  flex flex-col gap-4 h-[500px] '>
            <div className='bg-white rounded-lg px-2 py-1.5 items-center justify-between flex'>
                <div className='flex gap-2 items-center bg-gray-50 py-1 px-1.5 rounded-lg'>
                    <div className={clsx(
                        'h-4 w-2 rounded-sm',
                        kanbanColor
                    )}></div>
                    <p className='font-medium uppercase text-sm'>{kanbanType}</p>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='text-gray-700 px-1.5 py-0.5 rounded bg-gray-200 text-xs shadow-2xl'>{
                        items ? items.length : 0
                    }
                    </div>
                    <Ellipsis className='text-inherit' size={16} />
                </div>
            </div>
            <div className='flex flex-col gap-4 pr-2 overflow-auto sidebar-scrollbar'>
                {
                    items && items.map((item, index) => (
                        <div key={index} className='bg-white rounded-lg flex flex-col p-2'>
                            {/* Task Category */}
                            <div className='mb-2 flex justify-between items-start'>
                                <div className='flex flex-wrap gap-2'>
                                    <div className={clsx(
                                        'text-[10px] bg-red-100 px-1.5 py-0.5 rounded ',
                                        item.task_priority === 'High' && 'bg-red-100 text-red-500',
                                        item.task_priority === 'Medium' && 'bg-yellow-100 text-yellow-500',
                                        item.task_priority === 'Low' && 'bg-green-100 text-green-500',
                                    )}>{item.task_priority}</div>
                                    {
                                        item.project_task_tags.map((tag, index) => (
                                            <div key={index} className={clsx(
                                                'text-[10px] px-1.5 py-0.5 rounded',
                                                tag.task_tags_list.tag_category === 'Area' && 'bg-blue-100 text-blue-500',
                                                tag.task_tags_list.tag_category === 'Task Type' && 'bg-purple-100 text-purple-500',
                                                tag.task_tags_list.tag_category === 'Status' && 'bg-red-100 text-red-500',
                                                tag.task_tags_list.tag_category === 'Quality' && 'bg-green-100 text-green-500',
                                            )}>{tag.task_tags_list.tag_text}</div>
                                        ))
                                    }
                                </div>
                                <p className='text-xs text-gray-400 min-w-max'>{`TDT-${index}`}</p>
                            </div>
                            <p className='text-sm font-medium mb-1'>{item.task_title}</p>
                            <p className='text-xs font-light text-gray-500'>{item.task_description}</p>
                            {/* Progress Bar */}
                            <div className='flex flex-col gap-1 my-4'>
                                <div className='flex justify-between items-center text-[10px] text-gray-400'>
                                    <div className='flex gap-1 items-center'>
                                        <Loader size={13} />
                                        <p>Progress</p>
                                    </div>
                                    <p>{item.progress}%</p>
                                </div>
                                <div className='bg-gray-200 h-1.5 rounded-full'>
                                    <div className={clsx(
                                        'bg-[#3B82F6] h-1.5 rounded-full',
                                    )}
                                    style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 text-[10px]">
                                <p>{item.updated_at}</p>
                                <div className='flex gap-1 items-center'>
                                    <MessageCircleMore size={16} />
                                    <p>2</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default KanbanBoardItem;