import React from 'react';
import { Modal, Card, Skeleton, Avatar, Space, Tag, Typography, Divider, Button, Tabs, Row, Col, Statistic } from 'antd';
import { UserOutlined, UnlockOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { UserRow } from '../custom/useUsers';
import UserContentTab from './UserContentTab';
import UserRelationsTab from './UserRelationsTab';

export default function UserViewModal({
  open,
  loading,
  user,
  onClose,
  onToggleLock,
  lockingId,
}: {
  open: boolean;
  loading: boolean;
  user: UserRow | null;
  onClose: () => void;
  onToggleLock: (id: string) => void;
  lockingId: string | null;
}) {
  return (
    <Modal
      open={open}
      footer={null}
      width={1400}
      bodyStyle={{ paddingBottom: 8 }}
      title={false}
      closable={true}
      onCancel={onClose}
    >
      <Card style={{ borderRadius: 12, marginBottom: 12 }} bordered>
        {loading || !user ? (
          <Skeleton avatar active paragraph={{ rows: 2 }} />
        ) : (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar src={user.avatar} icon={<UserOutlined />} size={72} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <Space direction="vertical" size={2}>
                <Space align="center" wrap>
                  <Typography.Title level={4} style={{ margin: 0 }}>{user.username}</Typography.Title>
                  <Tag color={user.status === 'locked' ? 'red' : 'green'}>{user.status === 'locked' ? 'Đã khoá' : 'Hoạt động'}</Tag>
                </Space>
                <Typography.Text type="secondary">Tạo ngày {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')} · {dayjs(user.createdAt).fromNow()}</Typography.Text>
              </Space>
            </div>

            <Space>
              {user.status === 'locked' ? (
                <Button type="primary" icon={<UnlockOutlined />} loading={lockingId === user._id} onClick={() => onToggleLock(user._id)}>Gỡ chặn</Button>
              ) : (
                <Button danger icon={<StopOutlined />} loading={lockingId === user._id} onClick={() => onToggleLock(user._id)}>Chặn</Button>
              )}
              <Button onClick={onClose}>Đóng</Button>
            </Space>
          </div>
        )}
      </Card>

      {loading || !user ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Tổng quan',
              children: (
                <div>
                  <Row gutter={[12, 12]}>
                    <Col xs={24} md={12}>
                      <Card bordered style={{ borderRadius: 12, height: '100%' }}>
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                          <Typography.Text type="secondary">Thông tin liên hệ</Typography.Text>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <div>
                              <div style={{ display: 'flex', gap: 8 }}><i className="ri-mail-line" /> <Typography.Text copyable={!!user.email}>{user.email || '—'}</Typography.Text></div>
                              <Divider style={{ margin: '8px 0' }} />
                              <div style={{ display: 'flex', gap: 8 }}><i className="ri-phone-line" /> <Typography.Text copyable={!!user.phone}>{user.phone || '—'}</Typography.Text></div>
                            </div>
                          </div>
                        </Space>
                      </Card>
                    </Col>

                    <Col xs={24} md={12}>
                      <Card bordered style={{ borderRadius: 12, height: '100%' }}>
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                          <Typography.Text type="secondary">Chỉ số</Typography.Text>
                          <Row gutter={[8, 8]}>
                            <Col span={12}><Card size="small" bordered style={{ borderRadius: 10 }}><Statistic title="Bài post" value={user.totalPosts} /></Card></Col>
                            <Col span={12}><Card size="small" bordered style={{ borderRadius: 10 }}><Statistic title="Story" value={user.totalStories} /></Card></Col>
                            <Col span={12}><Card size="small" bordered style={{ borderRadius: 10 }}><Statistic title="Like nhận" value={user.totalLikesReceived} /></Card></Col>
                            <Col span={12}><Card size="small" bordered style={{ borderRadius: 10 }}><Statistic title="Followers" value={user.totalFollowers} /></Card></Col>
                            <Col span={24}><Card size="small" bordered style={{ borderRadius: 10 }}><Statistic title="Bookmarks" value={user.totalBookmarks} /></Card></Col>
                          </Row>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            },
            { key: 'contents', label: 'Nội dung', children: (<UserContentTab userId={user._id} visible={open} />) },
            { key: 'relations', label: 'Quan hệ', children: (<UserRelationsTab userId={user._id} visible={open} />) },
          ]}
        />
      )}
    </Modal>
  );
}
