import React from 'react';
import { Space, Input, Button, Select, Tooltip } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

export default function ContentHeader({
  searchQuery,
  setSearchQuery,
  onSearch,
  onRefresh,
  onClearSearch,
  typeFilter,
  setTypeFilter,
  enabledFilter,
  setEnabledFilter,
}: {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onClearSearch: () => void;
  typeFilter: string | '';
  setTypeFilter: (t: any) => void;
  enabledFilter: boolean | '';
  setEnabledFilter: (v: any) => void;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <Space>
        <Input.Search
          placeholder="Tìm caption hoặc hashtag"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={() => onSearch()}
          style={{ width: 420 }}
          enterButton={<SearchOutlined />}
          allowClear
          onClear={() => onClearSearch()}
        />

        <Select 
          value={typeFilter} 
          onChange={(v) => setTypeFilter(v)} 
          style={{ width: 140 }} 
          options={[
            { value: '', label: 'Tất cả' }, 
            { value: 'post', label: 'Bài viết' }, 
            { value: 'reel', label: 'Video ngắn' }
          ]} 
        />

        <Select 
          value={enabledFilter === '' ? '' : String(enabledFilter)} 
          onChange={(v) => setEnabledFilter(v === '' ? '' : v === 'true')} 
          style={{ width: 160 }} 
          options={[
            { value: 'true', label: 'Đã hiển thị' }, 
            { value: 'false', label: 'Đã ẩn' }
          ]} 
        />

        <Button icon={<ReloadOutlined />} onClick={onRefresh}>Làm mới</Button>
      </Space>

      <Space>
        <Tooltip title="Chức năng thêm (tương lai)"> </Tooltip>
      </Space>
    </div>
  );
}