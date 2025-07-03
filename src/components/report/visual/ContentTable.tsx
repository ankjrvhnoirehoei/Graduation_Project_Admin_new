import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
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
  createdAt: string;
}

// Detailed post shape
interface PostDetail {
  _id: string;
  userID: string;
  music?: {
    musicId?: {
      _id: string;
      song: string;
      link: string;
      author: string;
      coverImg: string;
    };
    timeStart: number;
    timeEnd: number;
  };
  type?: string;
  caption?: string;
  isFlagged?: boolean;
  nsfw?: boolean;
  isEnable?: boolean;
  viewCount?: number;
  share?: number;
  createdAt?: string;
  updatedAt?: string;
  media?: Array<{ _id: string; postID: string; imageUrl?: string; videoUrl?: string; tags?: any[] }>;
  thumbnail?: string[];
}

const isVideo = (url: string) => /\.(mp4|mov|webm)(\?|$)/i.test(url);
const isHls = (url: string) => /\.m3u8(\?|$)/i.test(url);

// Component to render thumbnail (image, video, or hls)
function VideoThumbnail({ url, className, controls = false }: { url: string; className?: string; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (isHls(url) && ref.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(ref.current);
        return () => { hls.destroy(); };
      } else {
        ref.current.src = url;
      }
    }
  }, [url]);
  
  if (isVideo(url) || isHls(url)) {
    return (
      <video 
        ref={ref} 
        src={!isHls(url) ? url : undefined} 
        className={className} 
        muted={!controls}
        preload="metadata" 
        controls={controls}
      />
    );
  }
  return <img src={url} alt="thumb" className={className} />;
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
        const res = await api.get('/admin/posts/new', { headers: { token: true }, params: { range: '7days' } });
        if (res.data.success) {
          setData((res.data.data as any[]).slice(0,20).map(item => ({
            id: item._id,
            thumbnail: item.thumbnail?.[0],
            caption: item.caption || '(no caption)',
            author: item.author,
            likes: item.likes,
            comments: item.comments,
            shares: item.shares,
            createdAt: new Date(item.createdAt).toLocaleString(),
          })));
        } else setError('Không thể tải danh sách bài viết');
      } catch (err: any) {
        setError(err.response?.data?.message||'Lỗi khi tải bài viết mới');
      } finally { setLoading(false); }
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
    } catch { }
  };

  // close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
    if (modalOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  return (
    <>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="overflow-x-auto border rounded-xl shadow-sm bg-white p-4">
        <table className="min-w-full border-separate border-spacing-y-1">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide">Ảnh</th>
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
              ? Array(5).fill(null).map((_,i)=>(<tr key={i} className="animate-pulse"><td colSpan={7} className="h-8 bg-gray-200 rounded"/></tr>))
              : data.map(c=>(
                  <tr key={c.id} className="hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors" onClick={()=>openDetail(c.id)}>
                    <td className="px-4 py-3 align-middle">
                      {c.thumbnail ? <VideoThumbnail url={c.thumbnail} className="w-14 h-10 object-cover rounded-md border"/> : <div className="w-14 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">Không có</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 truncate max-w-[200px]">{c.caption}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.author}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{c.likes}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{c.comments}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{c.shares}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.createdAt}</td>
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
            className="bg-white max-w-2xl w-full mx-4 p-0 rounded-xl shadow-2xl border overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 max-h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Chi tiết bài viết</h2>
              {selectedPost.thumbnail?.[0] && (
                <VideoThumbnail 
                  url={selectedPost.thumbnail[0]} 
                  className="w-full h-56 object-cover mb-4 rounded-lg border"
                  controls={true}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="font-mono text-sm bg-gray-50 rounded px-2 py-1 mb-2">{selectedPost._id}</p>
                  <p className="text-xs text-gray-500 mb-1">Loại</p>
                  <p className="text-sm mb-2">{selectedPost.type||'—'}</p>
                  <p className="text-xs text-gray-500 mb-1">Chú thích</p>
                  <p className="text-sm mb-2">{selectedPost.caption||'—'}</p>
                  <p className="text-xs text-gray-500 mb-1">Người đăng (ID)</p>
                  <p className="text-sm mb-2">{selectedPost.userID}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Lượt xem</p>
                  <p className="text-sm mb-2">{selectedPost.viewCount??'—'}</p>
                  <p className="text-xs text-gray-500 mb-1">Chia sẻ</p>
                  <p className="text-sm mb-2">{selectedPost.share??'—'}</p>
                  <p className="text-xs text-gray-500 mb-1">Gắn cờ</p>
                  <p className="text-sm mb-2">{selectedPost.isFlagged?'Có':'Không'}</p>
                  <p className="text-xs text-gray-500 mb-1">Nhạy cảm</p>
                  <p className="text-sm mb-2">{selectedPost.nsfw?'Có':'Không'}</p>
                  <p className="text-xs text-gray-500 mb-1">Đang bật</p>
                  <p className="text-sm mb-2">{selectedPost.isEnable?'Có':'Không'}</p>
                  <p className="text-xs text-gray-500 mb-1">Tạo lúc</p>
                  <p className="text-sm mb-2">{selectedPost.createdAt?new Date(selectedPost.createdAt).toLocaleString():'—'}</p>
                  <p className="text-xs text-gray-500 mb-1">Cập nhật</p>
                  <p className="text-sm mb-2">{selectedPost.updatedAt?new Date(selectedPost.updatedAt).toLocaleString():'—'}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <h3 className="font-semibold mb-2 text-gray-700">Phương tiện</h3>
              {selectedPost.media?.map(m => (
                <div key={m._id} className="mb-2">
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt="media" className="max-w-full rounded border mb-2" />
                  )}
                  {m.videoUrl && (
                    <VideoThumbnail 
                      url={m.videoUrl} 
                      className="max-w-full rounded border mb-2" 
                      controls={true}
                    />
                  )}
                </div>
              ))}
              <Separator className="my-4" />
              {selectedPost.music?.musicId && (
                <>
                  <h3 className="font-semibold mb-2 text-gray-700">Nhạc</h3>
                  <p className="mb-1">{selectedPost.music.musicId.song||'—'} <span className="text-xs text-gray-500">bởi</span> {selectedPost.music.musicId.author||'—'}</p>
                  <audio src={selectedPost.music.musicId.link} controls className="w-full my-2" />
                  <p className="text-xs text-gray-500 mb-2">Đoạn: {selectedPost.music.timeStart?.toFixed(2)||'0.00'}s - {selectedPost.music.timeEnd?.toFixed(2)||'0.00'}s</p>
                  <Separator className="my-4" />
                </>
              )}
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Đóng</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}