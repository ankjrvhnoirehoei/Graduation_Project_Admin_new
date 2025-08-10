import React from 'react';
import { Card, Typography, Button, Space, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Report, UserTarget, ContentTarget } from '../components/report/type';
import ReportListItem from './ReportListItem';

const { Title } = Typography;

type ReportMode = 'user' | 'content';
type ViewMode = 'all' | 'unresolved';

interface ReportListProps {
  reports: Report[];
  targetReports: Report[];
  showTargetReports: boolean;
  reportMode: ReportMode;
  viewMode: ViewMode;
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
  onBackToMain: () => void;
  targetSearchInfo?: { target: UserTarget | ContentTarget; mode: ReportMode } | null;
}

export default function ReportList({
  reports,
  targetReports,
  showTargetReports,
  reportMode,
  viewMode,
  selectedReport,
  onSelectReport,
  onBackToMain,
  targetSearchInfo
}: ReportListProps) {
  const displayReports = showTargetReports ? targetReports : reports;
  
  const getTitle = () => {
    if (showTargetReports) return 'Báo cáo theo đối tượng';
    const typeText = reportMode === 'user' ? 'người dùng' : 'nội dung';
    const modeText = viewMode === 'all' ? 'tất cả' : 'chưa giải quyết';
    return `Báo cáo ${typeText} (${modeText})`;
  };

  return (
    <div className="lg:col-span-2">
      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          {getTitle()}
        </Title>
        
        {showTargetReports && (
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={onBackToMain}
            style={{ padding: 0, marginBottom: 16 }}
          >
            Quay lại báo cáo chính
          </Button>
        )}

        {displayReports.length === 0 ? (
          <Empty
            description="Không có báo cáo nào"
            style={{ padding: '40px 0' }}
          />
        ) : (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {displayReports.map((report) => (
              <ReportListItem
                key={report._id}
                report={report}
                isSelected={selectedReport?._id === report._id}
                onSelect={onSelectReport}
                showTargetReports={showTargetReports}
                targetSearchInfo={targetSearchInfo}
              />
            ))}
          </Space>
        )}
      </Card>
    </div>
  );
}