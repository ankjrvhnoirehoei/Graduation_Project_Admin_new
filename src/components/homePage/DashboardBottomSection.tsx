import { useEffect, useState } from "react";
import api from "../../lib/axios";
import VideoPreview from "../VideoPreview";

interface TopVideo {
  id: string;
  caption: string;
  thumbnail: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
}

interface TopUser {
  id: string;
  avatar: string;
  handle: string;
  fullName: string;
  followers: number;
}

export default function DashboardBottomSection() {
  const [topVideos, setTopVideos] = useState<TopVideo[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    const fetchTopLikedVideos = async () => {
      try {
        const res = await api.get("/posts/admin/top-liked", {
          headers: { token: true },
        });

        const videos = res.data.map((video: any) => ({
          id: video._id,
          caption: video.caption,
          thumbnail: Array.isArray(video.thumbnail)
            ? video.thumbnail[0]
            : video.thumbnail,
          author: video.author,
          likes: video.likes,
          comments: video.comments,
          shares: video.shares,
        }));

        setTopVideos(videos);
      } catch (error) {
        console.error("Lỗi khi fetch top liked videos:", error);
      }
    };

    const fetchTopUsers = async () => {
      try {
        const res = await api.get("/users/admin/top-followers", {
          headers: { token: true },
        });
        setTopUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch top followers:", error);
      }
    };

    fetchTopLikedVideos();
    fetchTopUsers();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      <div className="w-full md:w-[70%] bg-white rounded-lg shadow p-4">
        <h4 className="text-md font-semibold mb-3">
          Video nhiều lượt thích nhất tuần
        </h4>
        <div className="overflow-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2">Bài đăng</th>
                <th className="p-2">Nội dung</th>
                <th className="p-2">Người đăng</th>
                <th className="p-2 text-center">Số lượt thích</th>
                <th className="p-2 text-center">Số bình luận</th>
                <th className="p-2 text-center">Số lượt chia sẻ</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((video) => (
                <tr
                  key={video.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-2">
                    {video.thumbnail.endsWith(".m3u8") ? (
                      <VideoPreview
                        src={video.thumbnail}
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <img
                        src={video.thumbnail}
                        alt="thumb"
                        className="w-16 h-10 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2 max-w-[150px] truncate">
                    {video.caption || "Không có mô tả"}
                  </td>
                  <td className="p-2 max-w-[150px] truncate">{video.author}</td>
                  <td className="p-2 text-center">{video.likes}</td>
                  <td className="p-2 text-center">{video.comments}</td>
                  <td className="p-2 text-center">{video.shares}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}
