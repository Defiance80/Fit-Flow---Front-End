import { useTranslation } from "@/hooks/useTranslation";
import React from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  progressColor?: string;
  bgColor?: string;
  textClassName?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 96, // 24 * 4 = 96px default size
  strokeWidth = 10,
  className = "",
  progressColor = "#83B807", // Default green color
  bgColor = "#E5E7EB", // Default gray background
  textClassName = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const { t } = useTranslation();
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="transition-all duration-300 ease-in-out"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-300 ease-in-out"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${textClassName}`}>{value}%</span>
        <span className="text-xs text-gray-500">{t("complete")}</span>
      </div>
    </div>
  );
};

export default CircularProgress;
