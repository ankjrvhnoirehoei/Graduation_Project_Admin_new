import {
  BarChart2,
  LineChart,
  Users,
  Video,
  Eye,
  MessageCircle,
  DollarSign,
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

export default function Report() {
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
        <Button variant="outline">Export Excel</Button>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: Users, label: "Người dùng mới", value: "1,230" },
          { icon: Video, label: "Video mới", value: "528" },
          { icon: Eye, label: "Lượt xem", value: "89.2K" },
          { icon: MessageCircle, label: "Bình luận", value: "3,102" },
          { icon: DollarSign, label: "Doanh thu", value: "$12,500" },
          { icon: LineChart, label: "Tăng trưởng", value: "+12%" },
        ].map((item, idx) => (
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
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Tăng trưởng người dùng
            </CardTitle>
          </CardHeader>
          <CardContent> {/* Replace with chart */} Coming soon...</CardContent>
        </Card>

        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Hoạt động video
            </CardTitle>
          </CardHeader>
          <CardContent> {/* Replace with chart */} Coming soon...</CardContent>
        </Card>

        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Tương tác & Bình luận
            </CardTitle>
          </CardHeader>
          <CardContent> {/* Replace with chart */} Coming soon...</CardContent>
        </Card>

        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Nguồn lưu lượng truy cập
            </CardTitle>
          </CardHeader>
          <CardContent>
            {" "}
            {/* Replace with pie chart */} Coming soon...
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="users">
        <TabsList className="bg-muted p-1 rounded mb-4">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="videos">Video</TabsTrigger>
          <TabsTrigger value="content">Hiệu suất nội dung</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người dùng mới</CardTitle>
            </CardHeader>
            <CardContent>Table Placeholder</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách video mới</CardTitle>
            </CardHeader>
            <CardContent>Table Placeholder</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất nội dung</CardTitle>
            </CardHeader>
            <CardContent>Table Placeholder</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
