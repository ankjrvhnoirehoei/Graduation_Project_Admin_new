import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../../lib/axios';
import { RangeType } from '../../../components/report/type';
import { reasonMap } from '../../../utils/reasons';

interface ReportedUserPoint {
  period: string;
  [username: string]: string | number;
}

interface ApiResponse {
  success: boolean;
  range: RangeType;
  unit: string;
  from: string;
  to: string;
  data: ReportedUserPoint[];
}

interface Props {
  rangeType?: RangeType;
}

const USER_COLORS = [
  '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F472B6',
  '#A855F7', '#22C55E', '#EAB308', '#DC2626', '#0EA5E9', '#65A30D',
  '#EA580C', '#7C3AED', '#059669', '#BE185D', '#7E22CE', '#16A34A',
  '#D97706', '#B91C1C', '#0284C7', '#4D7C0F', '#C2410C', '#5B21B6'
];

const CustomLegend = ({ users }: { users: string[] }) => {
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 3;
  const visibleUsers = showAll ? users : users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 text-xs mt-2"
      onMouseEnter={() => setShowAll(true)}
      onMouseLeave={() => setShowAll(false)}
    >
      {visibleUsers.map((username, index) => (
        <div key={username} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: USER_COLORS[index % USER_COLORS.length] }}
          />
          <span className="max-w-[100px] truncate" title={username}>
            {username}
          </span>
        </div>
      ))}
      {!showAll && remainingCount > 0 && (
        <div className="relative">
          <button
            className="text-blue-600 hover:text-blue-800 underline"
          >
            +{remainingCount} khác
          </button>
        </div>
      )}
      {showAll && (
        <button
          className="text-blue-600 hover:text-blue-800 underline"
        >
        </button>
      )}
    </div>
  );
};
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Filter out entries with value 0
    const nonZeroPayload = payload.filter((entry: any) => entry.value > 0);
    
    if (nonZeroPayload.length === 0) {
      return null;
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {nonZeroPayload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {reasonMap[entry.dataKey] || entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportedUsersChart({ rangeType = 'year' }: Props) {
  const [chartData, setChartData] = useState<ReportedUserPoint[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/reported', {
          headers: { token: true },
          params: { range: rangeType }
        });
        
        if (res.data.success) {
          // Filter out users with zero reports
          const { filteredData, usersWithReports } = filterActiveUsers(res.data.data);
          setChartData(filteredData);
          setActiveUsers(usersWithReports);
        } else {
          setError('Không thể tải dữ liệu người dùng bị báo cáo');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi khi tải dữ liệu người dùng bị báo cáo');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rangeType]);

  // Function to filter out users with zero reports across all periods
  const filterActiveUsers = (data: ReportedUserPoint[]) => {
    if (data.length === 0) return { filteredData: [], usersWithReports: [] };

    // Get all possible user keys (excluding 'period')
    const allUserKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'period') {
          allUserKeys.add(key);
        }
      });
    });

    // Find users who have at least 1 report across all periods
    const usersWithReports: string[] = [];
    allUserKeys.forEach(username => {
      const totalReports = data.reduce((sum, item) => {
        const reportCount = typeof item[username] === 'number' ? item[username] : 0;
        return sum + reportCount;
      }, 0);
      
      if (totalReports > 0) {
        usersWithReports.push(username);
      }
    });

    // Filter the data to only include active users
    const filteredData = data.map(item => {
      const filteredItem: ReportedUserPoint = { period: item.period };
      usersWithReports.forEach(username => {
        filteredItem[username] = item[username] || 0;
      });
      return filteredItem;
    });

    return { filteredData, usersWithReports };
  };

  if (loading) return <div className="flex h-full items-center justify-center">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  // Show message if no users have reports
  if (activeUsers.length === 0) {
    return <div className="flex h-full items-center justify-center text-gray-500">Không có người dùng nào bị báo cáo trong khoảng thời gian này</div>;
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="93%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          {activeUsers.map((username, index) => (
            <Line
              key={username}
              type="monotone"
              dataKey={username}
              stroke={USER_COLORS[index % USER_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <CustomLegend users={activeUsers} />
    </div>
  );
}