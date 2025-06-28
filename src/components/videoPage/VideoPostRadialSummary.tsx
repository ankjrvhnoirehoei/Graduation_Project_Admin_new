"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
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
import api from "../../lib/axios";

const chartConfig = {
  hot: {
    label: "Nổi bật",
    color: "#a78bfa",
  },
  reported: {
    label: "Bị báo cáo",
    color: "#fdba74",
  },
  removed: {
    label: "Bị gỡ",
    color: "#fca5a5",
  },
  resolved: {
    label: "Đã duyệt",
    color: "#6ee7b7",
  },
} satisfies ChartConfig;

export function VideoPostRadialSummary() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [trend, setTrend] = useState<"increase" | "decrease" | null>(null);
  const [summaryItems, setSummaryItems] = useState<
    { label: string; value: number; gradient: string }[]
  >([]);
  const [dateRange, setDateRange] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/posts/summary-posts", {
          headers: { token: true },
        });

        const stats = res.data;
        const current = stats.currentWindow;

        const dataItem = {
          status: "summary",
          hot: current.hot,
          reported: current.reported,
          removed: current.removed,
          resolved: current.resolved,
        };

        setChartData([dataItem]);
        setTotal(current.total || 0);
        setPercentChange(stats.percentageChange);
        setTrend(stats.trend);
        setDateRange(`${stats.start} → ${stats.end}`);

        setSummaryItems([
          {
            label: "Nổi bật",
            value: current.hot,
            gradient: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
          },
          {
            label: "Bị báo cáo",
            value: current.reported,
            gradient: "linear-gradient(135deg, #fed7aa, #fdba74)",
          },
          {
            label: "Bị gỡ",
            value: current.removed,
            gradient: "linear-gradient(135deg, #fecaca, #fca5a5)",
          },
          {
            label: "Đã duyệt",
            value: current.resolved,
            gradient: "linear-gradient(135deg, #bbf7d0, #6ee7b7)",
          },
        ]);
      } catch (err) {
        console.error("Summary posts error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tổng bài đăng</CardTitle>
        <CardDescription>{dateRange || "6 tháng gần nhất"}</CardDescription>
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

            <RadialBar
              dataKey="hot"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.hot.color}
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
              dataKey="resolved"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.resolved.color}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm">
        {percentChange !== null && trend && (
          <div
            className={`flex items-center gap-2 leading-none font-semibold ${
              trend === "increase" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "increase" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {trend === "increase" ? "Tăng" : "Giảm"} {percentChange}% so với
            trước
          </div>
        )}

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
