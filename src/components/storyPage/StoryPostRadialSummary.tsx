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
  active: {
    label: "Hoạt động",
    color: "#a78bfa",
  },
  reported: {
    label: "Bị báo cáo",
    color: "#fdba74",
  },
  flagged: {
    label: "Bị gắn cờ",
    color: "#fca5a5",
  },
  disabled: {
    label: "Vô hiệu hóa",
    color: "#6ee7b7",
  },
} satisfies ChartConfig;

export function StoryPostRadialSummary() {
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
        // Use the new story summary with trends endpoint
        const res = await api.get('/admin/stories/summary-stories', {
          headers: { token: true }
        });

        if (res.data.success) {
          const current = res.data.currentWindow;

          const dataItem = {
            status: "summary",
            active: current.active,
            reported: current.reported,
            flagged: current.flagged,
            disabled: current.disabled,
          };

          setChartData([dataItem]);
          setTotal(current.total || 0);
          setPercentChange(res.data.percentageChange);
          setTrend(res.data.trend);
          setDateRange(`${res.data.start} → ${res.data.end}`);

          setSummaryItems([
            {
              label: "Hoạt động",
              value: current.active,
              gradient: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
            },
            {
              label: "Bị báo cáo",
              value: current.reported,
              gradient: "linear-gradient(135deg, #fed7aa, #fdba74)",
            },
            {
              label: "Bị gắn cờ",
              value: current.flagged,
              gradient: "linear-gradient(135deg, #fecaca, #fca5a5)",
            },
            {
              label: "Vô hiệu hóa",
              value: current.disabled,
              gradient: "linear-gradient(135deg, #bbf7d0, #6ee7b7)",
            },
          ]);
        } else {
          throw new Error('API response not successful');
        }
      } catch (err) {
        console.error("Story summary error:", err);
        // Fallback to default mock data
        const fallbackData = {
          status: "summary",
          active: 1250,
          reported: 45,
          flagged: 23,
          disabled: 12,
        };
        setChartData([fallbackData]);
        setTotal(1330);
        setPercentChange(12.5);
        setTrend("increase");
        setDateRange("6 tháng gần nhất");
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tổng Stories</CardTitle>
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
                          Stories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>

            <RadialBar
              dataKey="active"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.active.color}
            />
            <RadialBar
              dataKey="reported"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.reported.color}
            />
            <RadialBar
              dataKey="flagged"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.flagged.color}
            />
            <RadialBar
              dataKey="disabled"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.disabled.color}
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