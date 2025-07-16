import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface TopVideo {
  id: string;
  caption: string;
  thumbnail: string;       // renamed from `thumbnail`
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [codecSupported, setCodecSupported] = useState(true);

  // Check codec support once on mount or when URL changes
  useEffect(() => {
    if (!post) return;
    setVideoError(false);
    setIsPlaying(false);
    setIsLoading(true);
    setCodecSupported(true);

    if (post.thumbnail.endsWith('.mp4')) {
      const v = document.createElement('video');
      const ok = (
        v.canPlayType('video/mp4; codecs="avc1.42E01E"') || ''
      ) !== '';
      if (!ok) {
        setCodecSupported(false);
        setVideoError(true);
        setIsLoading(false);
      }
    }
  }, [post?.id, post?.thumbnail]);

  const handleVideoPress = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
  };

  if (!post) return null;

  const isVideo = post.thumbnail.endsWith('.mp4') || post.thumbnail.endsWith('.m3u8');
  const totalViews = post.likes + post.comments + post.shares;
  const v = document.querySelector('video');
console.log(`Video track dimensions: ${v?.videoWidth}×${v?.videoHeight}`);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[85vw] w-[85vw] h-[85vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
        <DialogTitle className="sr-only">
          {post.caption || 'Video Preview'}
        </DialogTitle>

        <div className="flex w-full h-full rounded-lg overflow-hidden bg-white">
          {/* Media section */}
          <div className="w-3/5 flex items-center justify-center px-5 bg-white">
            <div className="max-h-[75vh] max-w-full flex items-center justify-center m-5">
              {isVideo ? (
                videoError ? (
                  <div className="text-center text-gray-500 text-sm space-y-2">
                    <p>
                      Không thể phát video ({
                        post.thumbnail.split('.').pop()?.toUpperCase()
                      })
                    </p>
                    {!codecSupported && (
                      <p className="text-red-600 text-xs">
                        Trình duyệt không hỗ trợ codec HEVC/H.265
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      URL: {post.thumbnail}
                    </p>
                  </div>
                ) : (
                  <div className="relative cursor-pointer flex items-center justify-center h-[75vh] w-full" onClick={handleVideoPress}>
                    <video
                      ref={videoRef}
                      src={post.thumbnail}
                      playsInline
                      controls
                      preload="metadata"
                      className="object-contain max-w-full h-full w-full rounded-lg shadow-md"
                      onLoadedMetadata={() => setIsLoading(false)}
                      onError={(e) => {
                        console.error('Video playback error:', e);
                        setVideoError(true);
                        setIsLoading(false);
                      }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <img
                  src={post.thumbnail}    // fallback as image
                  alt={post.caption}
                  className="object-contain h-auto max-h-[75vh] w-auto rounded-lg shadow-md"
                />
              )}
            </div>
          </div>

          {/* Info section unchanged... */}
          <div className="w-2/5 p-8 flex flex-col justify-between border-l overflow-auto">
            <div className="space-y-6 text-gray-800 text-base">
              <h2 className="text-2xl font-semibold">{post.caption}</h2>

              <div>
                <p className="text-sm text-gray-500">Người đăng</p>
                <p className="font-medium">
                  {post.author || (
                    <span className="italic text-gray-400">
                      (Ẩn danh)
                    </span>
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

              {/* Debug info */}
              <div className="text-xs text-gray-400 border-t pt-4">
                <p>Video URL: {post.thumbnail}</p>
                <p>Is Video: {isVideo ? 'Yes' : 'No'}</p>
                <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                <p>Error: {videoError ? 'Yes' : 'No'}</p>
                <p>Codec Supported: {codecSupported ? 'Yes' : 'No'}</p>
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
