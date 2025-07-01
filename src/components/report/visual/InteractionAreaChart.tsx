import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { differenceInDays, eachDayOfInterval, eachMonthOfInterval, format, subDays, subMonths } from 'date-fns';

type RangeType = 'year' | '30days' | '7days';

interface InteractionAreaProps {
  rangeType?: RangeType;
  start?: Date;
  end?: Date;
  data: { date: string; likes: number; comments: number; follows: number; }[]
}

export function InteractionAreaChart({ rangeType = 'year', start, end }: InteractionAreaProps) {
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
    likes: rand(200, 1000),
    comments: rand(20, 200),
    follows: rand(5, 100),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="likes" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="comments" stroke="#EC4899" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="follows" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
