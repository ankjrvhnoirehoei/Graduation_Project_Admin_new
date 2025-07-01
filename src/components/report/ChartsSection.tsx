import { eachDayOfInterval, format } from 'date-fns';
import { UserGrowthChart } from './visual/UserGrowthChart';
import { ContentRadarChart } from './visual/ContentRadarChart';
import { InteractionAreaChart } from './visual/InteractionAreaChart';
import { CardContent } from '../ui/card';

interface Props {
  dateRange: { start: Date; end: Date; label: string };
  filters: { platform: string; category: string; uploader: string };
}

export default function ChartsSection({ dateRange }: Props) {
  const { start, end, label } = dateRange;

  // build list of days between start/end
  const days = eachDayOfInterval({ start, end });
  const formatted = days.map((d) => format(d, 'dd/MM'));

  // mock numeric generator
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // mock data arrays
  const usersData = formatted.map((date) => ({ date, users: rand(50, 300) }));
  const contentData = formatted.map((date) => ({
    date,
    posts: rand(10, 80),
    reels: rand(5, 60),
    stories: rand(8, 70),
  }));
  const interactionsData = formatted.map((date) => ({
    date,
    likes: rand(200, 1000),
    comments: rand(20, 200),
    follows: rand(5, 100),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow h-[444px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ tăng trưởng người dùng ({label})
        </h3>
        <CardContent className='h-[400px]'> <UserGrowthChart start={start} end={end} data={usersData} /> </CardContent>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[444px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ hoạt động video ({label})
        </h3>
        <CardContent className='h-[400px]'> <ContentRadarChart start={start} end={end} data={contentData} /> </CardContent>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[444px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ tương tác ({label})
        </h3>
        <CardContent className='h-[400px]'> <InteractionAreaChart 
          start={start}
          end={end}
          data={interactionsData}
        /></CardContent>
      </div>
    </div>
  );
}
