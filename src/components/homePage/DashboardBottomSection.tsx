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
    const fetchTopLikedPosts = async () => {
      try {
        const res = await api.get("/admin/posts/top-liked", {
          headers: { token: true },
        });

        // The API already returns the correct structure, just set it directly
        setTopPosts(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch top liked posts:", error);
      }
    };

    const fetchTopUsers = async () => {
      try {
        const res = await api.get("/admin/users/top-followers", {
          headers: { token: true },
        });
        setTopUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch top followers:", error);
      }
    };

    fetchTopLikedPosts();
    fetchTopUsers();
  }, []);

  // Helper function to get the first media URL for preview
  const getPreviewMedia = (post: TopPost) => {
    if (!post.media || post.media.length === 0) return null;
    const firstMedia = post.media[0];
    return firstMedia.videoUrl || firstMedia.imageUrl || null;
  };

  // Helper function to check if media is video
  const isVideoMedia = (mediaUrl: string | null) => {
    if (!mediaUrl) return false;
    return mediaUrl.endsWith('.mp4') || mediaUrl.includes('video');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      {/* Top Liked Posts */}
      <div className="w-full md:w-[70%] bg-white rounded-lg shadow p-4">
        <h4 className="text-md font-semibold mb-3">
          Bài đăng nhiều lượt thích nhất tháng
        </h4>
        <div className="overflow-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2">Bài đăng</th>
                <th className="p-2">Loại</th>
                <th className="p-2">Nội dung</th>
                <th className="p-2">Người đăng</th>
                <th className="p-2 text-center">Số lượt thích</th>
                <th className="p-2 text-center">Số bình luận</th>
                <th className="p-2 text-center">Số lượt chia sẻ</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post) => {
                const previewMedia = getPreviewMedia(post);
                const isVideo = isVideoMedia(previewMedia);
                
                return (
                  <tr
                    key={post.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td
                      className="p-2 cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      {previewMedia ? (
                        isVideo ? (
                          <VideoPreview
                            src={previewMedia}
                            className="w-16 h-10 object-cover rounded"
                          />
                        ) : (
                          <img
                            src={previewMedia}
                            alt="preview"
                            className="w-16 h-10 object-cover rounded"
                          />
                        )
                      ) : (
                        <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          Không có media
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.type === 'reel' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.type === 'reel' ? 'Reel' : 'Post'}
                      </span>
                    </td>
                    <td className="p-2 max-w-[150px] truncate">
                      {post.caption || "Không có mô tả"}
                    </td>
                    <td className="p-2 max-w-[150px] truncate">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={post.user.profilePic} 
                          alt={post.user.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>@{post.user.handleName}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center">{post.likeCount}</td>
                    <td className="p-2 text-center">{post.commentCount}</td>
                    <td className="p-2 text-center">{post.share}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Users */}
      <div className="w-full md:w-[30%] bg-white rounded-lg shadow p-4">
        <h4 className="text-md font-semibold mb-3">
          Bảng xếp hạng người dùng phổ biến
        </h4>
        <div className="space-y-4">
          {topUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  @{user.handle}
                </p>
                <p className="text-xs text-gray-500">{user.fullName}</p>
                <p className="text-sm mt-1 text-blue-600 font-semibold">
                  {user.followers.toLocaleString()} followers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal preview post */}
      <PostPreviewModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}