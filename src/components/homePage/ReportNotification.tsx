import React, { useEffect, useState } from "react";
import { reasonMap } from "../../utils/reasons";
import api from "../../lib/axios";

type UserReport = {
  _id: string;
  reporter: { handleName: string; profilePic: string };
  target: { handleName: string };
  reason: string;
  description?: string;
};

type ContentReport = {
  _id: string;
  reporter: { handleName: string; profilePic: string };
  target: {
    caption?: string;
    media: { videoUrl?: string; imageUrl?: string }[];
  };
  reason: string;
  description?: string;
};

type StoryReport = {
  _id: string;
  reporter: { handleName: string; profilePic: string };
  target: {
    caption?: string;
    media: { videoUrl?: string; imageUrl?: string }[];
    user: { handleName: string };
  };
  reason: string;
  description?: string;
};

type Props = {
  onCountsChange: (userCount: number, contentCount: number, storyCount?: number) => void;
};

export default function ReportNotification({ onCountsChange }: Props) {
  const [activeTab, setActiveTab] = useState<"user" | "content" | "story">("user");
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [contentReports, setContentReports] = useState<ContentReport[]>([]);
  const [storyReports, setStoryReports] = useState<StoryReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, c, s] = await Promise.all([
        api.get("/admin/reports/user/unread", { headers: { token: true } }),
        api.get("/admin/reports/content/unread", { headers: { token: true } }),
        api.get("/admin/reports/story/unread", { headers: { token: true } }).catch(() => ({ data: { data: [] } })),
      ]);
      setUserReports(u.data.data);
      setContentReports(c.data.data);
      setStoryReports(s.data.data);
      onCountsChange(u.data.data.length, c.data.data.length, s.data.data.length);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    const endpoint =
      activeTab === "user"
        ? "/admin/reports/user/mark-all-read"
        : activeTab === "content"
        ? "/admin/reports/content/mark-all-read"
        : "/admin/reports/story/mark-all-read";
    await api.patch(endpoint, {}, { headers: { token: true } });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const renderUserRow = (r: UserReport) => (
    <div key={r._id} className="flex items-start gap-2 py-2">
      <img
        src={r.reporter.profilePic}
        alt=""
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="text-sm text-gray-700">
        <span>
          Người dùng <b>{r.reporter.handleName}</b> đã báo cáo người dùng{" "}
          <b>{r.target.handleName}</b> vì lý do{" "}
          <b>{reasonMap[r.reason]}</b>
        </span>
        {r.description && (
          <span> với nội dung: “{r.description}”.</span>
        )}
      </div>
    </div>
  );

  const renderContentRow = (r: ContentReport) => {
    const media = r.target.media[0] || {};
    return (
      <div key={r._id} className="flex items-start gap-2 py-2">
        {media.videoUrl ? (
          <video
            src={media.videoUrl}
            className="w-8 h-8 rounded-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={media.imageUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="text-sm text-gray-700">
          <span>
            Người dùng <b>{r.reporter.handleName}</b> đã báo cáo bài viết
          </span>
          {r.target.caption && (
            <span> “{r.target.caption}”</span>
          )}
          <span>
            {" "}
            vì lý do <b>{reasonMap[r.reason]}</b>
          </span>
          {r.description && (
            <span> với nội dung: “{r.description}”.</span>
          )}
        </div>
      </div>
    );
  };

  const renderStoryRow = (r: StoryReport) => {
    const media = r.target.media[0] || {};
    return (
      <div key={r._id} className="flex items-start gap-2 py-2">
        {media.videoUrl ? (
          <video
            src={media.videoUrl}
            className="w-8 h-8 rounded-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={media.imageUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="text-sm text-gray-700">
          <span>
            Người dùng <b>{r.reporter.handleName}</b> đã báo cáo story của <b>{r.target.user.handleName}</b>
          </span>
          {r.target.caption && (
            <span> "{r.target.caption}"</span>
          )}
          <span>
            {" "}
            vì lý do <b>{reasonMap[r.reason]}</b>
          </span>
          {r.description && (
            <span> với nội dung: "{r.description}".</span>
          )}
        </div>
      </div>
    );
  };

  const activeList =
    activeTab === "user" ? userReports : activeTab === "content" ? contentReports : storyReports;

  return (
    <div className="w-80 bg-white border rounded shadow-lg p-4">
      {/* Tabs */}
      <div className="flex border-b mb-2">
        <button
          className={`flex-1 py-1 ${
            activeTab === "user"
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("user")}
        >
          Người dùng
        </button>
        <button
          className={`flex-1 py-1 ${
            activeTab === "content"
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("content")}
        >
          Bài viết
        </button>
        <button
          className={`flex-1 py-1 ${
            activeTab === "story"
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("story")}
        >
          Stories
        </button>
      </div>

      {/* Content */}
      <div className="h-500 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-400">Đang tải…</div>
        ) : activeList.length === 0 ? (
          <div className="text-center text-gray-400 mt-6">
            Chưa có báo cáo mới
          </div>
        ) : (
          activeList.map((r) =>
            activeTab === "user"
              ? renderUserRow(r as UserReport)
              : activeTab === "content"
              ? renderContentRow(r as ContentReport)
              : renderStoryRow(r as StoryReport)
          )
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 text-center">
        <button
          onClick={markAllRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Đánh dấu đã đọc
        </button>
      </div>
    </div>
  );
}