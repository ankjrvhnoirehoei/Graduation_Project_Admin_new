import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui/tabs';
import DateRangePicker from '../components/custom/DateRangePicker';
import ExportControls from '../components/report/ExportControls';
import DashboardSummary from '../components/report/DashboardSummary';
import ChartsSection from '../components/report/ChartsSection';
import DetailedTables from '../components/report/DetailedTables';
import { RangeType, TableType } from '../components/report/type';

export default function NewReportToday() {
  const [rangeType, setRangeType] = useState<RangeType>('7days');

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <DateRangePicker value={rangeType} onChange={setRangeType} />
        <ExportControls />
      </div>

      {/* Dashboard Summary */}
      <DashboardSummary rangeType={rangeType} />

      {/* Charts & Trends */}
      <ChartsSection rangeType={rangeType} />
      
    </div>
  );
}
