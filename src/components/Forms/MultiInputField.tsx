

'use client';

import { getUsers } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Users } from "@/lib/interface";
import { Loader } from "lucide-react";

interface Props {
    projectMembers: Users[],
    setProjectMembers: React.Dispatch<React.SetStateAction<Users[]>>,
    ref: React.RefObject<HTMLDivElement | null>
}
const MultiInputField:React.FC<Props> = ({projectMembers, setProjectMembers, ref}) => {
    const [usersData, setUsersData] = useState<Users[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const {users, error} = await getUsers();
            if(error || !users) {
                console.error(error);
            } else {
                setUsersData(users);
            }
        }

        fetchUsers();
    }, [])

    const addProjectMember = (user: Users) => {
        if(projectMembers.some(member => member.id === user.id)) return;
        setProjectMembers(prev => [...prev, user])
    }
    return (
        <div ref={ref} className="absolute right-35 bottom-0 flex flex-col bg-white text-black py-2 border border-gray-200 rounded-lg text-[13px] w-max">
            {
                usersData.length > 0 ? (
                    usersData.map((user) => (
                        <p 
                            key={user.id}
                            className="text-start cursor-pointer hover:bg-blue-500 hover:text-white py-1 px-2"
                            onClick={() => addProjectMember(user)}
                        >{user.name}</p>
                    ))
                ) : (
                    <Loader className="mx-2" color="blue" />
                )
            }
        </div>
    )
}

export default MultiInputField;