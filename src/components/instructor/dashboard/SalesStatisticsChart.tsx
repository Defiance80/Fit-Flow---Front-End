"use client";
import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesChartData } from "@/utils/api/instructor/course/getCourseDetails";
import { useTranslation } from "@/hooks/useTranslation";
import { getCurrencySymbol } from "@/utils/helpers";

// Define proper types for the tooltip
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface SalesChartDataProps {
  data: SalesChartData
}

const SalesStatisticsChart: React.FC<SalesChartDataProps> = ({ data }) => {

  const { t } = useTranslation();
  const chartData = data;

  // Custom tooltip to match the image
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded">
          <p className="text-gray-600 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name} :{" "}
              {entry.name === "Sales"
                ? entry.value
                : `${getCurrencySymbol()}${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const [period, setPeriod] = useState("yearly");

  const handlePeriodChange = (value: string): void => {
    setPeriod(value);
  };

  return (
    <Card className="bg-white rounded-xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium flex items-center justify-between border-b borderColor pb-4">
          <span className="font-semibold">{t("sales_statistics")}</span>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[110px] md:w-[200px] text-sm bg-[#F8F8F9]">
                <SelectValue placeholder={t("period")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yearly">{t("yearly")}</SelectItem>
                <SelectItem value="monthly">{t("monthly")}</SelectItem>
                <SelectItem value="weekly">{t("weekly")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-4 justify-end py-4">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-xs">{t("profit")}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs">{t("revenue")}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              <span className="text-xs">{t("sales")}</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={period === "yearly" ? chartData?.yearly : period === "monthly" ? chartData?.monthly : chartData?.weekly}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 20000]}
                tickFormatter={(value) => {
                  if (value === 0) return "0";
                  if (value === 1000) return "1K";
                  if (value === 2000) return "2K";
                  if (value === 4000) return "4K";
                  if (value === 6000) return "6K";
                  if (value === 8000) return "8K";
                  if (value === 10000) return "10K";
                  if (value === 12000) return "12K";
                  if (value === 14000) return "14K";
                  if (value === 16000) return "16K";
                  if (value === 18000) return "18K";
                  if (value === 20000) return "20K";
                  return `${value / 1000}K`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="profit"
                fill="#3b82f6"
                radius={[5, 5, 0, 0]}
                maxBarSize={40}
                name={t("profit")}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name={t("revenue")}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name={t("sales")}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesStatisticsChart;
