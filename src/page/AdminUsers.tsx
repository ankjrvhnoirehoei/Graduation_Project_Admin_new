import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import useUsers from '../components/custom/useUsers';
import HeaderCard from '../components/userComponents/HeaderCard';
import FiltersDrawer from '../components/userComponents/FiltersDrawer';
import UsersTable from '../components/userComponents/UsersTable';
import UserViewModal from '../components/userComponents/UserViewModal';
import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { Content } = Layout;

export default function AdminUsersPage() {
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = React.useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    const onPop = () => setSearchParams(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setSearchParamsHandler = (next: URLSearchParams) => {
    const qs = next.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.pushState({}, '', url);
    setSearchParams(new URLSearchParams(qs));
  };

  const {
    rows,
    total,
    loading,
    page,
    pageSize,
    lockingId,
    viewOpen,
    viewLoading,
    selectedUser,
    quickStats,
    fetchUsers,
    updateSearchParams,
    openViewModal,
    setViewOpen,
    toggleLock,
    setSelectedUser,
  } = useUsers({ searchParams, setSearchParams: setSearchParamsHandler });

  useEffect(() => {
    const status = searchParams.get('status') ?? undefined;
    const q = searchParams.get('q') ?? undefined;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    form.setFieldsValue({
      q,
      status,
      createdRange: from && to ? [dayjs(from, 'YYYY-MM-DD'), dayjs(to, 'YYYY-MM-DD')] : undefined,
    });
  }, [searchParams]);

  return (
    <Layout style={{ background: 'transparent' }}>
      <Content style={{ padding: 16, width: '100%', margin: '0 auto' }}>
        <HeaderCard
          total={total}
          quickStats={quickStats}
          queryStatus={searchParams.get('status') ?? ''}
          updateSearchParams={(p) => {
            const next = new URLSearchParams(searchParams.toString());
            Object.entries(p).forEach(([k, v]) => {
              if (v === undefined || v === '') next.delete(k);
              else next.set(k, v);
            });
            if (p.q !== undefined || p.status !== undefined || p.from !== undefined || p.to !== undefined) next.set('page', '1');
            setSearchParamsHandler(next);
          }}
          onRefresh={() => {
            const next = new URLSearchParams(searchParams.toString());
            next.set('page', '1');
            setSearchParamsHandler(next);
            fetchUsers();
          }}
          onOpenFilter={() => {
            form.resetFields();
            setDrawerOpen(true);
          }}
        />

        {/* Drawer state kept here to match original behaviour */}
        <FiltersDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          form={form}
          onSubmit={() => {
            const values = form.getFieldsValue() as { q?: string; status?: 'active' | 'locked'; createdRange?: [Dayjs, Dayjs] };
            const next = new URLSearchParams(searchParams.toString());
            if (values.q) next.set('q', values.q); else next.delete('q');
            if (values.status) next.set('status', values.status); else next.delete('status');
            if (values.createdRange) {
              next.set('from', values.createdRange[0].format('YYYY-MM-DD'));
              next.set('to', values.createdRange[1].format('YYYY-MM-DD'));
            } else {
              next.delete('from');
              next.delete('to');
            }
            next.set('page', '1');
            setSearchParamsHandler(next);
            setDrawerOpen(false);
          }}
          onReset={() => {
            form.resetFields();
            const next = new URLSearchParams(searchParams.toString());
            next.delete('q');
            next.delete('status');
            next.delete('from');
            next.delete('to');
            next.set('page', '1');
            setSearchParamsHandler(next);
          }}
        />

        <div style={{ marginTop: 12 }} />

        <UsersTable
          rows={rows}
          loading={loading}
          lockingId={lockingId}
          page={page}
          pageSize={pageSize}
          total={total}
          onOpenView={(r) => openViewModal(r)}
          onToggleLock={(id) => toggleLock(id)}
          onChangePage={(p) => {
            const next = new URLSearchParams(searchParams.toString());
            next.set('page', String(p));
            setSearchParamsHandler(next);
          }}
        />

        <UserViewModal
          open={viewOpen}
          loading={viewLoading}
          user={selectedUser}
          onClose={() => setViewOpen(false)}
          onToggleLock={(id) => toggleLock(id)}
          lockingId={lockingId}
        />

        <style>{`.row-locked td { background: #fff1f0 !important; } .ant-table-wrapper .ant-table-thead > tr > th { background: #fff; } .ant-table-cell { padding-top: 10px !important; padding-bottom: 10px !important; }`}</style>
      </Content>
    </Layout>
  );
}
