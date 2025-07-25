"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import { useEffect, useState } from "react";
import api from "../../lib/axios";

const chartConfig = {
  thisWeek: {
    label: "Tuần trước",
    color: "var(--chart-1)",
  },
  lastWeek: {
    label: "Tuần kia",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface WeeklyData {
  day: string;
  previousWeek: number;
  beforePrevious: number;
  percentageChange: number;
  trend: string;
}

export default function VideoLineComparison() {
  const [chartData, setChartData] = useState<
    { day: string; thisWeek: number; lastWeek: number }[]
  >([]);
  const [overallStats, setOverallStats] = useState<{
    totalChange: number;
    trend: string;
    thisWeekTotal: number;
    lastWeekTotal: number;
  }>({
    totalChange: 0,
    trend: "no change",
    thisWeekTotal: 0,
    lastWeekTotal: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/posts/last-two-weeks", {
          headers: { token: true },
        });

        const rawData: WeeklyData[] = res.data;

        const transformed = rawData.map((item) => ({
          day: item.day,
          thisWeek: item.previousWeek,
          lastWeek: item.beforePrevious,
        }));

        const order = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
        transformed.sort(
          (a, b) => order.indexOf(a.day) - order.indexOf(b.day)
        );

        setChartData(transformed);

        // Calculate overall statistics
        const thisWeekTotal = rawData.reduce((sum, item) => sum + item.previousWeek, 0);
        const lastWeekTotal = rawData.reduce((sum, item) => sum + item.beforePrevious, 0);
        
        let overallChange = 0;
        let overallTrend = "no change";
        
        if (lastWeekTotal === 0) {
          overallChange = thisWeekTotal === 0 ? 0 : 100;
          overallTrend = thisWeekTotal > 0 ? "increase" : "no change";
        } else {
          overallChange = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
          overallTrend = overallChange > 0 ? "increase" : overallChange < 0 ? "decrease" : "no change";
        }

        setOverallStats({
          totalChange: Math.abs(overallChange),
          trend: overallTrend,
          thisWeekTotal,
          lastWeekTotal,
        });

      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu 2 tuần:", error);
      }
    };

    fetchData();
  }, []);

  const getTrendIcon = () => {
    switch (overallStats.trend) {
      case "increase":
        return <TrendingUp className="h-4 w-4" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (overallStats.trend) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendText = () => {
    if (overallStats.trend === "no change") {
      return "Không có thay đổi";
    }
    const action = overallStats.trend === "increase" ? "tăng" : "giảm";
    return `${action} ${overallStats.totalChange}% so với tuần kia`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>So sánh video 2 tuần gần đây</CardTitle>
        <CardDescription>
          Thứ 2 → Chủ Nhật ({overallStats.thisWeekTotal} vs {overallStats.lastWeekTotal} video)
        </CardDescription>
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
              domain={[0, "dataMax + 2"]}
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
            <div className={`flex items-center gap-2 font-medium ${getTrendColor()}`}>
              {getTrendText()} {getTrendIcon()}
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