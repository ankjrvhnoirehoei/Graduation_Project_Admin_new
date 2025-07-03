import { UserGrowthChart } from './visual/UserGrowthChart';
import { ContentRadarChart } from './visual/ContentRadarChart';
import { InteractionAreaChart } from './visual/InteractionAreaChart';
import { CardContent } from '../ui/card';
import { RangeType } from '../../components/report/type';

interface Props {
  rangeType: RangeType;
}

// Map RangeType to label
const rangeTypeLabel: Record<RangeType, string> = {
  '7days': '7 ngày trước',
  '30days': '30 ngày trước',
  'year': 'Năm nay',
};

export default function ChartsSection({ rangeType }: Props) {
  const label = rangeTypeLabel[rangeType];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow h-[444px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ tăng trưởng người dùng ({label})
        </h3>
        <CardContent className='h-[400px]'> <UserGrowthChart rangeType={rangeType} /> </CardContent>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[444px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ hoạt động video ({label})
        </h3>
        <CardContent className='h-[400px]'> <ContentRadarChart rangeType={rangeType} /> </CardContent>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[444px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ tương tác ({label})
        </h3>
        <CardContent className='h-[400px]'> <InteractionAreaChart rangeType={rangeType} /></CardContent>
      </div>
    </div>
  );
}