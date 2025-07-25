import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StoriesReportManagement } from '../components/report/StoriesReportManagement';
import { StoriesReportChart } from '../components/report/visual/StoriesReportChart';
import { RangeType } from '../components/report/type';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function StoriesReport() {
  const [rangeType, setRangeType] = useState<RangeType>('year');

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý báo cáo Stories</h1>
          <p className="text-gray-500">
            Quản lý và theo dõi các báo cáo về stories
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={rangeType} onValueChange={(value: RangeType) => setRangeType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 ngày trước</SelectItem>
              <SelectItem value="30days">30 ngày trước</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Section */}
      <Card className="h-[490px] pt-1">
        <CardHeader>
          <CardTitle>Thống kê báo cáo Stories theo lý do</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <StoriesReportChart rangeType={rangeType} />
        </CardContent>
      </Card>

      {/* Reports Management Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="bg-muted p-1 rounded mb-4">
          <TabsTrigger value="all">Tất cả báo cáo</TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
          <TabsTrigger value="unresolved">Chưa giải quyết</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <StoriesReportManagement mode="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardContent className="p-6">
              <StoriesReportManagement mode="unread" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unresolved">
          <Card>
            <CardContent className="p-6">
              <StoriesReportManagement mode="unresolved" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}