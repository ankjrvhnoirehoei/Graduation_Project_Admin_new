import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '../components/ui/select';
import { Download, Eye, Trash, X, User, Mail, Calendar, Crown, AlertCircle } from 'lucide-react';
import api from '../lib/axios';

function EnhancedUserModal({ user, onClose }: { user: any; onClose: () => void }) {
  if (!user) return null;

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Esc key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Vietnamese field translations
  const fieldTranslations: { [key: string]: string } = {
    _id: 'ID',
    username: 'Tên người dùng',
    handleName: 'Tên hiển thị',
    email: 'Email',
    profilePic: 'Ảnh đại diện',
    isVip: 'Tài khoản VIP',
    deletedAt: 'Đã xóa',
    createdAt: 'Ngày tạo',
    dateOfBirth: 'Ngày sinh',
    updatedAt: 'Cập nhật lần cuối',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    bio: 'Tiểu sử',
    verified: 'Đã xác minh',
    lastLogin: 'Lần đăng nhập cuối'
  };

  // Format field values
  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return 'Không có';
    
    switch (key) {
      case 'isVip':
      case 'deletedAt':
      case 'verified':
        return value ? 'Có' : 'Không';
      case 'createdAt':
      case 'updatedAt':
      case 'lastLogin':
      case 'dateOfBirth':
        return value ? new Date(value).toLocaleString('vi-VN') : 'Không có';
      default:
        return String(value);
    }
  };

  // Get icon for field
  const getFieldIcon = (key: string) => {
    switch (key) {
      case 'username':
      case 'handleName':
        return <User className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'createdAt':
      case 'dateOfBirth':
        return <Calendar className="w-4 h-4" />;
      case 'isVip':
        return <Crown className="w-4 h-4" />;
      case 'deletedAt':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Use createPortal to render modal at document body level
  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chi tiết người dùng</h2>
                <p className="text-sm text-gray-500">{user.handleName || user.username}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Profile Picture Section */}
          {user.profilePic && (
            <div className="mb-6 text-center">
              <div className="inline-block">
                <img 
                  src={user.profilePic} 
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Ảnh đại diện</p>
            </div>
          )}

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(user)
              .filter(([key]) => key !== 'profilePic' && key !== '__v') // Handle profile pic separately
              .map(([key, value]) => (
                <div 
                  key={key}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getFieldIcon(key)}
                    <span className="text-sm font-medium text-gray-700">
                      {fieldTranslations[key] || key}
                    </span>
                  </div>
                  <div className="text-gray-900 font-medium break-all">
                    {formatValue(key, value)}
                  </div>
                </div>
              ))}
          </div>

          {/* VIP Status Badge */}
          {user.isVip && (
            <div className="mt-6 flex justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Tài khoản VIP</span>
              </div>
            </div>
          )}

          {/* Deleted Status */}
          {user.deletedAt && (
            <div className="mt-4 flex justify-center">
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-full flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Tài khoản đã bị xóa</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onClose}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body // Render at document.body level
  );
}

export default function NewUsersToday() {
  interface User {
    _id: string;
    username: string;
    handleName: string;
    email: string;
    profilePic?: string;
    isVip: boolean;
    deletedAt: boolean;
    createdAt: string;
    dateOfBirth?: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all'|'vip'|'deleted'>('all');

  const [detailUser, setDetailUser] = useState<User| null>(null);

  // fetch page
  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const res = await api.get(`/admin/users/new`, {
          headers: { token: true },
          params: { range: '7days', page, limit }
        });
        if (res.data.success) {
          setUsers(res.data.data.items);
          setTotalPages(res.data.data.pagination.totalPages);
        } else {
          setError('Không thể tải người dùng mới');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  // local filters
  const filtered = users.filter(u => {
    if (searchTerm && !u.handleName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filter === 'vip' && !u.isVip) return false;
    if (filter === 'deleted' && !u.deletedAt) return false;
    return true;
  });

  // toggle delete
  const toggleDelete = async (user: User) => {
    try {
      const res = await api.patch(`/admin/users/disable/${user._id}`, {}, { headers: { token: true } });
      if (res.data.success) {
        setUsers(us =>
          us.map(u =>
            u._id === user._id
              ? { ...u, deletedAt: res.data.isDeleted }
              : u
          )
        );
      }
    } catch {
      // handle error
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white shadow rounded-xl max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Người dùng mới</h1>
          <p className="text-sm text-gray-500">
            Hiển thị {filtered.length} / {users.length} kết quả
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Excel
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Tìm theo handleName"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <Select value={filter} onValueChange={v => setFilter(v as any)}>
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder="Lọc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="deleted">Đã xóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username/Handle</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>VIP</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(limit).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell>{i+1}</TableCell>
                    <TableCell colSpan={6} className="h-8 bg-gray-200" />
                  </TableRow>
                ))
              : filtered.map((u, i) => (
                  <TableRow key={u._id}>
                    <TableCell>{(page-1)*limit + i + 1}</TableCell>
                    <TableCell>
                      <div>{u.username}</div>
                      <div className="text-sm text-gray-500">{u.handleName}</div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{u.isVip ? '✔' : '–'}</TableCell>
                    <TableCell>{u.deletedAt ? '✔' : '–'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {/* Eye: show details */}
                      <Button size="icon" variant="ghost" onClick={() => setDetailUser(u)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {/* Trash: toggle delete */}
                      <Button size="icon" variant="ghost" onClick={() => toggleDelete(u)}>
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(p => p-1)}
        >Trang trước</Button>
        <span>{page} / {totalPages}</span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(p => p+1)}
        >Trang sau</Button>
      </div>

      {/* Enhanced Detail modal */}
      {detailUser && (
        <EnhancedUserModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
        />
      )}
    </div>
  );
}