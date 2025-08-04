import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Avatar,
  Pagination,
  message,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  HeartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import api from "../lib/axios";
import PostPreviewModal from "../components/PostPreviewModal";

const { Search } = Input;
const { Option } = Select;

interface Post {
  _id: string;
  userID: string;
  type: "post" | "reel";
  caption: string;
  isFlagged: boolean;
  nsfw: boolean;
  isEnable: boolean;
  viewCount: number;
  share: number;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  media: Array<{
    _id: string;
    imageUrl?: string;
    videoUrl?: string;
    tags: Array<{ handleName: string }>;
  }>;
  user: {
    username: string;
    handleName: string;
    profilePic: string;
  };
}

interface ApiResponse {
  posts: Post[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const isVideo = (url: string) => /\.(mp4)(\?|$)/i.test(url);

const VideoThumbnail = ({ url }: { url: string }) => {
  if (!url) return null;
  return isVideo(url) ? (
    <video
      src={url}
      className="w-16 h-10 object-cover rounded"
      muted
      preload="metadata"
    />
  ) : (
    <img src={url} className="w-16 h-10 object-cover rounded" alt="media" />
  );
};

export default function NewPostsToday() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "post" | "reel">("all");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "likeCount" | "commentCount" | "viewCount"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/posts/new", {
        headers: { token: true },
        params: { range: "7days", sortBy, sortOrder, page, limit: pageSize },
      });
      if (res.data.success) {
        setData(res.data.data);
        setCurrentPage(page);
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [sortBy, sortOrder, pageSize]);

  const filteredPosts =
    data?.posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.handleName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || post.type === filter;
      return matchesSearch && matchesFilter;
    }) || [];

  const handlePageChange = (page: number) => {
    if (page !== currentPage) fetchPosts(page);
  };

  const toggleEnable = async (post: Post) => {
    try {
      const res = await api.patch(
        `/admin/posts/disable/${post._id}`,
        {},
        { headers: { token: true } }
      );
      if (res.data.success) {
        message.success("Cập nhật thành công");
        fetchPosts(currentPage);
      }
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    {
      title: "#",
      width: 50,
      align: "center" as const,
      render: (_: any, __: any, i: number) =>
        (currentPage - 1) * pageSize + i + 1,
    },
    {
      title: "Loại",
      width: 100,
      dataIndex: "type",
      render: (type: string) => (
        <Tag color={type === "post" ? "blue" : "purple"}>{type}</Tag>
      ),
    },
    {
      title: "Media",
      render: (_: any, record: Post) => {
        const media = record.media?.[0];
        const url = media?.imageUrl || media?.videoUrl;
        return url ? <VideoThumbnail url={url} /> : <p>Không có</p>;
      },
    },
    {
      title: "Chú thích",
      dataIndex: "caption",
      width: 200,
      ellipsis: true,
      render: (caption: string) =>
        caption?.trim() ? (
          caption
        ) : (
          <span className="text-gray-400">Không có chú thích</span>
        ),
    },
    {
      title: "Người đăng",
      dataIndex: "user",
      render: (user: Post["user"]) => (
        <div className="flex items-center gap-2">
          <Avatar src={user.profilePic} size={24} />
          {user.username}
        </div>
      ),
    },
    {
      title: "Thống kê",
      render: (_: any, post: Post) => (
        <div className="text-xs flex items-center gap-3">
          <span className="flex items-center gap-1">
            <HeartOutlined className="text-red-500" /> {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <CommentOutlined className="text-blue-500" /> {post.commentCount}
          </span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      render: (_: any, post: Post) => (
        <div className="space-y-1">
          <Tag color={post.isEnable ? "green" : "red"}>
            {post.isEnable ? "Enabled" : "Disabled"}
          </Tag>
          {post.isFlagged && <Tag color="orange">Flagged</Tag>}
          {post.nsfw && <Tag color="red">NSFW</Tag>}
        </div>
      ),
    },
    {
      title: "Hành động",
      render: (_: any, post: Post) => (
        <div className="space-x-1 text-left">
          <Button icon={<EyeOutlined />} onClick={() => setPreviewPost(post)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => toggleEnable(post)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-7xl mx-auto space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <h2 className="text-2xl font-bold">Bài viết mới</h2>
          <p className="text-gray-500 text-sm">
            {filteredPosts.length} / {data?.totalCount || 0} bài viết
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Search
            placeholder="Tìm kiếm bài viết"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={setSearchTerm}
            allowClear
            style={{ width: 250 }}
          />
          <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
            <Option value="all">Tất cả</Option>
            <Option value="post">Post</Option>
            <Option value="reel">Reel</Option>
          </Select>
          <Select value={sortBy} onChange={setSortBy} style={{ width: 150 }}>
            <Option value="createdAt">Thời gian tạo</Option>
            <Option value="likeCount">Lượt thích</Option>
            <Option value="commentCount">Bình luận</Option>
          </Select>
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            style={{ width: 120 }}
          >
            <Option value="desc">Giảm dần</Option>
            <Option value="asc">Tăng dần</Option>
          </Select>
          <Select
            value={String(pageSize)}
            onChange={(v) => setPageSize(Number(v))}
            style={{ width: 100 }}
          >
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
            <Option value="100">100</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="text-center">
          <Pagination
            current={currentPage}
            total={data.totalCount}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      )}

      <PostPreviewModal
        post={previewPost}
        onClose={() => setPreviewPost(null)}
      />
    </div>
  );
}
