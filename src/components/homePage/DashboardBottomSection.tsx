import { useEffect, useState } from "react";
import api from "../../lib/axios";
import VideoPreview from "../VideoPreview";
import PostPreviewModal from "../PostPreviewModal";

interface Media {
  _id: string;
  postID: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: any[];
}

interface User {
  _id: string;
  username: string;
  handleName: string;
  profilePic: string;
}

interface TopPost {
  _id: string;
  userID: string;
  type: "post" | "reel";
  caption: string;
  isFlagged: boolean;
  nsfw: boolean;
  isEnable: boolean;
  location?: string;
  viewCount: number;
  share: number;
  createdAt: string;
  updatedAt: string;
  media: Media[];
  user: User;
  likeCount: number;
  commentCount: number;
  id: string;
}

interface TopUser {
  id: string;
  avatar: string;
  handle: string;
  fullName: string;
  followers: number;
}

export default function DashboardBottomSection() {
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [selectedPost, setSelectedPost] = useState<TopPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          api.get("/admin/posts/top-liked", { headers: { token: true } }),
          api.get("/admin/users/top-followers", { headers: { token: true } }),
        ]);
        setTopPosts(postsRes.data);
        setTopUsers(usersRes.data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu dashboard:", error);
      }
    };
    fetchData();
  }, []);

  const getPreviewMedia = (post: TopPost) => {
    const firstMedia = post.media?.[0];
    return firstMedia?.videoUrl || firstMedia?.imageUrl || null;
  };

  const isVideoMedia = (mediaUrl: string | null) => {
    return (
      !!mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.includes("video"))
    );
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row mt-6">
      {/* Top Posts */}
      <div className="w-full md:w-[70%] bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Top bài đăng trong tháng
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Bài đăng</th>
                <th className="p-3 text-left">Người đăng</th>
                <th className="p-3 text-left">Mô tả</th>
                <th className="p-3 text-center">Loại</th>
                <th className="p-3 text-center">Thích</th>
                <th className="p-3 text-center">Bình luận</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post) => {
                const media = getPreviewMedia(post);
                const isVideo = isVideoMedia(media);

                return (
                  <tr
                    key={post.id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {/* Media preview */}
                    <td className="p-3">
                      {media ? (
                        isVideo ? (
                          <VideoPreview
                            src={media}
                            className="w-20 h-14 rounded object-cover"
                          />
                        ) : (
                          <img
                            src={media}
                            alt="preview"
                            className="w-20 h-14 rounded object-cover"
                          />
                        )
                      ) : (
                        <div className="w-20 h-14 bg-gray-200 flex items-center justify-center rounded text-gray-400 text-xs">
                          Không có
                        </div>
                      )}
                    </td>

                    {/* User */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.user.profilePic}
                          alt={post.user.username}
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                        <div className="text-sm text-gray-700">
                          @{post.user.handleName}
                        </div>
                      </div>
                    </td>

                    {/* Caption */}
                    <td className="p-3 max-w-[200px] truncate text-gray-800">
                      {post.caption || (
                        <span className="text-gray-400 italic">
                          Không có mô tả
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.type === "reel"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {post.type === "reel" ? "Reel" : "Post"}
                      </span>
                    </td>

                    {/* Likes */}
                    <td className="p-3 text-center text-blue-400 font-medium">
                      {post.likeCount}
                    </td>

                    {/* Comments */}
                    <td className="p-3 text-center text-gray-700">
                      {post.commentCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Users */}
      <div className="w-full md:w-[30%] bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Người dùng nổi bật
        </h2>

        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl transition"
            >
              {/* Left section: rank + avatar + name + handle */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-4 text-right">
                  {index + 1}
                </span>

                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 leading-none mb-1">
                    {user.fullName}
                  </span>
                  <span className="text-xs text-gray-500 leading-none">
                    @{user.handle}
                  </span>
                </div>
              </div>

              {/* Right section: follower count */}
              <div className="flex flex-col items-end items-center">
                <span className="text-sm font-semibold text-blue-600 leading-none mb-1">
                  {user.followers.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 leading-none">
                  followers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview */}
      <PostPreviewModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
