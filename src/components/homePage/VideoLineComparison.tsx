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
import { useEffect, useState } from "react";
import api from "../../lib/axios";

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
  const [chartData, setChartData] = useState<
    { day: string; thisWeek: number; lastWeek: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/posts/last-two-weeks", {
          headers: { token: true },
        });

        const rawData = res.data;

        const transformed = rawData.map((item: any) => ({
          day: item.day,
          thisWeek: item.previousWeek,
          lastWeek: item.beforePrevious,
        }));

        const order = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
        transformed.sort(
          (a: { day: string }, b: { day: string }) =>
            order.indexOf(a.day) - order.indexOf(b.day)
        );

        setChartData(transformed);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu 2 tuần:", error);
      }
    };

    fetchData();
  }, []);

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
