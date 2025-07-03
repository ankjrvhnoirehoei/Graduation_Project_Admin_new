import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../../lib/axios';
import { RangeType } from '../../../components/report/type';

interface ContentPoint {
  period: string;
  posts: number;
  reels: number;
  stories: number;
}
interface ApiResponse {
  success: boolean;
  range: RangeType;
  unit: string;
  from: string;
  to: string;
  data: ContentPoint[];
}

interface Props {
  rangeType?: RangeType;
}

export function ContentRadarChart({ rangeType = 'year' }: Props) {
  const [chartData, setChartData] = useState<ContentPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/content', {
          headers: { token: true },
          params: { range: rangeType }
        });
        if (res.data.success) {
          setChartData(res.data.data);
        } else {
          setError('Không thể tải dữ liệu nội dung');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi khi tải dữ liệu nội dung');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [rangeType]);

  if (loading) return <div className="flex h-full items-center justify-center">Đang tải...</div>;
  if (error)   return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top:10, right:10, bottom:10, left:0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize:12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize:12 }} />
        <Bar dataKey="posts"  stackId="a" fill="#6366F1" />
        <Bar dataKey="reels"  stackId="a" fill="#EC4899" />
        <Bar dataKey="stories"stackId="a" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
