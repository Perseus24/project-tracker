'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchSpecificProject } from "@/lib/supabase/client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

interface Props {
    title: string
}
const Topbar = () => {
    const pathname = usePathname();
    const params = useParams();
    const projectId = Number(params.id);
    const [projectTitle, setProjectTitle] = useState('');

    let linkNames = pathname.split('/').slice(1);
    let originalLinkNames = pathname.split('/').slice(1);
    console.log("original linkNames", originalLinkNames);

    if (linkNames.length > 0) {
        linkNames.forEach((link, index, arr) => {
            switch (link) {
                case 'create-new-project':
                    arr[index] = 'Create New Project';
                    break;
                case 'board':
                    arr[index] = 'Board';
                    break;
                case 'projects':
                    arr[index] = 'Projects';
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

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-gray-300 mb-3">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {
                            linkNames.map((link, index)=>(
                                <React.Fragment key={`item-${index}`}>
                                    <BreadcrumbItem >
                                        {
                                            index !== linkNames.length - 1 ? (
                                                <>
                                                    <BreadcrumbLink  href={`/${originalLinkNames.slice(0, index + 1).join('/')}`}>
                                                        {link}
                                                    </BreadcrumbLink>
                                                </>
                                            ) : (
                                                <BreadcrumbPage >{link}</BreadcrumbPage>
                                            )
                                        }
                                    </BreadcrumbItem>
                                    {
                                        index !== linkNames.length - 1 && (
                                            <BreadcrumbSeparator key={`separator-${index}`} className="hidden md:block" />
                                        )
                                    }
                                </React.Fragment>
                            ))
                        }
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}

export default Topbar;
