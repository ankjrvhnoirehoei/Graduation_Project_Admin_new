import { useEffect, useRef, useState } from "react";
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
import { TrendingUp, TrendingDown } from "lucide-react";
import api from "../../lib/axios";
import Fuse from "fuse.js";

type UserInfo = {
  _id?: string;
  username: string;
  handleName: string;
  address?: string;
  profilePic?: string;
  isVip?: boolean;
  interactionChartData: {
    week: string;
    post: number;
    story: number;
  }[];
  monthlyComparison?: {
    posts: {
      percentageChange: number;
      trend: "increase" | "decrease";
    };
    stories: {
      percentageChange: number;
      trend: "increase" | "decrease";
    };
  };
};

export default function DashboardUserDetail() {
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFromDropdown, setSelectedFromDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adminInfo = JSON.parse(sessionStorage.getItem("adminInfo") || "{}");

  const fetchUserByHandle = async (handle: string) => {
    try {
      const res = await api.get(`/admin/users/search/?keyword=${handle}`, {
        headers: { token: true },
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Không tìm thấy người dùng:", err);
      setUserData(null);
    }
  };

  useEffect(() => {
    if (adminInfo?.handleName) {
      fetchUserByHandle(adminInfo.handleName);
    }
  }, []);

  // Fetch danh sách gợi ý ban đầu (chỉ 1 lần)
  useEffect(() => {
    api
      .get("/admin/users/recommended", { headers: { token: true } })
      .then((res) => setAllUsers(res.data.data))
      .catch((err) => console.error("Lỗi lấy all users:", err));
  }, []);

  // Tìm kiếm gần đúng bằng Fuse.js
  useEffect(() => {
    if (search.trim() && !selectedFromDropdown) {
      const fuse = new Fuse(allUsers, {
        keys: ["username", "handleName"],
        threshold: 0.3,
      });
      const results = fuse.search(search.trim()).map((r) => r.item);
      setFilteredUsers(results);
      setShowSuggestions(results.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredUsers([]);
    }
  }, [search, allUsers, selectedFromDropdown]);

  // Reset flag selected
  useEffect(() => {
    if (selectedFromDropdown) {
      const t = setTimeout(() => setSelectedFromDropdown(false), 800);
      return () => clearTimeout(t);
    }
  }, [selectedFromDropdown]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border rounded-lg shadow p-6 space-y-6">
      {/* Tìm kiếm */}
      <div className="relative w-full md:w-2/5" ref={searchRef}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[240px] overflow-y-auto text-sm">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearch(user.handleName);
                  fetchUserByHandle(user.handleName);
                  setShowSuggestions(false);
                  setSelectedFromDropdown(true);
                  inputRef.current?.blur();
                }}
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/32"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {user.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    @{user.handleName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thông tin user + biểu đồ */}
      {userData && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thông tin người dùng */}
          <div className="w-full md:w-[30%]">
            <div className="flex flex-col items-center text-center space-y-2">
              <img
                src={userData.profilePic || "https://via.placeholder.com/80"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-lg font-semibold text-gray-800">
                @{userData.handleName}
              </p>
              <p className="text-sm text-gray-500">{userData.username}</p>
              <p className="text-xs text-gray-600 italic">
                {userData.address || "Địa chỉ không rõ"}
              </p>
              {userData.isVip ? (
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

          {/* Biểu đồ tương tác */}
          <div className="w-full md:w-[70%]">
            <div className="mb-3">
              <h4 className="text-md font-semibold text-gray-800">
                Biểu đồ tương tác tháng {new Date().getMonth() + 1} -{" "}
                {new Date().getFullYear()}
              </h4>
              <p className="text-sm text-gray-500">
                Thống kê lượt Post & Story theo từng tuần
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData.interactionChartData}>
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

            {/* Tăng giảm tương tác */}
            {userData.monthlyComparison && (
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                {["posts", "stories"].map((key) => {
                  const metric =
                    userData.monthlyComparison?.[key as "posts" | "stories"];
                  if (!metric) return null;

                  const isIncrease = metric.trend === "increase";
                  const Icon = isIncrease ? TrendingUp : TrendingDown;
                  const colorClass = isIncrease
                    ? "text-green-600"
                    : "text-red-600";

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 font-medium ${colorClass}`}
                    >
                      <Icon className="h-4 w-4" />
                      {key === "posts" ? "Bài viết" : "Story"}:{" "}
                      {isIncrease ? "Tăng" : "Giảm"} {metric.percentageChange}%
                    </div>
                  );
                })}
                <p className="text-xs text-gray-500 mt-1">
                  Tổng hợp dữ liệu tuần 1 → tuần 4
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}