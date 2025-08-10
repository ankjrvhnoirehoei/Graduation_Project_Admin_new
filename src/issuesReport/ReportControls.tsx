import React from 'react';
import { Card, Select, Button, Input, Typography, Space, Divider } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

type ReportMode = 'user' | 'content';
type ViewMode = 'all' | 'unresolved';

interface ReportControlsProps {
  reportMode: ReportMode;
  setReportMode: (mode: ReportMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onRefresh: () => void;
  loading: boolean;
  targetMode: ReportMode;
  setTargetMode: (mode: ReportMode) => void;
  targetId: string;
  setTargetId: (id: string) => void;
  onTargetSearch: () => void;
}

export default function ReportControls({
  reportMode,
  setReportMode,
  viewMode,
  setViewMode,
  onRefresh,
  loading,
  targetMode,
  setTargetMode,
  targetId,
  setTargetId,
  onTargetSearch
}: ReportControlsProps) {
  return (
    <Card className="mb-6">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space wrap size="middle" align="end">
          <div>
            <label className="block text-sm font-medium mb-2">Loại báo cáo:</label>
            <Select
              value={reportMode}
              onChange={(value) => setReportMode(value as ReportMode)}
              style={{ width: 160 }}
              options={[
                { value: 'content', label: 'Báo cáo nội dung' },
                { value: 'user', label: 'Báo cáo người dùng' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chế độ xem:</label>
            <Select
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              style={{ width: 160 }}
              options={[
                { value: 'all', label: 'Tất cả báo cáo' },
                { value: 'unresolved', label: 'Chỉ chưa giải quyết' }
              ]}
            />
          </div>
          
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>

        <Divider />

        <div>
          <Title level={5} style={{ marginBottom: 16 }}>Tìm báo cáo theo đối tượng</Title>
          <Space wrap size="middle" align="end">
            <div>
              <label className="block text-sm font-medium mb-2">Loại đối tượng:</label>
              <Select
                value={targetMode}
                onChange={(value) => setTargetMode(value as ReportMode)}
                style={{ width: 140 }}
                options={[
                  { value: 'content', label: 'ID nội dung' },
                  { value: 'user', label: 'ID người dùng' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ID đối tượng:</label>
              <Input
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Nhập ID đối tượng"
                style={{ width: 250 }}
              />
            </div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onTargetSearch}
              loading={loading}
              disabled={!targetId.trim()}
            >
              Tìm kiếm
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
}