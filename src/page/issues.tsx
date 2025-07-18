import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { reasonMap } from '../utils/reasons';
import { Report, Reporter, ContentTarget, UserTarget, ReportsResponse } from '../components/report/type';

type ReportMode = 'user' | 'content';
type ViewMode = 'all' | 'unresolved';

export default function Issues() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportMode, setReportMode] = useState<ReportMode>('content');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [targetReports, setTargetReports] = useState<Report[]>([]);
  const [showTargetReports, setShowTargetReports] = useState(false);
  const [targetId, setTargetId] = useState<string>('');
  const [targetMode, setTargetMode] = useState<ReportMode>('content');

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
  const fetchTargetReports = async () => {
    if (!targetId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const endpoint = `/admin/reports/${targetMode}/target/${targetId}`;
      const response = await api.get<ReportsResponse>(endpoint, {
        headers: { token: true },
      });
      setTargetReports(response.data.data);
      setShowTargetReports(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch target reports');
    } finally {
      setLoading(false);
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
      
      if (selectedReport?._id === reportId) {
        setSelectedReport(prev => prev ? { ...prev, resolved: true, isDismissed: false } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resolve report');
    }
  };

  // Get report mode based on target type
  const getReportMode = (report: Report): ReportMode => {
    // Check if target has username field (user) or type field (content)
    const target = report.target as any;
    return target.username ? 'user' : 'content';
  };

  // Check if target is a user
  const isUserTarget = (target: any): target is UserTarget => {
    return target && target.username;
  };

  // Check if target is content
  const isContentTarget = (target: any): target is ContentTarget => {
    return target && target.type;
  };

  useEffect(() => {
    fetchReports();
  }, [reportMode, viewMode]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quản lý báo cáo</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Loại báo cáo:</label>
            <select 
              value={reportMode} 
              onChange={(e) => setReportMode(e.target.value as ReportMode)}
              className="border rounded px-3 py-2"
            >
              <option value="content">Báo cáo nội dung</option>
              <option value="user">Báo cáo người dùng</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chế độ xem:</label>
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Tất cả báo cáo</option>
              <option value="unresolved">Chỉ chưa giải quyết</option>
            </select>
          </div>
          
          <button
            onClick={fetchReports}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {/* Target Reports Search */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Tìm báo cáo theo đối tượng</h3>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Loại đối tượng:</label>
              <select 
                value={targetMode} 
                onChange={(e) => setTargetMode(e.target.value as ReportMode)}
                className="border rounded px-3 py-2"
              >
                <option value="content">ID nội dung</option>
                <option value="user">ID người dùng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID đối tượng:</label>
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Nhập ID đối tượng"
                className="border rounded px-3 py-2 w-64"
              />
            </div>
            <button
              onClick={fetchTargetReports}
              disabled={loading || !targetId.trim()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {showTargetReports ? 'Báo cáo theo đối tượng' : `Báo cáo ${reportMode === 'user' ? 'người dùng' : 'nội dung'} (${viewMode === 'all' ? 'tất cả' : 'chưa giải quyết'})`}
          </h2>
          
          {showTargetReports && (
            <button
              onClick={() => setShowTargetReports(false)}
              className="mb-4 text-blue-500 hover:text-blue-700"
            >
              ← Quay lại báo cáo chính
            </button>
          )}

          <div className="space-y-4">
            {(showTargetReports ? targetReports : reports).map((report) => (
              <div
                key={report._id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedReport?._id === report._id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                } ${report.resolved ? 'bg-green-50' : ''} ${report.isDismissed ? 'bg-red-50' : ''}`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={report.reporter.profilePic}
                      alt={report.reporter.handleName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{report.reporter.handleName}</p>
                      <p className="text-sm text-gray-600">@{report.reporter.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {report.resolved && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.isDismissed ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                      }`}>
                        {report.isDismissed ? 'Đã bỏ qua' : 'Đã giải quyết'}
                      </span>
                    )}
                    {!report.isRead && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-200 text-blue-800">
                        Mới
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                    {reasonMap[report.reason] || report.reason}
                  </span>
                </div>
                
                {report.description && (
                  <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                )}
                
                <p className="text-xs text-gray-500">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Details */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Chi tiết báo cáo</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Người báo cáo:</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={selectedReport.reporter.profilePic}
                      alt={selectedReport.reporter.handleName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{selectedReport.reporter.handleName}</p>
                      <p className="text-xs text-gray-600">@{selectedReport.reporter.username}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Lý do:</h4>
                  <p className="text-sm">{reasonMap[selectedReport.reason] || selectedReport.reason}</p>
                </div>

                {selectedReport.description && (
                  <div>
                    <h4 className="font-medium">Mô tả:</h4>
                    <p className="text-sm">{selectedReport.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium">Đối tượng:</h4>
                  {isUserTarget(selectedReport.target) ? (
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={selectedReport.target.profilePic}
                        alt={selectedReport.target.handleName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{selectedReport.target.handleName}</p>
                        <p className="text-xs text-gray-600">@{selectedReport.target.username}</p>
                      </div>
                    </div>
                  ) : isContentTarget(selectedReport.target) ? (
                    <div className="mt-1">
                      <p className="text-sm font-medium">Bài viết của {selectedReport.target.user.handleName}</p>
                      <p className="text-xs text-gray-600">Loại: {selectedReport.target.type}</p>
                      {selectedReport.target.caption && (
                        <p className="text-xs text-gray-600 mt-1">{selectedReport.target.caption}</p>
                      )}
                      {selectedReport.target.media && selectedReport.target.media.length > 0 && (
                        <div className="mt-2">
                          {selectedReport.target.media.map((media, index) => (
                            <div key={media._id} className="mb-2">
                              {media.videoUrl && (
                                <video
                                  src={media.videoUrl}
                                  controls
                                  className="w-full max-w-xs rounded"
                                />
                              )}
                              {media.imageUrl && (
                                <img
                                  src={media.imageUrl}
                                  alt={`Media ${index + 1}`}
                                  className="w-full max-w-xs rounded"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div>
                  <h4 className="font-medium">Trạng thái:</h4>
                  <div className="flex gap-2 mt-1">
                    {selectedReport.resolved && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        selectedReport.isDismissed ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                      }`}>
                        {selectedReport.isDismissed ? 'Đã bỏ qua' : 'Đã giải quyết'}
                      </span>
                    )}
                    {!selectedReport.resolved && (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800">
                        Đang chờ
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Ngày tháng:</h4>
                  <p className="text-xs text-gray-600">
                    Tạo: {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-xs text-gray-600">
                    Cập nhật: {new Date(selectedReport.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>

                {!selectedReport.resolved && (
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => dismissReport(selectedReport._id, getReportMode(selectedReport))}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                    >
                      Bỏ qua
                    </button>
                    <button
                      onClick={() => resolveReport(selectedReport._id, getReportMode(selectedReport))}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm"
                    >
                      Giải quyết
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4 text-center text-gray-500">
              Chọn một báo cáo để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}