import React from 'react';
import { Card, Avatar, Tag, Typography, Space } from 'antd';
import { UserOutlined, FileTextOutlined, VideoCameraOutlined, PictureOutlined } from '@ant-design/icons';
import { Report, UserTarget, ContentTarget } from '../components/report/type';
import { reasonMap } from '../utils/reasons';
import { getTargetDisplayInfo } from '../components/custom/reportUtils';

const { Text, Paragraph } = Typography;

type ReportMode = 'user' | 'content';

interface ReportListItemProps {
  report: Report;
  isSelected: boolean;
  onSelect: (report: Report) => void;
  showTargetReports: boolean;
  targetSearchInfo?: { target: UserTarget | ContentTarget; mode: ReportMode } | null;
}

export default function ReportListItem({
  report,
  isSelected,
  onSelect,
  showTargetReports,
  targetSearchInfo
}: ReportListItemProps) {
  const targetInfo = getTargetDisplayInfo(report, showTargetReports, targetSearchInfo);

  const getStatusTag = () => {
    if (report.resolved) {
      return (
        <Tag color={report.isDismissed ? 'red' : 'green'}>
          {report.isDismissed ? 'Đã bỏ qua' : 'Đã giải quyết'}
        </Tag>
      );
    }
    return null;
  };

  const getMediaIcon = (media: any) => {
    if (media.videoUrl) return <VideoCameraOutlined />;
    if (media.imageUrl) return <PictureOutlined />;
    return <FileTextOutlined />;
  };

  return (
    <Card
      hoverable
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-md' : ''
      }`}
      style={{
        backgroundColor: report.resolved 
          ? (report.isDismissed ? '#fff2f0' : '#f6ffed') 
          : undefined
      }}
      onClick={() => onSelect(report)}
    >
      <div className="flex justify-between items-start mb-3">
        <Space>
          {targetInfo && (
            <>
              {showTargetReports && targetInfo.type === 'content' && targetInfo.media && targetInfo.media.length > 0 ? (
                <Avatar
                  size={40}
                  icon={getMediaIcon(targetInfo.media[0])}
                  src={targetInfo.media[0].imageUrl}
                  style={{ backgroundColor: '#f56a00' }}
                />
              ) : (
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={targetInfo.profilePic}
                />
              )}
              <div>
                <Text strong>{targetInfo.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  @{targetInfo.username}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  ID: {targetInfo.id}
                  {targetInfo.type === 'content' && ` (${targetInfo.contentType})`}
                </Text>
              </div>
            </>
          )}
        </Space>
        
        <Space direction="vertical" align="end" size="small">
          {getStatusTag()}
          {!report.isRead && (
            <Tag color="blue">Mới</Tag>
          )}
        </Space>
      </div>
      
      <div className="mb-3">
        <Tag color="geekblue">
          {reasonMap[report.reason] || report.reason}
        </Tag>
      </div>
      
      {report.description && (
        <Paragraph 
          ellipsis={{ rows: 2 }} 
          style={{ marginBottom: 8, fontSize: '13px' }}
        >
          {report.description}
        </Paragraph>
      )}
      
      <Text type="secondary" style={{ fontSize: '11px' }}>
        {new Date(report.createdAt).toLocaleString('vi-VN')}
      </Text>
    </Card>
  );
}