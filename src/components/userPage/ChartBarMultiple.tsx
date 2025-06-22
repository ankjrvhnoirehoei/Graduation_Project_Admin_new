"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", post: 186, story: 80 },
  { month: "February", post: 305, story: 200 },
  { month: "March", post: 237, story: 120 },
  { month: "April", post: 73, story: 190 },
  { month: "May", post: 209, story: 130 },
  { month: "June", post: 214, story: 140 },
];

export function ChartBarMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bài viết & Story theo tháng</CardTitle>
        <CardDescription>Thống kê từ tháng 1 đến tháng 6</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar
              dataKey="post"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              name="Bài viết"
            />
            <Bar
              dataKey="story"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              name="Story"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 font-medium text-green-600">
          <TrendingUp className="h-4 w-4" />
          Tăng 5.2% trong tháng này
        </div>
        <p className="text-muted-foreground">
          Tổng tương tác bài viết và story 6 tháng gần nhất
        </p>
      </CardFooter>
    </Card>
  );
}
