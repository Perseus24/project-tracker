'use client';

import Dropdown from "@/components/Dropdown";
import MultiInputField from "@/components/Forms/MultiInputField";
import { Users } from "@/lib/interface";
import {  UserRoundPlus, X } from "lucide-react";
import { useState } from "react";

export default function CreateNewProject() {
    const [addMemberBtn, setAddMemberBtn] = useState(false);
    const [projectMembers, setProjectMembers] = useState<Users[]>([]);
    const [projectType, setProjectType] = useState(-1);
    const [priority, setPriority] = useState(-1);
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
    return (
        <form className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-md font-medium text-black mb-4">Basic Information</p>
            {/* BASIC INFO */}
            <div className="flex gap-4">
                <div className="flex flex-col gap-4 w-1/2">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Title of the Project</label>
                        <input type="text" className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                    </div>
                    <div className="flex gap-2 w-full">
                        <div className="flex flex-1 flex-col gap-2">
                            <label className="text-gray-600 text-[13px]">Est. Start Date</label>
                            <input type="date" className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <label className="text-gray-600 text-[13px]">Est. End Date</label>
                            <input type="date" className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <label className="text-gray-600 text-[13px]">Description</label>
                    <textarea  className="h-full border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
                </div>
            </div>
            {/* PEOPLE */}
            <p className="text-md font-medium text-black mt-6 mb-4">Stakeholders/People</p>
            <div className="flex gap-4">
                <div className="flex flex-col gap-4 w-1/2">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Client</label>
                        <input type="text" className="border border-gray-200 rounded-lg p-2 focus:outline-blue-900 text-black text-[13px]" />
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
                            <button type="button" className="rounded-2xl text-white bg-[#3B82F6] cursor-pointer flex gap-2 px-3 py-2 w-max relative" onClick={() => setAddMemberBtn(!addMemberBtn)}>
                                <UserRoundPlus size={16} />
                                <p className="text-[11px] font-semibold">Add Member</p>
                                {
                                    addMemberBtn && <MultiInputField projectMembers={projectMembers} setProjectMembers={setProjectMembers} />
                                }
                            </button>
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
                        <Dropdown items={projectTypes} setItem={setProjectType} selectedItem={projectType}  />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600 text-[13px]">Project Type</label>
                        <Dropdown items={priorities} setItem={setPriority} selectedItem={priority}  />
                    </div>
                </div>
                <div className="flex-1"></div>
            </div>
        </form>
    );
}