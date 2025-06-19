'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ProjectContextType = {
    projectId: number | null;
    setProjectId: (id: number) => void;

    // active tab in the board page
    activeBoardTab: number | null;
    setActiveBoardTab: (id: number) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Create a provider component
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [projectId, setProjectId] = useState<number | null>(null);
    const [activeBoardTab, setActiveBoardTab] = useState<number | null>(null);

    return (
        <ProjectContext.Provider value={{ projectId, setProjectId, activeBoardTab, setActiveBoardTab}}>
            {children}
        </ProjectContext.Provider>
    );
};

// Create a custom hook for easy access to the context
export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
