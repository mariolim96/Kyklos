"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";

// export function DropdownMenuCheckboxes() {
//   const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
//   const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
//   const [showPanel, setShowPanel] = React.useState<Checked>(false);

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">Open</Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56">
//         <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
//           Status Bar
//         </DropdownMenuCheckboxItem>
//         <DropdownMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar} disabled>
//           Activity Bar
//         </DropdownMenuCheckboxItem>
//         <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
//           Panel
//         </DropdownMenuCheckboxItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
export interface DropdownMenuItem {
    label: string;
    checked: boolean;
    disabled?: boolean;
}

export interface DropdownMenuCheckboxesProps {
    items: DropdownMenuItem[];
    name: string;
    onItemChange: (label: string, checked: boolean) => void;
}

export function DropdownMenuCheckboxes({ items, onItemChange, name }: DropdownMenuCheckboxesProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <DropdownMenu onOpenChange={open => setIsOpen(open)}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost2">
                    {name}
                    <IoIosArrowDown
                        className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {items.map(item => (
                    <DropdownMenuCheckboxItem
                        key={item.label}
                        checked={item.checked}
                        onCheckedChange={checked => onItemChange(item.label, checked)}
                        disabled={item.disabled}
                    >
                        {item.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
