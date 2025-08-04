import { format } from 'date-fns';
import { UsersTable } from './visual/UsersTable';
import { ContentTable } from './visual/ContentTable';
import { StoriesTable } from './visual/StoriesTable';
import { TableType } from './type';

interface Props {
  type: TableType;
}

export default function DetailedTables({ type }: Props) {

  if (type === 'users') {
    return <UsersTable />;
  }

  // if (type === 'stories') {
  //   return <StoriesTable />;
  // }

  return <ContentTable />;
}
