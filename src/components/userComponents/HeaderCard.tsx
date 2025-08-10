import React from 'react';
import { Space, Typography, Badge, Button, Row, Col } from 'antd';
import { TeamOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { Segmented, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function HeaderCard({
  total,
  quickStats,
  queryStatus,
  updateSearchParams,
  onRefresh,
  onOpenFilter,
}: {
  total: number;
  quickStats: { active: number; locked: number; total: number };
  queryStatus: string;
  updateSearchParams: (p: Record<string, string | undefined>) => void;
  onRefresh: () => void;
  onOpenFilter: () => void;
}) {
  const quickSearch = (
    <Input.Search
      allowClear
      placeholder="Tìm theo username / email / sđt"
      defaultValue={new URLSearchParams(window.location.search).get('q') ?? ''}
      onSearch={(val) => updateSearchParams({ q: val || undefined })}
      style={{ width: 320 }}
      enterButton={<SearchOutlined />}
    />
  );

  const statusSegment = (
    <Segmented
      options={[{ label: 'Tất cả', value: '' }, { label: 'Hoạt động', value: 'active' }, { label: 'Đã khoá', value: 'locked' }]}
      value={queryStatus}
      onChange={(val) => updateSearchParams({ status: String(val) || undefined })}
    />
  );

  const COLORS = { total: '#1677ff', active: '#52c41a', locked: '#ff4d4f' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <Space align="center" size={12}>
          <TeamOutlined />
          <Title level={5} style={{ margin: 0 }}>
            Danh sách tài khoản
          </Title>
          <Badge count={total} overflowCount={9999} style={{ backgroundColor: COLORS.total }} />
        </Space>

        <Space wrap size={8}>
          {statusSegment}
          {quickSearch}
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
          <Button type="primary" icon={<FilterOutlined />} onClick={onOpenFilter}>
            Bộ lọc
          </Button>
        </Space>
      </div>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} sm={8}>
          <div style={{ borderRadius: 12, textAlign: 'center' }}>
            <div style={{ color: COLORS.total, fontWeight: 600 }}>Tổng tài khoản</div>
            <div style={{ fontSize: 20, color: COLORS.total, fontWeight: 600 }}>{quickStats.total}</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div style={{ borderRadius: 12, textAlign: 'center' }}>
            <div style={{ color: COLORS.active }}>Đang hoạt động (trang)</div>
            <div style={{ fontSize: 20, color: COLORS.active, fontWeight: 600 }}>{quickStats.active}</div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div style={{ borderRadius: 12, textAlign: 'center' }}>
            <div style={{ color: COLORS.locked }}>Đã khoá (trang)</div>
            <div style={{ fontSize: 20, color: COLORS.locked, fontWeight: 600 }}>{quickStats.locked}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
