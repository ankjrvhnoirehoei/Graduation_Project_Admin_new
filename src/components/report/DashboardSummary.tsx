interface SummaryCard {
  label: string;
  value: number | string;
  comparison: number | string;
}

interface Props {
  dateRange: {
    start: Date;
    end: Date;
    label: string;
  };
  filters: {
    platform: string;
    category: string;
    uploader: string;
  };
}

export default function DashboardSummary({ dateRange, filters }: Props) {
  // Giả lập dữ liệu tạm thời
  const mockData: SummaryCard[] = [
    {
      label: "Người dùng mới",
      value: 124,
      comparison: "+12%",
    },
    {
      label: "Video mới",
      value: 52,
      comparison: "+8%",
    },
    {
      label: "Lượt xem",
      value: "12,430",
      comparison: "-3%",
    },
    {
      label: "Bình luận",
      value: 830,
      comparison: "+20%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mockData.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-4 flex flex-col gap-1"
        >
          <p className="text-sm text-gray-500">
            {item.label} ({dateRange.label})
          </p>
          <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
          <p
            className={`text-xs ${
              typeof item.comparison === "string" &&
              item.comparison.startsWith("-")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            So với trước: {item.comparison}
          </p>
        </div>
      ))}
    </div>
  );
}
