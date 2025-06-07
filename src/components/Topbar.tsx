'use client';

interface Props {
    title: string
}
const Topbar: React.FC<Props> = ({title}) => {
    return (
        <div className="flex items-center justify-between px-5 py-2 bg-white shadow-md rounded-lg text-[#111827]">
            <p className="text-md font-medium">{title}</p>
        </div>
    );
}

export default Topbar;
