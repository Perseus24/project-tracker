"use client"

import * as React from "react"
import {
    CircleDot,
    FolderKanban,
    LayoutDashboard,
    Projector,
    Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { getUser } from "@/lib/supabase/client"


let data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navItems : [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Projects",
            url: "#",
            icon: FolderKanban,
            items: [
                {
                    title: "Create new",
                    url: "/projects/create-new-project"
                },
                {
                    title: "List",
                    url: "/projects"
                },
                
            ]
        },
        {
            title: "Issues",
            url: "/issues",
            icon: CircleDot
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [userData, setUserData] = useState(data.user);
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (!user) return;
            setUserData({
                ...userData,
                name: user.name,
                email: user.email
            })
        }

        fetchUser();
    }, []);
    return (
        <Sidebar collapsible="icon" {...props} className="bg-blue-900" >
            <SidebarHeader className="bg-blue-900">
                <SidebarMenu>
                    <SidebarMenuItem >
                        <SidebarMenuButton size="lg" className="hover:bg-white/10" asChild>
                            <a href="/dashboard">
                                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-white">
                                    <Projector className="size-4" color="black"  />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none text-white">
                                    <span className="font-medium">ProjectTrackr</span>
                                    <span className="text-xs">beta</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="bg-blue-900 text-white overflow-x-hidden">
                <NavMain items={data.navItems} />
            </SidebarContent>
            <SidebarFooter className="bg-blue-900 ">
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
