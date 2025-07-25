import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import api from '../../../lib/axios';

export interface UserRow {
  id: string;
  username: string;
  handleName: string;
  profilePic?: string;
  deletedAt: boolean;
  createdAt: string;
  dateOfBirth?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    items: Array<{
      _id: string;
      username: string;
      handleName: string;
      profilePic?: string;
      deletedAt: boolean;
      createdAt: string;
      dateOfBirth?: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export function UsersTable() {
  const [data, setData] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/users/new', {
          headers: { token: true },
          params: { range: '7days', page, limit },
        });
        if (res.data.success) {
          const items = res.data.data.items.map(u => ({
            id: u._id,
            username: u.username,
            handleName: u.handleName,
            profilePic: u.profilePic,
            deletedAt: u.deletedAt,
            createdAt: new Date(u.createdAt).toLocaleString(),
            dateOfBirth: u.dateOfBirth || '',
          }));
          setData(items);
          setTotalPages(res.data.data.pagination.totalPages);
        } else {
          setError('Không thể tải danh sách người dùng');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải người dùng mới');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ảnh đại diện</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Username</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Handle</th>
            {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">VIP</th> */}
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Bị xóa</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ngày tạo account</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ngày sinh</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(limit).fill(null).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-3"><div className="w-8 h-8 bg-gray-200 rounded-full" /></td>
                  <td className="px-4 py-3 bg-gray-200 h-4" />
                  <td className="px-4 py-3 bg-gray-200 h-4" />
                  <td className="px-4 py-3 bg-gray-200 h-4" />
                  <td className="px-4 py-3 bg-gray-200 h-4" />
                  <td className="px-4 py-3 bg-gray-200 h-4" />
                  <td className="px-4 py-3 bg-gray-200 h-4" />
                </tr>
              ))
            : data.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-3">
                    {u.profilePic
                      ? <img src={u.profilePic} alt={u.username} className="w-8 h-8 rounded-full object-cover" />
                      : <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    }
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.handleName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.deletedAt ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.deletedAt ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.createdAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.dateOfBirth}</td>
                </tr>
              ))
          }
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page === 1 || loading}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Trang trước
        </Button>
        <span className="text-sm text-gray-600">{page} / {totalPages}</span>
        <Button
          variant="outline"
          disabled={page === totalPages || loading}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Trang sau
        </Button>
      </div>
    </div>
);
}
