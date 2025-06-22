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

export default function Home() {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Người dùng mới hôm nay",
      value: 12,
      icon: <FiUsers size={20} />,
      link: "/user",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      label: "Video hôm nay",
      value: 8,
      icon: <FiVideo size={20} />,
      link: "/videos",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      label: "Báo cáo hôm nay",
      value: 3,
      icon: <FiAlertCircle size={20} />,
      link: "/reports",
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];

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
          <FiBell
            size={18}
            className="text-gray-600 cursor-pointer hover:text-black"
          />
          <div className="flex items-center space-x-2">
            <img
              src="https://i.pinimg.com/736x/6f/a5/88/6fa588f89c774e53eb9dc58eae66869f.jpg"
              alt="admin"
              className="w-7 h-7 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
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
        <VideoBarChart />
        <VideoLineComparison />
      </div>
      <DashboardBottomSection />
    </div>
  );
}
