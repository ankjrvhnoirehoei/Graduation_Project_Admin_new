import {
  FiBookOpen,
  FiFileText,
  FiHome,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Clapperboard } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: <FiHome size={18} /> },
  { name: "User", path: "/users", icon: <FiUser size={18} /> },
  { name: "Post", path: "/video", icon: <Clapperboard size={18} /> },
  { name: "Report", path: "/reports", icon: <FiFileText size={18} /> },
  { name: "Settings", path: "/settings", icon: <FiSettings size={18} /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-md flex flex-col justify-between">
      <div>
        <div className="text-2xl font-extrabold text-purple-600 text-center py-6 tracking-tight">
          Cirla
        </div>

        <nav className="flex flex-col px-4 gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-purple-100 text-purple-700 shadow-inner font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <Link
          to="/documentation"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white text-sm py-2 rounded-xl font-medium transition-all duration-200"
        >
          <FiBookOpen size={16} />
          View Helper
        </Link>
      </div>
    </aside>
  );
}
