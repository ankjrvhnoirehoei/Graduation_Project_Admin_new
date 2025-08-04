import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import api from "../../lib/axios";

const { Title } = Typography;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // 1. Gửi request đăng nhập
      const res = await api.post("/users/login", values);
      const { accessToken, refreshToken } = res.data;

      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      // 2. Lấy thông tin user (có interceptor tự đính kèm token)
      const userRes = await api.get("/users/me");
      const user = userRes.data;

      if (user.role !== "admin") {
        sessionStorage.clear();
        throw new Error("Bạn không có quyền truy cập");
      }

      sessionStorage.setItem("adminInfo", JSON.stringify(user));

      // 3. Thành công
      message.success("Đăng nhập thành công");
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Đăng nhập thất bại";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>Đăng nhập</Title>}
      style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}
    >
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
