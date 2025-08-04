import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Đăng nhập
      const res = await fetch("http://cirla.io.vn/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Sai tài khoản hoặc mật khẩu");

      const { accessToken, refreshToken } = await res.json();

      // 2. Lưu token tạm thời vào sessionStorage
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      // 3. Kiểm tra role user
      const userRes = await fetch("http://cirla.io.vn/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userRes.ok) throw new Error("Không lấy được thông tin người dùng");

      const user = await userRes.json();

      if (user.role !== "admin") {
        sessionStorage.clear();
        throw new Error("Bạn không có quyền truy cập");
      }

	  sessionStorage.setItem("adminInfo", JSON.stringify(user));
	  
      // 4. Thành công → vào trang chủ
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Mật khẩu</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
