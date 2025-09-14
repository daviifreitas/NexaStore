import React from 'react';
import ProductCard from './ProductCard';
import { SkeletonCard } from './Skeleton';
import Pagination from './Pagination';

const ProductGrid = ({
  products = [],
  loading = false,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  className = '',
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
  startIndex = 1,
  endIndex = 1,
  totalItems = 0,
  showPagination = false,
  itemsPerPage = 12
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 ${className}`}>
          {Array.from({ length: itemsPerPage }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (products.length === 0 && !loading) {
      return (
        <div className="grid place-items-center rounded-3xl border border-gray-200 dark:border-neutral-800 p-10 text-center">
          <div className="mb-2 text-4xl">🛍️</div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Nenhum produto encontrado
          </h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Tente ajustar seus filtros ou busca.
          </p>
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 ${className}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderContent()}

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProductGrid;