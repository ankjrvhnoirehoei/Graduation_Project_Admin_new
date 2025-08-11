import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

// List item shape for table
export interface ContentRow {
  id: string;
  thumbnail?: string;
  caption: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  type: string;
  createdAt: string;
}

// Media interface
interface Media {
  _id: string;
  postID: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: Array<{
    userId: string;
    handleName: string;
    positionX: number;
    positionY: number;
    _id: string;
  }>;
  __v: number;
}

// User interface
interface User {
  _id: string;
  username: string;
  handleName: string;
  profilePic: string;
}

// Detailed post shape
interface PostDetail {
  _id: string;
  userID: string;
  type: string;
  caption?: string;
  isFlagged: boolean;
  nsfw: boolean;
  isEnable: boolean;
  location?: string;
  viewCount: number;
  share: number;
  createdAt: string;
  updatedAt: string;
  media: Media[];
  user: User;
  likeCount: number;
  commentCount: number;
}

// API Response interface
interface PostsResponse {
  success: boolean;
  data: {
    posts: PostDetail[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const isVideo = (url: string) => /\.(mp4|mov|webm)(\?|$)/i.test(url);

// Simplified thumbnail component 
function MediaThumbnail({ url, className, controls = false }: { url: string; className?: string; controls?: boolean }) {
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
  return <img src={url} alt="Media thumbnail" className={className} />;
}

export function ContentTable() {
  const [data, setData] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/posts/new', { 
          headers: { token: true }, 
          params: { range: '7days' } 
        });
        
        if (res.data.success) {
          const postsData: PostsResponse = res.data;
          const mappedData = postsData.data.posts.slice(0, 20).map((post: PostDetail) => {
            // Get the first media item for thumbnail
            const firstMedia = post.media?.[0];
            const thumbnail = firstMedia?.imageUrl || firstMedia?.videoUrl;
            
            return {
              id: post._id,
              thumbnail,
              caption: post.caption || '(no caption)',
              author: post.user?.username || post.user?.handleName || 'Unknown',
              likes: post.likeCount || 0,
              comments: post.commentCount || 0,
              shares: post.share || 0,
              views: post.viewCount || 0,
              type: post.type || 'unknown',
              createdAt: new Date(post.createdAt).toLocaleString(),
            };
          });
          
          setData(mappedData);
        } else {
          setError('Không thể tải danh sách bài viết');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải bài viết mới');
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchContents();
  }, []);

  const openDetail = async (id: string) => {
    try {
      const res = await api.get(`/posts/${id}`, { headers: { token: true } });
      if (res.data.success) {
        setSelectedPost(res.data.data);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') setModalOpen(false); 
    };
    
    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      
      <div className="overflow-x-auto border rounded-xl shadow-sm bg-white p-4">
        <table className="min-w-full border-separate border-spacing-y-1">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide">Ảnh</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide">Loại</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide">Chú thích</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide">Người đăng</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 tracking-wide">Lượt thích</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 tracking-wide">Bình luận</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 tracking-wide">Chia sẻ</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(5).fill(null).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={9} className="h-8 bg-gray-200 rounded" />
                  </tr>
                ))
              : data.map((content) => (
                  <tr 
                    key={content.id} 
                    className="hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors" 
                    onClick={() => openDetail(content.id)}
                  >
                    <td className="px-4 py-3 align-middle">
                      {content.thumbnail ? (
                        <MediaThumbnail 
                          url={content.thumbnail} 
                          className="w-14 h-10 object-cover rounded-md border" 
                        />
                      ) : (
                        <div className="w-14 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
                          Không có
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        content.type === 'reel' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 truncate max-w-[200px]">{content.caption}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{content.author}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{content.likes}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{content.comments}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{content.shares}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{content.createdAt}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal overlay */}
      {modalOpen && selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white max-w-4xl w-full mx-4 p-0 rounded-xl shadow-2xl border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 max-h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Chi tiết bài viết</h2>
              
              {/* Post info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Thông tin cơ bản</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ID</p>
                      <p className="font-mono text-sm bg-gray-50 rounded px-2 py-1">{selectedPost._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Loại</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedPost.type === 'reel' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedPost.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chú thích</p>
                      <p className="text-sm">{selectedPost.caption || '—'}</p>
                    </div>
                    {selectedPost.location && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Vị trí</p>
                        <p className="text-sm">{selectedPost.location}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Thống kê & Trạng thái</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Lượt thích</p>
                        <p className="text-sm font-medium">{selectedPost.likeCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bình luận</p>
                        <p className="text-sm font-medium">{selectedPost.commentCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Chia sẻ</p>
                        <p className="text-sm font-medium">{selectedPost.share}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className={`px-2 py-1 rounded text-xs text-center ${
                        selectedPost.isFlagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedPost.isFlagged ? 'Đã gắn cờ' : 'Bình thường'}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs text-center ${
                        selectedPost.nsfw ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedPost.nsfw ? 'NSFW' : 'An toàn'}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs text-center ${
                        selectedPost.isEnable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedPost.isEnable ? 'Đang hoạt động' : 'Đã tắt'}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1">Thời gian</p>
                      <p className="text-sm">Tạo: {new Date(selectedPost.createdAt).toLocaleString()}</p>
                      <p className="text-sm">Cập nhật: {new Date(selectedPost.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* User info */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-700">Người đăng</h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={selectedPost.user.profilePic} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{selectedPost.user.username}</p>
                    <p className="text-sm text-gray-600">@{selectedPost.user.handleName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedPost.user._id}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Media */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-700">Phương tiện ({selectedPost.media.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPost.media.map((media) => (
                    <div key={media._id} className="border rounded-lg p-3 bg-gray-50">
                      {media.imageUrl && (
                        <img 
                          src={media.imageUrl} 
                          alt="Post media" 
                          className="w-full rounded border mb-2 max-h-64 object-cover" 
                        />
                      )}
                      {media.videoUrl && (
                        <MediaThumbnail 
                          url={media.videoUrl} 
                          className="w-full rounded border mb-2 max-h-64" 
                          controls={true}
                        />
                      )}
                      {media.tags && media.tags.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Tags ({media.tags.length}):</p>
                          <div className="space-y-1">
                            {media.tags.map((tag) => (
                              <div key={tag._id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mr-1">
                                @{tag.handleName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}