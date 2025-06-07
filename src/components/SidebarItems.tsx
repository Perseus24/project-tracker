'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface Props {
    icon: React.ReactElement,
    title: string,
    href: string
}
const SidebarItems: React.FC<Props> = ({icon, title, href}) => {

    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link 
            href={href}
            className={clsx(
                "flex gap-3 text-sm items-center rounded-lg p-1 ",
                isActive
                    ? "bg-white/20 font-medium text-white"
                    : "hover:bg-white/40 hover:text-white text-white/80"
            )}>
            <span className="text-inherit">{icon}</span>
            <p>{title}</p>
        </Link>
    );
}

export default SidebarItems;