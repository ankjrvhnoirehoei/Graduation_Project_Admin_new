import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { differenceInDays, eachDayOfInterval, eachMonthOfInterval, format, subDays, subMonths } from 'date-fns';

type RangeType = 'year' | '30days' | '7days';

interface UserGrowthProps {
  /** choose a preset, or provide custom start/end */
  rangeType?: RangeType;
  start?: Date;
  end?: Date;
  data: { date: string; users: number }[];
}

export function UserGrowthChart({ rangeType = 'year', start, end }: UserGrowthProps) {
  const today = new Date();
  let from = start ?? (rangeType === '7days' ? subDays(today, 6) : rangeType === '30days' ? subDays(today, 29) : subMonths(today, 11));
  let to = end ?? today;

  const spanDays = differenceInDays(to, from);
  const useMonths = spanDays > 60;
  const labels = useMonths
    ? eachMonthOfInterval({ start: from, end: to }).map((d) => format(d, 'MMM'))
    : eachDayOfInterval({ start: from, end: to }).map((d) => format(d, 'dd/MM'));

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const chartData = labels.map((label) => ({ date: label, users: rand(100, 800) }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
