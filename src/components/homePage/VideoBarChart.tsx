"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import api from "../../lib/axios";

const chartConfig = {
  videos: {
    label: "Số video",
    color: "var(--chart-1)",
  },
};

interface WeeklyStatsData {
  day: string;
  posts: number;
  percentageChange: number;
  trend: string;
}

export default function VideoBarChart() {
  const [data, setData] = useState<{ day: string; videos: number }[]>([]);
  const [overallStats, setOverallStats] = useState<{
    totalChange: number;
    trend: string;
    currentTotal: number;
  }>({
    totalChange: 0,
    trend: "no change",
    currentTotal: 0,
  });

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const res = await api.get("/admin/posts/weekly", {
          headers: { token: true },
        });
        
        const rawData: WeeklyStatsData[] = res.data;
        
        const transformed = rawData.map((item) => ({
          day: item.day,
          videos: item.posts,
        }));
        
        setData(transformed);

        // Calculate overall weekly statistics
        const currentTotal = rawData.reduce((sum, item) => sum + item.posts, 0);
        
        // Calculate weighted average of daily changes for overall trend
        const dailyChanges = rawData.filter(item => item.posts > 0); // Only consider days with posts
        
        if (dailyChanges.length > 0) {
          const totalCurrentPosts = dailyChanges.reduce((sum, item) => sum + item.posts, 0);
          const weightedChange = dailyChanges.reduce((sum, item) => {
            const weight = item.posts / totalCurrentPosts;
            return sum + (item.percentageChange * weight);
          }, 0);
          
          const overallTrend = dailyChanges.some(item => item.trend === "increase") 
            ? "increase" 
            : dailyChanges.some(item => item.trend === "decrease")
            ? "decrease"
            : "no change";
          
          setOverallStats({
            totalChange: Math.abs(Math.round(weightedChange)),
            trend: overallTrend,
            currentTotal,
          });
        } else {
          // No posts this week
          setOverallStats({
            totalChange: 0,
            trend: "no change",
            currentTotal: 0,
          });
        }

      } catch (err) {
        console.error("Lỗi khi fetch thống kê tuần:", err);
      }
    };

    fetchWeeklyStats();
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
    if (overallStats.trend === "no change" || overallStats.totalChange === 0) {
      return "Không có thay đổi so với tuần trước";
    }
    const action = overallStats.trend === "increase" ? "Tăng" : "Giảm";
    return `${action} ${overallStats.totalChange}% so với tuần trước`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê video tuần này</CardTitle>
        <CardDescription>
          Thứ 2 → Chủ Nhật (Tổng: {overallStats.currentTotal} bài viết)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, "dataMax + 2"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="videos"
              fill="var(--chart-1)"
              radius={[6, 6, 0, 0]}
              name="Bài viết"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className={`flex gap-2 font-medium ${getTrendColor()}`}>
          {getTrendText()}
          {getTrendIcon()}
        </div>
        <div className="text-muted-foreground">
          Tổng hợp dữ liệu trong 7 ngày qua
        </div>
      </CardFooter>
    </Card>
  );
}