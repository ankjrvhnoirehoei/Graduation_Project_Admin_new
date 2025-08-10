import React from 'react';
import { Card, Typography, Tag, Space, Button, Avatar, Image, Descriptions, Divider } from 'antd';
import { UserOutlined, CloseOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Report, UserTarget, ContentTarget } from '../components/report/type';
import { reasonMap } from '../utils/reasons';
import { getReportMode, isUserTarget, isContentTarget } from '../components/custom/reportUtils';

const { Title, Text, Paragraph } = Typography;

type ReportMode = 'user' | 'content';

interface ReportDetailsProps {
  selectedReport: Report | null;
  showTargetReports: boolean;
  targetSearchInfo?: { target: UserTarget | ContentTarget; mode: ReportMode } | null;
  onDismissReport: (reportId: string, mode: ReportMode) => void;
  onResolveReport: (reportId: string, mode: ReportMode) => void;
  onBanResolveReport: (reportId: string, mode: ReportMode) => void;
  onSearchTarget: (id: string, mode: ReportMode) => void;   
}

export default function ReportDetails({
  selectedReport,
  showTargetReports,
  targetSearchInfo,
  onDismissReport,
  onResolveReport,
  onBanResolveReport,
  onSearchTarget,
}: ReportDetailsProps) {
  if (!selectedReport) {
    return (
      <div className="lg:col-span-1">
        <Card>
          <div className="text-center text-gray-500 py-8">
            <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
            <div>Chọn một báo cáo để xem chi tiết</div>
          </div>
        </Card>
      </div>
    );
  }

  console.log({ showTargetReports, targetSearchInfo, selectedReport });
  const renderTargetInfo = () => {
  // If we're in target-search mode use the stored target info
  if (showTargetReports && targetSearchInfo) {
    const target = targetSearchInfo.target;

    if (isUserTarget(target)) {
      return (
        <Space>
          <Avatar size={32} icon={<UserOutlined />} src={target.profilePic} />
          <div>
            <Text strong>{target.handleName}</Text><br />
            <Text type="secondary" style={{ fontSize: '12px' }}>@{target.username}</Text><br />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              ID:{' '}
              <a
                onClick={() => onSearchTarget(target._id, targetSearchInfo.mode)}
                style={{ cursor: 'pointer' }}
              >
                <u>{target._id}</u>
              </a>
            </Text>
          </div>
        </Space>
      );
    } else if (isContentTarget(target)) {
      return (
        <div>
          <Space style={{ marginBottom: 8 }}>
            <Avatar size={32} icon={<UserOutlined />} src={target.user?.profilePic} />
            <div>
              <Text strong>Bài viết của {target.user?.handleName}</Text><br />
              <Text type="secondary" style={{ fontSize: '12px' }}>Loại: {target.type}</Text><br />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                ID:{' '}
                <a
                  onClick={() => onSearchTarget(target._id, targetSearchInfo.mode)}
                  style={{ cursor: 'pointer' }}
                >
                  <u>{target._id}</u>
                </a>
              </Text>
            </div>
          </Space>

          {target.caption && (
            <Paragraph style={{ fontSize: '12px', margin: '8px 0' }}>{target.caption}</Paragraph>
          )}

          {target.media?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Space direction="vertical" size="small">
                {target.media.map((media: any, index: number) => (
                  <div key={media._id || index}>
                    {media.videoUrl && (
                      <video src={media.videoUrl} controls style={{ width: '100%', maxWidth: 300, borderRadius: 6 }} />
                    )}
                    {media.imageUrl && (
                      <Image src={media.imageUrl} alt={`Media ${index + 1}`} style={{ maxWidth: 300, borderRadius: 6 }} />
                    )}
                  </div>
                ))}
              </Space>
            </div>
          )}
        </div>
      );
    }
  }

  // Not search-mode: show target info from the selectedReport (guard against undefined)
  if (!selectedReport) return null;

  // User target
  if (isUserTarget(selectedReport.target)) {
    const t = selectedReport.target;
    return (
      <Space>
        <Avatar size={32} icon={<UserOutlined />} src={t.profilePic} />
        <div>
          <Text strong>{t.handleName}</Text><br />
          <Text type="secondary" style={{ fontSize: '12px' }}>@{t.username}</Text><br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            ID:{' '}
            <a
              onClick={() => {
                const id = t._id;
                const mode: ReportMode = getReportMode(selectedReport);
                onSearchTarget(id, mode);
              }}
              style={{ cursor: 'pointer' }}
            >
              <u>{t._id}</u>
            </a>
          </Text>
        </div>
      </Space>
    );
  }

  // Content target
  if (isContentTarget(selectedReport.target)) {
    const t = selectedReport.target;
    return (
      <div>
        <Space style={{ marginBottom: 8 }}>
          <Avatar size={32} icon={<UserOutlined />} src={t.user?.profilePic} />
          <div>
            <Text strong>Bài viết của {t.user?.handleName}</Text><br />
            <Text type="secondary" style={{ fontSize: '12px' }}>Loại: {t.type}</Text><br />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              ID:{' '}
              <a
                onClick={() => {
                  const id = t._id;
                  const mode: ReportMode = getReportMode(selectedReport);
                  onSearchTarget(id, mode);
                }}
                style={{ cursor: 'pointer' }}
              >
                <u>{t._id}</u>
              </a>
            </Text>
          </div>
        </Space>

        {t.caption && <Paragraph style={{ fontSize: '12px', margin: '8px 0' }}>{t.caption}</Paragraph>}

        {t.media?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <Space direction="vertical" size="small">
              {t.media.map((media: any, index: number) => (
                <div key={media._id || index}>
                  {media.videoUrl && (
                    <video src={media.videoUrl} controls style={{ width: '100%', maxWidth: 300, borderRadius: 6 }} />
                  )}
                  {media.imageUrl && (
                    <Image src={media.imageUrl} alt={`Media ${index + 1}`} style={{ maxWidth: 300, borderRadius: 6 }} />
                  )}
                </div>
              ))}
            </Space>
          </div>
        )}
      </div>
    );
  }

  return null;
};

  const getStatusTag = () => {
    if (selectedReport.resolved) {
      return (
        <Tag 
          color={selectedReport.isDismissed ? 'red' : 'green'}
          icon={selectedReport.isDismissed ? <CloseOutlined /> : <CheckOutlined />}
        >
          {selectedReport.isDismissed ? 'Đã bỏ qua' : 'Đã giải quyết'}
        </Tag>
      );
    }
    return (
      <Tag color="orange" icon={<ClockCircleOutlined />}>
        Đang chờ
      </Tag>
    );
  };

  return (
    <div className="lg:col-span-1">
      <Card>
        <Title level={5} style={{ marginBottom: 16 }}>Chi tiết báo cáo</Title>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Lý do">
              <Tag color="geekblue">
                {reasonMap[selectedReport.reason] || selectedReport.reason}
              </Tag>
            </Descriptions.Item>
            
            {selectedReport.description && (
              <Descriptions.Item label="Mô tả">
                <Paragraph style={{ margin: 0, fontSize: '13px' }}>
                  {selectedReport.description}
                </Paragraph>
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label="Trạng thái">
              {getStatusTag()}
            </Descriptions.Item>
            
            <Descriptions.Item label="Ngày tạo">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}
              </Text>
            </Descriptions.Item>
            
            <Descriptions.Item label="Cập nhật">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(selectedReport.updatedAt).toLocaleString('vi-VN')}
              </Text>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: '16px 0' }} />

          <div>
            <Title level={5} style={{ marginBottom: 12 }}>Đối tượng bị báo cáo</Title>
            {renderTargetInfo()}
          </div>

          {!selectedReport.resolved && (
            <>
                <Divider style={{ margin: '16px 0' }} />
                <Space style={{ width: '100%' }}>
                <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => onDismissReport(selectedReport._id, getReportMode(selectedReport))}
                    style={{ flex: 1 }}
                >
                    Bỏ qua
                </Button>

                <Button
                    type="default"
                    onClick={() => {
                    // confirmation
                    const proceed = window.confirm('Bạn chắc chắn muốn cấm đối tượng và giải quyết báo cáo này?');
                    if (proceed) onBanResolveReport(selectedReport._id, getReportMode(selectedReport));
                    }}
                    style={{ flex: 1 }}
                >
                    Cấm & Giải quyết
                </Button>

                <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => onResolveReport(selectedReport._id, getReportMode(selectedReport))}
                    style={{ flex: 1 }}
                >
                    Giải quyết
                </Button>
                </Space>
            </>
            )}
        </Space>
      </Card>
    </div>
  );
}