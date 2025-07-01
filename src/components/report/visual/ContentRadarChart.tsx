import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
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
  let from = start ?? (rangeType === '7days' ? subDays(today, 6) : rangeType === '30days' ? subDays(today, 29) : subMonths(today, 11));
  let to = end ?? today;

  const spanDays = differenceInDays(to, from);
  const useMonths = spanDays > 60;
  const labels = useMonths
    ? eachMonthOfInterval({ start: from, end: to }).map((d) => format(d, 'MMM'))
    : eachDayOfInterval({ start: from, end: to }).map((d) => format(d, 'dd/MM'));

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const chartData = labels.map((label) => ({
    date: label,
    posts: rand(10, 80),
    reels: rand(5, 60),
    stories: rand(8, 70),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <PolarGrid gridType="circle" radialLines={false} stroke="#E5E7EB" />
        <PolarAngleAxis dataKey="date" tick={{ fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
        <Radar name="Bài đăng" dataKey="posts" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
        <Radar name="Reels" dataKey="reels" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
        <Radar name="Stories" dataKey="stories" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}