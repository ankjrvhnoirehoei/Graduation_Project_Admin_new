import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import api from '../../../lib/axios';

export interface StoryRow {
  id: string;
  userID: string;
  caption?: string;
  isFlagged: boolean;
  isEnable: boolean;
  viewCount: number;
  createdAt: string;
  user: {
    _id: string;
    handleName: string;
    profilePic: string;
  };
  media: Array<{
    _id: string;
    storyID: string;
    videoUrl?: string;
    imageUrl?: string;
    tags: string[];
  }>;
}

interface ApiResponse {
  success: boolean;
  data: {
    items: Array<{
      _id: string;
      userID: string;
      caption?: string;
      isFlagged: boolean;
      isEnable: boolean;
      viewCount: number;
      createdAt: string;
      user: {
        _id: string;
        handleName: string;
        profilePic: string;
      };
      media: Array<{
        _id: string;
        storyID: string;
        videoUrl?: string;
        imageUrl?: string;
        tags: string[];
      }>;
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

export function StoriesTable() {
  const [data, setData] = useState<StoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<ApiResponse>('/admin/stories/new', {
          headers: { token: true },
          params: { range: '7days', page, limit },
        });
        if (res.data.success) {
          const items = res.data.data.items.map(s => ({
            id: s._id,
            userID: s.userID,
            caption: s.caption,
            isFlagged: s.isFlagged,
            isEnable: s.isEnable,
            viewCount: s.viewCount,
            createdAt: new Date(s.createdAt).toLocaleString(),
            user: s.user,
            media: s.media,
          }));
          setData(items);
          setTotalPages(res.data.data.pagination.totalPages);
        } else {
          setError('Không thể tải danh sách stories');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải stories mới');
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [page]);

  const getMediaPreview = (story: StoryRow) => {
    if (story.media && story.media.length > 0) {
      const firstMedia = story.media[0];
      if (firstMedia.imageUrl) {
        return (
          <img 
            src={firstMedia.imageUrl} 
            alt="Story preview" 
            className="w-12 h-12 rounded object-cover"
          />
        );
      } else if (firstMedia.videoUrl) {
        return (
          <video 
            src={firstMedia.videoUrl} 
            className="w-12 h-12 rounded object-cover"
            muted
          />
        );
      }
    }
    return <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-xs">No media</div>;
  };

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Preview</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Người tạo</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Caption</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Trạng thái</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Bị gắn cờ</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(limit).fill(null).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-3"><div className="w-12 h-12 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                </tr>
              ))
            : data.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-3">
                    {getMediaPreview(s)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {s.user.profilePic ? (
                        <img 
                          src={s.user.profilePic} 
                          alt={s.user.handleName} 
                          className="w-6 h-6 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full" />
                      )}
                      <span className="text-sm text-gray-700">{s.user.handleName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                    <div className="truncate" title={s.caption}>
                      {s.caption || 'Không có caption'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      s.isEnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {s.isEnable ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      s.isFlagged ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.isFlagged ? 'Có' : 'Không'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.createdAt}</td>
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