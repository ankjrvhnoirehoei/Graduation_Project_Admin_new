import { useState, useEffect, useCallback } from "react";
import { FiBarChart2, FiBell } from "react-icons/fi";
import VideoAreaChart from "../components/videoPage/VideoAreaChart";
import VideoRadialSummary from "../components/videoPage/VideoRadialSummary";
import VideoRadarChart from "../components/videoPage/VideoRadarChart";
import { VideoPostRadialSummary } from "../components/videoPage/VideoPostRadialSummary";
import ReportNotification from "../components/homePage/ReportNotification";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
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
const { Text, Title } = Typography;

export default function Video() {
  const adminInfo = JSON.parse(sessionStorage.getItem("adminInfo") || "{}");

  const [unreadReports, setUnreadReports] = useState<number>(0);
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const navigate = useNavigate();

  const goAllContents = useCallback(() => {
    navigate("/admin/contents");
  }, [navigate]);

  const goLockedContents = useCallback(() => {
    navigate("/admin/contents?status=locked");
  }, [navigate]);

  // initial load of unread counts
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const [uRes, cRes] = await Promise.all([
          api.get("/admin/reports/user/unread", { headers: { token: true } }),
          api.get("/admin/reports/content/unread", { headers: { token: true } }),
        ]);
        setUnreadReports(uRes.data.totalCount + cRes.data.totalCount);
      } catch (err) {
        console.error("Error fetching unread reports:", err);
      }
    };
    fetchUnread();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Header top bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <FiBarChart2 size={20} />
          <span>Thống kê</span>
        </div>

        <Space style={{ marginLeft: 990 }} size={8} align="center" wrap>
          <Button icon={<TeamOutlined />} onClick={goAllContents}>
            Xem bài viết
          </Button>
        </Space>

        <div className="flex items-center space-x-4">
     

          <div className="relative">
            <FiBell
              size={18}
              className={`
                transition
                ${
                  unreadReports > 0
                    ? "text-yellow-700 hover:text-yellow-600"
                    : "text-gray-600 hover:text-black"
                }
              `}
              onClick={() => setShowNotif((v) => !v)}
              style={{ cursor: "pointer" }}
            />
            {unreadReports > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3 h-3 text-[0.55rem] font-semibold text-white bg-red-600 rounded-full">
                {unreadReports}
              </span>
            )}
            {showNotif && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <ReportNotification
                  onCountsChange={(userCount, contentCount) =>
                    setUnreadReports(userCount + contentCount)
                  }
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <img
              src={adminInfo.profilePic || "https://via.placeholder.com/32"}
              alt="admin avatar"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {adminInfo.username || "Admin"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[70%] flex flex-col gap-4">
          <VideoAreaChart />
          <VideoPostRadialSummary />
        </div>

        <div className="w-full md:w-[30%] flex flex-col gap-4">
          <VideoRadarChart />
          <VideoRadialSummary />
        </div>
      </div>
    </div>
  );
}