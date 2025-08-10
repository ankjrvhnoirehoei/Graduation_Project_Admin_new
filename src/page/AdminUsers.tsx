import { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Space,
  Typography,
  Button,
  Badge,
  Avatar,
  Tag,
  Table,
  Input,
  Drawer,
  Form,
  Select,
  DatePicker,
  Calendar,
  Divider,
  Modal,
  Statistic,
  Row,
  Col,
  message,
  Tooltip,
  Popconfirm,
  Empty,
  Card,
  Skeleton,
  Segmented,
  Tabs,
} from "antd";
import {
  TeamOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  StopOutlined,
  UnlockOutlined,
  UserOutlined,
  SearchOutlined,
  LockOutlined,
  CheckCircleOutlined,
  BarsOutlined,
  StarOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearchParams } from "react-router-dom";
import api from "../lib/axios";

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type UserRow = {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: "active" | "locked";
  createdAt: string;
  totalPosts: number;
  totalStories: number;
  totalLikesReceived: number;
  totalFollowers: number;
  totalBookmarks: number;
};

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lockingId, setLockingId] = useState<string | null>(null);

  // Data & pagination (server-side)
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [pageSize, setPageSize] = useState<number>(
    parseInt(searchParams.get("pageSize") || "10", 10)
  );

  // Filter drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  /** ===== Sync URL -> form ===== */
  useEffect(() => {
    const status = searchParams.get("status") ?? undefined;
    const q = searchParams.get("q") ?? undefined;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    form.setFieldsValue({
      q,
      status,
      createdRange:
        from && to
          ? [dayjs(from, "YYYY-MM-DD"), dayjs(to, "YYYY-MM-DD")]
          : undefined,
    });
  }, [searchParams, form]);

  /** ===== Build query from URL ===== */
  const query = useMemo(() => {
    const q = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "";
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";
    return { q, status, from, to };
  }, [searchParams]);

  /** ===== Quick stats (client) ===== */
  const quickStats = useMemo(() => {
    const active = rows.filter((r) => r.status === "active").length;
    const locked = rows.filter((r) => r.status === "locked").length;
    return { active, locked, total };
  }, [rows, total]);

  /** ===== Fetch from API (server-side filter + paginate) ===== */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/admin", {
        params: {
          q: query.q || undefined,
          status: query.status || undefined,
          from: query.from || undefined,
          to: query.to || undefined,
          page,
          pageSize,
        },
        headers: { token: true },
      });

      const { items, total: t } = res.data || {};
      const mapped: UserRow[] = (items || []).map((u: any) => ({
        _id: u._id,
        username: u.username,
        email: u.email || "",
        phone: u.phone || u.phoneNumber || "",
        avatar: u.avatar || u.profilePic || "",
        status: u.status,
        createdAt: u.createdAt,
        totalPosts: u.totalPosts ?? 0,
        totalStories: u.totalStories ?? 0,
        totalLikesReceived: u.totalLikesReceived ?? 0,
        totalFollowers: u.totalFollowers ?? 0,
        totalBookmarks: u.totalBookmarks ?? 0,
      }));
      setRows(mapped);
      setTotal(Number(t) || 0);
    } catch (e: any) {
      console.error(e);
      message.error(
        e?.response?.data?.message || "Không tải được danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.q, query.status, query.from, query.to, page, pageSize]);

  /** ===== URL helper ===== */
  const updateSearchParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, v);
    });
    if (
      patch.q !== undefined ||
      patch.status !== undefined ||
      patch.from !== undefined ||
      patch.to !== undefined
    ) {
      next.set("page", "1");
      setPage(1);
    }
    setSearchParams(next);
  };

  /** ===== Handlers ===== */
  const onSubmitFilter = () => {
    const values = form.getFieldsValue() as {
      q?: string;
      status?: "active" | "locked";
      createdRange?: [Dayjs, Dayjs];
    };

    updateSearchParams({
      q: values.q || undefined,
      status: values.status || undefined,
      from: values.createdRange?.[0]?.format("YYYY-MM-DD"),
      to: values.createdRange?.[1]?.format("YYYY-MM-DD"),
    });
    setDrawerOpen(false);
  };

  const onResetFilter = () => {
    form.resetFields();
    updateSearchParams({
      q: undefined,
      status: undefined,
      from: undefined,
      to: undefined,
    });
  };

  const openViewModal = async (row: UserRow) => {
    setViewOpen(true);
    setViewLoading(true);
    try {
      setSelectedUser(row);
    } catch {
      message.error("Không tải được thông tin người dùng");
    } finally {
      setViewLoading(false);
    }
  };

  const toggleLock = async (id: string) => {
    try {
      setLockingId(id);
      const res = await api.patch(
        `/users/admin/users/${id}/toggle-lock`,
        null,
        {
          headers: { token: true },
        }
      );
      const locked = !!res?.data?.locked;
      setRows((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: locked ? "locked" : "active" } : u
        )
      );
      setSelectedUser((prev) =>
        prev && prev._id === id
          ? { ...prev, status: locked ? "locked" : "active" }
          : prev
      );
      message.success(locked ? "Đã khoá tài khoản" : "Đã mở khoá");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Thao tác thất bại");
    } finally {
      setLockingId(null);
    }
  };

  /** ===== Columns ===== */
  const columns = [
    {
      title: "Người dùng",
      key: "username",
      width: 240,
      render: (_: any, row: UserRow) => (
        <Space>
          <Avatar size={40} src={row.avatar} icon={<UserOutlined />} />
          <div style={{ maxWidth: 230 }}>
            <Typography.Paragraph
              style={{ margin: 0, fontWeight: 600 }}
              ellipsis={{ rows: 1 }}
            >
              <Button
                type="link"
                style={{ padding: 0, height: "auto" }}
                onClick={() => openViewModal(row)}
              >
                {row.username}
              </Button>
            </Typography.Paragraph>
            <Typography.Paragraph
              type="secondary"
              style={{ margin: 0, fontSize: 12 }}
              ellipsis={{ rows: 1 }}
            >
              {row.email || row.phone || "—"}
            </Typography.Paragraph>
          </div>
        </Space>
      ),
      onCell: () => ({ style: { paddingTop: 10, paddingBottom: 10 } }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (v: UserRow["status"]) =>
        v === "locked" ? (
          <Tag icon={<LockOutlined />} color="error">
            Khoá
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoạt động
          </Tag>
        ),
    },
    {
      title: "Tổng quan",
      key: "stats",
      width: 200,
      render: (_: any, r: UserRow) => (
        <Space size={6} wrap>
          <Tag color="processing">{r.totalPosts} Bài đăng</Tag>
          <Tag color="warning">{r.totalFollowers} Lượt lưu</Tag>
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (v: string) => (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
          {dayjs(v).format("DD/MM/YYYY HH:mm")}
        </Typography.Paragraph>
      ),
      sorter: (a: UserRow, b: UserRow) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      defaultSortOrder: "descend" as const,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, row: UserRow) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => openViewModal(row)} />
          </Tooltip>
          {row.status === "locked" ? (
            <Popconfirm
              title="Gỡ chặn người dùng này?"
              onConfirm={() => toggleLock(row._id)}
              okText="Gỡ chặn"
              cancelText="Huỷ"
            >
              <Tooltip title="Gỡ chặn">
                <Button
                  type="primary"
                  icon={<UnlockOutlined />}
                  loading={lockingId === row._id}
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Chặn người dùng này?"
              onConfirm={() => toggleLock(row._id)}
              okText="Chặn"
              cancelText="Huỷ"
            >
              <Tooltip title="Chặn">
                <Button
                  danger
                  icon={<StopOutlined />}
                  loading={lockingId === row._id}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  /** ===== Header right: quick search + segmented ===== */
  const quickSearch = (
    <Input.Search
      allowClear
      placeholder="Tìm theo username / email / sđt"
      defaultValue={searchParams.get("q") ?? ""}
      onSearch={(val) => updateSearchParams({ q: val || undefined })}
      style={{ width: 320 }}
      enterButton={<SearchOutlined />}
    />
  );

  const statusSegment = (
    <Segmented
      options={[
        { label: "Tất cả", value: "" },
        { label: "Hoạt động", value: "active" },
        { label: "Đã khoá", value: "locked" },
      ]}
      value={query.status}
      onChange={(val) =>
        updateSearchParams({ status: String(val) || undefined })
      }
    />
  );

  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 16, width: "100%", margin: "0 auto" }}>
        {/* Header Card */}
        <Card
          bordered={false}
          style={{
            marginBottom: 12,
            borderRadius: 14,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
          bodyStyle={{ padding: 16 }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between"
            style={{ gap: 12, flexWrap: "wrap" as const }}
          >
            <Space align="center" size={12} wrap>
              <TeamOutlined />
              <Title level={5} style={{ margin: 0 }}>
                Danh sách tài khoản
              </Title>
              <Badge
                count={total}
                overflowCount={9999}
                style={{ backgroundColor: "#1677ff" }}
              />
            </Space>

            <Space wrap size={8}>
              {statusSegment}
              {quickSearch}
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setPage(1);
                  updateSearchParams({ page: "1" });
                  fetchUsers();
                }}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setDrawerOpen(true)}
              >
                Bộ lọc
              </Button>
            </Space>
          </div>

          {/* Quick stats */}
          <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
            {/* Colors */}
            {(() => {
              const COLORS = {
                total: "#1677ff",
                active: "#52c41a",
                locked: "#ff4d4f",
              };
              return (
                <>
                  <Col xs={24} sm={8}>
                    <Card
                      size="small"
                      style={{ borderRadius: 12, textAlign: "center" }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: COLORS.total }}>
                            Tổng tài khoản
                          </span>
                        }
                        value={quickStats.total}
                        valueStyle={{ color: COLORS.total, fontWeight: 600 }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Card
                      size="small"
                      style={{ borderRadius: 12, textAlign: "center" }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: COLORS.active }}>
                            Đang hoạt động (trang)
                          </span>
                        }
                        value={quickStats.active}
                        valueStyle={{ color: COLORS.active, fontWeight: 600 }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Card
                      size="small"
                      style={{ borderRadius: 12, textAlign: "center" }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: COLORS.locked }}>
                            Đã khoá (trang)
                          </span>
                        }
                        value={quickStats.locked}
                        valueStyle={{ color: COLORS.locked, fontWeight: 600 }}
                      />
                    </Card>
                  </Col>
                </>
              );
            })()}
          </Row>
        </Card>

        {/* Table */}
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
            pagination={false} // ❌ tắt pagination mặc định
            locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
            rowClassName={(record) =>
              record.status === "locked" ? "row-locked" : ""
            }
          />

          {/* Custom pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {/* Left: current page */}
            <div>
              Trang {page} / {Math.ceil(total / pageSize)}
            </div>

            {/* Right: buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Button
                shape="default"
                disabled={page === 1}
                onClick={() => {
                  const newPage = Math.max(page - 1, 1);
                  setPage(newPage);
                  updateSearchParams({ page: String(newPage) });
                }}
                style={{
                  border: "1px solid #d9d9d9",
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
              >
                <LeftOutlined />
              </Button>
              <Button
                shape="default"
                disabled={page === Math.ceil(total / pageSize)}
                onClick={() => {
                  const newPage = Math.min(
                    page + 1,
                    Math.ceil(total / pageSize)
                  );
                  setPage(newPage);
                  updateSearchParams({ page: String(newPage) });
                }}
                style={{
                  border: "1px solid #d9d9d9",
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
              >
                <RightOutlined />
              </Button>
            </div>
          </div>
        </Card>

        {/* Drawer Filter */}
        <Drawer
          title={
            <Space>
              <FilterOutlined />
              <span>Bộ lọc tài khoản</span>
            </Space>
          }
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={420}
          destroyOnClose={false}
          extra={
            <Space>
              <Button onClick={onResetFilter}>Xoá lọc</Button>
              <Button type="primary" onClick={onSubmitFilter}>
                Áp dụng
              </Button>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: searchParams.get("status") || undefined }}
          >
            <Form.Item label="Từ khoá" name="q">
              <Input allowClear placeholder="username / email / sđt" />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status">
              <Select
                allowClear
                options={[
                  { label: "Hoạt động", value: "active" },
                  { label: "Đã khoá", value: "locked" },
                ]}
                placeholder="Chọn trạng thái"
              />
            </Form.Item>

            <Form.Item label="Ngày tạo tài khoản" name="createdRange">
              <RangePicker
                style={{ width: "100%" }}
                allowEmpty={[true, true]}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Divider />

            <Tooltip title="Chọn nhanh theo ngày trên lịch">
              <Text type="secondary">Calendar nhanh</Text>
            </Tooltip>
            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              <Calendar
                fullscreen={false}
                onSelect={(d) => {
                  const curr = form.getFieldValue("createdRange") as
                    | [Dayjs, Dayjs]
                    | undefined;
                  if (!curr || (curr && curr.length !== 2)) {
                    form.setFieldsValue({
                      createdRange: [d.startOf("day"), d.endOf("day")],
                    });
                  } else {
                    form.setFieldsValue({
                      createdRange: [curr[0], d.endOf("day")],
                    });
                  }
                }}
              />
            </div>
          </Form>
        </Drawer>

        {/* View Modal */}
        <Modal
          open={viewOpen}
          footer={null}
          width={860}
          styles={{ body: { paddingBottom: 8 } }}
          title={false}
          closable={false}
        >
          <Card style={{ borderRadius: 12, marginBottom: 12 }} bordered>
            {viewLoading || !selectedUser ? (
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Avatar
                  src={selectedUser.avatar}
                  icon={<UserOutlined />}
                  size={72}
                />
                <div style={{ flex: 1, minWidth: 220 }}>
                  <Space direction="vertical" size={2}>
                    <Space align="center" wrap>
                      <Typography.Title level={4} style={{ margin: 0 }}>
                        {selectedUser.username}
                      </Typography.Title>
                      <Tag
                        color={
                          selectedUser.status === "locked" ? "red" : "green"
                        }
                      >
                        {selectedUser.status === "locked"
                          ? "Đã khoá"
                          : "Hoạt động"}
                      </Tag>
                    </Space>
                    <Typography.Text type="secondary">
                      Tạo ngày{" "}
                      {dayjs(selectedUser.createdAt).format("DD/MM/YYYY HH:mm")}{" "}
                      · {dayjs(selectedUser.createdAt).fromNow()}
                    </Typography.Text>
                  </Space>
                </div>

                {/* Actions */}
                <Space>
                  {selectedUser.status === "locked" ? (
                    <Popconfirm
                      title="Gỡ chặn người dùng này?"
                      onConfirm={() => toggleLock(selectedUser._id)}
                      okText="Gỡ chặn"
                      cancelText="Huỷ"
                    >
                      <Button
                        type="primary"
                        icon={<UnlockOutlined />}
                        loading={lockingId === selectedUser._id}
                      >
                        Gỡ chặn
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="Chặn người dùng này?"
                      onConfirm={() => toggleLock(selectedUser._id)}
                      okText="Chặn"
                      cancelText="Huỷ"
                    >
                      <Button
                        danger
                        icon={<StopOutlined />}
                        loading={lockingId === selectedUser._id}
                      >
                        Chặn
                      </Button>
                    </Popconfirm>
                  )}
                  <Button onClick={() => setViewOpen(false)}>Đóng</Button>
                </Space>
              </div>
            )}
          </Card>

          {viewLoading || !selectedUser ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: "overview",
                  label: "Tổng quan",
                  children: (
                    <Row gutter={[12, 12]}>
                      <Col xs={24} md={12}>
                        <Card
                          bordered
                          style={{ borderRadius: 12, height: "100%" }}
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{ width: "100%" }}
                          >
                            <Typography.Text type="secondary">
                              Thông tin liên hệ
                            </Typography.Text>

                            <Space
                              style={{
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Space>
                                <i className="ri-mail-line" />
                                <Typography.Text
                                  copyable={!!selectedUser.email}
                                >
                                  {selectedUser.email || "—"}
                                </Typography.Text>
                              </Space>
                            </Space>

                            <Divider style={{ margin: "8px 0" }} />

                            <Space
                              style={{
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Space>
                                <i className="ri-phone-line" />
                                <Typography.Text
                                  copyable={!!selectedUser.phone}
                                >
                                  {selectedUser.phone || "—"}
                                </Typography.Text>
                              </Space>
                            </Space>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} md={12}>
                        <Card
                          bordered
                          style={{ borderRadius: 12, height: "100%" }}
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{ width: "100%" }}
                          >
                            <Typography.Text type="secondary">
                              Chỉ số
                            </Typography.Text>
                            <Row gutter={[8, 8]}>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  bordered
                                  style={{ borderRadius: 10 }}
                                >
                                  <Statistic
                                    title="Bài post"
                                    value={selectedUser.totalPosts}
                                  />
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  bordered
                                  style={{ borderRadius: 10 }}
                                >
                                  <Statistic
                                    title="Story"
                                    value={selectedUser.totalStories}
                                  />
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  bordered
                                  style={{ borderRadius: 10 }}
                                >
                                  <Statistic
                                    title="Like nhận"
                                    value={selectedUser.totalLikesReceived}
                                  />
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  bordered
                                  style={{ borderRadius: 10 }}
                                >
                                  <Statistic
                                    title="Followers"
                                    value={selectedUser.totalFollowers}
                                  />
                                </Card>
                              </Col>
                              <Col span={24}>
                                <Card
                                  size="small"
                                  bordered
                                  style={{ borderRadius: 10 }}
                                >
                                  <Statistic
                                    title="Bookmarks"
                                    value={selectedUser.totalBookmarks}
                                  />
                                </Card>
                              </Col>
                            </Row>
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
          )}
        </Modal>
      </Content>

      {/* Small style tweak for locked rows */}
      <style>
        {`
          .row-locked td { background: #fff1f0 !important; }
          .ant-table-wrapper .ant-table-thead > tr > th {
            background: #fff;
          }
          /* Thu nhỏ padding cell một chút cho gọn */
          .ant-table-cell { padding-top: 10px !important; padding-bottom: 10px !important; }
        `}
      </style>
    </Layout>
  );
}
