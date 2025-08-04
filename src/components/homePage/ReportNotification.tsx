import { useEffect, useState } from "react";
import { Tabs, Avatar, List, Skeleton, Button, Empty, Card } from "antd";
import { CheckOutlined } from "@ant-design/icons";
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
  onCountsChange: (
    userCount: number,
    contentCount: number,
    storyCount?: number
  ) => void;
};

export default function ReportNotification({ onCountsChange }: Props) {
  const [activeTab, setActiveTab] = useState<"user" | "content" | "story">(
    "user"
  );
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
        api
          .get("/admin/reports/story/unread", { headers: { token: true } })
          .catch(() => ({ data: { data: [] } })),
      ]);
      setUserReports(u.data.data);
      setContentReports(c.data.data);
      setStoryReports(s.data.data);
      onCountsChange(
        u.data.data.length,
        c.data.data.length,
        s.data.data.length
      );
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

  const renderUserReport = (item: UserReport) => ({
    key: item._id,
    avatar: <Avatar src={item.reporter.profilePic} />,
    description: (
      <>
        Người dùng <b>{item.reporter.handleName}</b> đã báo cáo người dùng{" "}
        <b>{item.target.handleName}</b> vì <b>{reasonMap[item.reason]}</b>
        {item.description && <> với nội dung: “{item.description}”.</>}
      </>
    ),
  });

  const renderContentReport = (item: ContentReport) => {
    const media = item.target.media[0] || {};
    const avatar = media.videoUrl ? (
      <video
        src={media.videoUrl}
        width={40}
        height={40}
        muted
        loop
        playsInline
        style={{ borderRadius: 8 }}
      />
    ) : (
      <Avatar shape="square" src={media.imageUrl} />
    );
    return {
      key: item._id,
      avatar,
      description: (
        <>
          Người dùng <b>{item.reporter.handleName}</b> đã báo cáo bài viết
          {item.target.caption && <> “{item.target.caption}”</>} vì{" "}
          <b>{reasonMap[item.reason]}</b>
          {item.description && <> với nội dung: “{item.description}”.</>}
        </>
      ),
    };
  };

  const renderStoryReport = (item: StoryReport) => {
    const media = item.target.media[0] || {};
    const avatar = media.videoUrl ? (
      <video
        src={media.videoUrl}
        width={40}
        height={40}
        muted
        loop
        playsInline
        style={{ borderRadius: 8 }}
      />
    ) : (
      <Avatar shape="square" src={media.imageUrl} />
    );
    return {
      key: item._id,
      avatar,
      description: (
        <>
          Người dùng <b>{item.reporter.handleName}</b> đã báo cáo story của{" "}
          <b>{item.target.user.handleName}</b>
          {item.target.caption && <> “{item.target.caption}”</>} vì{" "}
          <b>{reasonMap[item.reason]}</b>
          {item.description && <> với nội dung: “{item.description}”.</>}
        </>
      ),
    };
  };

  const getListData = () => {
    switch (activeTab) {
      case "user":
        return userReports.map(renderUserReport);
      case "content":
        return contentReports.map(renderContentReport);
      case "story":
        return storyReports.map(renderStoryReport);
    }
  };

  return (
    <Card title="Báo cáo chưa đọc" bordered style={{ width: 400 }}>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as any)}>
        <Tabs.TabPane tab={`Người dùng (${userReports.length})`} key="user" />
        <Tabs.TabPane
          tab={`Bài viết (${contentReports.length})`}
          key="content"
        />
        <Tabs.TabPane tab={`Story (${storyReports.length})`} key="story" />
      </Tabs>

      <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 10 }}>
        {loading ? (
          <Skeleton active />
        ) : getListData().length === 0 ? (
          <Empty description="Chưa có báo cáo mới" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={getListData()}
            renderItem={(item) => (
              <List.Item key={item.key}>
                <List.Item.Meta
                  avatar={item.avatar}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        )}
      </div>

      <div className="text-center mt-4">
        <Button type="primary" icon={<CheckOutlined />} onClick={markAllRead}>
          Đánh dấu đã đọc
        </Button>
      </div>
    </Card>
  );
}
