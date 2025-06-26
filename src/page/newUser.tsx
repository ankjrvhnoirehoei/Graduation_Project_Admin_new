import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Download, Eye, Lock, Unlock, Edit, Trash } from "lucide-react";
import UserDialog from "../components/userPage/UserDialog";

const mockData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar:
      "https://i.pinimg.com/736x/e4/21/bd/e421bd984c60b6ab64ba076745a1c667.jpg",
    createdAt: "2025-06-26 08:12:34",
    status: "Đang hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    avatar:
      "https://i.pinimg.com/736x/6b/37/30/6b3730d5559f7ebc1672dbb580d4f207.jpg",
    createdAt: "2025-06-26 09:22:10",
    status: "Chưa xác minh email",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    avatar:
      "https://i.pinimg.com/736x/a0/66/20/a066206b0a917bad8a6a9f78c01959dc.jpg",
    createdAt: "2025-06-26 10:05:44",
    status: "Bị khóa",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    avatar:
      "https://i.pinimg.com/736x/af/09/95/af09952d2563c2710c0ba165079f9db6.jpg",
    createdAt: "2025-06-26 11:15:20",
    status: "Đang hoạt động",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    avatar:
      "https://i.pinimg.com/736x/cc/35/eb/cc35ebe3013da74cea8ace5f3bbcdf8f.jpg",
    createdAt: "2025-06-26 12:30:45",
    status: "Chưa xác minh email",
  },
];

export default function NewUsersToday() {
  const [users, setUsers] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("none");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [lockMode, setLockMode] = useState(false);
  const [pin, setPin] = useState("");

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)) &&
      (filterStatus === "none" || u.status === filterStatus)
    );
  });

  const handleEditChange = (field: string, value: string) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
    }
  };

  return (
    <div className="p-8 space-y-8 bg-white shadow rounded-xl max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Người dùng mới hôm nay
        </h1>
        <p className="text-4xl font-bold text-blue-600">{users.length}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Input
          placeholder="Tìm theo tên hoặc email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tất cả</SelectItem>
            <SelectItem value="Đang hoạt động">Đang hoạt động</SelectItem>
            <SelectItem value="Chưa xác minh email">
              Chưa xác minh email
            </SelectItem>
            <SelectItem value="Bị khóa">Bị khóa</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="default"
          className="flex items-center gap-2 whitespace-nowrap w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="min-w-[200px]">Tên / Email</TableHead>
              <TableHead>Thời gian đăng ký</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right pr-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, idx) => (
              <TableRow key={user.id}>
                <TableCell className="text-center font-medium">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Đang hoạt động"
                        ? "bg-green-100 text-green-700"
                        : user.status === "Chưa xác minh email"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditMode(false);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditMode(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(user);
                      setLockMode(true);
                    }}
                  >
                    {user.status === "Bị khóa" ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => console.log("Delete", user.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Trang trước</Button>
        <Button variant="outline">Trang sau</Button>
      </div>

      <UserDialog
        selectedUser={selectedUser}
        editMode={editMode}
        lockMode={lockMode}
        pin={pin}
        onClose={() => {
          setSelectedUser(null);
          setEditMode(false);
          setLockMode(false);
          setPin("");
        }}
        onEditChange={handleEditChange}
        onPinChange={setPin}
      />
    </div>
  );
}
