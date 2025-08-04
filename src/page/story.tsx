import { useState, useEffect } from "react";
import { FiBarChart2, FiBell } from "react-icons/fi";
import StoryAreaChart from "../components/storyPage/StoryAreaChart";
import StoryRadialSummary from "../components/storyPage/StoryRadialSummary";
import StoryRadarChart from "../components/storyPage/StoryRadarChart";
import { StoryPostRadialSummary } from "../components/storyPage/StoryPostRadialSummary";
import ReportNotification from "../components/homePage/ReportNotification";
import api from "../lib/axios";

export default function Story() {
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

        let totalUnread = uRes.data.totalCount + cRes.data.totalCount;

        // Fetch story reports
        try {
          const sRes = await api.get("/admin/reports/story/unread", { headers: { token: true } });
          totalUnread += sRes.data.totalCount;
        } catch (storyErr) {
          console.warn("Story reports endpoint error:", storyErr);
        }

        setUnreadReports(totalUnread);
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
          <span>Thống kê Stories</span>
        </div>

        <div className="flex items-center space-x-4">

          

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
          {/* <StoryAreaChart /> */}
          <StoryPostRadialSummary />
        </div>

        <div className="w-full md:w-[30%] flex flex-col gap-4">
          <StoryRadarChart />
          <StoryRadialSummary />
        </div>
      </div>
    </div>
  );
}