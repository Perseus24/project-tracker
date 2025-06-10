'use client';
import { ChevronLeft, ChevronRight, DiamondPlus, Ellipsis, FolderClosed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ProjectNav = () => {
    const pathname = usePathname();
    let linkNames = pathname.split('/').slice(2);
    if (linkNames.length > 0) {
        linkNames.forEach((link, index, arr) => {
            switch (link) {
                case 'create-new-project':
                    arr[index] = 'Create New Project';
                    break;
                default:
                    'Default Case'
                    break;
            }
        })
    }

    return (
        <div className="flex flex-col bg-white rounded-lg border border-gray-200">
            <div className="flex gap-3 items-center text-gray-500 text-[14px] border-b py-3 px-4 border-b-gray-200">
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
            <div className="flex text-sm py-3 px-4">
                <p className="text-gray-400">No projects yet</p>
            </div>
        </div>
    )
}

export default ProjectNav;