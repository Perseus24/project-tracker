'use client';

import AddUser from "@/components/addUser";
import Dropdown from "@/components/Dropdown";
import { Users } from "@/lib/interface";
import { newProjectForm } from "@/lib/supabase/client";
import {  Plus, Search, UserRoundPlus, X } from "lucide-react";
import Link from "next/link";
import  { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function CreateNewProject() {
    const router = useRouter();
    const [projectTitle, setProjectTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [client, setClient] = useState('');

    const [addMemberBtn, setAddMemberBtn] = useState(false);
    const [projectMembers, setProjectMembers] = useState<Users[]>([]);
    const [projectType, setProjectType] = useState(0);
    const [projectTypeDropdown, setProjectTypeDropdown] = useState(false);
    const [priority, setPriority] = useState(0);
    const [priorityDropdown, setPriorityDropdown] = useState(false);

    const [addTag, setAddTag] = useState(false);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const selectTagsCont = useRef(null);
    const addMemberCont = useRef(null);
    const projectTypeDropdownRef = useRef(null);
    const priorityDropdownRef = useRef(null);
    
    const [projectTypes] = useState([
        { id: 0, item: "Development" },
        { id: 1, item:  "Design" },
        { id: 2, item: "Research" },
        { id: 3, item:  "Marketing" },
        { id: 4, item: "Consulting" },
        { id: 5, item: "Other" }
    ]);
    const [priorities] = useState([
        { id: 0, item: "High" },
        { id: 1, item:  "Medium" },
        { id: 2, item: "Low" },
    ]);
    const [tags] = useState([
        { id: 0, item: "Urgent", category: "Project Status" },
        { id: 1, item: "High Priority", category: "Project Status"},
        { id: 2, item: "Medium Priority", category: "Project Status"},
        { id: 3, item: "Low Priority", category: "Project Status" },
        { id: 4, item: "On Hold", category: "Project Status" },
        { id: 5, item: "Delayed", category: "Project Status"},
        { id: 6, item: "Completed", category: "Project Status" },
        { id: 7, item: "In Progress", category: "Project Status"},
        { id: 8, item: "Pending", category: "Project Status"},

        { id: 9, item: "Q1", category: "Time / Date Related" },
        { id: 10, item: "Q2", category: "Time / Date Related" },
        { id: 11, item: "Q3", category: "Time / Date Related" },
        { id: 12, item: "Q4", category: "Time / Date Related" },
        { id: 13, item: "This Week", category: "Time / Date Related" },
        { id: 14, item: "Next Week", category: "Time / Date Related" },
        { id: 15, item: "This Month", category: "Time / Date Related" },
        { id: 16, item: "Next Month", category: "Time / Date Related" },
        { id: 17, item: "Overdue", category: "Time / Date Related" },

        { id: 18, item: "Redesign", category: "Project Focus" },
        { id: 19, item: "New Feature", category: "Project Focus" },
        { id: 20, item: "Bug Fix", category: "Project Focus" },
        { id: 21, item: "Testing", category: "Project Focus" },
        { id: 22, item: "Prototype", category: "Project Focus" },
        { id: 23, item: "MVP (Minimum Viable Product)", category: "Project Focus" },
        { id: 24, item: "Launch", category: "Project Focus" },
        { id: 25, item: "Performance Improvement", category: "Project Focus" },
        { id: 26, item: "UX/UI Overhaul", category: "Project Focus" },
        { id: 27, item: "Customer Feedback", category: "Project Focus" },

        { id: 28, item: "Marketing", category: "Department or Team" },
        { id: 29, item: "Development", category: "Department or Team" },
        { id: 30, item: "Design", category: "Department or Team" },
        { id: 31, item: "Sales", category: "Department or Team" },
        { id: 32, item: "Operations", category: "Department or Team" },
        { id: 33, item: "Support", category: "Department or Team" },
        { id: 34, item: "R&D (Research and Development)", category: "Department or Team" },
        { id: 35, item: "Finance", category: "Department or Team" },
        { id: 36, item: "HR", category: "Department or Team" },

        { id: 37, item: "Prototype", category: "Scope or Deliverables" },
        { id: 38, item: "Final Version", category: "Scope or Deliverables" },
        { id: 39, item: "Beta", category: "Scope or Deliverables" },
        { id: 40, item: "First Draft", category: "Scope or Deliverables" },
        { id: 41, item: "Final Draft", category: "Scope or Deliverables" },
        { id: 42, item: "Client Review", category: "Scope or Deliverables" },
        { id: 43, item: "Internal Use", category: "Scope or Deliverables" },
        { id: 44, item: "External Use", category: "Scope or Deliverables" },
        { id: 45, item: "Complete Deliverable", category: "Scope or Deliverables" },

        { id: 46, item: "Web Development", category: "Product or Industry Focus" },
        { id: 47, item: "App Development", category: "Product or Industry Focus" },
        { id: 48, item: "Software", category: "Product or Industry Focus" },
        { id: 49, item: "Mobile-First", category: "Product or Industry Focus" },
        { id: 50, item: "SEO", category: "Product or Industry Focus" },
        { id: 51, item: "E-commerce", category: "Product or Industry Focus" },
        { id: 52, item: "SaaS", category: "Product or Industry Focus" },
        { id: 53, item: "Enterprise Solution", category: "Product or Industry Focus" },
        { id: 54, item: "B2B", category: "Product or Industry Focus" },
        { id: 55, item: "B2C", category: "Product or Industry Focus" },

        { id: 56, item: "Customer-Facing", category: "Client/External Tags" },
        { id: 57, item: "Internal Project", category: "Client/External Tags" },
        { id: 58, item: "Client X", category: "Client/External Tags" },
        { id: 59, item: "Partner Collaboration", category: "Client/External Tags" },
        { id: 60, item: "Outsourcing", category: "Client/External Tags" },
        { id: 61, item: "New Business", category: "Client/External Tags" },
        { id: 62, item: "Retention", category: "Client/External Tags" },
        { id: 63, item: "Prospects", category: "Client/External Tags" },

        { id: 64, item: "Planning", category: "Stage / Progress" },
        { id: 65, item: "Design", category: "Stage / Progress" },
        { id: 66, item: "Development", category: "Stage / Progress" },
        { id: 67, item: "Testing", category: "Stage / Progress" },
        { id: 68, item: "Launch", category: "Stage / Progress" },
        { id: 69, item: "Post-Launch", category: "Stage / Progress" },
        { id: 70, item: "Maintenance", category: "Stage / Progress" },

        { id: 71, item: "Beta", category: "Miscellaneous" },
        { id: 72, item: "Compliance", category: "Miscellaneous" },
        { id: 73, item: "Innovation", category: "Miscellaneous" },
        { id: 74, item: "Experimental", category: "Miscellaneous" },
        { id: 75, item: "External Dependencies", category: "Miscellaneous" },
        { id: 76, item: "Internal Tools", category: "Miscellaneous" },
        { id: 77, item: "Resource Heavy", category: "Miscellaneous" },
        { id: 78, item: "Cross-Team", category: "Miscellaneous" },
    ]);

    const addSelectedTags = (e: React.MouseEvent | ChangeEvent, id: number) => {
        if (e && (e as React.MouseEvent).stopPropagation) {
            (e as React.MouseEvent).stopPropagation(); // Only call stopPropagation for MouseEvent
        }
        setSelectedTags((prev) => {
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

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const projectTypeS = projectTypes.find((type) => type.id === projectType);
        if(!projectTypeS) return;
        const projectTypeString = projectTypeS.item;
        const projectPriorityS = priorities.find((prio) => prio.id === priority);
        if(!projectPriorityS) return;
        const projectPriorityString = projectPriorityS.item; 
        
        let tagsString: string[] = [];
        selectedTags.forEach((tag) => tagsString.push(tags.find((t) => t.id === tag)?.item || ''));
        const { error } = await newProjectForm(projectTitle, startDate, endDate, projectDescription, client, projectTypeString, projectPriorityString, projectMembers, tagsString);

        if (error) {
            alert(error);
        } else {
            router.push(`/projects`);
        }
    }

    useEffect(() => {
        const handleClick= (e: MouseEvent) => {
            handleClickOutside(e, selectTagsCont, setAddTag);
            handleClickOutside(e, addMemberCont, setAddMemberBtn);
            handleClickOutside(e, projectTypeDropdownRef, setProjectTypeDropdown);
            handleClickOutside(e, priorityDropdownRef, setPriorityDropdown);
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);
    return (
        <form onSubmit={submitForm} className="bg-white rounded-lg border border-gray-200 pt-4 px-4">
            <p className="text-md font-medium text-black mb-4">Basic Information</p>
            {/* BASIC INFO */}
            <div className="flex gap-4">
                <div className="flex flex-col gap-4 w-1/2">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Title of the Project</label>
                        <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                    </div>
                    <div className="flex gap-2 w-full">
                        <div className="flex flex-1 flex-col gap-2">
                            <label className="text-gray-600 text-[13px]">Est. Start Date</label>
                            <input type="date"  value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <label className="text-gray-600 text-[13px]">Est. End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <label className="text-gray-600 text-[13px]">Description</label>
                    <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}  className="h-full border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                </div>
            </div>
            {/* PEOPLE */}
            <p className="text-md font-medium text-black mt-6 mb-4">Stakeholders/People</p>
            <div className="flex gap-4">
                <div className="flex flex-col gap-4 w-1/2">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Client</label>
                        <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-1/2">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Project Members</label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {
                                projectMembers && projectMembers.map((member, index) => (
                                    <p key={index} className="text-[13px] font-semibold text-gray-600 px-3 py-2 border border-gray-200 rounded-lg relative group">
                                        {member.name}
                                        <X size={20} color="white" 
                                        onClick={() => setProjectMembers(projectMembers.filter((_, i) => i !== index))}
                                        className="absolute top-[-10px] right-[-10px] cursor-pointer p-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                                    </p>
                                ))
                            }
                            <div className="rounded-2xl text-white bg-[#3B82F6] cursor-pointer flex gap-2 px-3 py-2 w-max" onClick={() => setAddMemberBtn(!addMemberBtn)}>
                                <UserRoundPlus size={16} />
                                <p className="text-[12px] font-medium">Add Member</p>
                                {
                                    addMemberBtn && (
                                        <AddUser setAddMemberBtn={setAddMemberBtn} selectedMembers={projectMembers} setSelectedMembers={setProjectMembers} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* CLASSIFICATION AND TAGS */}
            <p className="text-md font-medium text-black mt-6 mb-4">Classification & Tags</p>
            <div className="flex flex-wrap justify-evenly gap-5">
                <div className="flex-1">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Project Type</label>
                        <Dropdown ref={projectTypeDropdownRef} btnOpen={projectTypeDropdown} setBtnOpen={setProjectTypeDropdown} items={projectTypes} setItem={setProjectType} selectedItem={projectType}  />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Priority</label>
                        <Dropdown ref={priorityDropdownRef} btnOpen={priorityDropdown} setBtnOpen={setPriorityDropdown} items={priorities} setItem={setPriority} selectedItem={priority}  />
                    </div>
                </div>
                <div className="flex-1"></div>
            </div>
            <p className="text-gray-600 text-[13px] my-3">Tags</p>
            <div className="flex flex-wrap gap-4">
                <div 
                    onClick={() => setAddTag(!addTag)} 
                    className="cursor-pointer bg-gray-100 text-black flex gap-2 text-[13px] items-center px-2 py-1 rounded-lg relative">
                    <Plus size={16} />
                    Add tag
                    {
                        addTag && (
                            <div className="absolute bottom-8 bg-white flex flex-col border border-gray-200 rounded-lg w-72 h-60 px-3 py-2" ref={selectTagsCont}>
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
                                                    checked={selectedTags.includes(tag.id)}
                                                    onClick={(e) => addSelectedTags(e, tag.id)}
                                                    onChange={(e) => addSelectedTags(e, tag.id)}
                                                    id={tag.item} 
                                                    className="mr-2" />
                                                <p>{tag.item}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    selectedTags.map((tag, index) => (
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-[13px] flex items-center gap-2" key={index}>
                            {tags.find(t => t.id === tag)?.item}
                            <X size={16} className="cursor-pointer"
                                onClick={() => setSelectedTags(selectedTags.filter((_, i) => i !== index))} />
                        </div>
                    ))
                }
            </div>
            <div className="mt-4 border-t border-gray-200 -mx-4 p-4  justify-end flex text-sm">
                <Link href="/projects" type="button" className="cursor-pointer bg-white text-gray-600 border border-gray-400 px-6 py-2 rounded-lg mr-4">Cancel</Link>
                <button type="submit" className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg">Submit</button>
            </div>
        </form>
    );
}