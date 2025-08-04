import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Avatar,
  Tag,
  Pagination,
  message,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../lib/axios";

const { Option } = Select;
const { Search } = Input;

interface User {
  _id: string;
  username: string;
  handleName: string;
  email: string;
  profilePic?: string;
  deletedAt: boolean;
  createdAt: string;
  dateOfBirth?: string;
}

export default function NewUsersToday() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "deleted">("all");
  const [detailUser, setDetailUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/users/new", {
          headers: { token: true },
          params: { range: "7days", page, limit },
        });
        if (res.data.success) {
          setUsers(res.data.data.items);
          setTotalPages(res.data.data.pagination.totalPages);
        } else {
          setError("Không thể tải người dùng mới");
        }
      } catch (e: any) {
        setError(e.response?.data?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const filtered = users.filter((u) => {
    if (
      searchTerm &&
      !u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (filter === "deleted" && !u.deletedAt) return false;
    return true;
  });

  const toggleDelete = async (user: User) => {
    try {
      const res = await api.patch(
        `/admin/users/disable/${user._id}`,
        {},
        { headers: { token: true } }
      );
      if (res.data.success) {
        setUsers((us) =>
          us.map((u) =>
            u._id === user._id ? { ...u, deletedAt: res.data.isDeleted } : u
          )
        );
        message.success(
          res.data.isDeleted ? "Đã xóa người dùng" : "Khôi phục người dùng"
        );
      }
    } catch {
      message.error("Lỗi khi cập nhật trạng thái người dùng");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_: any, __: User, i: number) => (page - 1) * limit + i + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      render: (_: any, record: User) => (
        <div>
          <div className="font-medium">{record.username}</div>
          <div className="text-gray-500 text-sm">{record.handleName}</div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "deletedAt",
      render: (val: boolean) =>
        val ? (
          <Tag color="red">Đã xóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      render: (_: any, record: User) => (
        <>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => setDetailUser(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            type="link"
            onClick={() => toggleDelete(record)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Người dùng mới</h1>
          <p className="text-gray-500">
            Tổng: {filtered.length} / {users.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Search
            placeholder="Tìm theo tên hiển thị"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={setSearchTerm}
            allowClear
            style={{ width: 250 }}
          />
          <Select value={filter} onChange={setFilter} style={{ width: 150 }}>
            <Option value="all">Tất cả</Option>
            <Option value="deleted">Đã xóa</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          total={totalPages * limit}
          pageSize={limit}
          showSizeChanger={false}
          onChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal chi tiết người dùng */}
      <Modal
        title="Chi tiết người dùng"
        open={!!detailUser}
        onCancel={() => setDetailUser(null)}
        footer={null}
        width={600}
      >
        {detailUser && (
          <div className="space-y-4">
            {detailUser.profilePic && (
              <div className="text-center">
                <Avatar size={80} src={detailUser.profilePic} />
                <div className="text-gray-500 mt-1">Ảnh đại diện</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <b>Username:</b> {detailUser.username}
              </div>
              <div>
                <b>Handle:</b> {detailUser.handleName}
              </div>
              <div>
                <b>Email:</b> {detailUser.email}
              </div>
              <div>
                <b>Ngày tạo:</b>{" "}
                {new Date(detailUser.createdAt).toLocaleString("vi-VN")}
              </div>
              <div>
                <b>Ngày sinh:</b>{" "}
                {detailUser.dateOfBirth
                  ? new Date(detailUser.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Không có"}
              </div>
              <div>
                <b>Trạng thái:</b>{" "}
                {detailUser.deletedAt ? "Đã xóa" : "Hoạt động"}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
