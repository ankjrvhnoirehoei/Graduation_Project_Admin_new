"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

// 🔥 Chỉ lấy 6 tháng gần nhất
const chartData = [
  { month: "Jul", reels: 130, shorts: 110 },
  { month: "Aug", reels: 160, shorts: 150 },
  { month: "Sep", reels: 120, shorts: 95 },
  { month: "Oct", reels: 140, shorts: 130 },
  { month: "Nov", reels: 175, shorts: 160 },
  { month: "Dec", reels: 190, shorts: 145 },
];

const chartConfig = {
  reels: {
    label: "Reels",
    color: "var(--chart-1)",
  },
  shorts: {
    label: "Shorts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function VideoRadarChart() {
  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-3">
        <CardTitle className="text-base">Tỉ lệ phân phối video</CardTitle>
        <CardDescription className="text-xs text-center">
          Reels và Shorts trong 6 tháng gần nhất
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadarChart
            data={chartData}
            outerRadius={80}
            margin={{ top: -30, bottom: -10 }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="reels"
              fill="var(--color-reels)"
              fillOpacity={0.4}
              stroke="var(--color-reels)"
            />
            <Radar
              dataKey="shorts"
              fill="var(--color-shorts)"
              fillOpacity={0.4}
              stroke="var(--color-shorts)"
            />
            <ChartLegend className="mt-6" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-1 pt-3 text-xs">
        <div className="flex items-center gap-1 font-medium text-green-600">
          Tăng trưởng đồng đều <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-muted-foreground">Dữ liệu từ Jul → Dec 2024</div>
      </CardFooter>
    </Card>
  );
}
