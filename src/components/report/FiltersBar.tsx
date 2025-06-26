import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Filters } from "./type";

interface Props {
  filters: Filters;
  onChange: (updated: Filters) => void;
}

export default function FiltersBar({ filters, onChange }: Props) {
  const handleChange = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Input
        placeholder="Tìm theo người đăng hoặc kênh"
        className="w-60 bg-white"
        value={filters.uploader}
        onChange={(e) => handleChange("uploader", e.target.value)}
      />

      <Select
        value={filters.platform}
        onValueChange={(val) => handleChange("platform", val)}
      >
        <SelectTrigger className="w-48 bg-white">
          <SelectValue placeholder="Nền tảng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="web">Web</SelectItem>
          <SelectItem value="mobile">Mobile</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(val) => handleChange("category", val)}
      >
        <SelectTrigger className="w-48 bg-white">
          <SelectValue placeholder="Thể loại" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="funny">Hài hước</SelectItem>
          <SelectItem value="music">Âm nhạc</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
