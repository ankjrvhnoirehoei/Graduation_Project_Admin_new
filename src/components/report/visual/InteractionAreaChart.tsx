import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../../lib/axios';
import { RangeType } from '../../../components/report/type';

interface Point {
  period: string;
  likes: number;
  comments: number;
  follows: number;
}
interface ApiResponse {
  success: boolean;
  range: RangeType;
  unit: string;
  from: string;
  to: string;
  data: Point[];
}

interface Props {
  rangeType?: RangeType;
}

export function InteractionAreaChart({ rangeType = 'year' }: Props) {
  const [chartData, setChartData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/engagement', {
          headers: { token: true },
          params: { range: rangeType }
        });
        if (res.data.success) {
          setChartData(res.data.data);
        } else {
          setError('Không thể tải dữ liệu tương tác');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi khi tải dữ liệu tương tác');
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
      <LineChart data={chartData} margin={{ top:10, right:20, bottom:10, left:0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize:12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize:12 }} />
        <Line type="monotone" dataKey="likes"    stroke="#3B82F6" strokeWidth={2} dot={{ r:3 }} />
        <Line type="monotone" dataKey="comments" stroke="#EC4899" strokeWidth={2} dot={{ r:3 }} />
        <Line type="monotone" dataKey="follows"  stroke="#10B981" strokeWidth={2} dot={{ r:3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
