'use client';

import SidebarItems from "./SidebarItems";
import { CircleDot, CircleUserRound, LogOut, Settings } from "lucide-react";
import { signOutUser } from "@/lib/supabase/client";

const Sidebar = () => {

    const handleLogout = async () => {
        const error = await signOutUser();
        if (error) {
            console.error(error);
        }
        window.location.href = '/';
    }
    return (
        <div className="w-1/5 min-h-screen bg-blue-900 flex flex-col text-white py-5 px-3">
            <p className="text-xl pl-3 font-medium">ProjectTrackr</p>
            <div className="mt-5 flex flex-col gap-2">
                <p className="text-xs">NAVIGATION</p>
                <SidebarItems 
                    icon = {
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-[30px] fill-current" width="30" height="30"  viewBox="0 -0.5 25 25"><path  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.918 10H7.082A1.57 1.57 0 0 0 5.5 11.556v5.89A1.569 1.569 0 0 0 7.082 19h2.836a1.569 1.569 0 0 0 1.582-1.555v-5.889a1.569 1.569 0 0 0-1.582-1.555ZM9.918 4H7.082A1.54 1.54 0 0 0 5.5 5.495v1.014A1.54 1.54 0 0 0 7.082 8h2.836A1.54 1.54 0 0 0 11.5 6.508V5.494A1.54 1.54 0 0 0 9.918 4ZM15.082 13h2.835a1.57 1.57 0 0 0 1.583-1.555V5.557A1.569 1.569 0 0 0 17.918 4h-2.836A1.57 1.57 0 0 0 13.5 5.557v5.888A1.569 1.569 0 0 0 15.082 13ZM15.082 19h2.835a1.54 1.54 0 0 0 1.583-1.492v-1.014A1.54 1.54 0 0 0 17.918 15h-2.836a1.54 1.54 0 0 0-1.582 1.493v1.013A1.54 1.54 0 0 0 15.082 19Z" clipRule="evenodd"/></svg>
                    }
                    title = "Dashboard"
                    href = "/dashboard"
                />
                <SidebarItems 
                    icon = {
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[26px] w-[26px] fill-current"  width="30" height="30" fill="none" viewBox="0 0 24 24"><path  fillRule="evenodd" d="M5.4 2h13.2A3.4 3.4 0 0 1 22 5.4v13.2a3.4 3.4 0 0 1-3.4 3.4H5.4A3.4 3.4 0 0 1 2 18.6V5.4A3.4 3.4 0 0 1 5.4 2ZM7 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm6 1a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0V6Z" clipRule="evenodd"/></svg>
                    }
                    title = "Projects"
                    href = "/projects"
                />
                <SidebarItems 
                    icon = {
                        <CircleDot className="text-inherit" size={26} />
                    }
                    title = "My Issues"
                    href = "/my-issues"
                />
                <SidebarItems 
                    icon = {
                        <Settings className="text-inherit" size={28}/>
                    }
                    title = "Settings"
                    href = "/settings"
                />
                <SidebarItems 
                    icon = {
                        <CircleUserRound className="text-inherit" size={26}/>
                    }
                    title = "Account"
                    href = "/account"
                />
                <div className="cursor-pointer flex gap-3 text-sm items-center rounded-lg p-1 hover:bg-white/40 hover:text-white text-white/80" onClick={handleLogout}>
                    <LogOut className="text-inherit" size={24}/>
                    <p>Log Out</p>
                </div>
            </div>
            <p className="text-xs text-white mt-auto">Developed by Cy Jay Herrera.</p>
        </div>
    )
}

export default Sidebar;
// return (
//         <div className="w-1/5 bg-[#FFFFFF] flex flex-col text-[#111827] py-5 px-3">
//             <p className="text-xl font-medium">ProjectTracker</p>
//             <div className="mt-5 flex flex-col gap-2">
//                 <p className="text-xs text-gray-400">NAVIGATION</p>
//                 <SidebarItems 
//                     icon = {
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-[30px] fill-current" width="30" height="30"  viewBox="0 -0.5 25 25"><path  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.918 10H7.082A1.57 1.57 0 0 0 5.5 11.556v5.89A1.569 1.569 0 0 0 7.082 19h2.836a1.569 1.569 0 0 0 1.582-1.555v-5.889a1.569 1.569 0 0 0-1.582-1.555ZM9.918 4H7.082A1.54 1.54 0 0 0 5.5 5.495v1.014A1.54 1.54 0 0 0 7.082 8h2.836A1.54 1.54 0 0 0 11.5 6.508V5.494A1.54 1.54 0 0 0 9.918 4ZM15.082 13h2.835a1.57 1.57 0 0 0 1.583-1.555V5.557A1.569 1.569 0 0 0 17.918 4h-2.836A1.57 1.57 0 0 0 13.5 5.557v5.888A1.569 1.569 0 0 0 15.082 13ZM15.082 19h2.835a1.54 1.54 0 0 0 1.583-1.492v-1.014A1.54 1.54 0 0 0 17.918 15h-2.836a1.54 1.54 0 0 0-1.582 1.493v1.013A1.54 1.54 0 0 0 15.082 19Z" clipRule="evenodd"/></svg>
//                     }
//                     title = "Dashboard"
//                     href = "/dashboard"
//                 />
//                 <SidebarItems 
//                     icon = {
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-[30px] fill-current"  width="30" height="30" fill="none" viewBox="0 0 24 24"><path  fillRule="evenodd" d="M5.4 2h13.2A3.4 3.4 0 0 1 22 5.4v13.2a3.4 3.4 0 0 1-3.4 3.4H5.4A3.4 3.4 0 0 1 2 18.6V5.4A3.4 3.4 0 0 1 5.4 2ZM7 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm6 1a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0V6Z" clipRule="evenodd"/></svg>
//                     }
//                     title = "Projects"
//                     href = "/projects"
//                 />
//                 <SidebarItems 
//                     icon = {
//                         <CircleDot className="text-inherit" size={28} />
//                     }
//                     title = "My Issues"
//                     href = "/my-issues"
//                 />
//                 <SidebarItems 
//                     icon = {
//                         <Settings className="text-inherit" size={28}/>
//                     }
//                     title = "Settings"
//                     href = "/settings"
//                 />
//                 <SidebarItems 
//                     icon = {
//                         <CircleUserRound className="text-inherit" size={28}/>
//                     }
//                     title = "Account"
//                     href = "/account"
//                 />
//                 <SidebarItems 
//                     icon = {
//                         <LogOut className="text-inherit" size={26}/>
//                     }
//                     title = "Log Out"
//                     href = "/log-out"
//                 />
//             </div>
//         </div>
//     )