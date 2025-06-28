"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
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

export default function VideoBarChart() {
  const [data, setData] = useState<{ day: string; videos: number }[]>([]);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const res = await api.get("/admin/posts/weekly", {
          headers: { token: true },
        });
        const transformed = res.data.map((item: any) => ({
          day: item.day,
          videos: item.posts,
        }));
        setData(transformed);
      } catch (err) {
        console.error("Lỗi khi fetch thống kê tuần:", err);
      }
    };

    fetchWeeklyStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê video tuần này</CardTitle>
        <CardDescription>Thứ 2 → Chủ Nhật</CardDescription>
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
              domain={[0, "dataMax + 2"]} // tự động scale
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="videos"
              fill="var(--chart-1)"
              radius={[6, 6, 0, 0]}
              name="Video"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium text-green-600">
          Tăng 8.4% so với tuần trước
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Tổng hợp dữ liệu trong 7 ngày qua
        </div>
      </CardFooter>
    </Card>
  );
}
