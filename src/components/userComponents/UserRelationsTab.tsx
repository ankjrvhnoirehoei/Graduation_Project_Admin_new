import React, { useEffect, useState } from 'react';
import { List, Avatar, Card, Segmented, Pagination, Empty, Skeleton, Typography } from 'antd';
import api from '../../lib/axios';

const { Text } = Typography;

export default function UserRelationsTab({ userId, visible }: { userId: string; visible: boolean }) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'followers' | 'following' | 'blockers' | 'blocking'>('followers');
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchRelations = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.post(`/relations/${mode}`, 
        { userId }, // Request body
        {
          params: { page, limit },
          headers: { token: true },
        }
      );

      // console.log('Relations API response:', res.data); // Debug log
      const responseData = res.data || {};
      const list = responseData[mode] || []; // Get the array based on current mode
      const paginationData = responseData.pagination || {};
      
      setItems(Array.isArray(list) ? list : []);
      setTotal(paginationData.totalCount || paginationData.total || 0);
    } catch (e) {
      console.error('Error fetching relations:', e);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && userId) {
      // console.log('Fetching relations for userId:', userId, 'mode:', mode, 'page:', page); // Debug log
      fetchRelations();
    }
  }, [userId, visible, mode, page]);

  // Reset page when mode changes
  const handleModeChange = (val: any) => {
    setMode(val);
    setPage(1);
  };

  return (
    <div>
      <Card size="small" title="Quan hệ">
        <Segmented
          options={[
            { label: 'Followers', value: 'followers' },
            { label: 'Following', value: 'following' },
            { label: 'Blockers', value: 'blockers' },
            { label: 'Blocking', value: 'blocking' },
          ]}
          value={mode}
          onChange={handleModeChange}
          style={{ marginBottom: 12 }}
        />

        {loading ? (
          <Skeleton active />
        ) : (
          <>
            {items.length === 0 ? (
              <Empty description="Không có dữ liệu" />
            ) : (
              <List
                dataSource={items}
                renderItem={(u: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={u.profilePic || u.avatar} />}
                      title={<Text strong>{u.handleName || u.username}</Text>}
                      description={<Text type="secondary">{u.email || u.phoneNumber || u.phone || ''}</Text>}
                    />
                  </List.Item>
                )}
              />
            )}

            {total > limit && (
              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Pagination current={page} pageSize={limit} total={total} onChange={(p) => setPage(p)} />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}