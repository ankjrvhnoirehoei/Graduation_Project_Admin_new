import React from 'react';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  joined: string;
}

export function UsersTable({ data }: { data: UserRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Tên
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Ngày tham gia
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((u) => (
          <tr key={u.id}>
            <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{u.joined}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
