import React, { useRef, useEffect, useState } from 'react';
import { Modal, Card, Image, Typography, Tag, Space, Button, Avatar, Divider, Statistic, Progress } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LikeOutlined, CommentOutlined, UserOutlined, CalendarOutlined, AudioOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { ContentItem } from '../custom/useContents';

const { Paragraph, Text, Title } = Typography;

// Format date utility
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

// Format time utility for music
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ContentDetailsModal({ 
  visible, 
  item, 
  onClose, 
  onToggleEnable 
}: { 
  visible: boolean; 
  item: ContentItem | null; 
  onClose: () => void; 
  onToggleEnable: (id: string) => void 
}) {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Stop all videos and audio when modal closes
  useEffect(() => {
    if (!visible) {
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  }, [visible]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const startTime = item?.music?.timeStart || 0;
      const endTime = item?.music?.timeEnd || audio.duration;
      setDuration(endTime - startTime);
      audio.currentTime = startTime;
    };

    const handleTimeUpdate = () => {
      if (!item?.music) return;
      const startTime = item.music.timeStart || 0;
      const endTime = item.music.timeEnd || audio.duration;
      
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
        setIsPlaying(false);
        setCurrentTime(0);
      } else {
        setCurrentTime(audio.currentTime - startTime);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [item?.music, visible]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio || !item?.music) return;

    if (isPlaying) {
      audio.pause();
    } else {
      const startTime = item.music.timeStart || 0;
      if (audio.currentTime < startTime) {
        audio.currentTime = startTime;
      }
      audio.play();
    }
  };

  if (!item) return null;

  const mediaItems = item.media || [];
  const firstMedia = mediaItems[0];

  return (
    <Modal 
      open={visible} 
      footer={null} 
      width={1200} 
      onCancel={onClose}
      destroyOnClose
      styles={{
        body: { padding: 0 }
      }}
    >
      <div style={{ display: 'flex', minHeight: 600 }}>
        {/* Media Section */}
        <div style={{ 
          flex: '0 0 60%', 
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Show only first media item for cleaner display */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {firstMedia?.imageUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image.PreviewGroup>
                  {mediaItems.map((media, index) => (
                    <Image
                      key={media._id}
                      src={media.imageUrl}
                      alt={`Content image ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: index === 0 ? 'block' : 'none'
                      }}
                    />
                  ))}
                </Image.PreviewGroup>
                
                {/* Image tags overlay */}
                {firstMedia.tags && firstMedia.tags.map((tag, index) => (
                  <div
                    key={tag._id}
                    style={{
                      position: 'absolute',
                      left: `${tag.positionX * 100}%`,
                      top: `${tag.positionY * 100}%`,
                      transform: 'translate(-50%, -100%)',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      cursor: 'pointer'
                    }}
                  >
                    @{tag.handleName}
                  </div>
                ))}
                
                {/* Multiple images indicator */}
                {mediaItems.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    1/{mediaItems.length}
                  </div>
                )}
              </div>
            ) : firstMedia?.videoUrl ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current[0] = el;
                }}
                src={firstMedia.videoUrl}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onLoadStart={() => {
                  if (videoRefs.current[0]) {
                    videoRefs.current[0].pause();
                  }
                }}
              />
            ) : (
              <div style={{ color: 'white', textAlign: 'center' }}>
                <Text style={{ color: 'white' }}>Không có media</Text>
              </div>
            )}
          </div>
        </div>

        {/* Content Info Section */}
        <div style={{ 
          flex: '0 0 40%', 
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}>
          {/* Header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 12
            }}>
              <Space>
                <Avatar 
                  size={40} 
                  src={item.user?.profilePic} 
                  icon={<UserOutlined />}
                />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {item.user?.username || item.user?.handleName || 'Người dùng không xác định'}
                  </Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.user?.handleName && item.user?.username !== item.user?.handleName 
                        ? `@${item.user.handleName}` 
                        : ''
                      }
                    </Text>
                  </div>
                </div>
              </Space>
              
              <Space>
                <Tag 
                  color={item.type === 'post' ? 'blue' : 'purple'}
                  style={{ fontSize: 12 }}
                >
                  {item.type === 'post' ? 'BÀI VIẾT' : 'VIDEO NGẮN'}
                </Tag>
                <Tag 
                  color={item.isEnable ? 'green' : 'red'}
                  style={{ fontSize: 12 }}
                >
                  {item.isEnable ? 'HIỂN THỊ' : 'ĐÃ ẨN'}
                </Tag>
              </Space>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Stats */}
          <div style={{ marginBottom: 16 }}>
            <Space size={24}>
              <Statistic
                title="Lượt thích"
                value={item.likeCount || 0}
                prefix={<LikeOutlined />}
                valueStyle={{ fontSize: 16 }}
              />
              <Statistic
                title="Bình luận"
                value={item.commentCount || 0}
                prefix={<CommentOutlined />}
                valueStyle={{ fontSize: 16 }}
              />
            </Space>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Music Player */}
          {item.musicInfo && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>
                  <Space>
                    <AudioOutlined />
                    Nhạc nền
                  </Space>
                </Title>
                <Card size="small" style={{ backgroundColor: '#f8f9fa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar 
                      size={48} 
                      src={item.musicInfo.coverImg} 
                      icon={<AudioOutlined />}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: 14, display: 'block' }}>
                        {item.musicInfo.song}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.musicInfo.author}
                      </Text>
                    </div>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={toggleMusic}
                      size="large"
                    />
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ marginTop: 12 }}>
                    <Progress
                      percent={duration > 0 ? (currentTime / duration) * 100 : 0}
                      showInfo={false}
                      size="small"
                    />
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginTop: 4 
                    }}>
                      <Text style={{ fontSize: 11, color: '#999' }}>
                        {formatTime(currentTime)}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#999' }}>
                        {formatTime(duration)}
                      </Text>
                    </div>
                  </div>
                </Card>
                
                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src={item.musicInfo.link}
                  preload="metadata"
                />
              </div>
              <Divider style={{ margin: '12px 0' }} />
            </>
          )}

          {/* Tags */}
          {firstMedia?.tags && firstMedia.tags.length > 0 && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Gắn thẻ</Title>
                <Space wrap>
                  {firstMedia.tags.map((tag) => (
                    <Tag key={tag._id} color="blue">
                      @{tag.handleName}
                    </Tag>
                  ))}
                </Space>
              </div>
              <Divider style={{ margin: '12px 0' }} />
            </>
          )}

          {/* Caption */}
          <div style={{ flex: 1, marginBottom: 16 }}>
            <Title level={5}>Nội dung</Title>
            <Paragraph style={{ 
              fontSize: 14, 
              lineHeight: 1.6,
              maxHeight: 200,
              overflowY: 'auto',
              padding: 8,
              backgroundColor: '#fafafa',
              borderRadius: 6
            }}>
              {item.caption || 'Không có nội dung'}
            </Paragraph>
          </div>

          {/* Date */}
          <div style={{ marginBottom: 20 }}>
            <Space>
              <CalendarOutlined style={{ color: '#999' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Tạo lúc: {formatDate(item.createdAtLocal || item.createdAt)}
              </Text>
            </Space>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 'auto' }}>
            <Button
              type={item.isEnable ? "default" : "primary"}
              danger={item.isEnable}
              icon={item.isEnable ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => onToggleEnable(item._id)}
              size="large"
              block
              style={{
                height: 44,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item.isEnable ? 'Ẩn nội dung' : 'Hiển thị nội dung'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}