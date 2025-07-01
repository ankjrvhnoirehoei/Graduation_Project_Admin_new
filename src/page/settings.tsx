import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "../components/ui/select";

export default function Settings() {
  const [form, setForm] = useState({
    name: "Admin",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
    enableNotifications: true,
    enableBeta: false,
    theme: "light",
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saving settings:", form);
    // TODO: Call API to save settings
  };

  const handleReset = () => {
    setForm({
      name: "Admin",
      email: "admin@example.com",
      password: "",
      confirmPassword: "",
      enableNotifications: true,
      enableBeta: false,
      theme: "light",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Cài đặt hệ thống</h1>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin quản trị viên</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hệ thống</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Bật thông báo</Label>
              <p className="text-sm text-gray-500">Gửi thông báo khi có sự kiện mới</p>
            </div>
            <Switch
              checked={form.enableNotifications}
              onCheckedChange={(v) => handleChange("enableNotifications", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Tham gia bản thử nghiệm</Label>
              <p className="text-sm text-gray-500">Kích hoạt các tính năng beta</p>
            </div>
            <Switch
              checked={form.enableBeta}
              onCheckedChange={(v) => handleChange("enableBeta", v)}
            />
          </div>

        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={handleReset}>
          Đặt lại
        </Button>
        <Button onClick={handleSave}>Lưu thay đổi</Button>
      </div>
    </div>
  );
}