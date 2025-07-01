import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
} from 'recharts';
import { differenceInDays, eachDayOfInterval, eachMonthOfInterval, format, subDays, subMonths } from 'date-fns';

type RangeType = 'year' | '30days' | '7days';

interface ContentRadarProps {
  rangeType?: RangeType;
  start?: Date;
  end?: Date;
  data: { date: string; posts: number; reels: number; stories: number; }[]
}

export function ContentRadarChart({ rangeType = 'year', start, end }: ContentRadarProps) {
  const today = new Date();
  const from = start ?? (rangeType === '7days' ? subDays(today, 6) : rangeType === '30days' ? subDays(today, 29) : subMonths(today, 11));
  const to = end ?? today;
  const spanDays = differenceInDays(to, from);
  const useMonths = spanDays > 60;
  const labels = useMonths
    ? eachMonthOfInterval({ start: from, end: to }).map((d) => format(d, 'MMM'))
    : eachDayOfInterval({ start: from, end: to }).map((d) => format(d, 'dd/MM'));

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const chartData = labels.map((label) => ({
    period: label,
    posts: rand(10, 80),
    reels: rand(5, 60),
    stories: rand(8, 70),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="posts" stackId="a" fill="#6366F1" />
        <Bar dataKey="reels" stackId="a" fill="#EC4899" />
        <Bar dataKey="stories" stackId="a" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
