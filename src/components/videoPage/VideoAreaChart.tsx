"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

const chartData = [
  { month: "Jan", reels: 120, shorts: 80 },
  { month: "Feb", reels: 95, shorts: 110 },
  { month: "Mar", reels: 135, shorts: 130 },
  { month: "Apr", reels: 105, shorts: 98 },
  { month: "May", reels: 145, shorts: 125 },
  { month: "Jun", reels: 170, shorts: 140 },
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

export default function VideoAreaChart() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Thống kê video theo tháng</CardTitle>
        <CardDescription className="text-xs">
          Tổng số Reels & Shorts trong 12 tháng qua
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillReels" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-reels)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-reels)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillShorts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-shorts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-shorts)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="shorts"
              type="natural"
              fill="url(#fillShorts)"
              stroke="var(--color-shorts)"
              stackId="a"
              fillOpacity={0.4}
            />
            <Area
              dataKey="reels"
              type="natural"
              fill="url(#fillReels)"
              stroke="var(--color-reels)"
              stackId="a"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex w-full items-start gap-2 text-xs">
          <div className="grid gap-1">
            <div className="flex items-center gap-1 font-medium text-green-600">
              Tăng 18.7% so với năm ngoái
              <TrendingUp className="h-3 w-3" />
            </div>
            <div className="text-muted-foreground">
              Dữ liệu từ Jan → Dec 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
