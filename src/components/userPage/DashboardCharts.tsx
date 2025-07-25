// DashboardCharts.tsx
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
  Cell,
  Legend,
  LegendProps,
} from "recharts";
import api from "../../lib/axios";

const pieChartConfig: { [key: string]: { label: string; color: string } } = {
  Post: { label: "Post", color: "#8884d8" },
  Reel: { label: "Reel", color: "#82ca9d" },
  Story: { label: "Story", color: "#ffc658" },
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
    color: "#8884d8",
  },
};

// Custom Legend Component
const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      {payload.map((item, index) => {
        const config = pieChartConfig[item.value || ""];
        return (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-1.5"
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: item.color,
              }}
            />
            <span className="text-sm text-muted-foreground">
              {config?.label || item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
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
        const res = await api.get("/admin/posts/stats/content-distribution", {
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
          `/admin/users/stats/new-accounts/?month=${selectedMonth}`,
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
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[280px] w-full"
          >
            <PieChart width={280} height={280}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="type"
                cx="50%"
                cy="45%"
                outerRadius={90}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend content={<CustomLegend />} />
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
              <Bar dataKey="count" radius={6} fill="#8884d8" />
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