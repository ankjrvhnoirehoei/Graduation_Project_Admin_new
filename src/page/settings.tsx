import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "../components/ui/select";
import api from "../lib/axios";

interface SettingsForm {
  username?: string;
  handleName?: string;
  phoneNumber?: string;
  bio?: string;
  address?: string;
  gender?: "male" | "female" | "undisclosed";
  password?: string;
  confirmPassword?: string;
}

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>({
    username: "",
    handleName: "",
    phoneNumber: "",
    bio: "",
    address: "",
    gender: "undisclosed",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load current admin info
    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/me');
        setForm({
          username: data.username || '',
          handleName: data.handleName || '',
          phoneNumber: data.phoneNumber || '',
          bio: data.bio || '',
          address: data.address || '',
          gender: data.gender || 'undisclosed',
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (key: keyof SettingsForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");
    if (form.password && form.password !== form.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    const { confirmPassword, ...raw } = form;
    const payload: Record<string, any> = {};
    Object.entries(raw).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        payload[key] = value;
      }
    });

    try {
      setLoading(true);
      await api.post('/admin/setting', payload, {
        headers: { token: true },
      });
      alert('Cập nhật thông tin thành công');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      username: "",
      handleName: "",
      phoneNumber: "",
      bio: "",
      address: "",
      gender: "undisclosed",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Thông tin tài khoản</h1>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa thông tin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Tên hiển thị</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="handleName">Handle Name</Label>
            <Input
              id="handleName"
              value={form.handleName}
              onChange={(e) => handleChange('handleName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              onValueChange={(v) => handleChange('gender', v as any)}
              value={form.gender}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="undisclosed">Không công bố</SelectItem>
              </SelectContent>
            </Select>
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
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={handleReset} disabled={loading}>
          Đặt lại
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  );
}
