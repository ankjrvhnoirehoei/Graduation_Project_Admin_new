import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts";
import api from "../../lib/axios";

const pieChartConfig: { [key: string]: { label: string; color: string } } = {
  Post: { label: "Post", color: "var(--chart-1)" },
  Reel: { label: "Reel", color: "var(--chart-2)" },
  Story: { label: "Story", color: "var(--chart-3)" },
};

type MonthKey =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

const barChartConfig = {
  count: {
    label: "Tài khoản",
    color: "var(--chart-1)",
  },
};

export default function DashboardCharts() {
  const currentMonth = `${new Date().getMonth() + 1}` as MonthKey;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(currentMonth);
  const [pieData, setPieData] = useState<
    { type: string; value: number; fill: string }[]
  >([]);
  const [barData, setBarData] = useState<{ day: string; count: number }[]>([]);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [trend, setTrend] = useState<"increase" | "decrease" | null>(null);

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const res = await api.get("/posts/admin/stats/content-distribution", {
          headers: { token: true },
        });
        const data = res.data;

        const filledData = data.map(
          (item: { type: string; value: number }) => ({
            ...item,
            fill: pieChartConfig[item.type]?.color || "#ccc",
          })
        );

        setPieData(filledData);
      } catch (error) {
        console.error("Lỗi fetch pie chart:", error);
      }
    };

    fetchPieData();
  }, []);

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const res = await api.get(
          `/users/admin/stats/new-accounts/?month=${selectedMonth}`,
          { headers: { token: true } }
        );

        const { data, comparison } = res.data;

        const transformed = data.map(
          (item: { day: number; count: number }) => ({
            day: `${item.day}`,
            count: item.count,
          })
        );

        setBarData(transformed);
        setPercentageChange(comparison.percentageChange);
        setTrend(comparison.trend);
      } catch (error) {
        console.error("Lỗi fetch bar chart:", error);
      }
    };

    fetchBarData();
  }, [selectedMonth]);

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      {/* Biểu đồ tròn */}
      <Card className="w-full md:w-1/3">
        <CardHeader className="items-center pb-0">
          <CardTitle>Tỷ lệ bài đăng</CardTitle>
          <CardDescription>Thống kê theo loại</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[260px]"
          >
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="type" />
              <ChartLegend
                content={<ChartLegendContent nameKey="type" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Biểu đồ cột */}
      <Card className="w-full md:w-4/5">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Số tài khoản theo ngày</CardTitle>
              <CardDescription>
                Dữ liệu tháng {selectedMonth} - {currentYear}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="month-select" className="text-sm">
                Chọn tháng:
              </Label>
              <Select
                value={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value as MonthKey)}
              >
                <SelectTrigger id="month-select" className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const value = `${i + 1}` as MonthKey;
                    return (
                      <SelectItem key={value} value={value}>
                        Tháng {value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis axisLine={false} tickLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={6} fill="var(--color-count)" />
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          {percentageChange !== null && (
            <div
              className={`flex gap-2 font-medium ${
                trend === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "increase" ? (
                <>
                  Tăng {percentageChange}% <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Giảm {percentageChange}% <TrendingDown className="h-4 w-4" />
                </>
              )}
            </div>
          )}
          <div className="text-muted-foreground text-xs">
            Hiển thị theo ngày trong tháng được chọn
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
