'use client';

import AddUser from "@/components/addUser";
import { getProjectMembers, getUserProjects } from "@/lib/supabase/client";
import { FolderOpen, UserRoundPlus, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {  useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"

export default function Projects() {
    const [projectList, setProjectList] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingProjectId, setEditingProjectId] = useState<number | null>(null); 

    useEffect(() => {
        const getProjects = async () => {
            const { projects, error} = await getUserProjects();
            if (error) {
                setProjectList([]);
            } else {
                setProjectList(projects ?? []);
                setLoading(false);
            }
        }
        getProjects();
    }, [])

    const fetchProjectMembers = async (projectId: number) => {
        const { members, error } = await getProjectMembers(projectId);
        if (error) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(members ?? []);
        }
    }
    
    const handleAssignProjectMembers = async (projectId: number) => {
        // setAddMemberBtn(!addMemberBtn);
        // fetchProjectMembers(projectId);
        if (editingProjectId === projectId) {
            // Close if clicking on the same project
            setEditingProjectId(null);
            setSelectedMembers([]);
        } else {
            // Open for new project
            setEditingProjectId(projectId);
            await fetchProjectMembers(projectId);
        }
    }

    const closeAddMember = () => {
        setEditingProjectId(null);
        setSelectedMembers([]);
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-[20px] w-2/5 rounded-xl bg-gray-200" />
                    <Skeleton className="h-[20px] w-1/5 rounded-xl bg-gray-200" />
                </div>
                <div className="flex gap-5">
                    <Skeleton className="h-[20px] w-1/5 rounded-xl bg-gray-200" />
                    <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                    <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-[20px] w-3/5 rounded-xl bg-gray-200" />
                    <Skeleton className="h-[20px] w-1/10 rounded-xl bg-gray-200" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {
                projectList && (
                    projectList.map((project) => (
                        <div key={project.id} className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg pt-5 pb-3">
                            <div className="flex justify-between items-center px-5">
                                <div className="flex gap-7 items-baseline">
                                    <p className="font-semibold text-gray-600">{project.project_title}</p>
                                    <p className="text-gray-400 text-[11px] font-medium">Last updated on: <span className="font-semibold">1st Sep 2024</span></p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <p className="text-xs text-yellow-500 font-medium">In Progress</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-center px-5">
                                <div className="flex gap-2">
                                    <Users size={16} color="gray" />
                                    <p className="text-[11px] font-semibold text-gray-600">Assigned to project</p>
                                </div>
                                <div className="flex items-center">
                                    {
                                        project.project_members && project.project_members.map((member: any) => (
                                            <div key={member.id} className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2">
                                                <Image src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="rounded-2xl text-white bg-[#3B82F6] cursor-pointer flex gap-2 px-3 py-2">
                                    <UserRoundPlus size={16} />
                                    <p className="text-[11px] font-semibold" onClick={() => handleAssignProjectMembers(project.id)}>Add Member</p>
                                    {
                                        editingProjectId === project.id && (
                                            <AddUser
                                                selectedMembers={selectedMembers}
                                                setSelectedMembers={setSelectedMembers}
                                                setAddMemberBtn={closeAddMember}
                                                projectId={project.id}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                            <div className="flex items-center gap-2 border-t-2 border-t-gray-200 pt-3 text-xs text-gray-500 font-medium">
                                <div className="flex gap-1">
                                    <p className="ml-5">Board</p>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex gap-1">
                                    <p className="ml-5">Messages</p>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex gap-1">
                                    <p className="ml-5">Files</p>
                                </div>
                                <div className="flex gap-1">
                                    <p className="ml-5">Timeline</p>
                                </div>
                                <Link href={`/projects/${project.id}`} className=" ml-auto flex items-center text-black px-3 py-2 mr-5 cursor-pointer gap-2 hover:bg-gray-100 rounded-lg ">
                                    <FolderOpen size={16} color="black" />
                                    Open
                                </Link>
                            </div>
                        </div>
                    ))
                )
                
            }
        </div>
    )
}



