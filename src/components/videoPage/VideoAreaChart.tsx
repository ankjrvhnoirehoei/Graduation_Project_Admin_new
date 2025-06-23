"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../../components/ui/chart";
import api from "../../lib/axios";

const chartConfig = {
  reels: {
    label: "Posts",
    color: "var(--chart-1)",
  },
  shorts: {
    label: "Stories",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function VideoAreaChart() {
  const [chartData, setChartData] = useState<
    { month: string; reels: number; shorts: number }[]
  >([]);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [trend, setTrend] = useState<"increase" | "decrease" | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/posts/admin/yearly-stats", {
          headers: { token: true },
        });

        const stats = res.data;
        const formattedData = stats.currentYearStats.map(
          (item: { month: string; reels: number; stories: number }) => ({
            month: item.month,
            reels: item.reels,
            shorts: item.stories,
          })
        );

        setChartData(formattedData);

        const compare = stats.comparison?.[0];
        if (compare) {
          setPercentChange(compare.percentageChange);
          setTrend(compare.trend);
        }
      } catch (error) {
        console.error("Lỗi fetch yearly stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Thống kê video theo tháng</CardTitle>
        <CardDescription className="text-xs">
          Tổng số Posts & Stories trong 12 tháng qua
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
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs></defs>
            <Area
              dataKey="shorts"
              type="monotone"
              fill="url(#fillShorts)"
              stroke="var(--color-shorts)"
              fillOpacity={0.4}
            />
            <Area
              dataKey="reels"
              type="monotone"
              fill="url(#fillReels)"
              stroke="var(--color-reels)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex w-full items-start gap-2 text-xs">
          <div className="grid gap-1">
            {percentChange !== null && trend && (
              <div
                className={`flex items-center gap-1 font-medium ${
                  trend === "increase" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend === "increase" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend === "increase" ? "Tăng" : "Giảm"} {percentChange}% so với
                năm ngoái
              </div>
            )}
            <div className="text-muted-foreground">
              Dữ liệu từ Jan → Dec {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
