import { Button } from "../../components/ui/button";
import { DateRange } from "../report/type";

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: Props) {
  const now = new Date();

  const presets: DateRange[] = [
    {
      label: "Hôm nay",
      start: new Date(now.setHours(0, 0, 0, 0)),
      end: new Date(),
    },
    {
      label: "7 ngày qua",
      start: new Date(new Date().setDate(now.getDate() - 6)),
      end: new Date(),
    },
    {
      label: "30 ngày qua",
      start: new Date(new Date().setDate(now.getDate() - 29)),
      end: new Date(),
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

      <Button
        variant={value.label === "Tùy chỉnh" ? "default" : "outline"}
        onClick={() => {
          onChange({
            label: "Tùy chỉnh",
            start: new Date(),
            end: new Date(),
          });
        }}
      >
        Tùy chỉnh
      </Button>
    </div>
  );
}
