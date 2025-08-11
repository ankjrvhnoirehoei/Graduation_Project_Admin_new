import React from 'react';
import { Drawer, Form, Input, Select, DatePicker, Divider, Calendar, Space, Button, Tooltip } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export default function FiltersDrawer({
  open,
  onClose,
  form,
  onSubmit,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  form: any;
  onSubmit: () => void;
  onReset: () => void;
}) {
  return (
    <Drawer
      title={<span><FilterOutlined /> Bộ lọc tài khoản</span>}
      open={open}
      onClose={onClose}
      width={420}
      extra={
        <Space>
          <Button onClick={onReset}>Xoá lọc</Button>
          <Button type="primary" onClick={onSubmit}>Áp dụng</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" initialValues={{ status: undefined }}>
        <Form.Item label="Từ khoá" name="q">
          <Input allowClear placeholder="username / email / sđt" />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select allowClear options={[{ label: 'Hoạt động', value: 'active' }, { label: 'Đã khoá', value: 'locked' }]} placeholder="Chọn trạng thái" />
        </Form.Item>

        <Form.Item label="Ngày tạo tài khoản" name="createdRange">
          <RangePicker style={{ width: '100%' }} allowEmpty={[true, true]} format="DD/MM/YYYY" />
        </Form.Item>

        <Divider />

        <Tooltip title="Chọn nhanh theo ngày trên lịch">
          <div style={{ marginBottom: 8 }}>Calendar nhanh</div>
        </Tooltip>
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, marginTop: 8 }}>
          <Calendar fullscreen={false} onSelect={(d: Dayjs) => {
            const curr = form.getFieldValue('createdRange') as [Dayjs, Dayjs] | undefined;
            if (!curr || (curr && curr.length !== 2)) {
              form.setFieldsValue({ createdRange: [d.startOf('day'), d.endOf('day')] });
            } else {
              form.setFieldsValue({ createdRange: [curr[0], d.endOf('day')] });
            }
          }} />
        </div>
      </Form>
    </Drawer>
  );
}
