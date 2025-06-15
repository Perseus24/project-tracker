'use client';
import Image from "next/image";
import {  ChevronDownIcon, CirclePlus, GripVertical, PencilLine, Plus, Save, Search, Trash2, X } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Users } from "@/lib/interface";
import { getUser } from "@/lib/supabase/client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import React from "react";

function isInteractiveElement(element: EventTarget | null) {
    if (!(element instanceof HTMLElement)) return false;
    const interactiveElements = ['button', 'input', 'textarea', 'select', 'option'];
    return interactiveElements.includes(element.tagName.toLowerCase());
}

class CustomPointerSensor extends PointerSensor {
    static activators = [
        {
        eventName: 'onPointerDown' as const, // use 'as const' for string literal type
        handler: ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
            if (
            !nativeEvent.isPrimary ||
            nativeEvent.button !== 0 ||
            isInteractiveElement(nativeEvent.target)
            ) {
            return false;
            }
            return true;
        },
        },
    ];
}

function SortableSubtask({ id, onDelete, onRename, onRenameConfirm, isEditing }: { 
        id: string; 
        onDelete: (id: string) => void; 
        onRename: (id: string) => void;
        onRenameConfirm: (id: string, newValue: string) => void;
        isEditing: boolean;
    }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white py-2 pl-1 pr-3  rounded mb-1 cursor-grab flex items-center text-gray-700 font-medium hover:bg-gray-100 group pointer-events-auto"
        >
            <GripVertical size={18} color="gray" strokeWidth={1.5} className="group-hover:visible invisible" />
            <div className="h-3.5 w-3.5 rounded-full border border-gray-700 ml-2 mr-3"></div>
            {isEditing ? (
                <input
                    type="text"
                    defaultValue={id}
                    autoFocus
                    onBlur={(e) => onRenameConfirm(id, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onRenameConfirm(id, (e.target as HTMLInputElement).value);
                        }
                    }}
                    className="border rounded px-2 py-1 text-xs"
                />
                ) : (
                <p>{id}</p>
            )}
            <button className="ml-auto flex items-center gap-3"  >
                <PencilLine 
                    onClick={() => {onRename(id)}}
                    size={16} 
                    color="gray" 
                    strokeWidth={1.5} className="group-hover:visible invisible" />
                <Trash2  
                    onClick={() => {onDelete(id)}} 
                    size={16} color="gray" strokeWidth={1.5} className="group-hover:visible invisible cursor-pointer" />
            </button>
        </div>
    );
}

interface Props {
    setCreateTaskButton: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateNewTask:React.FC<Props> = ({setCreateTaskButton}) => {
    const [user, setUser] = useState<Users | null>(null);
    const [selectedPriority, setSelectedPriority] = useState(0);
    const [priorities] = useState([
        { id: 0, item: "High" },
        { id: 1, item:  "Medium" },
        { id: 2, item: "Low" },
    ]);
    const [deadlineButton, setDeadlineButton] = useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    const priorityDropdownButtonRef = useRef(null);
    const addTagButtonRef = useRef(null);

    const [addTagButton, setAddTagButton] = useState(false);
    const [taskTags, setTaskTags] = useState<number[]>([]);
    const [tags] = useState([
        // CATEGORY: Roles / Areas
        { id: 0, item: "Front-End", category: "Area" },
        { id: 1, item: "Back-End", category: "Area" },
        { id: 2, item: "Design", category: "Area" },
        { id: 3, item: "API", category: "Area" },
        { id: 10, item: "UX/UI", category: "Area" },
        { id: 11, item: "Database", category: "Area" },
        { id: 8, item: "DevOps", category: "Area" },
        { id: 14, item: "Client", category: "Area" },

        // CATEGORY: Task Type
        { id: 4, item: "Testing", category: "TaskType" },
        { id: 5, item: "Bug", category: "TaskType" },
        { id: 6, item: "Feature", category: "TaskType" },
        { id: 7, item: "Documentation", category: "TaskType" },
        { id: 9, item: "Research", category: "TaskType" },
        { id: 15, item: "Review", category: "TaskType" },
        { id: 18, item: "Maintenance", category: "TaskType" },

        // CATEGORY: Status / Progress
        { id: 16, item: "Blocked", category: "Status" },
        { id: 17, item: "Priority", category: "Status" },
        { id: 19, item: "Sprint", category: "Status" },
        { id: 20, item: "Deployment", category: "Status" },

        // CATEGORY: Quality / Performance
        { id: 12, item: "Security", category: "Quality" },
        { id: 13, item: "Performance", category: "Quality" }
    ]);

    const [addNewSubtask, setAddNewSubtask] = useState(false);
    const [newSubtaskInput, setNewSubtaskInput] = useState('');
    // subtasks
    // const [subtasks, setSubtasks] = useState([]);
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const sensors = useSensors(useSensor(CustomPointerSensor, {
        activationConstraint: { distance: 5 }
    }));
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);

    const handleRename = (id: string) => {
        setEditingSubtaskId(id);
    };

    const handleRenameConfirm = (id: string, newName: string) => {
        setSubtasks((prev) =>
            prev.map((subtask) => (subtask === id ? newName : subtask))
        );
        setEditingSubtaskId(null);
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = subtasks.indexOf(String(active.id));
        const newIndex = subtasks.indexOf(String(over.id));
        setSubtasks(arrayMove(subtasks, oldIndex, newIndex));
    };
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (!user) return;
            setUser(user);
        };

        const handleClick= (e: MouseEvent) => {
            handleClickOutside(e, addTagButtonRef, setAddTagButton);
        };

        document.addEventListener('mousedown', handleClick);
        fetchUser();
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
        
    }, [])

    useEffect(() => {
        console.log("subtasks updated:", subtasks);
        }, [subtasks]);

    const addSelectedTags = (e: React.MouseEvent | ChangeEvent, id: number) => {
        if (e && (e as React.MouseEvent).stopPropagation) {
            (e as React.MouseEvent).stopPropagation(); // Only call stopPropagation for MouseEvent
        }
        setTaskTags((prev) => {
            if (prev.includes(id)) {
                return prev.filter(tagId => tagId !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    const handleClickOutside = (e: MouseEvent, ref: React.RefObject<HTMLDivElement | null>, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setter(false);
        }
    };

    const handleAddSubtask = () => {
        setSubtasks(prev => [...prev, newSubtaskInput]);
        setAddNewSubtask(false);
        setNewSubtaskInput('');
    }

    return (
        <div className="fixed top-0 right-0 w-full h-screen z-50" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gray-400/50 z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 max-h-[90vh] bg-white rounded-xl pt-6 z-50 text-gray-700 overflow-hidden">
                    <div className="flex justify-between items-center text-gray-800 border-b border-gray-200 pb-4 px-7 ">
                        <p className="text-base font-semibold">Create new task</p>
                        <X className="cursor-pointer" onClick={()=> setCreateTaskButton(false)} />
                    </div>
                    <div className="flex">
                        <section className="flex flex-col w-2/3 px-8 py-5 overflow-y-auto max-h-[80vh] sidebar-scrollbar">
                            <div className="flex gap-5 w-full">
                                <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                                <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-3 flex-1 text-xs">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium">Task title</p>
                                        <input type="text" className="w-full border border-gray-200 rounded-md p-2" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium">Task Description</p>
                                        <textarea rows={4} className="w-full border border-gray-200 rounded-md p-2" />
                                    </div>
                                </div>
                            </div>
                            {/* Subtasks */}
                            <Accordion className="mt-5" type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="border-b-2 border-gray-200 rounded-none">Subtasks</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-1 text-xs mt-3">
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                                <SortableContext items={subtasks} strategy={verticalListSortingStrategy}>
                                                    {
                                                    subtasks.map((task) => (
                                                        <SortableSubtask key={task} 
                                                            id={task} 
                                                            onRename={handleRename}
                                                            onDelete={(id) => {setSubtasks(prev => prev.filter(subtask => subtask !== id))}}
                                                            onRenameConfirm={handleRenameConfirm}
                                                            isEditing={editingSubtaskId === task} />
                                                    ))}
                                                </SortableContext>
                                            </DndContext>
                                            {
                                                addNewSubtask && (
                                                    <div className="flex gap-2 items-center w-full">
                                                        <input 
                                                            type="text" 
                                                            autoFocus
                                                            value={newSubtaskInput} 
                                                            onChange={(e) => setNewSubtaskInput(e.target.value)} 
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    handleAddSubtask();
                                                                }
                                                            }}
                                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-md" />
                                                        <button 
                                                            onClick={handleAddSubtask} className="flex items-center gap-2 py-1 px-2  hover:bg-gray-100 cursor-pointer rounded-md">
                                                            <Save size={20} color="gray" strokeWidth={2} />
                                                        </button>
                                                        <button onClick={() => setAddNewSubtask(false)} className="flex items-center gap-2 py-1 px-2  hover:bg-gray-100 cursor-pointer rounded-md">
                                                            <X size={20} color="gray" strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            <div className="mt-2 flex gap-2 items-center cursor-pointer" onClick={() => setAddNewSubtask(!addNewSubtask)}>
                                                <Plus size={16} />
                                                <p>Add Subtask</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Attachments</AccordionTrigger>
                                    <AccordionContent>
                                        Currently not available.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Tags</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-wrap gap-3 items-center font-medium text-xs">
                                            <Popover>
                                                <PopoverTrigger 
                                                    className="cursor-pointer bg-gray-100 text-black flex gap-2 items-center px-2 py-1 rounded-lg relative text-xs">
                                                    <Plus size={16} />
                                                    Add tag
                                                </PopoverTrigger>
                                                <PopoverContent className="absolute bottom-full bg-white flex flex-col border border-gray-200 rounded-lg w-72 h-60 px-3 py-2 z-50 text-xs" >
                                                    <div className="flex bg-gray-100 relative w-full">
                                                        <input type="text" onClick={(e) => e.stopPropagation()} 
                                                            placeholder="Search tags" 
                                                            className="pl-8 w-full border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                                                        <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 cursor-pointer" />
                                                    </div>
                                                    <div className="h-full overflow-y-scroll gap-1">
                                                        {
                                                            tags.map((tag, index)=>(
                                                                <div key={index} className="px-4 py-1.5 cursor-pointer hover:bg-blue-500 hover:text-white flex gap-3 rounded-lg mb-1" onClick={(e) => addSelectedTags(e, tag.id) } >
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={taskTags.includes(tag.id)}
                                                                        onClick={(e) => addSelectedTags(e, tag.id)}
                                                                        onChange={(e) => addSelectedTags(e, tag.id)}
                                                                        id={tag.item} 
                                                                        className="mr-2" />
                                                                    <p>{tag.item}</p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            {
                                                taskTags.map((tag, index) => (
                                                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2" key={index}>
                                                        {tags.find(t => t.id === tag)?.item}
                                                        <X size={16} className="cursor-pointer"
                                                            onClick={() => setTaskTags(taskTags.filter((_, i) => i !== index))} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>
                        <section className="flex flex-col w-1/3 bg-gray-50 py-5">
                            <div className="flex flex-col gap-3 pb-5 border-b-1 border-b-gray-200 px-4 ">
                                <p>Created by</p>
                                <div className="flex gap-3 items-center font-semibold">
                                    <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white ">
                                        <Image src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} />
                                    </div>
                                    <p>{user?.name}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pb-5 border-b-1 border-b-gray-200 px-4 py-5">
                                <p>Assignee</p>
                                <div className="flex gap-1 items-center font-semibold">
                                    <CirclePlus className="cursor-pointer text-inherit" color="gray" strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pb-5 border-b-1 border-b-gray-200 px-4 py-5">
                                <p>Deadline</p>
                                <Popover open={deadlineButton} onOpenChange={setDeadlineButton}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!date}
                                            className="w-48 justify-between font-normal text-xs"
                                        >
                                            { date ? date.toLocaleDateString() : <span>Pick a date</span>}
                                            <ChevronDownIcon  />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar 
                                            mode="single" 
                                            selected={date} 
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date)
                                                setDeadlineButton(false)
                                            }} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-3 pb-5 border-b-1 border-b-gray-200 px-4 py-5">
                                <p>Set Priority</p>
                                <Select>
                                    <SelectTrigger className="w-[180px] text-xs border border-gray-200 bg-white hover:bg-gray-100">
                                        <SelectValue placeholder="Select a priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            priorities.map((priority, index) => (
                                                <SelectItem 
                                                    key={index} 
                                                    value={priority.item} 
                                                    onClick={() => setSelectedPriority(priority.id)}
                                                    className="text-xs">{priority.item}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                
                            </div>
                            
                        </section>
                    </div>
                </div>
        </div>
    )
}

export default CreateNewTask;