import { useEffect, useRef, useState } from "react";
import { Modal, Button, Tag, Avatar, Spin, Typography, Divider } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Media {
  _id: string;
  postID?: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: any[];
}

interface User {
  _id?: string;
  username?: string;
  handleName?: string;
  profilePic?: string;
}

interface Post {
  _id: string;
  id?: string;
  userID: string;
  type?: "post" | "reel";
  caption?: string;
  isFlagged?: boolean;
  nsfw?: boolean;
  isEnable?: boolean;
  location?: string;
  viewCount?: number;
  share?: number;
  createdAt?: string;
  updatedAt?: string;
  media?: Media[];
  user?: User;
  likeCount?: number;
  commentCount?: number;
}

interface Props {
  post: Post | null;
  onClose: () => void;
}

export default function PostPreviewModal({ post, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const mediaList = post?.media ?? [];
  const currentMedia = mediaList[currentMediaIndex];
  const currentMediaUrl =
    currentMedia?.videoUrl || currentMedia?.imageUrl || null;
  const isVideo = !!currentMedia?.videoUrl;

  useEffect(() => {
    setVideoError(false);
    setIsLoading(true);
  }, [post?._id, post?.id, currentMediaIndex]);

  if (!post) return null;

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Không rõ";

  return (
    <Modal
      open={!!post}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: 0, height: "80vh" }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        {/* Media Section */}
        <div style={{ flex: 3, background: "#000", position: "relative" }}>
          {currentMediaUrl ? (
            isVideo ? (
              <video
                ref={videoRef}
                src={currentMediaUrl}
                controls
                className="w-full h-full object-contain"
                onLoadedData={() => setIsLoading(false)}
                onError={() => setVideoError(true)}
              />
            ) : (
              <img
                src={currentMediaUrl}
                alt="media"
                className="w-full h-full object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => setVideoError(true)}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Không có media
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
              <Spin size="large" />
            </div>
          )}

          {mediaList.length > 1 && (
            <>
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                onClick={() =>
                  setCurrentMediaIndex((prev) =>
                    prev > 0 ? prev - 1 : mediaList.length - 1
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              />
              <Button
                shape="circle"
                icon={<RightOutlined />}
                onClick={() =>
                  setCurrentMediaIndex((prev) =>
                    prev < mediaList.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              />
            </>
          )}
        </div>

        {/* Info Section */}
        <div
          style={{
            flex: 2,
            padding: 24,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title level={4}>{post.caption || "Không có tiêu đề"}</Title>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {post.type && (
                <Tag color={post.type === "reel" ? "purple" : "blue"}>
                  {post.type}
                </Tag>
              )}
              {typeof post.isEnable === "boolean" && (
                <Tag color={post.isEnable ? "green" : "red"}>
                  {post.isEnable ? "Hoạt động" : "Bị vô hiệu hóa"}
                </Tag>
              )}
              {post.isFlagged && <Tag color="gold">Bị báo cáo</Tag>}
              {post.nsfw && <Tag color="volcano">NSFW</Tag>}
            </div>

            <Divider />

            <Text type="secondary">Người đăng</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
              }}
            >
              <Avatar src={post.user?.profilePic} />
              <div>
                <div>{post.user?.username || "Không rõ"}</div>
                <Text type="secondary">@{post.user?.handleName || "ẩn"}</Text>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Thời gian đăng</Text>
              <div>{formatDate(post.createdAt)}</div>
            </div>

            {post.location && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Vị trí</Text>
                <div>{post.location}</div>
              </div>
            )}

            <div
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <Text type="secondary">Lượt thích</Text>
                <div style={{ color: "blue" }}>
                  {(post.likeCount ?? 0).toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <Text type="secondary">Bình luận</Text>
                <div>{(post.commentCount ?? 0).toLocaleString()}</div>
              </div>
            </div>

            {mediaList.length > 1 && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Media</Text>
                <div>
                  {currentMediaIndex + 1}/{mediaList.length} (
                  {isVideo ? "Video" : "Hình ảnh"})
                </div>
              </div>
            )}
          </div>

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
