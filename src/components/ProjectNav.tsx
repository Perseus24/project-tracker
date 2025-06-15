'use client';
import {  fetchSpecificProject, getUserProjects } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, DiamondPlus, Ellipsis, FolderClosed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

const ProjectNav = () => {
    const pathname = usePathname();
    const params = useParams();
    const projectId = Number(params.id);
    const [projectTotal, setProjectTotal] = useState(0);
    const [projectTitle, setProjectTitle] = useState('');

    let linkNames = pathname.split('/').slice(2);
    if (linkNames.length > 0) {
        linkNames.forEach((link, index, arr) => {
            switch (link) {
                case 'create-new-project':
                    arr[index] = 'Create New Project';
                    break;
                default:
                    arr[index] = projectTitle;
                    break;
            }
        })
    }

    useEffect(() => {
        const fetchTitle = async () => {
            setProjectTitle('');
            if (!isNaN(projectId)) {
                const title = await fetchSpecificProject(projectId, true);
                if (!title) return;
                setProjectTitle(title.project_title);
            }
        };

        fetchTitle();
    }, [projectId]);

    useEffect(() => {
        const getProjects = async () => {
            const { projects, error} = await getUserProjects();
            if (error) {
                setProjectTotal(0);
            } else {
                setProjectTotal(projects?.length ?? 0);
            }
        }
        
        getProjects();
    }, [])

    return (
        <div className="flex flex-col bg-white rounded-lg border border-gray-200">
            <div className="flex gap-3 items-center text-gray-500 text-[14px] py-3 px-4">
                <div className="flex gap-2 items-center pr-2 border-r border-gray-200">
                    <ChevronLeft size="20" color="black" />
                    <ChevronRight size="20" color="gray" />
                </div>
                <FolderClosed size={18} />
                <p>Projects <span className="text-gray-400 text-[10px]"> /</span></p>
                {
                    linkNames.length > 0 && (
                        linkNames.map((link, index)=>(
                            <span key={index} >
                                {link}
                            </span>
                        ))
                    )
                }
                <div className="flex gap-3 ml-auto items-center">
                    <Link href="/projects/create-new-project" className="cursor-pointer bg-[#3B82F6] text-xs text-white rounded-lg py-2 px-3 ml-auto flex items-center gap-2">
                        <DiamondPlus size={16} />
                        Start a new project</Link>
                    <Ellipsis size="20" color="gray" className="ml-auto" />
                </div>
            </div>
            {
                projectId ? (
                    <div className="flex items-center gap-2 border-t-2 border-t-gray-200 text-xs text-gray-500 font-medium py-4 ">
                        <div className="flex gap-1">
                            <p className="ml-5 text-[#3B82F6] font-semibold">Details</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="ml-5">Board</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="ml-5">Messages</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="ml-5">Files</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="ml-5">Timeline</p>
                        </div>
                        
                    </div>
                ) : (
                    <div className="flex text-sm py-3 px-4 border-t border-t-gray-200">
                        <p className="text-gray-400">{
                            projectTotal === 0 ? 'No projects yet' : `${projectTotal} projects`
                        }</p>
                    </div>
                )
            }
            
        </div>
    )
}

export default ProjectNav;