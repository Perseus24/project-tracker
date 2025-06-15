'use client';

import { Project } from "@/lib/interface";
import { fetchSpecificProject } from "@/lib/supabase/client";
import clsx from "clsx";
import { Ellipsis, Tags } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectDetails () {
    const params = useParams();
    const projectId = Number(params.id);
    const [projectDetails, setProjectDetails] = useState<Project | null>(null);
    useEffect(() => {
        const fetchProjectDetails = async () => {
            const data = await fetchSpecificProject(projectId, false);
            if (!data) return;
            setProjectDetails(data);
        }

        fetchProjectDetails();
    }, [projectId])

    const formatDate = (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        return formattedDate;
    }
    if (!projectDetails) return null;

    return (
        <div className="bg-white w-full h-auto border border-gray-200 flex rounded-lg">
            <section className="flex flex-col gap-3 w-2/3 p-5 text-xs text-gray-700">
                <Image src='/images/project-background-default.png' alt="project image" width={900} height={300} className="w-full h-[200px] object-cover rounded-lg "/>
                <p className="text-xl font-semibold">{projectDetails.project_title}</p>
                <div className="flex items-center gap-4">
                    <p className={
                        clsx(
                            'font-medium px-2 py-1 rounded-sm  text-white',
                            projectDetails.project_type === 'Development' && 'bg-blue-500',
                            projectDetails.project_type === 'Design' && 'bg-pink-500',
                        )
                    }>{projectDetails.project_type}</p>
                    <div className="flex items-center gap-5 font-medium">
                        <p>Members: </p>
                        {
                            projectDetails.project_members && projectDetails.project_members.map((member: any, index) => (
                                <div key={index} className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2">
                                    <Image src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} />
                                </div>
                            ))
                        }
                    </div>
                    
                </div>
                <div className="flex flex-col pt-6 border-t-2 border-gray-200 text-xs text-gray-700">
                    <p className="text-base font-medium">Latest Updates</p>
                </div>
            </section>
            {/* Project Details page */}
            <section className="flex flex-col w-1/3 border-l border-gray-200 p-5 text-gray-700">
                <div className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4 text-xs">
                    <div className="flex justify-between items-center text-base my-1">
                        <p className="font-semibold">{projectDetails.project_title}</p>
                        <Ellipsis size={16} />
                    </div>
                    <p className="flex justify-between text-xs ">Created on: <span  className="font-medium">{formatDate(projectDetails.created_at)}</span></p>
                    <p className="flex justify-between text-xs">Created by: <span  className="font-medium">{projectDetails.created_by_user.name}</span></p>
                    <p className="flex justify-between text-xs">Start date: <span  className="font-medium">{formatDate(projectDetails.project_start_date)}</span></p>
                    <p className="flex justify-between text-xs">End date: <span  className="font-medium">{formatDate(projectDetails.project_end_date)}</span></p>
                    <p className="flex justify-between text-xs">Client: <span  className="font-medium">{projectDetails.client}</span></p>
                    <p className="flex justify-between text-xs">Project status: <span  className="font-medium">{projectDetails.project_status}</span></p>
                    <div className="flex justify-between text-xs">Priority: 
                        <div className={clsx(
                            "font-medium flex items-center",
                            projectDetails.project_priority === 'High' && 'text-red-500',
                            projectDetails.project_priority === 'Medium' && 'text-yellow-500',
                            projectDetails.project_priority === 'Low' && 'text-green-500',
                        )}>
                            <div className={clsx(
                                'h-2 w-2 rounded-full mr-1',
                                projectDetails.project_priority === 'High' && 'bg-red-500',
                                projectDetails.project_priority === 'Medium' && 'bg-yellow-500',
                                projectDetails.project_priority === 'Low' && 'bg-green-500',
                            )}></div>
                            {projectDetails.project_priority}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4 my-3 text-xs">
                    <p className="font-semibold">Project Description</p>
                    <p>
                        {
                            projectDetails.project_description ? (
                                projectDetails.project_description
                            ) : 'No description provided'
                        }
                    </p>
                </div>
                <div className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4 text-xs">
                    <div className="font-semibold flex items-center gap-1">
                        <Tags size={16} />
                        Tags
                    </div>
                    <div className="flex flex-wrap">
                        {
                            projectDetails.project_tags.length != 0 ? (
                                projectDetails.project_tags.map((tag: any, index: number) => (
                                    <p key={index} className="font-medium px-2 py-1 rounded-sm bg-gray-100 m-1.5">{tag.tag_text}</p>
                                ))
                            ) 
                            : (
                                <p>No tags provided</p>
                            )
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}