import React, { useState } from 'react';
import { Card, List, Tag, Skeleton, Empty, Space, Typography, Button } from 'antd';
import { FireOutlined, MoreOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function HashtagAnalytics({ 
  hashtags, 
  loading, 
  onClickTag 
}: { 
  hashtags: any[]; 
  loading: boolean; 
  onClickTag: (tag: string) => void 
}) {
  const [showAll, setShowAll] = useState(false);
  const displayCount = showAll ? hashtags.length : 10;
  const displayedHashtags = hashtags.slice(0, displayCount);

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <FireOutlined />
          <span>Hashtag phổ biến</span>
        </Space>
      }
      style={{ minHeight: 800 }}
      bodyStyle={{ padding: 12 }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : hashtags.length === 0 ? (
        <Empty 
          description="Không có hashtag" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <List 
            dataSource={displayedHashtags} 
            size="small"
            renderItem={(h: any, index: number) => (
              <List.Item style={{ 
                padding: '12px 0',
                borderBottom: index === displayedHashtags.length - 1 ? 'none' : '1px solid #f0f0f0'
              }}>
                <div style={{ width: '100%' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: 8
                  }}>
                    <Tag 
                      color="blue"
                      style={{ 
                        cursor: 'pointer',
                        margin: 0,
                        fontSize: '14px',
                        padding: '4px 8px',
                        maxWidth: '140px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }} 
                      onClick={() => onClickTag(h.normalizedHashtag || h.hashtag)}
                    >
                      {h.hashtag}
                    </Tag>
                    
                    <Text style={{ 
                      fontSize: '12px', 
                      color: '#999',
                      fontWeight: 'bold'
                    }}>
                      #{index + 1}
                    </Text>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <Text style={{ 
                      fontSize: '12px', 
                      color: '#666' 
                    }}>
                      {h.postCount} bài viết
                    </Text>
                    
                    <Space size={4}>
                      {h.hasPostType && (
                        <Tag color="green" style={{ fontSize: '10px', padding: '0 4px' }}>
                          Bài viết
                        </Tag>
                      )}
                      {h.hasReelType && (
                        <Tag color="purple" style={{ fontSize: '10px', padding: '0 4px' }}>
                          Video
                        </Tag>
                      )}
                    </Space>
                  </div>
                </div>
              </List.Item>
            )} 
          />
          
          {hashtags.length > 10 && (
            <div style={{ textAlign: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
              <Button 
                type="link" 
                size="small"
                icon={<MoreOutlined />}
                onClick={() => setShowAll(!showAll)}
                style={{ fontSize: '12px' }}
              >
                {showAll ? 'Thu gọn' : `Xem thêm ${hashtags.length - 10} hashtag`}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}