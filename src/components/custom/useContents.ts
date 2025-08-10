import { useEffect, useMemo, useState, useCallback } from 'react';
import api from '../../lib/axios';
import { message } from 'antd';

export type Media = {
  _id: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: Array<{
    userId: string;
    handleName: string;
    positionX: number;
    positionY: number;
    _id: string;
  }>;
};

export type MusicInfo = {
  musicId: string;
  timeStart: number;
  timeEnd: number;
};

export type ContentItem = {
  _id: string;
  userID?: string;
  type: 'post' | 'reel';
  caption?: string;
  isEnable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdAtLocal?: string;
  likeCount?: number;
  commentCount?: number;
  media: Media[];
  music?: MusicInfo;
  musicInfo?: {
    song: string;
    link: string;
    author: string;
    coverImg: string;
  };
  user?: { 
    _id: string; 
    handleName?: string; 
    username?: string;
    profilePic?: string;
  };
};

export default function useAdminContents() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // filters / pagination / sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState<'createdAt' | 'type' | 'isEnable'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState<'post' | 'reel' | ''>('');
  const [enabledFilter, setEnabledFilter] = useState<boolean | ''>(true);

  // search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'caption' | 'hashtag'>('caption');

  // hashtag analytics
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [hashLoading, setHashLoading] = useState(false);

  console.log('Current state:', { enabledFilter, searchQuery, page });

  // Memoize the fetchAll function to prevent unnecessary re-renders
  const fetchAll = useCallback(async () => {
    console.log('🔄 fetchAll called with enabledFilter:', enabledFilter);
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        type: typeFilter || undefined,
        enabled: enabledFilter === '' ? undefined : enabledFilter,
      };
      
      console.log('📡 API call params:', params);
      
      const res = await api.get('/admin/posts', {
        params,
        headers: { token: true },
      });
      
      console.log('✅ API Response received:', res.data);
      
      const payload = res.data?.data || {};
      const list = payload.items || [];
      setItems(list);
      
      const totalCount = payload.pagination?.totalCount || 0;
      console.log('📊 Total count:', totalCount);
      setTotal(totalCount);
      
    } catch (e: any) {
      console.error('❌ Fetch error:', e);
      message.error(e?.response?.data?.message || 'Không thể tải nội dung');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, typeFilter, enabledFilter]);

  const search = useCallback(async (q?: string, mode?: 'caption' | 'hashtag') => {
    const query = q || searchQuery;
    const searchType = mode || searchMode;
    
    if (!query || query.trim() === '') {
      return fetchAll();
    }
    
    console.log('🔍 search called with:', { query, searchType });
    setLoading(true);
    try {
      const res = await api.get('/admin/posts/search', {
        params: {
          q: query,
          mode: searchType,
          page,
          limit,
          type: typeFilter || undefined,
        },
        headers: { token: true },
      });
      
      console.log('✅ Search API Response:', res.data);
      
      const payload = res.data?.data || {};
      const list = payload.items || [];
      setItems(list);
      
      const totalCount = payload.pagination?.totalCount || 0;
      console.log('📊 Search total count:', totalCount);
      setTotal(totalCount);
      
    } catch (e: any) {
      console.error('❌ Search error:', e);
      message.error(e?.response?.data?.message || 'Tìm kiếm thất bại');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchMode, page, limit, typeFilter, fetchAll]);

  const fetchHashtags = useCallback(async (limitParam = 50) => {
    setHashLoading(true);
    try {
      const res = await api.get('/admin/hashtags/analytics', {
        params: { limit: limitParam },
        headers: { token: true },
      });
      const payload = res.data?.data || {};
      setHashtags(payload.hashtags || []);
    } catch (e) {
      console.error(e);
    } finally {
      setHashLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('🎯 Main useEffect triggered:', { 
      searchQuery: searchQuery?.trim(), 
      enabledFilter, 
      page 
    });
    
    if (searchQuery && searchQuery.trim() !== '') {
      console.log('🔍 Triggering search');
      search(searchQuery, searchMode);
    } else {
      console.log('📋 Triggering fetchAll');
      fetchAll();
    }
  }, [searchQuery, searchMode, page, limit, sortBy, sortOrder, typeFilter, enabledFilter, search, fetchAll]);

  // Initialize hashtags once
  useEffect(() => {
    fetchHashtags();
  }, [fetchHashtags]);

  const toggleEnable = useCallback(async (id: string) => {
    try {
      await api.patch(`/admin/posts/disable/${id}`, null, { headers: { token: true } });
      setItems(prev => prev.map(it => it._id === id ? { ...it, isEnable: !it.isEnable } : it));
      message.success('Cập nhật trạng thái nội dung thành công');
    } catch (e: any) {
      console.error(e);
      message.error(e?.response?.data?.message || 'Không thể thay đổi trạng thái nội dung');
    }
  }, []);

  const runSearchMode = useCallback((q: string, mode: 'caption' | 'hashtag') => {
    console.log('🏃‍♂️ runSearchMode called:', { q, mode });
    setSearchQuery(q);
    setSearchMode(mode);
    setPage(1);
    // Don't call search manually - let useEffect handle it
  }, []);

  const clearSearch = useCallback(() => {
    console.log('🧹 clearSearch called');
    setSearchQuery('');
    setPage(1);
    // Don't call fetchAll manually - let useEffect handle it
  }, []);

  // Manual refresh function (for refresh button)
  const refreshData = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    if (searchQuery && searchQuery.trim() !== '') {
      search(searchQuery, searchMode);
    } else {
      fetchAll();
    }
  }, [searchQuery, searchMode, search, fetchAll]);

  return {
    items,
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    typeFilter,
    setTypeFilter,
    enabledFilter,
    setEnabledFilter,

    searchQuery,
    setSearchQuery,
    searchMode,
    setSearchMode,
    runSearchMode,
    clearSearch,
    fetchAll: refreshData, 
    fetchHashtags,
    hashtags,
    hashLoading,
    toggleEnable,
  } as const;
}