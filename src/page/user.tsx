import { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Space,
  Typography,
  Button,
  Badge,
  Avatar,
  Popover,
  Divider,
} from "antd";
import {
  BarChartOutlined,
  BellOutlined,
  TeamOutlined,
  LockOutlined,
  FlagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DashboardCharts from "../components/userPage/DashboardCharts";
import DashboardUserDetail from "../components/userPage/DashboardUserDetail";
import ReportNotification from "../components/homePage/ReportNotification";
import api from "../lib/axios";

const { Content } = Layout;
const { Text, Title } = Typography;

export default function Users() {
  const adminInfo = JSON.parse(sessionStorage.getItem("adminInfo") || "{}");

  const [unreadReports, setUnreadReports] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch unread report counts (user + content)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [uRes, cRes] = await Promise.all([
          api.get("/admin/reports/user/unread", { headers: { token: true } }),
          api.get("/admin/reports/content/unread", {
            headers: { token: true },
          }),
        ]);
        if (!mounted) return;
        const total =
          Number(uRes?.data?.totalCount || 0) +
          Number(cRes?.data?.totalCount || 0);
        setUnreadReports(total);
      } catch (err) {
        // im lặng cũng được để tránh làm ồn UI; log nếu cần
        // console.error("Error fetching unread reports:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const goAllUsers = useCallback(() => {
    navigate("/admin/users");
  }, [navigate]);

  const goLockedUsers = useCallback(() => {
    navigate("/admin/users?status=locked");
  }, [navigate]);

  const goUserReportRequests = useCallback(() => {
    navigate("/admin/reports?type=user");
  }, [navigate]);

  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 16 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Space size={8} align="center">
            <BarChartOutlined />
            <Title level={5} style={{ margin: 0 }}>
              Thống kê
            </Title>
          </Space>

          <Space size={8} align="center" wrap>
            {/* Xem tài khoản */}
            <Button icon={<TeamOutlined />} onClick={goAllUsers}>
              Xem tài khoản
            </Button>

            {/* Tài khoản bị khoá */}
            <Button icon={<LockOutlined />} danger onClick={goLockedUsers}>
              Tài khoản bị khoá
            </Button>

            <Badge count={unreadReports} size="small">
              <Button icon={<FlagOutlined />} onClick={goUserReportRequests}>
                Report tài khoản
              </Button>
            </Badge>

            <Divider type="vertical" />

            {/* Chuông + popover thông báo */}
            <Popover
              open={notifOpen}
              onOpenChange={setNotifOpen}
              trigger="click"
              placement="bottomRight"
              content={
                <ReportNotification
                  onCountsChange={(userCount, contentCount) =>
                    setUnreadReports((userCount || 0) + (contentCount || 0))
                  }
                />
              }
            >
              <Badge count={unreadReports} size="small">
                <BellOutlined />
              </Badge>
            </Popover>

            {/* Admin info */}
            <Space size={8}>
              <Avatar
                src={adminInfo?.profilePic}
                icon={<UserOutlined />}
                size={28}
              />
              <Text strong>{adminInfo?.username || "Admin"}</Text>
            </Space>
          </Space>
        </div>

        <div style={{ height: 16 }} />

        <DashboardCharts />
        <div style={{ height: 16 }} />
        <DashboardUserDetail />
      </Content>
    </Layout>
  );
}
