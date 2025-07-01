import { Button } from "../../components/ui/button";
import { DateRange } from "../report/type";

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: Props) {
  const now = new Date();
  // Jan 1 of this year
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const presets: DateRange[] = [
    {
      label: "Năm nay",
      start: startOfYear,
      end: now,
    },
    {
      label: "7 ngày qua",
      start: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      end: now,
    },
    {
      label: "30 ngày qua",
      start: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000),
      end: now,
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant={value.label === preset.label ? "default" : "outline"}
          onClick={() => onChange(preset)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
