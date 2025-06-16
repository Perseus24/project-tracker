'use client';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"
import { Check, CirclePlus, Search } from "lucide-react"
import { JSX, useEffect, useState } from "react";
import { getProjectMembers } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

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
        <Dialog>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] text-xs p-0 gap-0">
                <DialogHeader className="p-4.5 border-b border-gray-300 ">
                    <DialogTitle className="text-base">Assign User</DialogTitle>
                    <DialogDescription className="text-[13px]">
                        Assign users from your team to this task. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
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
                                            <Check key={member.id} size={18} color="gray" strokeWidth={2} className="ml-auto" />
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
                    {
                        assignedMembers.length > 0 ? (
                            <div className="flex pl-2 gap-3 w-full">
                                {
                                    assignedMembers.map((member)=>(
                                        <Image key={member.id} src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} className="rounded-full h-7 w-7 -mx-2.5" />
                                    ))
                                }
                            </div>
                        ) : (
                            <p className="text-[13px] text-gray-500">No users assigned.</p>
                        )
                    }
                    <div className="flex gap-2 ">
                        <DialogClose asChild>
                            <Button variant="outline" className="text-[13px]">Cancel</Button>
                        </DialogClose>
                        <Button type="button" 
                            className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[13px]" 
                            disabled = {assignedMembers.length == 0}
                            >Assign</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AssignUserToTask;
