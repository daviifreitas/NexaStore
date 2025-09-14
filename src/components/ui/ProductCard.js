import React, { useState } from 'react';
import Button from './Button';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  className = ''
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart?.(product);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${className}`}
    >
      <div
        className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 grid place-items-center cursor-pointer"
        onClick={handleViewDetails}
      >
        {product.image ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 animate-pulse" />
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <svg className="h-12 w-12 text-gray-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l3-3 3 3" />
          </svg>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 cursor-pointer hover:text-brand transition-colors" onClick={handleViewDetails}>
              {product.name}
            </h3>
            {product.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {product.category}
              </p>
            )}
          </div>

          <button
            onClick={handleToggleFavorite}
            className="p-1 rounded-lg text-gray-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
            aria-pressed={product.isFavorite}
            aria-label={product.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <svg className="h-5 w-5" fill={product.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            {product.price && (
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {typeof product.price === 'number'
                  ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
                  : product.price
                }
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 line-through">
                {typeof product.originalPrice === 'number'
                  ? `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`
                  : product.originalPrice
                }
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            loading={isAddingToCart}
            disabled={product.stock === 0}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
          </Button>
        </div>

        {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 dark:text-orange-400">
            Apenas {product.stock} em estoque
          </p>
        )}
      </div>
    </article>
  );
};

export default ProductCard;