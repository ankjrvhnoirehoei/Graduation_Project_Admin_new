import { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Space,
  Input,
  DatePicker,
  Select,
  Button,
  Badge,
  Table,
  Tag,
  Modal,
  Descriptions,
  App,
  Tooltip,
  Flex,
  Avatar,
  Divider,
} from "antd";
import {
  FlagOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  UnlockOutlined,
  LockOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import api from "../lib/axios";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// ===== Types =====
export enum ReportReason {
  HARASSMENT_AND_BULLYING = "HARASSMENT_AND_BULLYING",
  HATE_SPEECH = "HATE_SPEECH",
  IMPERSONATION_FAKE_ACCOUNTS = "IMPERSONATION_FAKE_ACCOUNTS",
  GRAPHIC_CONTENT = "GRAPHIC_CONTENT",
  THREATS_AND_VIOLENCE = "THREATS_AND_VIOLENCE",
  SCAMS_AND_FRAUD = "SCAMS_AND_FRAUD",
  SENSITIVE_PERSONAL_INFO = "SENSITIVE_PERSONAL_INFO",
  SELF_HARM = "SELF_HARM",
  OTHER = "OTHER",
}

export type UserLite = {
  _id: string;
  username?: string;
  handleName?: string;
  email?: string;
  profilePic?: string;
  // optional: nếu BE có trả thì dùng để init lockState
  // deletedAt?: boolean;
};

export type ReportUserRow = {
  _id: string;
  reporterId: string;
  targetId: string;
  reason: ReportReason;
  description?: string;
  resolved: boolean;
  isDismissed: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  reporter?: UserLite | null;
  target?: UserLite | null;
};

// ===== Utilities =====
const REASON_LABEL: Record<ReportReason, string> = {
  [ReportReason.HARASSMENT_AND_BULLYING]: "Quấy rối / bắt nạt",
  [ReportReason.HATE_SPEECH]: "Ngôn từ thù ghét",
  [ReportReason.IMPERSONATION_FAKE_ACCOUNTS]: "Mạo danh / tài khoản giả",
  [ReportReason.GRAPHIC_CONTENT]: "Nội dung phản cảm",
  [ReportReason.THREATS_AND_VIOLENCE]: "Đe doạ / bạo lực",
  [ReportReason.SCAMS_AND_FRAUD]: "Lừa đảo / gian lận",
  [ReportReason.SENSITIVE_PERSONAL_INFO]: "Thông tin nhạy cảm",
  [ReportReason.SELF_HARM]: "Tự gây hại",
  [ReportReason.OTHER]: "Khác",
};

const REPORT_MODE = "users";

const reasonOptions = Object.entries(REASON_LABEL).map(([value, label]) => ({
  value,
  label,
}));

function formatUser(u?: UserLite | null, fallbackId?: string) {
  if (!u) return fallbackId || "(unknown)";
  return u.username || u.handleName || u.email || u._id;
}

// Avatar viền theo trạng thái khoá
const lockedAvatarStyle = (locked?: boolean) =>
  locked === undefined
    ? {}
    : {
        boxShadow: locked
          ? "0 0 0 2px rgba(255,0,0,0.45)" // red viền khi locked
          : "0 0 0 2px rgba(0,128,0,0.35)", // green viền khi unlocked
        borderRadius: "50%",
      };

// Tag thể hiện trạng thái khoá
const LockTag = ({ locked }: { locked?: boolean }) => {
  if (locked === undefined) return <Tag>Chưa rõ</Tag>;
  return locked ? (
    <Tag color="red">Đang khoá</Tag>
  ) : (
    <Tag color="green">Đang mở</Tag>
  );
};

// ===== Page =====
export default function UserReportsPage() {
  const { message } = App.useApp();

  const [rows, setRows] = useState<ReportUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const setCurrentPatch = (patch: Partial<ReportUserRow>) =>
    setCurrent((prev) => (prev ? { ...prev, ...patch } : prev));

  // bọc 2 hàm để cập nhật current + đóng panel
  const handleMarkResolved = async (r: ReportUserRow) => {
    await markResolved(r);
    setCurrentPatch({ resolved: true, isDismissed: false });
  };

  const handleDismissReport = async (r: ReportUserRow) => {
    await dismissReport(r);
    setCurrentPatch({ isDismissed: true, resolved: false });
  };

  // loading riêng cho từng userId khi toggle lock
  const [lockLoading, setLockLoading] = useState<Record<string, boolean>>({});
  // trạng thái khoá theo userId (true: locked, false: unlocked, undefined: chưa rõ)
  const [lockState, setLockState] = useState<
    Record<string, boolean | undefined>
  >({});

  // filters / query
  const [query, setQuery] = useState({
    text: "",
    reason: "" as "" | ReportReason,
    status: "" as "" | "open" | "resolved" | "dismissed",
    isRead: "" as "" | "read" | "unread",
    date: [] as Dayjs[],
    page: 1,
    limit: 10,
  });

  const unreadCount = useMemo(
    () => rows.reduce((acc, r) => acc + (r.isRead ? 0 : 1), 0),
    [rows]
  );

  // Fetch list
  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: query.page,
        limit: query.limit,
      };

      if (query.text) params.search = query.text;
      if (query.reason) params.reason = query.reason;
      if (query.status) params.status = query.status;
      if (query.isRead) params.isRead = query.isRead;
      if (query.date?.length === 2) {
        params.start = query.date[0].startOf("day").toISOString();
        params.end = query.date[1].endOf("day").toISOString();
      }

      const res = await api.get("/report-users", {
        params,
        headers: { token: true }, // dùng refresh token theo interceptor
      });

      const { items, total } = res.data as {
        items: ReportUserRow[];
        total: number;
      };

      setRows(items);
      setTotal(total);
    } catch (err: any) {
      console.error(err);
      message.error(
        err?.response?.data?.message || "Không thể tải danh sách báo cáo"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.page,
    query.limit,
    query.reason,
    query.status,
    query.isRead,
    JSON.stringify(query.date),
    query.text,
  ]);

  // Actions
  const markResolved = async (record: ReportUserRow) => {
    
  };

  const dismissReport = async (record: ReportUserRow) => {
    
  };

  const setRead = async (reportId: string, next: boolean) => {
    try {
      await api.patch(
        `/report-users/${reportId}/read`,
        { isRead: next },
        { headers: { token: true } }
      );
      setRows((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, isRead: next } : r))
      );
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Không thể cập nhật đã đọc");
    }
  };

  // toggle lock API
  const callToggleApi = async (userId: string) => {
    const res = await api.patch(
      `/users/admin/users/${userId}/toggle-lock`,
      {},
      { headers: { token: true } }
    );
    return res.data?.locked as boolean; // { message, locked }
  };

  // ép về trạng thái mong muốn + cập nhật lockState + toast chi tiết
  const setUserLocked = async (
    userId: string,
    desiredLocked: boolean,
    whoLabel: string
  ) => {
    try {
      setLockLoading((m) => ({ ...m, [userId]: true }));
      let locked = await callToggleApi(userId);
      if (locked !== desiredLocked) {
        locked = await callToggleApi(userId); // toggle lần 2 để đúng trạng thái
      }
      setLockState((m) => ({ ...m, [userId]: locked }));
      message.success(
        locked ? `Đã khoá ${whoLabel}` : `Đã mở khoá ${whoLabel}`
      );
      return locked;
    } catch (e: any) {
      message.error(
        e?.response?.data?.message ||
          `Không thể thay đổi trạng thái khoá/mở cho ${whoLabel}`
      );
      throw e;
    } finally {
      setLockLoading((m) => ({ ...m, [userId]: false }));
    }
  };

  // Modal detail
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ReportUserRow | null>(null);

  const openDetail = (r: ReportUserRow) => {
    setCurrent(r);
    setOpen(true);
    if (!r.isRead) setRead(r._id, true);
  };

  // helpers
  const lockUser = async (userId: string, whoLabel: string) =>
    setUserLocked(userId, true, whoLabel);
  const unlockUser = async (userId: string, whoLabel: string) =>
    setUserLocked(userId, false, whoLabel);

  // Columns
  const columns: any[] = [
    {
      title: (
        <Space>
          <FlagOutlined /> Báo cáo
          <Badge count={unreadCount} title="Chưa đọc" />
        </Space>
      ),
      dataIndex: "reporterId",
      key: "reporterId",
      render: (_: any, record: ReportUserRow) => {
        const reporter = record.reporter;
        const target = record.target;
        return (
          <Flex vertical>
            <Space>
              <Avatar
                src={reporter?.profilePic}
                icon={!reporter?.profilePic && <UserOutlined />}
              />
              <div>
                <Text strong>{formatUser(reporter, record.reporterId)}</Text>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Người báo cáo</div>
              </div>
            </Space>
            <Divider style={{ margin: "8px 0" }} />
            <Space>
              <Avatar
                src={target?.profilePic}
                icon={!target?.profilePic && <UserOutlined />}
              />
              <div>
                <Text>{formatUser(target, record.targetId)}</Text>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Đối tượng bị báo cáo
                </div>
              </div>
            </Space>
          </Flex>
        );
      },
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (v: ReportReason) => <Tag>{REASON_LABEL[v] || v}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 280,
      ellipsis: true,
      render: (v: string) =>
        v ? (
          <Tooltip title={v}>{v}</Tooltip>
        ) : (
          <Text type="secondary">(trống)</Text>
        ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      sorter: true,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, r: ReportUserRow) => (
        <Space wrap>
          {!r.isRead && <Tag color="red">Chưa đọc</Tag>}
          {r.resolved && <Tag color="green">Đã xử lý</Tag>}
          {r.isDismissed && <Tag>Đã bỏ qua</Tag>}
          {!r.resolved && !r.isDismissed && <Tag color="blue">Đang mở</Tag>}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 220,
      render: (_: any, r: ReportUserRow) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(r)}>
            Xem
          </Button>

          {/* Nút xử lý */}
          <Tooltip title="Đánh dấu đã xử lý">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              disabled={r.resolved}
              onClick={() => markResolved(r)}
            />
          </Tooltip>

          {/* Nút bỏ qua */}
          {!r.resolved && (
            <Tooltip title="Bỏ qua báo cáo">
              <Button
                danger
                icon={<CloseCircleOutlined />}
                disabled={r.isDismissed}
                onClick={() => dismissReport(r)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ background: "#fff" }}>
      <Content style={{ padding: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Flex align="center" justify="space-between" wrap>
            <Space>
              <Title level={3} style={{ margin: 0 }}>
                Báo cáo người dùng
              </Title>
              <Badge count={unreadCount} color="red" title="Báo cáo chưa đọc" />
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchReports} />
            </Space>
          </Flex>

          {/* Filters */}
          <Flex gap={8} wrap align="center">
            <Input
              allowClear
              style={{ width: 280 }}
              prefix={<SearchOutlined />}
              placeholder="Tìm theo người báo cáo / bị báo cáo / email / handle"
              value={query.text}
              onChange={(e) =>
                setQuery((q) => ({ ...q, text: e.target.value, page: 1 }))
              }
            />
            <Select
              allowClear
              style={{ width: 220 }}
              placeholder="Lý do"
              options={reasonOptions}
              value={query.reason || undefined}
              onChange={(v) =>
                setQuery((q) => ({ ...q, reason: (v as any) || "", page: 1 }))
              }
            />
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder="Trạng thái"
              options={[
                { value: "open", label: "Đang mở" },
                { value: "resolved", label: "Đã xử lý" },
                { value: "dismissed", label: "Đã bỏ qua" },
              ]}
              value={query.status || undefined}
              onChange={(v) =>
                setQuery((q) => ({ ...q, status: (v as any) || "", page: 1 }))
              }
            />
            <Select
              allowClear
              style={{ width: 160 }}
              placeholder="Đọc/Chưa đọc"
              options={[
                { value: "unread", label: "Chưa đọc" },
                { value: "read", label: "Đã đọc" },
              ]}
              value={query.isRead || undefined}
              onChange={(v) =>
                setQuery((q) => ({ ...q, isRead: (v as any) || "", page: 1 }))
              }
            />
            <RangePicker
              value={query.date as any}
              onChange={(v) =>
                setQuery((q) => ({ ...q, date: (v as any) || [], page: 1 }))
              }
            />
          </Flex>

          <Table<ReportUserRow>
            rowKey="_id"
            dataSource={rows}
            columns={columns as any}
            loading={loading}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total,
              showSizeChanger: true,
              onChange: (page, pageSize) =>
                setQuery((q) => ({ ...q, page, limit: pageSize })),
            }}
            scroll={{ x: 1100 }}
          />
        </Space>

        {/* Detail Modal */}
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title={
            <Space>
              <FlagOutlined /> Chi tiết báo cáo
            </Space>
          }
          footer={null}
          width={720}
        >
          {current && (
            <Descriptions column={1} size="middle" bordered>
              <Descriptions.Item label="Người báo cáo">
                <Space align="start">
                  <Avatar
                    src={current.reporter?.profilePic}
                    style={lockedAvatarStyle(lockState[current.reporterId])}
                  />
                  <div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <Text strong>
                        {formatUser(current.reporter, current.reporterId)}
                      </Text>
                      <LockTag locked={lockState[current.reporterId]} />
                    </div>
                    <Text type="secondary">{current.reporter?.email}</Text>
                  </div>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Đối tượng">
                <Space align="start">
                  <Avatar
                    src={current.target?.profilePic}
                    style={lockedAvatarStyle(lockState[current.targetId])}
                  />
                  <div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <Text>
                        {formatUser(current.target, current.targetId)}
                      </Text>
                      <LockTag locked={lockState[current.targetId]} />
                    </div>
                    <Text type="secondary">{current.target?.email}</Text>
                  </div>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Lý do">
                {REASON_LABEL[current.reason]}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {current.description || <Text type="secondary">(trống)</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">
                {dayjs(current.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Space wrap>
                  {!current.isRead && <Tag color="red">Chưa đọc</Tag>}
                  {current.resolved && <Tag color="green">Đã xử lý</Tag>}
                  {current.isDismissed && <Tag>Đã bỏ qua</Tag>}
                  {!current.resolved && !current.isDismissed && (
                    <Tag color="blue">Đang mở</Tag>
                  )}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Hành động nhanh">
                <Space size={24} wrap>
                  {/* Quản lý báo cáo */}
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ minWidth: 260 }}
                  >
                    <Text strong>Quản lý báo cáo</Text>

                    {/* Nếu report đang mở (chưa xử lý & chưa bỏ qua): hiện 2 nút hành động chính */}
                    {!current.resolved && !current.isDismissed ? (
                      <>
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          onClick={() => handleMarkResolved(current)}
                          block
                        >
                          Đánh dấu đã xử lý
                        </Button>
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={() => handleDismissReport(current)}
                          block
                        >
                          Bỏ qua
                        </Button>
                      </>
                    ) : (
                      /* Nếu đã xử lý hoặc đã bỏ qua: chỉ hiện trạng thái + nút Đổi trạng thái */
                      <>
                        <Space wrap>
                          {current.resolved && (
                            <Tag color="green">Đã xử lý</Tag>
                          )}
                          {current.isDismissed && <Tag>Đã bỏ qua</Tag>}
                        </Space>
                      </>
                    )}
                  </Space>

                  {/* Người báo cáo */}
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ minWidth: 220 }}
                  >
                    <Text strong>Người báo cáo</Text>
                    <Button
                      type={
                        lockState[current.reporterId] ? "default" : "primary"
                      }
                      danger={!lockState[current.reporterId]}
                      icon={<LockOutlined />}
                      loading={!!lockLoading[current.reporterId]}
                      disabled={lockState[current.reporterId] === true}
                      onClick={() =>
                        current && lockUser(current.reporterId, "người báo cáo")
                      }
                      block
                    >
                      Khoá
                    </Button>
                    <Button
                      type={
                        lockState[current.reporterId] ? "primary" : "default"
                      }
                      icon={<UnlockOutlined />}
                      loading={!!lockLoading[current.reporterId]}
                      disabled={lockState[current.reporterId] === false}
                      onClick={() =>
                        current &&
                        unlockUser(current.reporterId, "người báo cáo")
                      }
                      block
                    >
                      Mở khoá
                    </Button>
                  </Space>

                  {/* Đối tượng bị báo cáo */}
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ minWidth: 220 }}
                  >
                    <Text strong>Đối tượng</Text>
                    <Button
                      type={lockState[current.targetId] ? "default" : "primary"}
                      danger={!lockState[current.targetId]}
                      icon={<LockOutlined />}
                      loading={!!lockLoading[current.targetId]}
                      disabled={lockState[current.targetId] === true}
                      onClick={() =>
                        current &&
                        lockUser(current.targetId, "đối tượng bị báo cáo")
                      }
                      block
                    >
                      Khoá
                    </Button>
                    <Button
                      type={lockState[current.targetId] ? "primary" : "default"}
                      icon={<UnlockOutlined />}
                      loading={!!lockLoading[current.targetId]}
                      disabled={lockState[current.targetId] === false}
                      onClick={() =>
                        current &&
                        unlockUser(current.targetId, "đối tượng bị báo cáo")
                      }
                      block
                    >
                      Mở khoá
                    </Button>
                  </Space>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Content>
    </Layout>
  );
}
