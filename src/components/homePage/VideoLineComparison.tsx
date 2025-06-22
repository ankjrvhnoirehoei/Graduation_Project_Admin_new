"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
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

// Dữ liệu 2 tuần
const chartData = [
  { day: "T2", thisWeek: 51, lastWeek: 32 },
  { day: "T3", thisWeek: 60, lastWeek: 42 },
  { day: "T4", thisWeek: 41, lastWeek: 51 },
  { day: "T5", thisWeek: 86, lastWeek: 61 },
  { day: "T6", thisWeek: 13, lastWeek: 44 },
  { day: "T7", thisWeek: 73, lastWeek: 59 },
  { day: "CN", thisWeek: 34, lastWeek: 36 },
];

// Cấu hình biểu đồ
const chartConfig = {
  thisWeek: {
    label: "Tuần này",
    color: "var(--chart-1)",
  },
  lastWeek: {
    label: "Tuần trước",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function VideoLineComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>So sánh video 2 tuần gần đây</CardTitle>
        <CardDescription>Thứ 2 → Chủ Nhật</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="thisWeek"
              stroke="var(--color-thisWeek)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="lastWeek"
              stroke="var(--color-lastWeek)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium text-green-600">
              Tuần này tăng 7.4% <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">
              So sánh tổng số video giữa 2 tuần
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
