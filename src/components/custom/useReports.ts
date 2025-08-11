import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Report, UserTarget, ContentTarget, ReportsResponse } from '../../components/report/type';

type ReportMode = 'user' | 'content';
type ViewMode = 'all' | 'unresolved';

interface TargetSearchResponse {
  target: UserTarget | ContentTarget;
  reports: ReportsResponse;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportMode, setReportMode] = useState<ReportMode>('content');
  const [viewMode, setViewMode] = useState<ViewMode>('unresolved');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Target search states
  const [targetReports, setTargetReports] = useState<Report[]>([]);
  const [showTargetReports, setShowTargetReports] = useState(false);
  const [targetId, setTargetId] = useState<string>('');
  const [targetMode, setTargetMode] = useState<ReportMode>('content');
  const [targetSearchInfo, setTargetSearchInfo] = useState<{
    target: UserTarget | ContentTarget;
    mode: ReportMode;
  } | null>(null);

  // Fetch reports based on current mode
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = `/admin/reports/${reportMode}/${viewMode === 'all' ? 'all' : 'unresolved'}`;
      const response = await api.get<ReportsResponse>(endpoint, {
        headers: { token: true },
      });
      setReports(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports for a specific target
  const fetchTargetReports = async (id?: string, mode?: ReportMode) => {
    // Accept optional params so parent/components can call directly without racing state updates
    const currentId = id ?? targetId;
    const currentMode = mode ?? targetMode;

    if (!currentId?.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const endpoint = `/admin/reports/${currentMode}/target/${currentId}`;
      const response = await api.get<TargetSearchResponse>(endpoint, {
        headers: { token: true },
      });
      setTargetReports(response.data.reports.data);
      setTargetSearchInfo({
        target: response.data.target,
        mode: currentMode
      });
      setShowTargetReports(true);

      // also ensure hook internal states reflect the searched target
      setTargetId(currentId);
      setTargetMode(currentMode);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch target reports');
    } finally {
      setLoading(false);
    }
  };

  // ban + resolve a report
  const banResolveReport = async (reportId: string, mode: ReportMode) => {
    try {
      const endpoint = `/admin/reports/${mode}/ban-resolve/${reportId}`;
      await api.patch(endpoint, {}, {
        headers: { token: true },
      });

      // Update the report in the current list
      setReports(prev => prev.map(report =>
        report._id === reportId
          ? { ...report, resolved: true, isDismissed: false }
          : report
      ));

      // Update target reports if showing
      if (showTargetReports) {
        setTargetReports(prev => prev.map(report =>
          report._id === reportId
            ? { ...report, resolved: true, isDismissed: false }
            : report
        ));
      }

      if (selectedReport?._id === reportId) {
        setSelectedReport(prev => prev ? { ...prev, resolved: true, isDismissed: false } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to ban & resolve report');
    }
  };

  // Dismiss a report
  const dismissReport = async (reportId: string, mode: ReportMode) => {
    try {
      const endpoint = `/admin/reports/${mode}/dismiss/${reportId}`;
      await api.patch(endpoint, {}, {
        headers: { token: true },
      });
      
      // Update the report in the current list
      setReports(prev => prev.map(report => 
        report._id === reportId 
          ? { ...report, isDismissed: true, resolved: true }
          : report
      ));
      
      // Update target reports if showing
      if (showTargetReports) {
        setTargetReports(prev => prev.map(report => 
          report._id === reportId 
            ? { ...report, isDismissed: true, resolved: true }
            : report
        ));
      }
      
      if (selectedReport?._id === reportId) {
        setSelectedReport(prev => prev ? { ...prev, isDismissed: true, resolved: true } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dismiss report');
    }
  };

  // Resolve a report
  const resolveReport = async (reportId: string, mode: ReportMode) => {
    try {
      const endpoint = `/admin/reports/${mode}/resolve/${reportId}`;
      await api.patch(endpoint, {}, {
        headers: { token: true },
      });
      
      // Update the report in the current list
      setReports(prev => prev.map(report => 
        report._id === reportId 
          ? { ...report, resolved: true, isDismissed: false }
          : report
      ));
      
      // Update target reports if showing
      if (showTargetReports) {
        setTargetReports(prev => prev.map(report => 
          report._id === reportId 
            ? { ...report, resolved: true, isDismissed: false }
            : report
        ));
      }
      
      if (selectedReport?._id === reportId) {
        setSelectedReport(prev => prev ? { ...prev, resolved: true, isDismissed: false } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resolve report');
    }
  };

  // Reset target search
  const resetTargetSearch = () => {
    setShowTargetReports(false);
    setTargetSearchInfo(null);
    setSelectedReport(null);
  };

  useEffect(() => {
    fetchReports();
  }, [reportMode, viewMode]);

  return {
    // State
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
    
    // Actions
    fetchReports,
    fetchTargetReports,
    banResolveReport,
    dismissReport,
    resolveReport,
    resetTargetSearch
  };
};