import { Button } from '../../components/ui/button';
import { RangeType } from '../report/type';   

const presets: { label: string; value: RangeType }[] = [
  { label: 'Năm nay',    value: 'year'   },
  { label: '7 ngày qua', value: '7days'  },
  { label: '30 ngày qua',value: '30days' },
];

interface Props {
  value: RangeType;
  onChange: (range: RangeType) => void;
}

export default function DateRangePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {presets.map(preset => (
        <Button
          key={preset.value}
          variant={value === preset.value ? 'default' : 'outline'}
          onClick={() => onChange(preset.value)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
