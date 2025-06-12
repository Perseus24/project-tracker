'use client';
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Dropdown from "./Dropdown";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { autocompleteUsersSearch, modifyProjectMembers} from "@/lib/supabase/client";
import React from "react";
import clsx from "clsx";

interface Props {
    setAddMemberBtn: React.Dispatch<React.SetStateAction<boolean>>,
    selectedMembers: any[],
    setSelectedMembers: React.Dispatch<React.SetStateAction<any[]>>,
    projectId?: number
}
const AddUser:React.FC<Props> = ({setAddMemberBtn, selectedMembers, setSelectedMembers, projectId}) => {
    console.log("Add user projectId ", projectId);
    const roles = useMemo(() => [
        { id: 0, item: "Developer" },
        { id: 1, item: "Project Manager" },
        { id: 2, item: "Viewer" },
    ], []);
    // const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [searchUser, setSearchUser] = useState('');
    const [searchUserList, setSearchUserList] = useState<any[]>([]);
    const selectRoleBtnRefs = useRef<{ [userId: string]: React.RefObject<HTMLDivElement | null> }>({});

    const [selectRoleDropdown, setSelectRoleDropdown] = useState<{ [userId: string]: boolean }>({});

    const handleSelectedUser = (user: any) => {
        if(selectedMembers.some(member => member.id === user.id)) return;
        setSearchUser('');
        setSelectedMembers(prev => [...prev, {...user, role: 0}]);
    }

    // update roles for the selected users to be assigned
    const updateUserRole = (userId: string, newRoleId: SetStateAction<number>) => {
        setSelectedMembers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, role: newRoleId } : user
            )
        );
    };
    
    useEffect(() => {
        // Initialize refs for each selected member
        selectedMembers.forEach(user => {
            if (!selectRoleBtnRefs.current[user.id]) {
            selectRoleBtnRefs.current[user.id] = React.createRef<HTMLDivElement>();
            }
        });

        // Initialize dropdown open state for each user if missing
        setSelectRoleDropdown(prev => {
            const newState = { ...prev };
            selectedMembers.forEach(user => {
            if (newState[user.id] === undefined) {
                newState[user.id] = false;
            }
            });
            return newState;
        });
    }, [selectedMembers]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            selectedMembers.forEach(user => {
            const ref = selectRoleBtnRefs.current[user.id];
            if (ref?.current && selectRoleDropdown[user.id]) {
                if (!ref.current.contains(e.target as Node)) {
                setSelectRoleDropdown(prev => ({
                    ...prev,
                    [user.id]: false,
                }));
                }
            }
            });
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [selectedMembers, selectRoleDropdown]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchUser) {
                setSearchUserList([]);
                return;
            }
            const { users, error } = await autocompleteUsersSearch(searchUser);
            if (!error) setSearchUserList(users || []);
        };

        const timeout = setTimeout(fetchUsers, 200);
        return () => clearTimeout(timeout);
    }, [searchUser]);

    const handleAssignMembers = async () => {
        // Function to add members from the projects page
        if(projectId){
            const {error} =await modifyProjectMembers(selectedMembers, projectId);
            if(!error){
                setAddMemberBtn(false);
            }
        }else {
            setAddMemberBtn(false);
        }
    }

    return (
        <div className="fixed top-0 right-0 w-full h-screen z-50" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gray-400/50 z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 max-h-3/4 min-h-min bg-white rounded-xl pt-6 z-50">
                <div className="flex justify-between items-center text-gray-800 border-b border-gray-200 pb-4 px-7 ">
                    <p className="text-md font-semibold">Add members</p>
                    <X onClick={()=> setAddMemberBtn(false)} />
                </div>
                <div className="flex flex-col justify-start items-start gap-2 px-7 py-8 text-gray-600">
                    <p className="font-semibold text-sm">Invite by email</p>
                    <div className="flex items-center gap-3 w-full text-[13px]">
                        <input 
                            type="text" 
                            value={searchUser} 
                            onChange={(e) => setSearchUser(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none " placeholder="Enter email address" />
                    </div>
                    <AnimatePresence>
                        {
                            searchUserList.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full border border-gray-300 rounded-lg overflow-hidden">
                                    {
                                        searchUserList.map((user, index) => (
                                            <p 
                                                key={index} 
                                                onClick={() => handleSelectedUser(user)}
                                                className="font-semibold hover:bg-gray-50 cursor-pointer p-3 text-[13px] flex items-center gap-4 overflow-ellipsis">
                                                    {user.name}
                                                    <span className="text-gray-400 text-[11px] font-light">{user.email}</span>
                                            </p>
                                        ))
                                    }
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </div>
                {
                    selectedMembers.length > 0 && (
                        <div className="flex flex-col justify-start items-start gap-2 px-7 py-3 text-gray-600 border-t border-gray-200">
                            {
                                selectedMembers.map((user, index) => (
                                    <div key={index} className="flex justify-between items-center w-full text-gray-600 text-[13px] my-3">
                                        <p className="font-semibold">{user.name}</p>
                                        <div  className="flex gap-3 items-center">
                                            <Dropdown
                                                ref={selectRoleBtnRefs.current[user.id]}
                                                btnOpen={!!selectRoleDropdown[user.id]}
                                                setBtnOpen={(open) =>
                                                    setSelectRoleDropdown((prev) => ({ ...prev, [user.id]: open }))
                                                }
                                                items={roles} 
                                                setItem={(roleId) => updateUserRole(user.id, roleId)} 
                                                selectedItem={user.role}  />
                                            <X className="cursor-pointer" onClick={() => setSelectedMembers(selectedMembers.filter((member) => member.id !== user.id))} size={17} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
                <div className="flex justify-end p-3 border-t border-gray-200">
                    <button type="button" disabled={selectedMembers.length === 0} className={clsx(
                        selectedMembers.length === 0 ? 'bg-[#3B82F6]/20 cursor-not-allowed' : 'cursor-pointer',
                        "bg-[#3B82F6] text-white rounded-lg px-4 py-2 text-[13px]"
                    )} onClick={() => handleAssignMembers()}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default AddUser;