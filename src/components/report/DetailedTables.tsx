interface Props {
  type: "users" | "videos" | "performance";
  dateRange: {
    label: string;
    start: Date;
    end: Date;
  };
  filters: {
    platform: string;
    category: string;
    uploader: string;
  };
}

export default function DetailedTables({ type, dateRange, filters }: Props) {
  const renderTableContent = () => {
    switch (type) {
      case "users":
        return (
          <div className="p-4">📋 Bảng người dùng mới từ {dateRange.label}</div>
        );
      case "videos":
        return (
          <div className="p-4">📹 Bảng video mới từ {dateRange.label}</div>
        );
      case "performance":
        return (
          <div className="p-4">📈 Hiệu suất nội dung từ {dateRange.label}</div>
        );
      default:
        return null;
    }
  };

  return <div className="bg-white rounded shadow">{renderTableContent()}</div>;
}
