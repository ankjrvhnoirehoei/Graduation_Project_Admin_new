import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../../lib/axios';
import { RangeType } from '../../../components/report/type';


interface ApiPoint {
  period: string;
  accounts: number;
  cumulative: number;
}
interface ApiResponse {
  success: boolean;
  range: RangeType;
  unit: string;
  from: string;
  to: string;
  data: ApiPoint[];
}

interface UserGrowthProps {
  rangeType?: 'year' | '30days' | '7days';
}

export function UserGrowthChart({ rangeType = 'year' }: UserGrowthProps) {
  const [chartData, setChartData] = useState<ApiPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/cumulative', {
          headers: { token: true },
          params: { range: rangeType }
        });
        if (res.data.success) {
          setChartData(res.data.data);
        } else {
          setError('Không thể tải dữ liệu tăng trưởng');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rangeType]);

  if (loading) return <div className="flex h-full items-center justify-center">Đang tải...</div>;
  if (error)   return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize:12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="cumulative" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
