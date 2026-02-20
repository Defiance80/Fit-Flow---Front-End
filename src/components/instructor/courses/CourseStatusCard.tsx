"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import icon1 from "@/assets/images/instructorPanel/myCourses/activeIcon.svg";
import icon2 from "@/assets/images/instructorPanel/myCourses/pendingIcon.svg";
import icon3 from "@/assets/images/instructorPanel/myCourses/rejectedIcon.svg";
import icon4 from "@/assets/images/instructorPanel/myCourses/draftIcon.svg";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";

interface CourseStatusCardProps {
  title: string;
  count: number;
  subtitle: string;
  className?: string;
  barColorClass?: string;
  status?: string;
}

const CourseStatusCard: React.FC<CourseStatusCardProps> = ({
  title,
  count,
  subtitle,
  className = "",
  barColorClass = "bg-gray-500",
  status = "publish",
}) => {
  const icon = status === "publish" ? icon1 : status === "pending" ? icon2 : status === "rejected" ? icon3 : icon4;
  return (
    <Card
      className={`p-4 rounded-lg flex items-center space-x-3 ${className} relative overflow-hidden border-none shadow-none`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 h-[60%] flexCenter rounded-lg my-auto ${barColorClass}`}
      ></div>

      <div className="ml-2 p-2 bg-white rounded-[8px] w-12 h-12 flexCenter">
        <CustomImageTag src={icon} alt="icon" className="w-8 h-8 object-contain" />
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-normal text-gray-700">{title}</h3>
        <div className="mt-0.5 flex items-baseline">
          <p className="text-2xl font-bold text-gray-900">{count}</p>
          <p className="ml-1 text-sm font-normal text-gray-700">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default CourseStatusCard;
