import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface Media {
  _id: string;
  postID: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: any[];
}

interface User {
  _id: string;
  username: string;
  handleName: string;
  profilePic: string;
}

interface TopPost {
  _id: string;
  userID: string;
  type: "post" | "reel";
  caption: string;
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
  id: string;
}

interface Props {
  post: TopPost | null;
  onClose: () => void;
}

export default function PostPreviewModal({ post, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [codecSupported, setCodecSupported] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Helper functions
  const getCurrentMedia = () => {
    if (!post?.media || post.media.length === 0) return null;
    return post.media[currentMediaIndex] || post.media[0];
  };

  const getCurrentMediaUrl = () => {
    const media = getCurrentMedia();
    if (!media) return null;
    return media.videoUrl || media.imageUrl || null;
  };

  const isCurrentMediaVideo = () => {
    const mediaUrl = getCurrentMediaUrl();
    if (!mediaUrl) return false;
    return mediaUrl.endsWith('.mp4') || mediaUrl.includes('video');
  };

  // Check codec support once on mount or when URL changes
  useEffect(() => {
    if (!post) return;
    setVideoError(false);
    setIsPlaying(false);
    setIsLoading(true);
    setCodecSupported(true);

    const mediaUrl = getCurrentMediaUrl();
    if (mediaUrl && mediaUrl.endsWith('.mp4')) {
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
  }, [post?.id, currentMediaIndex, post?.media]);

  const handleVideoPress = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
  };

  const handlePrevMedia = () => {
    if (!post?.media || post.media.length <= 1) return;
    setCurrentMediaIndex(prev => 
      prev > 0 ? prev - 1 : post.media.length - 1
    );
    // Reset video state when changing media
    setVideoError(false);
    setIsPlaying(false);
    setIsLoading(true);
  };

  const handleNextMedia = () => {
    if (!post?.media || post.media.length <= 1) return;
    setCurrentMediaIndex(prev => 
      prev < post.media.length - 1 ? prev + 1 : 0
    );
    // Reset video state when changing media
    setVideoError(false);
    setIsPlaying(false);
    setIsLoading(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!post) return null;

  const currentMediaUrl = getCurrentMediaUrl();
  const isVideo = isCurrentMediaVideo();
  const hasMultipleMedia = post.media && post.media.length > 1;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[85vw] w-[85vw] h-[85vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
        <DialogTitle className="sr-only">
          {post.caption || 'Post Preview'}
        </DialogTitle>

        <div className="flex w-full h-full rounded-lg overflow-hidden bg-white">
          {/* Media section */}
          <div className="w-3/5 flex items-center justify-center px-5 bg-black relative">
            <div className="max-h-[75vh] max-w-full flex items-center justify-center m-5">
              {currentMediaUrl ? (
                isVideo ? (
                  videoError ? (
                    <div className="text-center text-white text-sm space-y-2">
                      <p>
                        Không thể phát video (MP4)
                      </p>
                      {!codecSupported && (
                        <p className="text-red-400 text-xs">
                          Trình duyệt không hỗ trợ codec HEVC/H.265
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        URL: {currentMediaUrl}
                      </p>
                    </div>
                  ) : (
                    <div className="relative cursor-pointer flex items-center justify-center h-[75vh] w-full" onClick={handleVideoPress}>
                      <video
                        key={currentMediaUrl} // Force re-render when URL changes
                        ref={videoRef}
                        src={currentMediaUrl}
                        playsInline
                        controls
                        preload="metadata"
                        muted={false}
                        className="object-contain max-w-full h-full w-full rounded-lg shadow-md bg-black"
                        style={{ 
                          maxHeight: '75vh',
                          width: 'auto',
                          height: 'auto'
                        }}
                        onLoadedMetadata={(e) => {
                          console.log(`Video loaded: ${e.currentTarget.videoWidth}x${e.currentTarget.videoHeight}`);
                          setIsLoading(false);
                        }}
                        onLoadedData={() => {
                          setIsLoading(false);
                        }}
                        onCanPlay={() => {
                          setIsLoading(false);
                        }}
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
                    key={currentMediaUrl} // Force re-render when URL changes
                    src={currentMediaUrl}
                    alt={post.caption}
                    className="object-contain h-auto max-h-[75vh] w-auto rounded-lg shadow-md"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      console.error('Image loading error:', currentMediaUrl);
                      setVideoError(true);
                      setIsLoading(false);
                    }}
                  />
                )
              ) : (
                <div className="text-center text-white text-sm">
                  <p>Không có media để hiển thị</p>
                </div>
              )}

              {/* Media navigation arrows - positioned relative to the entire media section */}
              {hasMultipleMedia && (
                <>
                  <button
                    onClick={handlePrevMedia}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all duration-200 z-10 shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextMedia}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all duration-200 z-10 shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Media indicator dots - positioned at bottom of media section */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {post.media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentMediaIndex 
                            ? 'bg-white shadow-lg' 
                            : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="w-2/5 p-8 flex flex-col justify-between border-l overflow-auto bg-white">
            <div className="space-y-6 text-gray-800 text-base">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{post.caption || "Không có tiêu đề"}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  post.type === 'reel' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {post.type === 'reel' ? 'Reel' : 'Post'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Người đăng</p>
                <div className="flex items-center space-x-3 mt-1">
                  <img 
                    src={post.user.profilePic} 
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{post.user.username}</p>
                    <p className="text-sm text-gray-500">@{post.user.handleName}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Thời gian đăng</p>
                <p className="font-medium">{formatDate(post.createdAt)}</p>
              </div>

              {post.location && (
                <div>
                  <p className="text-sm text-gray-500">Vị trí</p>
                  <p className="font-medium">{post.location}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    post.isEnable 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {post.isEnable ? 'Hoạt động' : 'Bị vô hiệu hóa'}
                  </span>
                  {post.isFlagged && (
                    <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                      Bị báo cáo
                    </span>
                  )}
                  {post.nsfw && (
                    <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                      NSFW
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Lượt xem</p>
                  <p className="font-medium text-lg">{post.viewCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lượt thích</p>
                  <p className="font-medium text-lg text-red-600">{post.likeCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bình luận</p>
                  <p className="font-medium text-lg">{post.commentCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chia sẻ</p>
                  <p className="font-medium text-lg">{post.share.toLocaleString()}</p>
                </div>
              </div>

              {hasMultipleMedia && (
                <div>
                  <p className="text-sm text-gray-500">Media</p>
                  <p className="font-medium">
                    {currentMediaIndex + 1} / {post.media.length} 
                    {isVideo ? ' (Video)' : ' (Hình ảnh)'}
                  </p>
                </div>
              )}
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