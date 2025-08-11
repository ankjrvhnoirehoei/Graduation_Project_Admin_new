import React, { useEffect, useState, useRef } from 'react';
import { List, Card, Image, Typography, Pagination, Space, Skeleton, Empty, Modal } from 'antd';
import api from '../../lib/axios';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

type Media = {
  _id: string;
  postID: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: any[];
};

type PostItem = {
  _id: string;
  type: string; // 'post' | 'reel'
  caption?: string;
  createdAt?: string;
  likeCount?: number;
  viewCount?: number;
  media: Media[];
};

type StoryItem = {
  _id: string;
  mediaUrl: string;
  thumbnail: string;
  createdAt: string;
};

export default function UserContentTab({ userId, visible }: { userId: string; visible: boolean }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [reels, setReels] = useState<PostItem[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);

  const [postPage, setPostPage] = useState(1);
  const [postLimit] = useState(6);
  const [postTotal, setPostTotal] = useState(0);

  const [reelPage, setReelPage] = useState(1);
  const [reelLimit] = useState(6);
  const [reelTotal, setReelTotal] = useState(0);

  const [storyPage, setStoryPage] = useState(1);
  const [storyLimit] = useState(6);
  const [storyTotal, setStoryTotal] = useState(0);

  // Modal states for viewing media
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Video modal state
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  
  // Add ref to control video element
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchContents = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/users/content/${userId}`, {
        params: {
          postPage,
          postLimit,
          reelPage,
          reelLimit,
          storyPage,
          storyLimit,
        },
        headers: { token: true },
      });

      const data = res.data?.data || {};
      setPosts(data.posts?.data || []);
      setPostTotal(data.posts?.totalCount || 0);
      setReels(data.reels?.data || []);
      setReelTotal(data.reels?.totalCount || 0);
      setStories(data.stories?.data || []);
      setStoryTotal(data.stories?.totalCount || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchContents();
  }, [userId, visible, postPage, reelPage, storyPage]);

  // Clean up video when component unmounts or becomes invisible
  useEffect(() => {
    if (!visible && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [visible]);

  // Truncate caption text
  const truncateCaption = (caption: string | undefined, maxLength: number = 50) => {
    if (!caption) return '—';
    return caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;
  };

  // Handle image preview for posts with multiple images
  const handleImageClick = (item: PostItem) => {
    const imageUrls = item.media.filter(m => m.imageUrl).map(m => m.imageUrl!);
    if (imageUrls.length > 0) {
      setPreviewImages(imageUrls);
      setPreviewIndex(0);
      setPreviewOpen(true);
    }
  };

  // Handle video click for reels
  const handleVideoClick = (item: PostItem) => {
    const videoMedia = item.media.find(m => m.videoUrl);
    if (videoMedia?.videoUrl) {
      setVideoUrl(videoMedia.videoUrl);
      setVideoOpen(true);
    }
  };

  // Enhanced video modal close handler
  const handleVideoModalClose = () => {
    // Pause and reset video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setVideoOpen(false);
    setVideoUrl('');
  };

  const renderMediaThumb = (item: PostItem) => {
    const m = item.media?.[0];
    if (!m) return null;

    if (m.videoUrl) {
      return (
        <div 
          onClick={() => handleVideoClick(item)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <video 
            src={m.videoUrl} 
            style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 6 }} 
            muted
          />
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            padding: '8px',
            color: 'white'
          }}>
            ▶️
          </div>
        </div>
      );
    }

    if (m.imageUrl) {
      const hasMultipleImages = item.media.filter(media => media.imageUrl).length > 1;
      return (
        <div 
          onClick={() => handleImageClick(item)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <Image 
            src={m.imageUrl} 
            style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 6 }}
            preview={false}
          />
          {hasMultipleImages && (
            <div style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: '4px',
              padding: '2px 6px',
              color: 'white',
              fontSize: '12px'
            }}>
              +{item.media.filter(media => media.imageUrl).length - 1}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card size="small" title={`Bài đăng (${postTotal})`}>
            {posts.length === 0 ? (
              <Empty description="Không có bài đăng" />
            ) : (
              <List grid={{ gutter: 12, column: 3 }} dataSource={posts} renderItem={(item: PostItem) => (
                <List.Item>
                  <Card size="small" hoverable>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {renderMediaThumb(item)}
                      <div style={{ flex: 1 }}>
                        <Text strong title={item.caption}>{truncateCaption(item.caption)}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.createdAt).fromNow()}</Text>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )} />
            )}

            {postTotal > postLimit && (
              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Pagination current={postPage} pageSize={postLimit} total={postTotal} onChange={(p) => setPostPage(p)} />
              </div>
            )}
          </Card>

          <Card size="small" title={`Reels (${reelTotal})`}>
            {reels.length === 0 ? (
              <Empty description="Không có reels" />
            ) : (
              <List grid={{ gutter: 12, column: 3 }} dataSource={reels} renderItem={(item: PostItem) => (
                <List.Item>
                  <Card size="small" hoverable>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {renderMediaThumb(item)}
                      <div style={{ flex: 1 }}>
                        <Text strong title={item.caption}>{truncateCaption(item.caption)}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.createdAt).fromNow()}</Text>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )} />
            )}

            {reelTotal > reelLimit && (
              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Pagination current={reelPage} pageSize={reelLimit} total={reelTotal} onChange={(p) => setReelPage(p)} />
              </div>
            )}
          </Card>

          <Card size="small" title={`Stories (${storyTotal})`}>
            {stories.length === 0 ? (
              <Empty description="Không có stories" />
            ) : (
              <List grid={{ gutter: 12, column: 3 }} dataSource={stories} renderItem={(item: StoryItem) => (
                <List.Item>
                  <Card size="small" hoverable>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Image 
                        src={item.thumbnail || item.mediaUrl} 
                        style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 6 }} 
                      />
                      <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(item.createdAt).fromNow()}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )} />
            )}

            {storyTotal > storyLimit && (
              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Pagination current={storyPage} pageSize={storyLimit} total={storyTotal} onChange={(p) => setStoryPage(p)} />
              </div>
            )}
          </Card>
        </Space>
      )}

      {/* Image Preview Modal */}
      <Image.PreviewGroup 
        preview={{
          visible: previewOpen,
          onVisibleChange: (vis) => setPreviewOpen(vis),
          current: previewIndex,
          onChange: (index) => setPreviewIndex(index),
        }}
      >
        {previewImages.map((url, index) => (
          <Image key={index} src={url} style={{ display: 'none' }} />
        ))}
      </Image.PreviewGroup>

      {/* Video Modal */}
      <Modal
        open={videoOpen}
        footer={null}
        width={800}
        onCancel={handleVideoModalClose}
        centered
        destroyOnClose={true}
      >
        {videoUrl && (
          <video 
            ref={videoRef}
            src={videoUrl} 
            controls 
            autoPlay 
            style={{ width: '100%', maxHeight: '70vh' }}
            onLoadStart={() => {
              // Ensure video starts fresh when modal opens
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
              }
            }}
          />
        )}
      </Modal>
    </div>
  );
}