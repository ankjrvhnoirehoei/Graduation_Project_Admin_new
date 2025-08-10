import {
  BarChart2,
  LineChart,
  Users,
  Video,
  Eye,
  MessageCircle,
  ChartColumnIncreasing,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { UserGrowthChart } from "../components/report/visual/UserGrowthChart";
import { ContentRadarChart } from "../components/report/visual/ContentRadarChart";
import { InteractionAreaChart } from "../components/report/visual/InteractionAreaChart";
import { UsersTable } from "../components/report/visual/UsersTable";
import { ContentTable } from "../components/report/visual/ContentTable";
import { StoriesTable } from "../components/report/visual/StoriesTable";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import { ReportsReasonsChart } from "../components/report/visual/ReportsReasonsChart";
import { ReportedUsersChart } from "../components/report/visual/ReportedUsersChart";
import { StoriesReportChart } from "../components/report/visual/StoriesReportChart";

interface StatsData {
  users: number;
  contents: number;
  views: number;
  comments: number;
  fluctuation: {
    percentageChange: number;
    trend: string;
  };
}

export default function Report() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get('/admin/stats?range=year', { headers: { token: true } });
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setError('Không thể tải thống kê');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải thống kê');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const summaryItems = stats
    ? [
        { icon: Users, label: 'Người dùng mới', value: stats.users.toLocaleString() },
        { icon: Video, label: 'Bài viết mới', value: stats.contents.toLocaleString() },
        { icon: MessageCircle, label: 'Bình luận', value: stats.comments.toLocaleString() },
        { icon: LineChart, label: 'Tăng trưởng', value: `${stats.fluctuation.percentageChange}%` },
      ]
    : [];

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo hệ thống</h1>
          <p className="text-gray-500">
            Tổng quan các chỉ số, xu hướng và hiệu suất nội dung
          </p>
        </div>
      </div>

      {/* Summary Section */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array(4)
              .fill(null)
              .map((_, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center gap-4 p-4 opacity-50 animate-pulse">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <div>
                      <p className="h-4 w-20 bg-gray-200 mb-2 rounded" />
                      <p className="h-6 w-10 bg-gray-200 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
          : summaryItems.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-gray-800">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="h-[490px] pt-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Hoạt động bài viết (posts, reels và stories)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ContentRadarChart />
          </CardContent>
        </Card>

        <Card className="h-[490px] pt-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartColumnIncreasing className="w-5 h-5" />
              Lý do người dùng/bài viết bị báo cáo
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ReportsReasonsChart />
          </CardContent>
        </Card>

        <Card className="h-[490px] pt-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Tương tác, Bình luận và Theo dõi
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <InteractionAreaChart />
          </CardContent>
        </Card>

        <Card className="h-[490px] pt-1">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Người dùng bị báo cáo nhiều lần 
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ReportedUsersChart />
          </CardContent>
        </Card>

        <Card className="h-[490px] pt-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Báo cáo Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <StoriesReportChart />
          </CardContent>
        </Card>

        <Card className="h-[490px] pt-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Tăng trưởng người dùng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <UserGrowthChart />
          </CardContent>
        </Card>        
      </div>

      {/* Tabs Section */}
      {/* <Tabs defaultValue="users">
        <TabsList className="bg-muted p-1 rounded mb-4">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="videos">Bài viết</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người dùng mới</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bài mới</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
