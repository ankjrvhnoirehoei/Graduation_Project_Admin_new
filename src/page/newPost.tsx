import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '../components/ui/select';
import { Download, Eye, Trash, X, Music, Image, Video, User, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

const isVideo = (url: string) => /\.(mp4)(\?|$)/i.test(url);

function VideoThumbnail({ 
  url, 
  className, 
  controls = false 
}: { 
  url: string; 
  className?: string; 
  controls?: boolean 
}) {
  if (isVideo(url)) {
    return (
      <video 
        src={url} 
        className={className} 
        muted={!controls}
        preload="metadata" 
        controls={controls}
      />
    );
  }
  return <img src={url} alt="thumb" className={className} />;
}

function PostDetailModal({ 
  postId, 
  onClose 
}: { 
  postId: string | null; 
  onClose: () => void 
}) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!postId) return;
    
    const fetchPostDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/posts/${postId}`, {
          headers: { token: true }
        });
        if (res.data.success) {
          setPost(res.data.data);
        } else {
          setError('Failed to load post details');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Error loading post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (!postId) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết bài viết</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Đang tải chi tiết bài viết...</span>
              </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {post && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Mã bài viết
                    </label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                      {post._id}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã người dùng
                    </label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                      {post.userID}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      post.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {post.type === 'post' ? <Image className="w-4 h-4 mr-1" /> : <Video className="w-4 h-4 mr-1" />}
                      {post.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {post.caption || 'Không có chú thích'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        post.isEnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {post.isEnable ? 'Enabled' : 'Deleted'}
                      </span>
                      {post.isFlagged && (
                        <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                          Đã gắn cờ
                        </span>
                      )}
                      {post.nsfw && (
                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          Nhạy cảm
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thống kê
                    </label>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Lượt xem:</span>
                        <span className="font-semibold ml-2">{post.viewCount || 0}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Chia sẻ:</span>
                        <span className="font-semibold ml-2">{post.share || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian
                    </label>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Tạo lúc:</span>
                        <span className="ml-2">{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">Cập nhật:</span>
                        <span className="ml-2">{new Date(post.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Section */}
              {post.music && post.music.musicId && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Thông tin nhạc
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <img 
                          src={post.music.musicId.coverImg} 
                          alt="Music cover"
                          className="w-24 h-24 object-cover rounded-lg mb-4"
                        />
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Bài hát:</span>
                            <p className="text-gray-900">{post.music.musicId.song}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Tác giả:</span>
                            <p className="text-gray-900">{post.music.musicId.author}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
                          <p className="text-gray-900">
                            {post.music.timeStart?.toFixed(2)}s - {post.music.timeEnd?.toFixed(2)}s
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Liên kết nhạc:</span>
                          <a 
                            href={post.music.musicId.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline block truncate"
                          >
                            {post.music.musicId.link}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Section */}
              {post.media && post.media.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Phương tiện ({post.media.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.media.map((media: any, index: number) => (
                      <div key={media._id || index} className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-3">
                          {media.imageUrl && (
                            <VideoThumbnail 
                              url={media.imageUrl} 
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                          {media.videoUrl && (
                            <VideoThumbnail 
                              url={media.videoUrl} 
                              className="w-full h-48 object-cover rounded-lg"
                              controls={true}
                            />
                          )}
                        </div>
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Mã phương tiện:</span>
                            <p className="font-mono text-xs text-gray-600">{media._id}</p>
                          </div>
                          {media.imageUrl && (
                            <div>
                              <span className="font-medium text-gray-700">Liên kết ảnh:</span>
                              <a 
                                href={media.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline block truncate text-xs"
                              >
                                {media.imageUrl}
                              </a>
                            </div>
                          )}
                          {media.videoUrl && (
                            <div>
                              <span className="font-medium text-gray-700">Liên kết video:</span>
                              <a 
                                href={media.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline block truncate text-xs"
                              >
                                {media.videoUrl}
                              </a>
                            </div>
                          )}
                          {media.tags && media.tags.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Thẻ:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {media.tags.map((tag: any, tagIndex: number) => (
                                  <span 
                                    key={tagIndex}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                  >
                                    @{tag.handleName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

interface Post {
  _id: string;
  userID: string;
  type: 'post' | 'reel';
  caption: string;
  isFlagged: boolean;
  nsfw: boolean;
  isEnable: boolean;
  viewCount: number;
  share: number;
  createdAt: string;
  updatedAt: string;
  media: Array<{
    _id: string;
    postID: string;
    imageUrl?: string;
    videoUrl?: string;
    tags: Array<{
      userId: string;
      handleName: string;
      positionX: number;
      positionY: number;
      _id: string;
    }>;
  }>;
  user: {
    _id: string;
    username: string;
    handleName: string;
    profilePic: string;
  };
  likeCount: number;
  commentCount: number;
}

interface ApiResponse {
  posts: Post[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function NewPostsToday() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all'|'post'|'reel'>('all');
  const [previewPostId, setPreviewPostId] = useState<string | null>(null);
  
  // pagination and sorting
  const [sortBy, setSortBy] = useState<'createdAt' | 'likeCount' | 'commentCount' | 'viewCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/posts/new', {
        headers: { token: true },
        params: { 
          range: '7days',
          sortBy,
          sortOrder,
          page,
          limit: pageSize
        }
      });
      if (res.data.success) {
        setData(res.data.data);
        setCurrentPage(page);
      } else {
        setError('Không thể tải bài viết mới');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [sortBy, sortOrder, pageSize]);

  // Type filter
  const filteredPosts = data?.posts?.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || 
      post.caption.toLowerCase().includes(term) || 
      post.user.username.toLowerCase().includes(term) ||
      post.user.handleName.toLowerCase().includes(term);
    
    const matchesFilter = filter === 'all' || post.type === filter;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      fetchPosts(newPage);
    }
  };

  const toggleEnable = async (post: Post) => {
    try {
      const res = await api.patch(`/admin/posts/disable/${post._id}`, {}, { 
        headers: { token: true }
      });
      if (res.data.success) {
        alert("Cập nhật bài viết thành công.");
        // Refresh current page
        fetchPosts(currentPage);
      }
    } catch { /* ignore */ }
  };

  const renderThumbnail = (post: Post) => {
    const media = post.media[0];
    if (!media) {
      return <div className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500">No media</span>
      </div>;
    }

    const url = media.imageUrl || media.videoUrl;
    if (!url) {
      return <div className="w-16 h-10 bg-gray-300 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500">No media</span>
      </div>;
    }

    return (
      <VideoThumbnail 
        url={url} 
        className="w-16 h-10 object-cover rounded"
      />
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bài viết mới (7 ngày)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị {filteredPosts.length} / {data?.totalCount || 0} bài viết
            {data && ` (Trang ${data.currentPage}/${data.totalPages})`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Tìm tiêu đề hoặc người đăng"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <Select value={filter} onValueChange={v => setFilter(v as any)}>
          <SelectTrigger className="min-w-[120px]">
            <SelectValue placeholder="Lọc loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="reel">Reels</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
          <SelectTrigger className="min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Thời gian tạo</SelectItem>
            <SelectItem value="likeCount">Lượt thích</SelectItem>
            <SelectItem value="commentCount">Bình luận</SelectItem>
            <SelectItem value="viewCount">Lượt xem</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={v => setSortOrder(v as any)}>
          <SelectTrigger className="min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Giảm dần</SelectItem>
            <SelectItem value="asc">Tăng dần</SelectItem>
          </SelectContent>
        </Select>

        <Select value={pageSize.toString()} onValueChange={v => setPageSize(Number(v))}>
          <SelectTrigger className="min-w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>#</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Phương tiện</TableHead>
              <TableHead>Chú thích</TableHead>
              <TableHead>Người đăng</TableHead>
              <TableHead>Thống kê</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(pageSize).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={8} className="h-12 bg-gray-200"/>
                  </TableRow>
                ))
              : filteredPosts.map((post, i) => (
                  <TableRow key={post._id} className="hover:bg-gray-50">
                    <TableCell>{((currentPage - 1) * pageSize) + i + 1}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        post.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {post.type === 'post' ? <Image className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                        {post.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {renderThumbnail(post)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{post.caption || '(Không có chú thích)'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={post.user.profilePic} 
                          alt="avatar" 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="truncate">{post.user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>👁️ {post.viewCount}</div>
                        <div>❤️ {post.likeCount}</div>
                        <div>💬 {post.commentCount}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center justify-center ${
                          post.isEnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {post.isEnable ? 'Enabled' : 'Disabled'}
                        </span>
                        {post.isFlagged && (
                          <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 inline-flex items-center justify-center">
                            Flagged
                          </span>
                        )}
                        {post.nsfw && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 inline-flex items-center justify-center">
                            NSFW
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setPreviewPostId(post._id)}
                      >
                        <Eye className="w-4 h-4"/>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => toggleEnable(post)}
                      >
                        <Trash className="w-4 h-4 text-red-500"/>
                      </Button>
                    </TableCell>
                  </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Trang {data.currentPage} / {data.totalPages} 
            ({data.totalCount} bài viết)
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!data.hasPrevPage || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(data.totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data.hasNextPage || loading}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <PostDetailModal
        postId={previewPostId}
        onClose={() => setPreviewPostId(null)}
      />
    </div>
  );
}