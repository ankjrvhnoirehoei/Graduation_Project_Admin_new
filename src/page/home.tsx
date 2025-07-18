import {
  FiUsers,
  FiVideo,
  FiAlertCircle,
  FiBell,
  FiBarChart2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import VideoBarChart from "../components/homePage/VideoBarChart";
import VideoLineComparison from "../components/homePage/VideoLineComparison";
import DashboardBottomSection from "../components/homePage/DashboardBottomSection";
import { useEffect, useState } from "react";
import ReportNotification from "../components/homePage/ReportNotification";
import api from "../lib/axios";

export default function Home() {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(sessionStorage.getItem("adminInfo") || "{}");

  const [stats, setStats] = useState<any[]>([]);
  const [unreadReports, setUnreadReports] = useState<number>(0);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const fetchStatsAndUnread = async () => {
      try {
        const statsPromise = api.get("/admin/users/today-stats", {
          headers: { token: true },
        });

        const unreadContentPromise = api.get("/admin/reports/content/unread", {
          headers: { token: true },
        });
        const unreadUserPromise = api.get("/admin/reports/user/unread", {
          headers: { token: true },
        });

        const [statsRes, contentRes, userRes] = await Promise.all([
          statsPromise,
          unreadContentPromise,
          unreadUserPromise,
        ]);

        const data = statsRes.data;
        setStats([
          {
            label: "Người dùng",
            value: data.newUsers,
            icon: <FiUsers size={20} />,
            link: "/new-users",
            bg: "bg-blue-100",
            text: "text-blue-600",
          },
          {
            label: "Bài post",
            value: data.newPosts,
            icon: <FiVideo size={20} />,
            link: "/new-posts",
            bg: "bg-purple-100",
            text: "text-purple-600",
          },
          {
            label: "Báo cáo",
            value: data.newReports,
            icon: <FiAlertCircle size={20} />,
            link: "/new-reports",
            bg: "bg-red-100",
            text: "text-red-600",
          },
        ]);

        // sum the unread counts from both endpoints
        const totalUnread =
          (contentRes.data.totalCount || 0) +
          (userRes.data.totalCount || 0);
        setUnreadReports(totalUnread);
      } catch (err) {
        console.error("Lỗi khi fetch stats or unread counts:", err);
      }
    };

    fetchStatsAndUnread();
  }, []);

  // Handler to receive updated unread counts from ReportNotification
  const handleReportCounts = (userCount: number, contentCount: number) => {
    setUnreadReports(userCount + contentCount);
  };  

  return (
    <div className="p-4 space-y-4">
      {/* Header top bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <FiBarChart2 size={20} />
          <span>Thống kê</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Bell with badge */}
          <div className="relative">
            <FiBell
              size={18}
              className={`
                transition 
                ${unreadReports > 0 
                  ? "text-yellow-700 hover:text-yellow-600 bg" 
                  : "text-gray-600 hover:text-black"}
              `}
              onClick={() => setShowNotif(v => !v)}
              style={{ cursor: "pointer" }}
            />
            {unreadReports > 0 && (
              <span
                className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3 h-3 text-[0.55rem] font-semibold text-white bg-red-600 rounded-full">
                {unreadReports}
              </span>
            )}
            {showNotif && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <ReportNotification onCountsChange={handleReportCounts} />
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer"
            onClick={() => navigate(stat.link)}
          >
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <h3 className="text-xl font-semibold">{stat.value}</h3>
            </div>
            <div
              className={`p-1.5 rounded-full ${stat.bg} ${stat.text} transition`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <VideoLineComparison />
        <VideoBarChart />
      </div>
      <DashboardBottomSection />
    </div>
  );
}