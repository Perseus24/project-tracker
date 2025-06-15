'use client';
import {  fetchSpecificProject, getUserProjects } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, DiamondPlus, Ellipsis, FolderClosed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useParams } from 'next/navigation';

const ProjectNav = () => {
    const pathname = usePathname();
    const params = useParams();
    const projectId = Number(params.id);
    const [projectTotal, setProjectTotal] = useState(0);
    const [projectTitle, setProjectTitle] = useState('');
    
    const bottomNavigationLinks = useMemo(() => {
        if (!projectId) return [];
        return [
            { id: 0, item: "Details", active: true, href: `/projects/${projectId}` },
            { id: 1, item: "Board", active: false, href: `/projects/${projectId}/board` },
            { id: 2, item: "Messages", active: false, href: `/projects/${projectId}/messages` },
            { id: 3, item: "Files", active: false, href: `/projects/${projectId}/files` },
            { id: 4, item: "Timeline", active: false, href: `/projects/${projectId}/timeline` },
        ];
        }, [projectId]);

    let linkNames = pathname.split('/').slice(2);
    if (linkNames.length > 0) {
        linkNames.forEach((link, index, arr) => {
            bottomNavigationLinks.forEach((link) => link.active = false);
            switch (link) {
                case 'create-new-project':
                    arr[index] = 'Create New Project';
                    break;
                case 'board':
                    arr[index] = 'Board';
                    bottomNavigationLinks[1].active = true;
                    break;
                default:
                    arr[index] = projectTitle;
                    bottomNavigationLinks[0].active = true;
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
                <p>Projects</p>
                <div className="flex">
                    {
                        linkNames.length > 0 && (
                            linkNames.map((link, index)=>(
                                <p key={index} >
                                    <span className="text-gray-400 text-[10px] mx-2">/</span>
                                    {link}
                                </p>
                            ))
                        )
                    }
                </div>
                <div className="flex gap-3 ml-auto items-center">
                    <Link href="/projects/create-new-project" className="cursor-pointer bg-[#3B82F6] text-xs text-white rounded-lg py-2 px-3 ml-auto flex items-center gap-2">
                        <DiamondPlus size={16} />
                        Start a new project</Link>
                    <Ellipsis size="20" color="gray" className="ml-auto" />
                </div>
            </div>
            {
                projectId ? (
                    <div className="flex items-center gap-2 border-t-2 border-t-gray-200 text-xs text-gray-500 font-medium py-3 pl-5">
                        {
                            bottomNavigationLinks.map((link) => (
                                <Link key={link.id} href={link.href} className={`flex gap-1 ${link.active ? 'text-[#3B82F6] font-semibold' : ''} px-2 py-1 hover:bg-gray-100 rounded-md`}>
                                    <p>{link.item}</p>
                                </Link>
                            ))
                        }
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