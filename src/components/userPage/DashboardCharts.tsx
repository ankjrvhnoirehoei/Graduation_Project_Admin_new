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
import { useState } from "react";
import { Label } from "../../components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts";

const pieData = [
  { type: "Post", value: 400, fill: "var(--chart-1)" },
  { type: "Reel", value: 300, fill: "var(--chart-2)" },
  { type: "Story", value: 200, fill: "var(--chart-3)" },
];

const pieChartConfig = {
  Post: { label: "Post", color: "var(--chart-1)" },
  Reel: { label: "Reel", color: "var(--chart-2)" },
  Story: { label: "Story", color: "var(--chart-3)" },
};

const generate30DaysData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    count: Math.floor(Math.random() * 20) + 5,
  }));

type MonthKey = "2024-06" | "2024-05";

const accountData: Record<MonthKey, { day: string; count: number }[]> = {
  "2024-06": generate30DaysData(),
  "2024-05": generate30DaysData(),
};

const barChartConfig = {
  count: {
    label: "Tài khoản",
    color: "var(--chart-1)",
  },
};

export default function DashboardCharts() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("2024-06");

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      {/* Biểu đồ tròn: 20% */}
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

      {/* Biểu đồ cột: 80% */}
      <Card className="w-full md:w-4/5">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Số tài khoản theo ngày</CardTitle>
              <CardDescription>
                Dữ liệu tháng {selectedMonth.split("-")[1]} - 2024
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
                  <SelectItem value="2024-06">Tháng 6</SelectItem>
                  <SelectItem value="2024-05">Tháng 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart data={accountData[selectedMonth]}>
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
          <div className="flex gap-2 font-medium text-green-600">
            Tăng 8.4% so với tháng trước <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground text-xs">
            Hiển thị theo ngày trong tháng được chọn
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
