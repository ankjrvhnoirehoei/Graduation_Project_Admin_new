import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { RangeType } from '../../components/report/type';

const rangeTypeLabel: Record<RangeType, string> = {
  '7days':  '7 ngày trước',
  '30days': '30 ngày trước',
  'year':   'Năm nay',
};

interface ApiResponse {
  success: boolean;
  range: RangeType;
  unit: string;
  from: string;
  to: string;
  data: {
    users: number;
    contents: number;
    views: number;
    comments: number;
    fluctuation: { percentageChange: number; trend: string };
  };
}

interface Props {
  rangeType: RangeType;
}

export default function DashboardSummary({ rangeType }: Props) {
  const [metrics, setMetrics] = useState<null | ApiResponse['data']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/stats', {
          headers: { token: true },
          params: { range: rangeType }
        });
        if (res.data.success) {
          setMetrics(res.data.data);
        } else {
          setError('Không thể tải Dashboard summary');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [rangeType]);

  if (error)   return <div className="text-red-500 text-sm">{error}</div>;

  if (!metrics) return null;
  const cards = [
    { label: 'Người dùng mới', value: metrics.users,    change: `${metrics.fluctuation.percentageChange}%` },
    { label: 'Bài viết mới',      value: metrics.contents, change: `${metrics.fluctuation.percentageChange}%` },
    { label: 'Bình luận',      value: metrics.comments, change: `${metrics.fluctuation.percentageChange}%` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c,i) => (
        <div key={i} className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">{c.label}</p>
          <h2 className="text-2xl font-bold text-gray-800">{c.value}</h2>
          <p className={c.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
            {c.change}
          </p>
        </div>
      ))}
    </div>
  );
}
