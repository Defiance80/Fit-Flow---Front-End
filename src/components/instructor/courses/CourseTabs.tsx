"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface TabItem {
  id: string;
  label: string;
}

interface CourseTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200 p-4 overflow-x-auto">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={`rounded-none px-1 pb-2 -mb-[2px] relative ${
            activeTab === tab.id
              ? "text-[var(--primary-color)] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--primary-color)]"
              : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default CourseTabs;
