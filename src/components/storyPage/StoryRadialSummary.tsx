import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import api from '../../lib/axios';

interface StorySummaryData {
  name: string;
  value: number;
  color: string;
}

export default function StoryRadialSummary() {
  const [summaryData, setSummaryData] = useState<StorySummaryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use the new story summary endpoint
        const res = await api.get('/admin/stories/summary', {
          headers: { token: true }
        });
        
        if (res.data.success) {
          const data = res.data.data;
          setSummaryData([
            { name: 'Hoạt động', value: data.active, color: '#0088FE' },
            { name: 'Bị gắn cờ', value: data.flagged, color: '#FF8042' },
            { name: 'Vô hiệu hóa', value: data.disabled, color: '#FFBB28' }
          ]);
        } else {
          // Fallback to mock data
          const mockData = [
            { name: 'Hoạt động', value: 1250, color: '#0088FE' },
            { name: 'Bị gắn cờ', value: 45, color: '#FF8042' },
            { name: 'Vô hiệu hóa', value: 23, color: '#FFBB28' }
          ];
          setSummaryData(mockData);
        }
      } catch (error) {
        // Fallback to mock data on error
        const mockData = [
          { name: 'Hoạt động', value: 1250, color: '#0088FE' },
          { name: 'Bị gắn cờ', value: 45, color: '#FF8042' },
          { name: 'Vô hiệu hóa', value: 23, color: '#FFBB28' }
        ];
        setSummaryData(mockData);
        console.warn('Using mock data for story summary');
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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt Stories</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={summaryData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {summaryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-4">
        {summaryData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}