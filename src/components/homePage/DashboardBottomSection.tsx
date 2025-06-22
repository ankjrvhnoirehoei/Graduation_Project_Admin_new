export default function DashboardBottomSection() {
  const topVideos = [
    {
      id: 6,
      thumbnail:
        "https://i.pinimg.com/736x/38/ec/11/38ec11a295791bb4916185ff8e63c573.jpg",
      caption: "TikTok dance trend mới",
      author: "dancer01",
      likes: 1530,
      comments: 300,
      shares: 210,
    },
    {
      id: 9,
      thumbnail:
        "https://i.pinimg.com/736x/e2/40/03/e24003cf0c6c6b10b634cd70cef793d9.jpg",
      caption: "Du lịch Đà Lạt 3N2Đ",
      author: "travelguy",
      likes: 1430,
      comments: 390,
      shares: 140,
    },
    {
      id: 4,
      thumbnail:
        "https://i.pinimg.com/736x/71/af/85/71af85cf48d18f650adff2ffd6158418.jpg",
      caption: "Top 5 món ăn vặt hot",
      author: "foodie24",
      likes: 1300,
      comments: 450,
      shares: 120,
    },
    {
      id: 1,
      thumbnail:
        "https://i.pinimg.com/736x/98/b2/d5/98b2d566669ba22380a40071cf06ce21.jpg",
      caption: "Video giải trí hài hước",
      author: "user123",
      likes: 1200,
      comments: 340,
      shares: 90,
    },
    {
      id: 2,
      thumbnail:
        "https://i.pinimg.com/736x/d6/33/a6/d633a691811b47743a0136afacf74b0e.jpg",
      caption: "Thử thách 7 ngày",
      author: "user456",
      likes: 980,
      comments: 210,
      shares: 60,
    },
    {
      id: 8,
      thumbnail:
        "https://i.pinimg.com/736x/e2/40/03/e24003cf0c6c6b10b634cd70cef793d9.jpg",
      caption: "Câu chuyện cảm động",
      author: "lifeinspires",
      likes: 950,
      comments: 410,
      shares: 50,
    },
    {
      id: 7,
      thumbnail:
        "https://i.pinimg.com/736x/cb/bb/f1/cbbbf1d6eba91e1ccb545e49a42d5982.jpg",
      caption: "Review đồ công nghệ",
      author: "techguru",
      likes: 810,
      comments: 230,
      shares: 75,
    },
    {
      id: 3,
      thumbnail:
        "https://i.pinimg.com/736x/01/d9/21/01d921c591c722cf0586c45092a1b1ea.jpg",
      caption: "Mẹo học nhanh thuộc bài",
      author: "smartkid",
      likes: 740,
      comments: 100,
      shares: 30,
    },
    {
      id: 10,
      thumbnail:
        "https://i.pinimg.com/736x/2b/0c/b6/2b0cb6b5965ad86cd3ff07ba2bcfa0d3.jpg",
      caption: "Thử nghiệm khoa học thú vị",
      author: "sciencekid",
      likes: 680,
      comments: 150,
      shares: 35,
    },
    {
      id: 5,
      thumbnail:
        "https://i.pinimg.com/736x/26/94/68/269468f86915584a1731277c5795b666.jpg",
      caption: "Biến hình cosplay",
      author: "animefan",
      likes: 670,
      comments: 88,
      shares: 40,
    },
  ];

  const topUser = [
    {
      avatar:
        "https://i.pinimg.com/736x/6f/a5/88/6fa588f89c774e53eb9dc58eae66869f.jpg",
      handle: "justina",
      fullName: "Justina Xie",
      followers: 10234,
    },
    {
      avatar: "https://i.pravatar.cc/100?img=2",
      handle: "queen_bee",
      fullName: "Lê Thị Ngọc",
      followers: 1500,
    },
    {
      avatar: "https://i.pravatar.cc/100?img=3",
      handle: "minhtech",
      fullName: "Nguyễn Minh Khoa",
      followers: 2300,
    },
  ];

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
                <th className="p-2">Video</th>
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
                    <img
                      src={video.thumbnail}
                      alt="thumb"
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 max-w-[150px] truncate">
                    {video.caption}
                  </td>
                  <td className="p-2 max-w-[150px] truncate">{video.author}</td>
                  <td className="p-2 text-center ">{video.likes}</td>
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
          {topUser.map((user, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={`user-${index}`}
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
