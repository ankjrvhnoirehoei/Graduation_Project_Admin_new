import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import { reasonMap } from '../../../utils/reasons';
import api from '../../../lib/axios';
import { RangeType } from '../type';

interface ReportReasonPoint {
  period: string;
  HARASSMENT_AND_BULLYING: number;
  HATE_SPEECH: number;
  IMPERSONATION_FAKE_ACCOUNTS: number;
  GRAPHIC_CONTENT: number;
  THREATS_AND_VIOLENCE: number;
  SCAMS_AND_FRAUD: number;
  SENSITIVE_PERSONAL_INFO: number;
  SELF_HARM: number;
  OTHER: number;
}

interface ApiResponse {
  success: boolean;
  range: RangeType;
  unit: string;
  from: string;
  to: string;
  data: ReportReasonPoint[];
}

interface Props {
  rangeType?: RangeType;
}

const reasonColors: Record<string, string> = {
  HARASSMENT_AND_BULLYING: "#EF4444",
  HATE_SPEECH: "#F97316",
  IMPERSONATION_FAKE_ACCOUNTS: "#EAB308",
  GRAPHIC_CONTENT: "#22C55E",
  THREATS_AND_VIOLENCE: "#3B82F6",
  SCAMS_AND_FRAUD: "#8B5CF6",
  SENSITIVE_PERSONAL_INFO: "#EC4899",
  SELF_HARM: "#06B6D4",
  OTHER: "#64748B",
};

const CustomLegend = () => {
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 3;
  const reasons = Object.keys(reasonMap);
  const visibleReasons = showAll ? reasons : reasons.slice(0, maxVisible);
  const remainingCount = reasons.length - maxVisible;

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 text-xs mt-2"
      onMouseEnter={() => setShowAll(true)}
      onMouseLeave={() => setShowAll(false)}
    >
      {visibleReasons.map((key) => (
        <div key={key} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: reasonColors[key] }}
          />
          <span>{reasonMap[key]}</span>
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

export function ReportsReasonsChart({ rangeType = 'year' }: Props) {
  const [chartData, setChartData] = useState<ReportReasonPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch data from both endpoints
        const [contentRes, userRes] = await Promise.all([
          api.get<ApiResponse>('/admin/reports/content/reasons', {
            headers: { token: true },
            params: { range: rangeType }
          }),
          api.get<ApiResponse>('/admin/reports/user/reasons', {
            headers: { token: true },
            params: { range: rangeType }
          })
        ]);

        if (contentRes.data.success && userRes.data.success) {
          // Combine data from both endpoints
          const combinedData = combineReportData(contentRes.data.data, userRes.data.data);
          setChartData(combinedData);
        } else {
          setError('Không thể tải dữ liệu báo cáo');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi khi tải dữ liệu báo cáo');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rangeType]);

  // Function to combine data from both endpoints
  const combineReportData = (
    contentData: ReportReasonPoint[], 
    userData: ReportReasonPoint[]
  ): ReportReasonPoint[] => {
    const combinedMap = new Map<string, ReportReasonPoint>();

    // Initialize with content data
    contentData.forEach(item => {
      combinedMap.set(item.period, { ...item });
    });

    // Add user data to existing periods or create new ones
    userData.forEach(item => {
      const existing = combinedMap.get(item.period);
      if (existing) {
        // Sum all the reason categories
        combinedMap.set(item.period, {
          period: item.period,
          HARASSMENT_AND_BULLYING: existing.HARASSMENT_AND_BULLYING + item.HARASSMENT_AND_BULLYING,
          HATE_SPEECH: existing.HATE_SPEECH + item.HATE_SPEECH,
          IMPERSONATION_FAKE_ACCOUNTS: existing.IMPERSONATION_FAKE_ACCOUNTS + item.IMPERSONATION_FAKE_ACCOUNTS,
          GRAPHIC_CONTENT: existing.GRAPHIC_CONTENT + item.GRAPHIC_CONTENT,
          THREATS_AND_VIOLENCE: existing.THREATS_AND_VIOLENCE + item.THREATS_AND_VIOLENCE,
          SCAMS_AND_FRAUD: existing.SCAMS_AND_FRAUD + item.SCAMS_AND_FRAUD,
          SENSITIVE_PERSONAL_INFO: existing.SENSITIVE_PERSONAL_INFO + item.SENSITIVE_PERSONAL_INFO,
          SELF_HARM: existing.SELF_HARM + item.SELF_HARM,
          OTHER: existing.OTHER + item.OTHER
        });
      } else {
        combinedMap.set(item.period, { ...item });
      }
    });

    // Custom sorting function
    const sortPeriods = (a: ReportReasonPoint, b: ReportReasonPoint) => {
      const periodA = a.period;
      const periodB = b.period;
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const monthIndexA = monthNames.indexOf(periodA);
      const monthIndexB = monthNames.indexOf(periodB);
      
      if (monthIndexA !== -1 && monthIndexB !== -1) {
        return monthIndexA - monthIndexB;
      }
      
      const dateRegex = /^(\d{1,2})\/(\d{1,2})$/;
      const matchA = periodA.match(dateRegex);
      const matchB = periodB.match(dateRegex);
      
      if (matchA && matchB) {
        const [, dayA, monthA] = matchA;
        const [, dayB, monthB] = matchB;
        
        // Compare month first, then day
        if (monthA !== monthB) {
          return parseInt(monthA) - parseInt(monthB);
        }
        return parseInt(dayA) - parseInt(dayB);
      }
      
      return periodA.localeCompare(periodB);
    };

    return Array.from(combinedMap.values()).sort(sortPeriods);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="HARASSMENT_AND_BULLYING" stackId="a" fill="#EF4444" />
          <Bar dataKey="HATE_SPEECH" stackId="a" fill="#F97316" />
          <Bar dataKey="IMPERSONATION_FAKE_ACCOUNTS" stackId="a" fill="#EAB308" />
          <Bar dataKey="GRAPHIC_CONTENT" stackId="a" fill="#22C55E" />
          <Bar dataKey="THREATS_AND_VIOLENCE" stackId="a" fill="#3B82F6" />
          <Bar dataKey="SCAMS_AND_FRAUD" stackId="a" fill="#8B5CF6" />
          <Bar dataKey="SENSITIVE_PERSONAL_INFO" stackId="a" fill="#EC4899" />
          <Bar dataKey="SELF_HARM" stackId="a" fill="#06B6D4" />
          <Bar dataKey="OTHER" stackId="a" fill="#64748B" />
        </BarChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
}