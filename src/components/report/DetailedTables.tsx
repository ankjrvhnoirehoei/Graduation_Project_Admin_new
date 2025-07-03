import { format } from 'date-fns';
import { UsersTable } from './visual/UsersTable';
import { ContentTable } from './visual/ContentTable';
import { TableType } from './type';

interface Props {
  type: TableType;
}

export default function DetailedTables({ type }: Props) {

  if (type === 'users') {
    return <UsersTable />;
  }

  return <ContentTable />;
}
