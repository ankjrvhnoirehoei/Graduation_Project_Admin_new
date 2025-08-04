import { useEffect, useRef, useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";

interface Props {
  src: string;
  className?: string;
  onClick?: () => void;
}

export default function VideoPreview({ src, className, onClick }: Props) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous"; // Nếu video trên domain khác
    video.muted = true;
    video.currentTime = 0.1; // tránh frame đen ở 0

    const handleLoadedData = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        setThumbnail(dataURL);
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [src]);

  return (
    <div
      className={`relative rounded overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}

      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 flex items-center justify-center transition">
        <PlayCircleOutlined style={{ fontSize: 22, color: "white" }} />
      </div>
    </div>
  );
}
