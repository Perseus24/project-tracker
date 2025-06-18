'use client';
import { parseDate } from "chrono-node"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
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
import React, {  useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { CalendarIcon, Check, GripVertical, PencilLine, Plus, Save, Search, StickyNote, Trash2, X } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import AssignUserToTask from "./AssignUserToTask";
import Image from "next/image";
import { CSS } from '@dnd-kit/utilities';
import clsx from "clsx";
import { createProjectTask } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { Toaster, toast } from 'sonner'

interface Props {
    sheetTrigger: React.ReactNode
}

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
            <StickyNote size={20} color="gray" strokeWidth={2} className="ml-2 mr-3"/>
            {/* <div className="h-3.5 w-3.5 rounded-full border border-gray-700 ml-2 mr-3"></div> */}
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

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

const CreateNewTaskSheet:React.FC<Props> = ({sheetTrigger}) => {
    const params = useParams();
    const projectId = Number(params.id);
    const [openedSheet, setOpenedSheet] = React.useState(false);
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("In 2 days")
    const [date, setDate] = React.useState<Date | undefined>(
        parseDate(value) || undefined
    )
    const [month, setMonth] = React.useState<Date | undefined>(date)

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');

    const [priorities] = useState([
        { id: 0, item: "High" },
        { id: 1, item:  "Medium" },
        { id: 2, item: "Low" },
    ]);

    const [assignedMembers, setAssignedMembers] = useState<any[]>([]);
    
    const [addNewSubtask, setAddNewSubtask] = useState(false);
    const [newSubtaskInput, setNewSubtaskInput] = useState('');
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const sensors = useSensors(useSensor(CustomPointerSensor, {
        activationConstraint: { distance: 5 }
    }));
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);

    const [searchQueryTags, setSearchQueryTags] = useState('');
    const [taskTags, setTaskTags] = useState<number[]>([]);
    const [tags] = useState([
        // CATEGORY: Roles / Areas
        { id: 1, item: "Front-End", category: "Area" },
        { id: 2, item: "Back-End", category: "Area" },
        { id: 3, item: "Design", category: "Area" },
        { id: 4, item: "API", category: "Area" },
        { id: 5, item: "UX/UI", category: "Area" },
        { id: 6, item: "Database", category: "Area" },
        { id: 7, item: "DevOps", category: "Area" },
        { id: 8, item: "Client", category: "Area" },

        // CATEGORY: Task Type
        { id: 9, item: "Testing", category: "TaskType" },
        { id: 10, item: "Bug", category: "TaskType" },
        { id: 11, item: "Feature", category: "TaskType" },
        { id: 12, item: "Documentation", category: "TaskType" },
        { id: 13, item: "Research", category: "TaskType" },
        { id: 14, item: "Review", category: "TaskType" },
        { id: 15, item: "Maintenance", category: "TaskType" },

        // CATEGORY: Status / Progress
        { id: 16, item: "Blocked", category: "Status" },
        { id: 17, item: "Priority", category: "Status" },
        { id: 18, item: "Sprint", category: "Status" },
        { id: 19, item: "Deployment", category: "Status" },

        // CATEGORY: Quality / Performance
        { id: 20, item: "Security", category: "Quality" },
        { id: 21, item: "Performance", category: "Quality" }
    ]);

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

    const handleAddSubtask = () => {
        setSubtasks(prev => [...prev, newSubtaskInput]);
        setAddNewSubtask(false);
        setNewSubtaskInput('');
    }

    // search query for tags
    const filteredTagItems = tags.filter(item =>
        item.item.toLowerCase().includes(searchQueryTags.toLowerCase())
    );

    const handleSubmit = async() => {
        setOpenedSheet(false);
        const taskTable = {
            "projectId": projectId,
            "taskTitle": taskTitle,
            "taskDescription": taskDescription,
            "taskDeadline": date,
            "taskPriority": selectedPriority
        };
        const { error } = await createProjectTask(taskTable, assignedMembers, subtasks, taskTags);
        if(error) return { error: error };
        toast.success('Task has been created')

        resetForm();
    }

    // Function to reset the form state
    const resetForm = () => {
        setTaskTitle('');
        setTaskDescription('');
        setValue('In 2 days');
        setSelectedPriority('');
        setAssignedMembers([]);
        setSubtasks([]);
        setTaskTags([]);
    };

    // Handle Sheet Close
    const handleCloseSheet = () => {
        resetForm(); // Reset form when the sheet is closed
        setOpenedSheet(false); // Close the sheet
    };

    return (
        <Sheet open={openedSheet} onOpenChange={setOpenedSheet}>
            <SheetTrigger>{sheetTrigger}</SheetTrigger>
            <Toaster richColors position="top-right"  />
            <SheetContent>
                <SheetHeader className="border-b border-gray-300 ">
                    <SheetTitle>Create New Task</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 text-[13px] text-gray-700 overflow-auto pb-4 ">
                    <div className="px-4 flex flex-col gap-4 ">
                        <div className="grid gap-3">
                            <label className="font-medium">Task Title</label>
                            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} type="text" className="rounded-md border border-gray-200 h-8 p-2 text-gray-800" />
                        </div>
                        <div className="grid gap-3">
                            <label className="font-medium">Task Description</label>
                            <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows={4} className="rounded-md border border-gray-200 p-2 text-gray-800" />
                        </div>
                        <div className="grid gap-3">
                            <label className="font-medium">Deadline</label>
                            <div className="relative flex gap-2">
                                <Input
                                    id="date"
                                    value={value}
                                    placeholder="Tomorrow or next week"
                                    className="bg-background pr-10"
                                    onChange={(e) => {
                                        setValue(e.target.value)
                                        const date = parseDate(e.target.value)
                                        if (date) {
                                            setDate(date)
                                            setMonth(date)
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowDown") {
                                        e.preventDefault()
                                        setOpen(true)
                                        }
                                    }}
                                />
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date-picker"
                                            variant="ghost"
                                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                        >
                                            <CalendarIcon className="size-3.5" />
                                            <span className="sr-only">Select date</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                                        <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        month={month}
                                        onMonthChange={setMonth}
                                        onSelect={(date) => {
                                            setDate(date)
                                            setValue(formatDate(date))
                                            setOpen(false)
                                        }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <label className="font-medium">Priority</label>
                            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                                <SelectTrigger className="w-full border border-gray-200 bg-white hover:bg-gray-100">
                                    <SelectValue placeholder="Select a priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        priorities.map((priority, index) => (
                                            <SelectItem 
                                                key={index} 
                                                value={priority.item} 
                                                >{priority.item}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <label className="font-medium">Assignee</label>
                            <AssignUserToTask 
                                triggerButton={
                                    <div className="flex gap-1 items-center border border-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 w-full">
                                        <Plus size={16} />
                                        Add user
                                    </div>
                                }
                                assignedMembers={assignedMembers}
                                setAssignedMembers={setAssignedMembers}
                            />
                            {
                                assignedMembers.length > 0 && (
                                    <div className="flex pl-3 gap-3">
                                        {
                                            assignedMembers.map((member)=>(
                                                <Image key={member.id} src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} className="rounded-full h-7 w-7 -mx-2.5 shrink-0" />
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="px-4 flex flex-col gap-4 ">
                        <div className="grid gap-3">
                            <label className="font-medium">Subtasks</label>
                            <div className="flex flex-col gap-1 text-xs">
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
                                        <div className="flex gap-2 items-center w-full relative">
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
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-md w-full overflow-hidden" />
                                            <button 
                                                onClick={handleAddSubtask} className="absolute p-1 right-9  hover:bg-gray-100 cursor-pointer rounded-md">
                                                <Save size={20} color="gray" strokeWidth={2} />
                                            </button>
                                            <button onClick={() => setAddNewSubtask(false)} className="absolute p-1 right-2  hover:bg-gray-100 cursor-pointer rounded-md">
                                                <X size={20} color="gray" strokeWidth={2} />
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="flex justify-center items-center gap-3 w-full py-2 border border-gray-200 hover:bg-gray-100 rounded-md"
                                onClick={() => setAddNewSubtask(!addNewSubtask)}>
                                <Plus size={16} />
                                Add Subtask
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <label className="font-medium">Tags</label>
                            <div className="flex flex-wrap gap-3 items-center font-medium text-xs mt-3">
                                <Popover modal={true}>
                                    <PopoverTrigger 
                                        className="cursor-pointer bg-gray-100 text-black flex gap-2 items-center px-2 py-1 rounded-lg relative text-xs">
                                        <Plus size={16} />
                                        Add tag
                                    </PopoverTrigger>
                                    <PopoverContent align="end" side="left" className="text-xs w-96 p-0 gap-0 h-96 overflow-hidden">
                                        <div className="p-4.5 border-b border-gray-300 ">
                                            <p className="text-base font-medium">Add Tags</p>
                                            <p className="text-[13px]">
                                                Add tags to help you keep track of your tasks.
                                            </p>
                                        </div>
                                        <div className="px-4.5 flex py-2.5 border-b border-gray-300">
                                            <Search size={18} color="gray" />
                                            <input autoFocus 
                                                className="ml-2.5 focus:outline-none text-[13px]" 
                                                placeholder="Search for users..." 
                                                onChange={(e) => setSearchQueryTags(e.target.value)}/>
                                        </div>
                                        <div className="flex flex-col px-2 py-1 gap-0.5 h-[70%] overflow-y-scroll">
                                            {
                                                filteredTagItems.length > 0 ? (
                                                    filteredTagItems.map((tag) => (
                                                        <div 
                                                            key={tag.id} 
                                                            className={clsx(    
                                                                "px-1.5 py-1 flex gap-4 items-center hover:bg-gray-100 rounded-md cursor-pointer",
                                                                taskTags.includes(tag.id) && "opacity-50"
                                                            )}
                                                            onClick={() => {
                                                                if(taskTags.includes(tag.id)) {
                                                                    setTaskTags(taskTags.filter((id) => id !== tag.id));
                                                                } else {
                                                                    setTaskTags([...taskTags, tag.id]);
                                                                }
                                                            }}
                                                            >
                                                            <p className="text-sm">{tag.item}</p>
                                                            {
                                                                taskTags.includes(tag.id) && (
                                                                    <Check size={18} color="gray" strokeWidth={2} className="ml-auto" />
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="w-full flex justify-center py-5 text-[13px]">No users found.</p>
                                                )
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
                        </div>
                    </div>
                </div>
                <SheetFooter className="">
                    <Button onClick={() => {handleSubmit()}} className="cursor-pointer">Create</Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCloseSheet}>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CreateNewTaskSheet;