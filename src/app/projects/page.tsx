'use client';

import { FolderOpen, UserRoundPlus, Users } from "lucide-react";
import Image from "next/image";

export default function Projects() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg pt-5 pb-3">
                <div className="flex justify-between items-center px-5">
                    <div className="flex gap-7 items-baseline">
                        <p className="font-semibold text-gray-600">SystemA Product Design</p>
                        <p className="text-gray-400 text-[11px] font-medium">Last updated on: <span className="font-semibold">1st Sep 2024</span></p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-xs text-yellow-500 font-medium">In Progress</p>
                    </div>
                </div>
                <div className="flex gap-5 items-center px-5">
                    <div className="flex gap-2">
                        <Users size={16} color="gray" />
                        <p className="text-[11px] font-semibold text-gray-600">Assigned to project</p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white">
                            <Image src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} />
                        </div>
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2">
                            <Image src="/images/profile-picture-2.jpg" alt="profile2" width={28} height={28} />
                        </div>
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2">
                            <Image src="/images/profile-picture-3.jpg" alt="profile3" width={28} height={28} />
                        </div>
                    </div>
                    <button className="rounded-2xl text-white bg-[#3B82F6] cursor-pointer flex gap-2 px-3 py-2">
                        <UserRoundPlus size={16} />
                        <p className="text-[11px] font-semibold">Add Member</p>
                    </button>
                </div>
                <div className="flex items-center gap-2 border-t-2 border-t-gray-200 pt-3 text-xs text-gray-500 font-medium">
                    <div className="flex gap-1">
                        <p className="ml-5">Board</p>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex gap-1">
                        <p className="ml-5">Messages</p>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex gap-1">
                        <p className="ml-5">Files</p>
                    </div>
                    <div className="flex gap-1">
                        <p className="ml-5">Timeline</p>
                    </div>
                    <button className=" ml-auto flex items-center text-black px-3 py-2 mr-5 cursor-pointer gap-2 hover:bg-gray-100 rounded-lg ">
                        <FolderOpen size={16} color="black" />
                        Open
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg pt-5 pb-3">
                <div className="flex justify-between items-center px-5">
                    <div className="flex gap-7 items-baseline">
                        <p className="font-semibold text-gray-600">Government Web Modernization</p>
                        <p className="text-gray-400 text-[11px] font-medium">Last updated on: <span className="font-semibold">1st June 2025</span></p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-xs text-yellow-500 font-medium">In Progress</p>
                    </div>
                </div>
                <div className="flex gap-5 items-center px-5">
                    <div className="flex gap-2">
                        <Users size={16} color="gray" />
                        <p className="text-[11px] font-semibold text-gray-600">Assigned to project</p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white">
                            <Image src="/images/profile-picture-1.jpg" alt="profile1" width={28} height={28} />
                        </div>
                        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white -ml-2">
                            <Image src="/images/profile-picture-3.jpg" alt="profile3" width={28} height={28} />
                        </div>
                    </div>
                    <button className="rounded-2xl text-white bg-[#3B82F6] cursor-pointer flex gap-2 px-3 py-2">
                        <UserRoundPlus size={16} />
                        <p className="text-[11px] font-semibold">Add Member</p>
                    </button>
                </div>
                <div className="flex items-center gap-2 border-t-2 border-t-gray-200 pt-3 text-xs text-gray-500 font-medium">
                    <div className="flex gap-1">
                        <p className="ml-5">Board</p>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex gap-1">
                        <p className="ml-5">Messages</p>
                    </div>
                    <div className="flex gap-1">
                        <p className="ml-5">Files</p>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex gap-1">
                        <p className="ml-5">Timeline</p>
                    </div>
                    <button className=" ml-auto flex items-center text-black px-3 py-2 mr-5 cursor-pointer gap-2 hover:bg-gray-100 rounded-lg ">
                        <FolderOpen size={16} color="black" />
                        Open
                    </button>
                </div>
            </div>
        </div>
    )
}



