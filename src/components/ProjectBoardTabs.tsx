'use client';

import { List, Plus, SquareKanban, Table2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useProject } from "@/context/ProjectContext";
import clsx from "clsx";
import { act, useEffect } from "react";
import CreateNewTaskSheet from "./CreateNewTaskSheet";

const ProjectBoardTabs = () => {
    const { activeBoardTab, setActiveBoardTab } = useProject();
    const currentActiveTab = 1;
    const items = [
        {
            id: 1,
            item: 'Board',
            icon: SquareKanban
        },
        {
            id: 2,
            item: 'List',
            icon: List
        },
        {
            id: 3,
            item: 'Table',
            icon: Table2
        },
    ]

    useEffect(() => {
        if (currentActiveTab !== activeBoardTab) {
            setActiveBoardTab(currentActiveTab);  
        }
    }, [currentActiveTab, activeBoardTab, setActiveBoardTab]);

    console.log("activeBoardTab", activeBoardTab);
    return (
        <div className="flex gap-2 items-center text-xs">
            <div className="flex gap-1">
                {
                    items.map((item) => (
                        <div key={item.id} className={clsx(
                            "flex items-center gap-1 px-2 py-1 rounded-md  hover:bg-gray-50 cursor-pointer",
                            activeBoardTab === item.id && "text-blue-500 border border-blue-500"
                        )}>
                            <item.icon size={16} />
                            <p>{item.item}</p>
                        </div>
                    ))
                }
                <div className="w-0.5 bg-gray-200 mx-4"></div>
                <CreateNewTaskSheet sheetTrigger={
                    <div className="text-xs flex items-center gap-1 px-2 py-1 hover:bg-gray-50 cursor-pointer rounded-md">
                        <Plus size={16} className="text-inherit" />
                        <p>New Task</p>
                    </div>
                }
                />
            </div>
        </div>
    )
}

export default ProjectBoardTabs;