import { useState } from 'react';

export function useRowExpansionAndPagination<T extends { id: string }>(items: T[], initialPageSize = 10) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const paginatedItems = items.slice(pageSize * pageIndex, pageSize * (pageIndex + 1));

  return {
    expandedRows,
    toggleRowExpansion,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    paginatedItems,
  };
}