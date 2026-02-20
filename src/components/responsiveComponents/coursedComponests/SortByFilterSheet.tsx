"use client";
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { FaChevronDown } from "react-icons/fa";

interface SortByProps {
    sortBy: string;
    onChangeSortBy: (value: string) => void;
}

const SortByFilterSheet: React.FC<SortByProps> = ({ sortBy, onChangeSortBy }) => {

    const options = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "most_popular", label: "Most Popular" },
    ];

    const handleSelect = (value: string) => {
        if (sortBy === value) {
            onChangeSortBy("");
        } else {
            onChangeSortBy(value);
        }
    }

    return (
        <Sheet>
            <SheetTrigger className="w-full">
                <div className="flexCenter !justify-between py-2 px-4 border-[1.5px] borderColor text-base bg-white w-full rounded">
                    <span>Sort By</span>
                    <FaChevronDown className="text-gray-400" />
                </div>
            </SheetTrigger>

            <SheetContent side="left">
                <div className="pt-4 p-6 space-y-6">
                    <SheetTitle className="font-semibold text-xl text-[#010211]">
                        Sort By
                    </SheetTitle>
                    <div className="space-y-6">
                    {options.map((item) => (
                        <div
                            key={item.value}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => handleSelect(item.value)}
                        >
                            <input
                                type="checkbox"
                                checked={sortBy === item.value}
                                readOnly
                                className="h-4 w-4 accent-primaryBg border borderColor rounded cursor-pointer"
                            />
                            <span
                                className={`text-base ${sortBy === item.value
                                        ? "font-normal text-primary"
                                        : "text-gray-700"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SortByFilterSheet;
