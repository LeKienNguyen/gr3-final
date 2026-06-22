import { useState, useMemo } from 'react';
import { PAGINATION } from '@/constants';

export const usePagination = (totalItems, pageSize = PAGINATION.DEFAULT_PAGE_SIZE) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize],
  );

  const paginatedRange = useMemo(
    () => ({
      start: (currentPage - 1) * pageSize,
      end: currentPage * pageSize,
    }),
    [currentPage, pageSize],
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    paginatedRange,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
};
