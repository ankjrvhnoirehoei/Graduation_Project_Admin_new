import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../lib/axios';

interface StoryDataPoint {
  period: string;
  stories: number;
  views: number;
}

export default function StoryAreaChart() {
  const [chartData, setChartData] = useState<StoryDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Use the new story activity endpoint
        const res = await api.get('/admin/stories/activity', {
          headers: { token: true },
          params: { range: 'year' }
        });
        
        if (res.data.success) {
          setChartData(res.data.data);
        } else {
          setError('Không thể tải dữ liệu stories');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi khi tải dữ liệu stories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-sm p-4">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <style jsx>{`
        :global(.recharts-surface) {
          background-color: #ffc0cb !important;
        }
      `}</style>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê Stories theo thời gian</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="stories" 
            stackId="1" 
            stroke="#8884d8" 
            fill="#8884d8" 
            name="Stories"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}