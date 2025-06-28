"use client";

import { useEffect, useState } from "react";
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
import api from "../../lib/axios";

const chartConfig = {
  videos: {
    label: "Videos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function VideoRadialSummary() {
  const [totalVideos, setTotalVideos] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [trend, setTrend] = useState<"increase" | "decrease" | "stable">(
    "stable"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/posts/compare-last-6-months", {
          headers: { token: true },
        });

        const data = res.data;
        setTotalVideos(data.currentTotalPosts || 0);
        setStart(data.start || "");
        setEnd(data.end || "");
        setPercentage(data.percentageChange || 0);
        setTrend(data.trend || "stable");
      } catch (err) {
        console.error("Lỗi fetch radial chart:", err);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    {
      label: "videos",
      value: totalVideos,
      fill: "var(--chart-2)",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Tổng post 6 tháng</CardTitle>
        <CardDescription className="text-xs">
          Dữ liệu từ {start} → {end}
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
          {trend === "increase" && (
            <>
              Tăng {percentage.toFixed(1)}% so với 6 tháng trước
              <TrendingUp className="h-3 w-3" />
            </>
          )}
          {trend === "decrease" && (
            <span className="text-red-600">
              Giảm {percentage.toFixed(1)}% so với 6 tháng trước
            </span>
          )}
          {trend === "stable" && (
            <span className="text-gray-500">
              Không đổi so với 6 tháng trước
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
