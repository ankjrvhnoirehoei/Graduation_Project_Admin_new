import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import useAdminContents from '../components/custom/useContents';
import ContentHeader from '../components/contentManagement/ContentHeader';
import ContentList from '../components/contentManagement/ContentList';
import HashtagAnalytics from '../components/contentManagement/HashtagAnalytics';
import ContentDetailsModal from '../components/contentManagement/ContentDetailsModal';

const { Content } = Layout;

export default function AdminContentsPage() {
  const hook = useAdminContents();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const location = useLocation();

  // Handle URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');

    console.log('🌐 URL changed, status:', status);

    if (status === 'locked') {
      console.log('🔒 Setting up for locked content');
      hook.setSearchQuery('');
      hook.setEnabledFilter(false);
      hook.setPage(1);
    } else {
      console.log('👁️ Setting up for enabled content');
      hook.setSearchQuery('');
      hook.setEnabledFilter(true);
      hook.setPage(1);
    }

    
  }, [location.search, hook.setSearchQuery, hook.setEnabledFilter, hook.setPage]);

  const openDetail = (it: any) => {
    setSelected(it);
    setDetailsOpen(true);
  };

  const handleHashtagClick = (tag: string) => {
    hook.runSearchMode(tag, 'hashtag');
  };

  const handleSearch = () => {
    hook.runSearchMode(hook.searchQuery, hook.searchMode);
  };

  const handleClearSearch = () => {
    hook.clearSearch();
  };

  return (
    <Layout style={{ background: 'transparent' }}>
      <Content style={{ padding: 16, maxWidth: 1600, margin: '0 auto', width: '100%' }}>
        <h2>Quản lý nội dung (Bài viết & Video ngắn)</h2>

        <ContentHeader
          searchQuery={hook.searchQuery}
          setSearchQuery={(s) => hook.setSearchQuery(s)}
          onSearch={handleSearch}
          onRefresh={() => hook.fetchAll()}
          onClearSearch={handleClearSearch}
          typeFilter={hook.typeFilter}
          setTypeFilter={hook.setTypeFilter}
          enabledFilter={hook.enabledFilter}
          setEnabledFilter={hook.setEnabledFilter}
        />

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={18} style={{ minWidth: 0 }}>
            <ContentList
              items={hook.items}
              loading={hook.loading}
              page={hook.page}
              setPage={(p) => hook.setPage(p)}
              limit={hook.limit}
              total={hook.total}
              onOpenDetail={openDetail}
              onToggleEnable={(id) => hook.toggleEnable(id)}
            />
          </Col>

          <Col xs={24} lg={6} style={{ minWidth: 280 }}>
            <HashtagAnalytics 
              hashtags={hook.hashtags} 
              loading={hook.hashLoading} 
              onClickTag={handleHashtagClick} 
            />
          </Col>
        </Row>

        <ContentDetailsModal 
          visible={detailsOpen} 
          item={selected} 
          onClose={() => {
            setDetailsOpen(false);
            setSelected(null);
          }} 
          onToggleEnable={(id) => hook.toggleEnable(id)} 
        />
      </Content>
    </Layout>
  );
}