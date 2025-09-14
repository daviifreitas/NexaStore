import React, { useState, useMemo } from 'react';
import Button from './Button';
import Skeleton from './Skeleton';

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="overflow-hidden rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-neutral-800">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="60%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton height="1rem" width={colIndex === 0 ? "80%" : "60%"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = true,
  pageSize = 10,
  searchable = false,
  sortable = true,
  className = '',
  emptyMessage = 'Nenhum item encontrado',
  loadingRows = 5,
  onRowClick = null,
  actions = null,
  responsive = true,
  responsiveBreakpoint = 'md',
  mobileColumns = null,
  paginationLoadingDelay = 500,
  enablePaginationLoading = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationLoading, setPaginationLoading] = useState(false);

  const getResponsiveClasses = () => {
    if (!responsive) return '';

    const breakpoints = {
      sm: 'sm:block',
      md: 'md:block',
      lg: 'lg:block',
      xl: 'xl:block'
    };

    return `hidden ${breakpoints[responsiveBreakpoint] || 'md:block'}`;
  };

  const renderMobileCard = (row, index) => {
    const columnsToShow = mobileColumns ? columns.filter(col => mobileColumns.includes(col.accessor)) : columns;

    return (
      <div
        key={index}
        className={`p-4 border border-gray-200 dark:border-neutral-700 rounded-lg mb-4 ${
          onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800' : ''
        } transition-colors duration-150`}
        onClick={() => onRowClick && onRowClick(row, index)}
      >
        {columnsToShow.map((column, colIndex) => (
          <div key={colIndex} className="flex justify-between items-start py-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0 flex-shrink-0 mr-3">
              {column.header}:
            </span>
            <span className="text-sm text-gray-900 dark:text-gray-100 text-right flex-1 min-w-0 break-words">
              {column.render ? column.render(row[column.accessor], row, index) : row[column.accessor]}
            </span>
          </div>
        ))}
        {actions && (
          <div className="flex justify-end mt-3 pt-3 border-t border-gray-200 dark:border-neutral-700">
            {actions(row, index)}
          </div>
        )}
      </div>
    );
  };

  const renderMobileView = () => (
    <div className={`${responsive ? `block ${responsiveBreakpoint}:hidden` : 'hidden'} p-4`}>
      {paginatedData.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        paginatedData.map(renderMobileCard)
      )}
    </div>
  );

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(item =>
      columns.some(column => {
        const value = column.accessor ? item[column.accessor] : '';
        return String(value).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedData.length);

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = async (page) => {
    if (enablePaginationLoading && page !== currentPage) {
      setPaginationLoading(true);

      await new Promise(resolve => setTimeout(resolve, paginationLoadingDelay));

      setCurrentPage(page);
      setPaginationLoading(false);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const renderSortIcon = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {sortConfig.direction === 'asc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        )}
      </svg>
    );
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left flex items-center gap-2">
          {paginationLoading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>
            Mostrando {startIndex} a {endIndex} de {sortedData.length} resultados
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || paginationLoading}
          >
            Anterior
          </Button>

          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={paginationLoading}
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {pages.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "brand" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              disabled={paginationLoading}
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={paginationLoading}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || paginationLoading}
          >
            Próxima
          </Button>
        </div>
      </div>
    );
  };

  if (loading || paginationLoading) {
    return <TableSkeleton rows={loadingRows} columns={columns.length} />;
  }

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 ${className}`}>
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar na tabela..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm sm:text-base"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      <div className={`overflow-x-auto ${getResponsiveClasses()}`}>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 group' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.accessor)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable !== false && renderSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800' : ''
                  } transition-colors duration-150`}
                  onClick={() => onRowClick && onRowClick(row, index)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {column.render ? column.render(row[column.accessor], row, index) : row[column.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actions(row, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {renderMobileView()}

      {renderPagination()}
    </div>
  );
};

export default DataTable;