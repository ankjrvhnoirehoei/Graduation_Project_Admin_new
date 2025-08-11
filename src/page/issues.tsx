import React from 'react';
import { Typography, Alert, Row, Col } from 'antd';
import { useReports } from '../components/custom/useReports';
import ReportControls from '../issuesReport/ReportControls';
import ReportList from '../issuesReport/ReportList';
import ReportDetails from '../issuesReport/ReportDetails';

const { Title } = Typography;

export default function Issues() {
  const {
    reports,
    loading,
    error,
    reportMode,
    setReportMode,
    viewMode,
    setViewMode,
    selectedReport,
    setSelectedReport,
    targetReports,
    showTargetReports,
    targetId,
    setTargetId,
    targetMode,
    setTargetMode,
    targetSearchInfo,
    fetchReports,
    fetchTargetReports,
    banResolveReport,
    dismissReport,
    resolveReport,
    resetTargetSearch
  } = useReports();

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Quản lý báo cáo
      </Title>
      
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      <ReportControls
        reportMode={reportMode}
        setReportMode={setReportMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={fetchReports}
        loading={loading}
        targetMode={targetMode}
        setTargetMode={setTargetMode}
        targetId={targetId}
        setTargetId={setTargetId}
        onTargetSearch={fetchTargetReports}
      />

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <ReportList
            reports={reports}
            targetReports={targetReports}
            showTargetReports={showTargetReports}
            reportMode={reportMode}
            viewMode={viewMode}
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
            onBackToMain={resetTargetSearch}
            targetSearchInfo={targetSearchInfo}
          />
        </Col>
        
        <Col xs={24} lg={8}>
          <ReportDetails
            selectedReport={selectedReport}
            showTargetReports={showTargetReports}
            targetSearchInfo={targetSearchInfo}
            onBanResolveReport={banResolveReport}
            onDismissReport={dismissReport}
            onResolveReport={resolveReport}
            onSearchTarget={(id, mode) => {
              setSelectedReport(null);
              fetchTargetReports(id, mode);
            }}
          />
        </Col>
      </Row>
    </div>
  );
}