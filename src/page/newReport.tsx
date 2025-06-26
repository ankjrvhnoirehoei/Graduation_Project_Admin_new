import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import DateRangePicker from "../components/custom/DateRangePicker";
import FiltersBar from "../components/report/FiltersBar";
import ExportControls from "../components/report/ExportControls";
import DashboardSummary from "../components/report/DashboardSummary";
import ChartsSection from "../components/report/ChartsSection";
import DetailedTables from "../components/report/DetailedTables";
import { DateRange, Filters, TableType } from "../components/report/type";

export default function NewReportToday() {
  const [dateRange, setDateRange] = useState<DateRange>({
    label: "7 ngày qua",
    start: new Date(new Date().setDate(new Date().getDate() - 6)),
    end: new Date(),
  });

  const [filters, setFilters] = useState<Filters>({
    platform: "all",
    category: "all",
    uploader: "all",
  });

  const tableTabs: { label: string; value: TableType }[] = [
    { label: "Người dùng mới", value: "users" },
    { label: "Video mới", value: "videos" },
    { label: "Hiệu suất nội dung", value: "performance" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <FiltersBar filters={filters} onChange={setFilters} />
        <ExportControls />
      </div>

      {/* Dashboard Summary */}
      <DashboardSummary dateRange={dateRange} filters={filters} />

      {/* Charts & Trends */}
      <ChartsSection dateRange={dateRange} filters={filters} />

      {/* Detailed Data Tables */}
      <Tabs defaultValue="users" className="mt-8">
        <TabsList className="mb-4">
          {tableTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tableTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardContent className="p-0">
                <DetailedTables
                  type={tab.value}
                  dateRange={dateRange}
                  filters={filters}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
