import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./page/home";
import Settings from "./page/settings";
import Users from "./page/user";
import Video from "./page/video";
import Sidebar from "./components/SideBar";
import Document from "./page/documentation";
import LoginPage from "./page/login";
import Report from "./page/report";
import NewUsersToday from "./page/newUser";
import NewPostsToday from "./page/newPost";
import NewReportToday from "./page/newReport";

function ProtectedLayout() {
  const location = useLocation();
  const [authorized, setAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No token");

        const res = await fetch("http://cirla.io.vn/users/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();
        if (user.role !== "admin") throw new Error("Not admin");

        setAuthorized(true);
      } catch (err) {
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  if (authorized === null)
    return <div className="p-10">Đang kiểm tra đăng nhập...</div>;

  if (!authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/new-users" element={<NewUsersToday />} />
          <Route path="/new-posts" element={<NewPostsToday />} />
          <Route
            path="/new-reports"
            element={<NewReportToday />}
          />
          <Route path="/video" element={<Video />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documents" element={<Document />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
