import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';

const ProductModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) return null;

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

  const HeartIcon = ({ filled }) => (
    <svg className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      size="lg"
      className="max-h-[90vh] flex flex-col"
    >
      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl overflow-hidden flex-shrink-0">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="h-16 w-16 text-gray-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l3-3 3 3" />
              </svg>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {product.name}
              </h2>
              {product.category && (
                <Badge variant="default" className="mb-3">
                  {product.category}
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={`p-2 ${product.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              aria-pressed={product.isFavorite}
              aria-label={product.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <HeartIcon filled={product.isFavorite} />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {typeof product.price === 'number'
                ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
                : product.price
              }
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                {typeof product.originalPrice === 'number'
                  ? `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`
                  : product.originalPrice
                }
              </span>
            )}
          </div>

          {product.stock !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estoque:</span>
              {product.stock === 0 ? (
                <Badge variant="error">Esgotado</Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="warning">{product.stock} unidades</Badge>
              ) : (
                <Badge variant="success">Disponível</Badge>
              )}
            </div>
          )}

          {product.description && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Descrição</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Características</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-neutral-800 flex-shrink-0">
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          loading={isAddingToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
    </Modal>
  );
};

export default ProductModal;