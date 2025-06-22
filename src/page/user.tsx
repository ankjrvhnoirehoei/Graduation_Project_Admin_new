import { FiBarChart2, FiBell } from "react-icons/fi";
import DashboardCharts from "../components/userPage/DashboardCharts";
import DashboardUserDetail from "../components/userPage/DashboardUserDetail";

export default function Users() {
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

      <DashboardCharts />
      <DashboardUserDetail />
    </div>
  );
}
