import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/home";
import Settings from "./page/settings";
import Users from "./page/user";
import Video from "./page/video";
import Sidebar from "./components/SideBar";
import Document from "./page/documentation";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/video" element={<Video />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/documents" element={<Document />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
