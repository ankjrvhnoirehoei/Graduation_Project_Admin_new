import React from 'react';

export interface ContentRow {
  id: string;
  type: string;
  title: string;
  created: string;
}

export function ContentTable({ data }: { data: ContentRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Loại
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Tiêu đề
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Ngày tạo
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((c) => (
          <tr key={c.id}>
            <td className="px-6 py-4 whitespace-nowrap">{c.type}</td>
            <td className="px-6 py-4 whitespace-nowrap">{c.title}</td>
            <td className="px-6 py-4 whitespace-nowrap">{c.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
