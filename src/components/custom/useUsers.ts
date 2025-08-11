import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../lib/axios';
import { message } from 'antd';

export type UserRow = {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'locked';
  createdAt: string;
  totalPosts: number;
  totalStories: number;
  totalLikesReceived: number;
  totalFollowers: number;
  totalBookmarks: number;
};

export default function useUsers({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (p: URLSearchParams) => void;
}) {
  const [lockingId, setLockingId] = useState<string | null>(null);

  // Data & pagination
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const query = useMemo(() => {
    const q = searchParams.get('q') ?? '';
    const status = searchParams.get('status') ?? '';
    const from = searchParams.get('from') ?? '';
    const to = searchParams.get('to') ?? '';
    return { q, status, from, to };
  }, [searchParams]);

  const quickStats = useMemo(() => {
    const active = rows.filter((r) => r.status === 'active').length;
    const locked = rows.filter((r) => r.status === 'locked').length;
    return { active, locked, total };
  }, [rows, total]);

  // Fetch from API 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/admin', {
        params: {
          q: query.q || undefined,
          status: query.status || undefined,
          from: query.from || undefined,
          to: query.to || undefined,
          page,
          pageSize,
        },
        headers: { token: true },
      });

      const { items, total: t } = res.data || {};
      const mapped: UserRow[] = (items || []).map((u: any) => ({
        _id: u._id,
        username: u.username,
        email: u.email || '',
        phone: u.phone || u.phoneNumber || '',
        avatar: u.avatar || u.profilePic || '',
        status: u.status,
        createdAt: u.createdAt,
        totalPosts: u.totalPosts ?? 0,
        totalStories: u.totalStories ?? 0,
        totalLikesReceived: u.totalLikesReceived ?? 0,
        totalFollowers: u.totalFollowers ?? 0,
        totalBookmarks: u.totalBookmarks ?? 0,
      }));
      setRows(mapped);
      setTotal(Number(t) || 0);
    } catch (e: any) {
      console.error(e);
      message.error(e?.response?.data?.message || 'Không tải được danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query.q, query.status, query.from, query.to, page, pageSize]);

  // URL helper 
  const updateSearchParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '') next.delete(k);
      else next.set(k, v);
    });
    if (
      patch.q !== undefined ||
      patch.status !== undefined ||
      patch.from !== undefined ||
      patch.to !== undefined
    ) {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const openViewModal = async (row: UserRow) => {
    setViewOpen(true);
    setViewLoading(true);
    try {
      setSelectedUser(row);
    } catch {
      message.error('Không tải được thông tin người dùng');
    } finally {
      setViewLoading(false);
    }
  };

  const toggleLock = async (id: string) => {
    try {
      setLockingId(id);
      const res = await api.patch(`/users/admin/users/${id}/toggle-lock`, null, {
        headers: { token: true },
      });
      const locked = !!res?.data?.locked;
      setRows((prev) => prev.map((u) => (u._id === id ? { ...u, status: locked ? 'locked' : 'active' } : u)));
      setSelectedUser((prev) => (prev && prev._id === id ? { ...prev, status: locked ? 'locked' : 'active' } : prev));
      message.success(locked ? 'Đã khoá tài khoản' : 'Đã mở khoá');
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLockingId(null);
    }
  };

  return {
    // state
    rows,
    total,
    loading,
    page,
    pageSize,
    lockingId,
    viewOpen,
    viewLoading,
    selectedUser,
    quickStats,

    // actions
    fetchUsers,
    updateSearchParams,
    openViewModal,
    setViewOpen,
    toggleLock,
    setSelectedUser,
  } as const;
}
