"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";

// Sample data
const chartData = [
  {
    status: "summary",
    featured: 42,
    reported: 12,
    removed: 7,
    approved: 25,
  },
];

const chartConfig = {
  featured: {
    label: "Nổi bật",
    color: "#a78bfa", // Màu thực tế
  },
  reported: {
    label: "Bị báo cáo",
    color: "#fdba74",
  },
  removed: {
    label: "Bị gỡ",
    color: "#fca5a5",
  },
  approved: {
    label: "Đã duyệt",
    color: "#6ee7b7",
  },
} satisfies ChartConfig;

export function VideoPostRadialSummary() {
  const total =
    chartData[0].featured +
    chartData[0].reported +
    chartData[0].removed +
    chartData[0].approved;

  const summaryItems = [
    {
      label: "Nổi bật",
      value: chartData[0].featured,
      gradient: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
    },
    {
      label: "Bị báo cáo",
      value: chartData[0].reported,
      gradient: "linear-gradient(135deg, #fed7aa, #fdba74)",
    },
    {
      label: "Bị gỡ",
      value: chartData[0].removed,
      gradient: "linear-gradient(135deg, #fecaca, #fca5a5)",
    },
    {
      label: "Đã duyệt",
      value: chartData[0].approved,
      gradient: "linear-gradient(135deg, #bbf7d0, #6ee7b7)",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tổng bài đăng</CardTitle>
        <CardDescription>6 tháng gần nhất</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[260px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Bài đăng
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>

            {/* Radial bars with fixed colors */}
            <RadialBar
              dataKey="featured"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.featured.color}
            />
            <RadialBar
              dataKey="reported"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.reported.color}
            />
            <RadialBar
              dataKey="removed"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.removed.color}
            />
            <RadialBar
              dataKey="approved"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.approved.color}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-semibold text-gray-900">
          Tăng 8.6% so với trước <TrendingUp className="h-4 w-4" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 w-full">
          {summaryItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-md px-3 py-2 shadow-sm"
              style={{ background: item.gradient }}
            >
              <span className="text-lg font-bold text-black">{item.value}</span>
              <span className="text-xs font-medium text-black">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
