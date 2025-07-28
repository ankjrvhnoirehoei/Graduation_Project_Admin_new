import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import api from '../../lib/axios';
import { Report, ReportsResponse, StoryTarget } from './type';
import { reasonMap } from '../../utils/reasons';

interface Props {
  mode?: 'all' | 'unread' | 'unresolved';
}

export function StoriesReportManagement({ mode = 'all' }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'all' 
        ? '/admin/reports/story/all'
        : mode === 'unread'
        ? '/admin/reports/story/unread'
        : '/admin/reports/story/unresolved';

      const res = await api.get<ReportsResponse>(endpoint, {
        headers: { token: true },
        params: { page, limit: 10 }
      });

      if (res.data) {
        setReports(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải báo cáo stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [mode, page]);

  const handleMarkAsRead = async (reportId: string) => {
    try {
      await api.patch(`/admin/reports/story/mark-read/${reportId}`, {}, {
        headers: { token: true }
      });
      fetchReports(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi đánh dấu đã đọc');
    }
  };

  const handleResolve = async (reportId: string) => {
    try {
      await api.patch(`/admin/reports/story/resolve/${reportId}`, {}, {
        headers: { token: true }
      });
      fetchReports(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi giải quyết báo cáo');
    }
  };

  const handleDismiss = async (reportId: string) => {
    try {
      await api.patch(`/admin/reports/story/dismiss/${reportId}`, {}, {
        headers: { token: true }
      });
      fetchReports(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi bỏ qua báo cáo');
    }
  };

  const getStoryPreview = (story: StoryTarget) => {
    if (story.media && story.media.length > 0) {
      const firstMedia = story.media[0];
      if (firstMedia.imageUrl) {
        return (
          <img 
            src={firstMedia.imageUrl} 
            alt="Story preview" 
            className="w-16 h-16 rounded object-cover"
          />
        );
      } else if (firstMedia.videoUrl) {
        return (
          <video 
            src={firstMedia.videoUrl} 
            className="w-16 h-16 rounded object-cover"
            muted
          />
        );
      }
    }
    return <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-xs">No media</div>;
  };

  if (loading) return <div className="flex justify-center p-8">Đang tải...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Báo cáo Stories ({mode === 'all' ? 'Tất cả' : mode === 'unread' ? 'Chưa đọc' : 'Chưa giải quyết'})
        </h2>
        <div className="text-sm text-gray-500">
          Tổng: {totalCount} báo cáo
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => {
          const story = report.target as StoryTarget;
          return (
            <div key={report._id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {getStoryPreview(story)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">@{story.user.handleName}</span>
                        <Badge variant={story.isEnable ? "default" : "destructive"}>
                          {story.isEnable ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </Badge>
                        {story.isFlagged && (
                          <Badge variant="destructive">Bị gắn cờ</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {story.caption || 'Không có caption'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {story.viewCount.toLocaleString()} lượt xem • {new Date(story.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!report.isRead && (
                        <Badge variant="secondary">Chưa đọc</Badge>
                      )}
                      {!report.resolved && (
                        <Badge variant="outline">Chưa giải quyết</Badge>
                      )}
                      {report.isDismissed && (
                        <Badge variant="destructive">Đã bỏ qua</Badge>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={report.reporter.profilePic} 
                        alt={report.reporter.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium">@{report.reporter.handleName}</span>
                      <span className="text-xs text-gray-500">báo cáo vì:</span>
                      <Badge variant="outline">{reasonMap[report.reason] || report.reason}</Badge>
                    </div>
                    
                    {report.description && (
                      <p className="text-sm text-gray-600 mb-2">"{report.description}"</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                      
                      <div className="flex gap-2">
                        {!report.isRead && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(report._id)}
                          >
                            Đánh dấu đã đọc
                          </Button>
                        )}
                        
                        {!report.resolved && !report.isDismissed && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDismiss(report._id)}
                            >
                              Bỏ qua
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResolve(report._id)}
                            >
                              Giải quyết
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có báo cáo nào
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Trang trước
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}