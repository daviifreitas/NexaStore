import React, { useState } from 'react';
import Button from './Button';
import Badge from './Badge';
import { categories } from '../../data/mockProducts';

const Filters = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
  onClearFilters,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = [
    selectedCategory && selectedCategory !== 'Todos',
    priceRange && (priceRange.min > 0 || priceRange.max < 10000),
    inStockOnly
  ].filter(Boolean).length;

  const FilterIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.534.891l-2 1A1 1 0 0110 20V14.414a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800 ${className}`}>
      <div className="lg:hidden">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-4 rounded-3xl"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <FilterIcon />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge variant="brand">{activeFiltersCount}</Badge>
            )}
          </div>
          <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </div>
        </Button>
      </div>

      <div className={`lg:block ${isExpanded ? 'block' : 'hidden'} p-4 space-y-6`}>
        <div className="hidden lg:flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FilterIcon />
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Limpar ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Categoria</h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className="justify-start"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Faixa de Preço</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="min-price" className="sr-only">Preço mínimo</label>
                <input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={priceRange?.min || ''}
                  onChange={(e) => onPriceRangeChange({
                    ...priceRange,
                    min: parseFloat(e.target.value) || 0
                  })}
                  className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="sr-only">Preço máximo</label>
                <input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={priceRange?.max || ''}
                  onChange={(e) => onPriceRangeChange({
                    ...priceRange,
                    max: parseFloat(e.target.value) || 10000
                  })}
                  className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockOnlyChange(e.target.checked)}
              className="rounded border-gray-300 dark:border-neutral-700 text-brand focus:ring-brand focus:ring-offset-0"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">Apenas em estoque</span>
          </label>
        </div>

        <div className="lg:hidden pt-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              Limpar Filtros ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;