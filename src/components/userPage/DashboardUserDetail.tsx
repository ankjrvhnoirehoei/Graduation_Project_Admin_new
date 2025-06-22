import { useState } from "react";
import { Badge } from "../ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function DashboardUserDetail() {
  const [search, setSearch] = useState("");
  const adminInfo = JSON.parse(sessionStorage.getItem("adminInfo") || "{}");

  const chartData = [
    { week: "Tuần 1", post: 52, story: 30 },
    { week: "Tuần 2", post: 78, story: 42 },
    { week: "Tuần 3", post: 64, story: 50 },
    { week: "Tuần 4", post: 90, story: 60 },
  ];

  return (
    <div className="bg-white border rounded-lg shadow p-6 space-y-6">
      {/* Ô tìm kiếm */}
      <div className="w-full md:w-2/5">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Thông tin user + biểu đồ */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 1. User Info */}
        <div className="w-full md:w-[30%]">
          <div className="flex flex-col items-center text-center space-y-2">
            <img
              src={adminInfo.profilePic || "https://via.placeholder.com/80"}
              alt="admin-avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <p className="text-lg font-semibold text-gray-800">
              @{adminInfo.handleName || "admin"}
            </p>
            <p className="text-sm text-gray-500">
              {adminInfo.username || "Admin"}
            </p>
            <p className="text-xs text-gray-600 italic">
              {adminInfo.address || "Địa chỉ không rõ"}
            </p>
            {adminInfo.isVip ? (
              <Badge
                variant="default"
                className="bg-yellow-400 text-white mt-2"
              >
                VIP
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-2">
                Thường
              </Badge>
            )}
          </div>
        </div>

        {/* 2. Biểu đồ */}
        <div className="w-full md:w-[70%]">
          <div className="mb-3">
            <h4 className="text-md font-semibold text-gray-800">
              Biểu đồ tương tác tháng {new Date().getMonth() + 1} - 2025
            </h4>
            <p className="text-sm text-gray-500">
              Thống kê lượt Post & Story theo từng tuần
            </p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar
                  dataKey="post"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  name="Post"
                />
                <Bar
                  dataKey="story"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Story"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              Tăng 12.5% so với tháng trước
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tổng hợp dữ liệu tuần 1 → tuần 4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
