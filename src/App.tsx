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
import Story from "./page/story";
import Sidebar from "./components/SideBar";
import Document from "./page/documentation";
import LoginPage from "./page/login";
import Report from "./page/report";
import NewUsersToday from "./page/newUser";
import NewPostsToday from "./page/newPost";
import NewReportToday from "./page/newReport";
import Issues from "./page/issues";
import api from "./lib/axios";
import AdminUsersPage from "./page/AdminUsers";

function ProtectedLayout() {
  const location = useLocation();
  const [authorized, setAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/me");

        const user = res.data;
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
          <Route path="/new-reports" element={<NewReportToday />} />
          <Route path="/video" element={<Video />} />
          <Route path="/story" element={<Story />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/documents" element={<Document />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
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
