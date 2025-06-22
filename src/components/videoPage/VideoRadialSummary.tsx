"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartConfig, ChartContainer } from "../ui/chart";

// 🔢 Dữ liệu mock tổng video trong 6 tháng gần nhất
const totalVideos = 965;

const chartData = [
  {
    label: "videos",
    value: totalVideos,
    fill: "var(--chart-2)",
  },
];

const chartConfig = {
  videos: {
    label: "Videos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function VideoRadialSummary() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Tổng video 6 tháng</CardTitle>
        <CardDescription className="text-xs">
          Dữ liệu từ Jan → Jun 2024
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={360}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVideos.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          Videos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-xs pt-2">
        <div className="flex items-center gap-2 leading-none font-medium text-green-600">
          Tăng 12.4% so với 6 tháng trước
          <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-muted-foreground leading-none">
          Tổng hợp từ Reels & Shorts
        </div>
      </CardFooter>
    </Card>
  );
}
