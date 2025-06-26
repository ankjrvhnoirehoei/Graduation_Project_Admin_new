import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Download, Eye, Trash, Edit } from "lucide-react";
import PostPreviewModal from "../components/PostPreviewModal";
import VideoPreview from "../components/VideoPreview"; // dùng nếu có video

interface TopVideo {
  id: string;
  caption: string;
  thumbnail: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
}

const mockPosts: TopVideo[] = [
  {
    id: "1",
    caption: "Hình ảnh đẹp tại Đà Lạt",
    thumbnail:
      "https://i.pinimg.com/736x/a9/55/9d/a9559dc25abe93d7addb3715a8ce9d19.jpg",
    author: "Nguyễn Văn A",
    likes: 80,
    comments: 20,
    shares: 20,
  },
  {
    id: "2",
    caption: "Video ghi lại hành trình phượt",
    thumbnail: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Video URL HLS
    author: "Trần Thị B",
    likes: 1400,
    comments: 500,
    shares: 400,
  },
  {
    id: "3",
    caption: "Một chiều hoàng hôn trên biển",
    thumbnail:
      "https://i.pinimg.com/736x/37/75/ee/3775ee1794c48ac5147ea92c305be37e.jpg",
    author: "",
    likes: 4,
    comments: 2,
    shares: 6,
  },
];

export default function NewPostsToday() {
  const [posts, setPosts] = useState<TopVideo[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("none");
  const [previewPost, setPreviewPost] = useState<TopVideo | null>(null);

  // Tạm định nghĩa trạng thái theo caption
  const getPostStatus = (caption: string): string => {
    if (caption.includes("Đà Lạt")) return "Đang chờ duyệt";
    if (caption.includes("phượt")) return "Đã xuất bản";
    return "Bị gỡ";
  };

  const filtered = posts.filter((p) => {
    const term = searchTerm.toLowerCase();
    const status = getPostStatus(p.caption);
    return (
      (p.caption.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term)) &&
      (filterStatus === "none" || filterStatus === status)
    );
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Đang chờ duyệt":
        return "bg-yellow-100 text-yellow-800";
      case "Đã xuất bản":
        return "bg-green-100 text-green-700";
      case "Bị gỡ":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bài viết mới hôm nay
          </h1>
          <p className="text-4xl font-bold text-blue-600 mt-1">
            {posts.length}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              placeholder="Tìm tiêu đề hoặc người đăng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:w-64 bg-white rounded-md shadow-sm border"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="sm:w-48 bg-white rounded-md shadow-sm border">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tất cả</SelectItem>
                <SelectItem value="Đang chờ duyệt">Đang chờ duyệt</SelectItem>
                <SelectItem value="Đã xuất bản">Đã xuất bản</SelectItem>
                <SelectItem value="Bị gỡ">Bị gỡ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="default"
            className="flex items-center gap-2 whitespace-nowrap w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Đang chờ duyệt", "Đã xuất bản", "Bị gỡ"].map((status) => (
          <div
            key={status}
            className="bg-white border rounded-lg shadow-sm p-4"
          >
            <p className="text-sm text-gray-500">{status}</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              {posts.filter((p) => getPostStatus(p.caption) === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>#</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Người đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post, idx) => {
              const isVideo =
                post.thumbnail.endsWith(".mp4") ||
                post.thumbnail.endsWith(".m3u8");
              const status = getPostStatus(post.caption);
              const views = post.likes + post.comments + post.shares;

              return (
                <TableRow key={post.id} className="hover:bg-gray-50">
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {isVideo ? (
                      <VideoPreview
                        src={post.thumbnail}
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <img
                        src={post.thumbnail}
                        alt="media"
                        className="w-16 h-10 object-cover rounded-md border"
                      />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {post.caption}
                  </TableCell>
                  <TableCell>{post.author || "(Ẩn danh)"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </TableCell>
                  <TableCell>{views}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setPreviewPost(post)}
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash className="w-4 h-4 text-gray-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Trang trước</Button>
        <Button variant="outline">Trang sau</Button>
      </div>

      {/* Modal */}
      <PostPreviewModal
        post={previewPost}
        onClose={() => setPreviewPost(null)}
      />
    </div>
  );
}
