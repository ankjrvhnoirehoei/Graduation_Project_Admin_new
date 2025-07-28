"use client";

import { useEffect, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  LabelList,
} from "recharts";
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
import api from "../../lib/axios";

const chartConfig = {
  posts: {
    label: "Posts",
    color: "var(--chart-1)",
  },
  stories: {
    label: "Stories",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function VideoRadarChart() {
  const [chartData, setChartData] = useState<
    { month: string; posts: number; stories: number }[]
  >([]);
  const [dateRange, setDateRange] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/posts/last-six-months", {
          headers: { token: true },
        });

        const data = res.data;
        const formatted = data.yearlyStats.map((item: any) => ({
          month: item.month,
          posts: item.posts,
          stories: item.stories,
        }));

        setChartData(formatted);
        setDateRange(`${data.start} → ${data.end}`);
      } catch (err) {
        console.error("Radar chart error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-3">
        <CardTitle className="text-base">Tỉ lệ phân phối bài viết</CardTitle>
        <CardDescription className="text-xs text-center">
          Posts & Stories trong 6 tháng gần nhất
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
              name="Posts"
              dataKey="posts"
              fill="var(--color-reels)"
              fillOpacity={0.4}
              stroke="var(--color-reels)"
            >
              <LabelList dataKey="posts" position="top" />
            </Radar>
            <Radar
              name="Stories"
              dataKey="stories"
              fill="var(--color-shorts)"
              fillOpacity={0.4}
              stroke="var(--color-shorts)"
            >
              <LabelList dataKey="stories" position="top" />
            </Radar>
            <ChartLegend className="mt-6" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-1 pt-3 text-xs">
        <div className="flex items-center gap-1 font-medium text-green-600">
          Tăng trưởng đồng đều <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-muted-foreground">
          Dữ liệu từ {dateRange || "6 tháng gần nhất"}
        </div>
      </CardFooter>
    </Card>
  );
}
