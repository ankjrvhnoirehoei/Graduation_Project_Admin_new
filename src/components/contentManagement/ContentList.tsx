import React from 'react';
import { Card, List, Image, Typography, Tag, Space, Pagination, Empty, Button, Avatar, Divider } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LikeOutlined, CommentOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons';
import { ContentItem } from '../custom/useContents';

const { Text, Paragraph } = Typography;

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

export default function ContentList({
  items,
  loading,
  page,
  setPage,
  limit,
  total,
  onOpenDetail,
  onToggleEnable,
}: {
  items: ContentItem[];
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  limit: number;
  total: number;
  onOpenDetail: (it: ContentItem) => void;
  onToggleEnable: (id: string) => void;
}) {
  return (
    <Card bordered style={{ borderRadius: 12, minHeight: 800 }} bodyStyle={{ padding: 16 }}>
      {items.length === 0 && !loading ? (
        <Empty description="Không có nội dung" />
      ) : (
        <List 
          loading={loading}
          grid={{ 
            gutter: [16, 16], 
            xs: 1, 
            sm: 2, 
            md: 2, 
            lg: 2, 
            xl: 3,
            xxl: 3
          }} 
          dataSource={items} 
          renderItem={(item: ContentItem) => (
            <List.Item>
              <Card 
                hoverable 
                size="small" 
                onClick={() => onOpenDetail(item)}
                style={{ 
                  height: '320px',
                  opacity: item.isEnable ? 1 : 0.6,
                  border: item.isEnable ? '1px solid #d9d9d9' : '1px solid #ff4d4f'
                }}
                bodyStyle={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {/* Media Preview */}
                <div style={{ 
                  width: '100%', 
                  height: '140px', 
                  marginBottom: 8,
                  borderRadius: 6,
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {item.media?.[0]?.imageUrl ? (
                    <>
                      <Image 
                        src={item.media[0].imageUrl} 
                        alt="content preview" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                        preview={false} 
                      />
                      {/* Media count indicator for multiple images */}
                      {item.type === 'post' && item.media.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 11
                        }}>
                          +{item.media.length - 1}
                        </div>
                      )}
                      {/* Tags indicator */}
                      {item.media[0].tags && item.media[0].tags.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 11
                        }}>
                          {item.media[0].tags.length} tag{item.media[0].tags.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </>
                  ) : item.media?.[0]?.videoUrl ? (
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <video 
                        src={item.media[0].videoUrl} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        muted
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '24px',
                        pointerEvents: 'none'
                      }}>
                        ▶
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#999' }}>Không có media</div>
                  )}
                </div>

                {/* Content Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Caption */}
                  <Paragraph 
                    style={{ margin: 0, marginBottom: 8, fontSize: '13px' }} 
                    ellipsis={{ rows: 2, tooltip: item.caption }}
                  >
                    {item.caption || '—'}
                  </Paragraph>

                  {/* User Info */}
                  <div style={{ marginBottom: 8 }}>
                    <Space size={4}>
                      <Avatar 
                        size={20} 
                        src={item.user?.profilePic} 
                        icon={<UserOutlined />}
                      />
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        {item.user?.username || item.user?.handleName || 'Người dùng không xác định'}
                      </Text>
                    </Space>
                  </div>

                  {/* Music indicator */}
                  {item.musicInfo && (
                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AudioOutlined style={{ fontSize: '12px', color: '#1890ff', flexShrink: 0 }} />
                        <Text 
                        style={{ 
                            fontSize: '11px', 
                            color: '#1890ff',
                            flex: 1,
                            minWidth: 0 
                        }} 
                        ellipsis={{ tooltip: item.musicInfo.song }}
                        >
                        {item.musicInfo.song}
                        </Text>
                    </div>
                    )}

                  {/* Stats */}
                  <div style={{ marginBottom: 8 }}>
                    <Space size={12}>
                      <Space size={4}>
                        <LikeOutlined style={{ fontSize: '12px', color: '#999' }} />
                        <Text style={{ fontSize: '12px', color: '#999' }}>
                          {item.likeCount || 0}
                        </Text>
                      </Space>
                      <Space size={4}>
                        <CommentOutlined style={{ fontSize: '12px', color: '#999' }} />
                        <Text style={{ fontSize: '12px', color: '#999' }}>
                          {item.commentCount || 0}
                        </Text>
                      </Space>
                    </Space>
                  </div>

                  {/* Footer */}
                  <div style={{ 
                    marginTop: 'auto',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div>
                      <Tag color={item.type === 'post' ? 'blue' : 'purple'}>
                        {item.type === 'post' ? 'Bài viết' : 'Video ngắn'}
                      </Tag>
                      <Text style={{ fontSize: '11px', color: '#999' }}>
                        {formatDate(item.createdAtLocal || item.createdAt)}
                      </Text>
                    </div>
                    
                    <Button
                      size="small"
                      type={item.isEnable ? "default" : "primary"}
                      danger={item.isEnable}
                      icon={item.isEnable ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onToggleEnable(item._id); 
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.isEnable ? 'Ẩn' : 'Hiện'}
                    </Button>
                  </div>
                </div>
              </Card>
            </List.Item>
          )} 
        />
      )}

      <Divider />
      <div style={{ textAlign: 'center' }}>
        <Pagination 
          current={page} 
          pageSize={limit} 
          total={total} 
          onChange={(p) => {
            console.log('Pagination clicked, changing to page:', p); // Debug log
            setPage(p);
          }}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) => {
            console.log('Pagination showTotal called with:', { total, range }); // Debug log
            return `${range[0]}-${range[1]} trên ${total} mục`;
          }}
          disabled={loading}
        />
      </div>
    </Card>
  );
}