import React, { useState, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from 'recharts';
import api from '../../lib/axios';

interface StoryRadarData {
  category: string;
  value: number;
}

export default function StoryRadarChart() {
  const [chartData, setChartData] = useState<StoryRadarData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use the new story engagement endpoint
        const res = await api.get('/admin/stories/engagement', {
          headers: { token: true },
          params: { range: 'year' }
        });
        
        if (res.data.success) {
          setChartData(res.data.data);
        } else {
          // Fallback to mock data if API fails
          const mockData = [
            { category: 'Tương tác', value: 85 },
            { category: 'Chia sẻ', value: 78 },
            { category: 'Bình luận', value: 65 },
            { category: 'Thích', value: 88 },
            { category: 'Lưu', value: 72 }
          ];
          setChartData(mockData);
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockData = [
          { category: 'Tương tác', value: 85 },
          { category: 'Chia sẻ', value: 78 },
          { category: 'Bình luận', value: 65 },
          { category: 'Thích', value: 88 },
          { category: 'Lưu', value: 72 }
        ];
        setChartData(mockData);
        console.warn('Using mock data for story radar chart');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center">Đang tải...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <style jsx>{`
        :global(.recharts-surface) {
          background-color: #ffc0cb !important;
        }
      `}</style>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân tích Stories</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis />
          <Radar
            name="Stories"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}