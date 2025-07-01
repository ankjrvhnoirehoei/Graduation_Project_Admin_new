import { format } from 'date-fns';
import { UsersTable } from './visual/UsersTable';
import { ContentTable } from './visual/ContentTable';
import { TableType, DateRange, Filters } from './type';

interface Props {
  type: TableType;
  dateRange: DateRange;
  filters: Filters;
}

export default function DetailedTables({ type, dateRange }: Props) {
  const { start, end } = dateRange;
  // generate mock rows
  const makeDate = (d: Date) => format(d, 'yyyy-MM-dd');
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  if (type === 'users') {
    const rows = Array.from({ length: 8 }).map((_, i) => {
      const date = new Date(
        start.getTime() + ((end.getTime() - start.getTime()) * i) / 7
      );
      return {
        id: `u${i + 1}`,
        name: `Người dùng ${i + 1}`,
        email: `user${i + 1}@example.com`,
        joined: makeDate(date),
      };
    });
    return <UsersTable data={rows} />;
  }

  // videos/contents
  const rows = Array.from({ length: 8 }).map((_, i) => {
    const date = new Date(
      start.getTime() + ((end.getTime() - start.getTime()) * i) / 7
    );
    const types = ['Bài đăng', 'Reels', 'Stories'] as const;
    const typeName = types[rand(0, 2)];
    return {
      id: `c${i + 1}`,
      type: typeName,
      title: `${typeName} tiêu đề ${i + 1}`,
      created: makeDate(date),
    };
  });
  return <ContentTable data={rows} />;
}
