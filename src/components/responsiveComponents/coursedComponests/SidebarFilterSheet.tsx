"use client";
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import SidebarFilter from "@/components/commonComp/SidebarFilter";
import { FaChevronDown } from "react-icons/fa";
import { SidebarFilterTypes } from "@/types";

const SidebarFilterSheet: React.FC<{ 
    sidebarFilter: SidebarFilterTypes, 
    setSidebarFilter: (filter: SidebarFilterTypes) => void,
    isInstructorPage?: boolean 
}> = ({ sidebarFilter, setSidebarFilter, isInstructorPage = false }) => {
    return (
        <div className="w-full">
            <Sheet>
                <SheetTrigger className="w-full">
                    <div className="flexCenter !justify-between py-2 px-4 border-[1.5px] borderColor text-base bg-white w-full rounded">
                        <span className="">Filter By</span>
                        <FaChevronDown  className="text-gray-400"/>
                    </div>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetTitle className="text-xl font-semibold text-black pt-4 pb-2 px-4">Filter By</SheetTitle>
                    <div className="">
                        <SidebarFilter 
                            sidebarFilter={sidebarFilter} 
                            setSidebarFilter={setSidebarFilter} 
                            mobileComp={true}
                            isInstructorPage={isInstructorPage}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default SidebarFilterSheet;
