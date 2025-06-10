import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropdownItems {
    id: number,
    item: string
}

interface Props {
    items: DropdownItems[],
    setItem: React.Dispatch<React.SetStateAction<number>>
    selectedItem: number
}
const Dropdown:React.FC<Props> = ({items, setItem, selectedItem}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg py-2 focus:outline-blue-900 text-black text-[13px] relative justify-between flex items-end" onClick={() => setIsOpen(!isOpen)}>
            <p className="ml-4">{
                selectedItem === -1 ? items[0].item: items[selectedItem].item    
            }</p>
            <ChevronDown size={18} className="w-min mr-4" />
            {
                isOpen && 
                <div className="w-full absolute bottom-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {
                        items.map((member, index) => (
                            <option key={index} onClick={() => setItem(member.id)} value={member.item} className="cursor-pointer px-4 py-1 hover:bg-blue-500 hover:text-white">{member.item}</option>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default Dropdown;