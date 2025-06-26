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

export default function ChartsSection({ dateRange, filters }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow h-[300px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ tăng trưởng người dùng ({dateRange.label})
        </h3>
        {/* PLACEHOLDER FOR CHART */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Biểu đồ người dùng
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[300px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ hoạt động video ({dateRange.label})
        </h3>
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Biểu đồ hoạt động video
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[300px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ tương tác ({dateRange.label})
        </h3>
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Biểu đồ tương tác
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[300px]">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Biểu đồ nguồn lưu lượng ({dateRange.label})
        </h3>
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Biểu đồ nguồn lưu lượng
        </div>
      </div>
    </div>
  );
}
