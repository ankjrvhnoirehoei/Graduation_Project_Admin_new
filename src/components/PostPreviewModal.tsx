import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import Hls from "hls.js";

interface TopVideo {
  id: string;
  caption: string;
  thumbnail: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
}

interface Props {
  post: TopVideo | null;
  onClose: () => void;
}

export default function PostPreviewModal({ post, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!post || !post.thumbnail) return;

    let hls: Hls | null = null;

    const setupPlayer = () => {
      if (!videoRef.current) return;

      if (post.thumbnail.endsWith(".m3u8")) {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(post.thumbnail);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error("HLS error", data);
              setVideoError(true);
              hls?.destroy();
            }
          });
        } else if (
          videoRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          videoRef.current.src = post.thumbnail;
        } else {
          setVideoError(true);
        }
      }
    };

    const timeout = setTimeout(setupPlayer, 50);

    return () => {
      clearTimeout(timeout);
      hls?.destroy();
    };
  }, [post]);

  if (!post) return null;

  const isVideo =
    post.thumbnail.endsWith(".mp4") || post.thumbnail.endsWith(".m3u8");

  const totalViews = post.likes + post.comments + post.shares;

  return (
    <Dialog open={!!post} onOpenChange={onClose}>
      <DialogContent className="max-w-[85vw] w-[85vw] h-[85vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="flex w-full h-full rounded-lg overflow-hidden bg-white">
          {/* Media section - 60% */}
          <div className="w-3/5 flex items-center justify-center px-5 bg-white">
            <div className="max-h-[75vh] max-w-full flex items-center justify-center m-5">
              {!isVideo ? (
                <img
                  src={post.thumbnail}
                  alt={post.caption}
                  className="object-contain h-auto max-h-[75vh] w-auto rounded-lg shadow-md"
                />
              ) : post.thumbnail.endsWith(".m3u8") ? (
                !videoError ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    controls
                    className="object-contain h-auto max-h-[75vh] w-auto rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    Không thể phát video HLS (.m3u8)
                  </div>
                )
              ) : (
                <video
                  src={post.thumbnail}
                  controls
                  className="object-contain h-auto max-h-[75vh] w-auto rounded-lg shadow-md"
                  onError={() => setVideoError(true)}
                />
              )}
            </div>
          </div>

          {/* Info section - 40% */}
          <div className="w-2/5 p-8 flex flex-col justify-between border-l overflow-auto">
            <div className="space-y-6 text-gray-800 text-base">
              <h2 className="text-2xl font-semibold">{post.caption}</h2>

              <div>
                <p className="text-sm text-gray-500">Người đăng</p>
                <p className="font-medium">
                  {post.author || (
                    <span className="italic text-gray-400">(Ẩn danh)</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Thời gian đăng</p>
                <p className="font-medium">Không rõ</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                  Đã xuất bản
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Lượt xem (tổng hợp)</p>
                <p className="font-medium">{totalViews.toLocaleString()}</p>
              </div>
            </div>

            <div className="text-right pt-6">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
