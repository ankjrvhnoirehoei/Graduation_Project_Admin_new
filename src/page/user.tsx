import { useState, useEffect } from "react";
import { FiBarChart2, FiBell } from "react-icons/fi";
import DashboardCharts from "../components/userPage/DashboardCharts";
import DashboardUserDetail from "../components/userPage/DashboardUserDetail";
import ReportNotification from "../components/homePage/ReportNotification";
import api from "../lib/axios";

export default function Users() {
  const adminInfo = JSON.parse(sessionStorage.getItem("adminInfo") || "{}");

  const [unreadReports, setUnreadReports] = useState<number>(0);
  const [showNotif, setShowNotif] = useState<boolean>(false);

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

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

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

      <DashboardCharts />
      <DashboardUserDetail />
    </div>
  );
}