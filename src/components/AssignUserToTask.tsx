'use client';

import { Check, Search } from "lucide-react"
import { JSX, useEffect, useState } from "react";
import { getProjectMembers } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Member {
    email: string;
    id: string;
    name: string;
    role: number;
    table_id: number;
}

interface Props {
    triggerButton: JSX.Element; 
    assignedMembers: any[];
    setAssignedMembers: React.Dispatch<React.SetStateAction<Member[]>>
}

const AssignUserToTask:React.FC<Props> = ({triggerButton, assignedMembers, setAssignedMembers}) => {
    const [projectMembers, setProjectMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const params = useParams();
    const projectId = Number(params.id);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const {members, error} = await getProjectMembers(projectId);
            if(error || !members) {
                console.error(error);
            } else {
                const formattedMembers: Member[] = members.map((member: any) => ({
                    id: member.id || '',           // Default empty string if missing
                    name: member.name || 'Unknown', // Default value if missing
                    email: member.email || '',     // Default empty string if missing
                    role: member.role || 0,        // Default to 0 if missing or incorrect
                    table_id: member.table_id || 0, // Default to 0 if missing or incorrect
                }));
                setProjectMembers(formattedMembers);
            }
        }
        fetchUsers();
    }, [projectId])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Filter items based on name
    const filteredItems = projectMembers.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <Popover>
            <PopoverTrigger asChild>
                {triggerButton}
            </PopoverTrigger>
            <PopoverContent align="end" side="left" className="text-xs w-96 p-0 gap-0">
                <div className="p-4.5 border-b border-gray-300 ">
                    <p className="text-base font-medium">Assign User</p>
                    <p className="text-[13px]">
                        Assign users from your team to this task.
                    </p>
                </div>
                <div className="px-4.5 flex py-2.5 border-b border-gray-300">
                    <Search size={18} color="gray" />
                    <input autoFocus 
                        className="ml-2.5 focus:outline-none text-[13px]" 
                        placeholder="Search for users..." 
                        onChange={handleSearchChange}/>
                </div>
                <div className="flex flex-col px-2 py-1 gap-0.5">
                    {
                        filteredItems.length > 0 ? (
                            filteredItems.map((member) => (
                                <div 
                                    key={member.id} 
                                    className={clsx(    
                                        "px-1.5 py-1 flex gap-4 items-center hover:bg-gray-100 rounded-md cursor-pointer",
                                        assignedMembers.includes(member.id) && "opacity-50"
                                    )}
                                    onClick={() => {
                                        if(assignedMembers.includes(member.id)) {
                                            setAssignedMembers(assignedMembers.filter((id) => id !== member.id));
                                        } else {
                                            setAssignedMembers([...assignedMembers, member.id]);
                                        }
                                    }}
                                    >
                                    <Image src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} className="rounded-full h-7 w-7" />
                                    <div className="flex flex-col">
                                        <p className="text-sm">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                    {
                                        assignedMembers.includes(member.id) && (
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
                
                <div className="border-t border-gray-300 p-4 flex justify-between items-center">
                    <p className="text-[13px] text-gray-500">{
                        assignedMembers.length === 0 ? 'No' : (
                            <span className="font-semibold">{assignedMembers.length}</span>
                        )
                        } users assigned.</p>

                    
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default AssignUserToTask;
