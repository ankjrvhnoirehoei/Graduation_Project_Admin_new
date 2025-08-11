import React from 'react';
import { Table, Space, Avatar, Typography, Tag, Tooltip, Button, Popconfirm, Empty, Card } from 'antd';
import { UserOutlined, EyeOutlined, UnlockOutlined, StopOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserRow } from '../custom/useUsers';

export default function UsersTable({
  rows,
  loading,
  lockingId,
  page,
  pageSize,
  total,
  onOpenView,
  onToggleLock,
  onChangePage,
}: {
  rows: UserRow[];
  loading: boolean;
  lockingId: string | null;
  page: number;
  pageSize: number;
  total: number;
  onOpenView: (r: UserRow) => void;
  onToggleLock: (id: string) => void;
  onChangePage: (page: number) => void;
}) {
  const columns = [
    {
      title: 'Người dùng',
      key: 'username',
      width: 240,
      render: (_: any, row: UserRow) => (
        <Space>
          <Avatar size={40} src={row.avatar} icon={<UserOutlined />} />
          <div style={{ maxWidth: 230 }}>
            <Typography.Paragraph style={{ margin: 0, fontWeight: 600 }} ellipsis={{ rows: 1 }}>
              <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => onOpenView(row)}>
                {row.username}
              </Button>
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }} ellipsis={{ rows: 1 }}>
              {row.email || row.phone || '—'}
            </Typography.Paragraph>
          </div>
        </Space>
      ),
      onCell: () => ({ style: { paddingTop: 10, paddingBottom: 10 } }),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (v: UserRow['status']) =>
        v === 'locked' ? (
          <Tag icon={<LockOutlined />} color="error">Khoá</Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">Hoạt động</Tag>
        ),
    },
    {
      title: 'Tổng quan',
      key: 'stats',
      width: 200,
      render: (_: any, r: UserRow) => (
        <Space size={6} wrap>
          <Tag color="processing">{r.totalPosts} Bài đăng</Tag>
          <Tag color="warning">{r.totalFollowers} Lượt lưu</Tag>
        </Space>
      ),
      responsive: ['md'],
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (v: string) => (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
          {dayjs(v).format('DD/MM/YYYY HH:mm')}
        </Typography.Paragraph>
      ),
      sorter: (a: UserRow, b: UserRow) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, row: UserRow) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => onOpenView(row)} />
          </Tooltip>
          {row.status === 'locked' ? (
            <Popconfirm title="Gỡ chặn người dùng này?" onConfirm={() => onToggleLock(row._id)} okText="Gỡ chặn" cancelText="Huỷ">
              <Tooltip title="Gỡ chặn">
                <Button type="primary" icon={<UnlockOutlined />} loading={lockingId === row._id} />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm title="Chặn người dùng này?" onConfirm={() => onToggleLock(row._id)} okText="Chặn" cancelText="Huỷ">
              <Tooltip title="Chặn">
                <Button danger icon={<StopOutlined />} loading={lockingId === row._id} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card bordered style={{ borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
      <Table<UserRow>
        rowKey="_id"
        dataSource={rows}
        columns={columns as any}
        loading={loading}
        size="small"
        bordered
        tableLayout="fixed"
        sticky={false}
        pagination={false}
        locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        rowClassName={(record) => (record.status === 'locked' ? 'row-locked' : '')}
      />

      {/* Custom pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
        <div>
          Trang {page} / {Math.ceil(total / pageSize) || 1}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <Button shape="default" disabled={page === 1} onClick={() => onChangePage(Math.max(page - 1, 1))} style={{ border: '1px solid #d9d9d9', width: 32, height: 32, padding: 0 }}>
            ‹
          </Button>
          <Button shape="default" disabled={page === Math.ceil(total / pageSize)} onClick={() => onChangePage(Math.min(page + 1, Math.ceil(total / pageSize)))} style={{ border: '1px solid #d9d9d9', width: 32, height: 32, padding: 0 }}>
            ›
          </Button>
        </div>
      </div>
    </Card>
  );
}
