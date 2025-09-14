import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import Filters from '../components/ui/Filters';
import DataTable from '../components/ui/DataTable';
import ProductModal from '../components/ui/ProductModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getProductsWithFavorites } from '../data/mockProducts';
import { toggleFavorite } from '../utils/favoriteStorage';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setLoading(true);

    setProducts(getProductsWithFavorites());

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory && selectedCategory !== 'Todos') {
      console.log('Categoria selecionada', selectedCategory);
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange.min > 0 || priceRange.max < 10000) {
      filtered = filtered.filter(product =>
        product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, inStockOnly]);

  const columns = useMemo(() => [
    {
      header: 'Produto',
      accessor: 'name',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={row.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Preço',
      accessor: 'price',
      render: (value) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          R$ {value.toFixed(2).replace('.', ',')}
        </span>
      )
    },
    {
      header: 'Estoque',
      accessor: 'stock',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${value > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={value > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-500'}>
            {value > 0 ? `${value} unidades` : 'Sem estoque'}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isFavorite',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {value && (
            <Badge variant="brand">
              ❤️ Favorito
            </Badge>
          )}
          {row.stock === 0 && (
            <Badge variant="danger">
              Indisponível
            </Badge>
          )}
        </div>
      ),
      sortable: false
    }
  ], []);

  const handleSearchChange = (query) => {
    setLoading(true);
    setTimeout(() => {
      setSearchQuery(query);
      setLoading(false);
    },500);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleInStockOnlyChange = (value) => {
    setInStockOnly(value);
  };

  const handleClearFilters = () => {
    setSelectedCategory('Todos');
    setPriceRange({ min: 0, max: 10000 });
    setInStockOnly(false);
    setSearchQuery('');
  };

  const handleAddToCart = async (product) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    showToast(`${product.name} adicionado ao carrinho!`);
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product.id);

    setProducts(prev =>
      prev.map(p =>
        p.id === product.id
          ? { ...p, isFavorite: !p.isFavorite }
          : p
      )
    );

    const message = product.isFavorite
      ? `${product.name} removido dos favoritos`
      : `${product.name} adicionado aos favoritos`;
    showToast(message);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const renderActions = (product) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleFavorite(product);
        }}
        className="p-2"
      >
        {product.isFavorite ? '❤️' : '🤍'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product);
        }}
        disabled={product.stock === 0}
        className="px-3"
      >
        {product.stock === 0 ? 'Indisponível' : 'Adicionar'}
      </Button>
    </div>
  );

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    console.log('Cart clicked - implement cart drawer/modal');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const activeFilters = [
    selectedCategory && selectedCategory !== 'Todos' ? selectedCategory : null,
    searchQuery.trim() ? `"${searchQuery}"` : null,
    priceRange.min > 0 || priceRange.max < 10000 ? 'Preço' : null,
    inStockOnly ? 'Em estoque' : null
  ].filter(Boolean);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSearchSubmit}
      cartItemsCount={cartItemsCount}
      onCartClick={handleCartClick}
    >
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Catálogo de Produtos
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {loading ? 'Carregando...' : `${filteredProducts.length} produtos encontrados`}
            </p>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="brand">
                  {filter}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs ml-2"
              >
                Limpar
              </Button>
            </div>
          )}
        </header>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <aside className="mb-6 lg:mb-0">
            <Filters
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              inStockOnly={inStockOnly}
              onInStockOnlyChange={handleInStockOnlyChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          <main>
            <DataTable
              data={filteredProducts}
              columns={columns}
              loading={loading}
              pagination={true}
              pageSize={12}
              searchable={true}
              sortable={true}
              onRowClick={handleViewDetails}
              actions={renderActions}
              emptyMessage="Nenhum produto encontrado"
              loadingRows={6}
              responsive={true}
            />
          </main>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="rounded-2xl bg-gray-900 text-white/90 p-3 shadow-lg max-w-sm">
            <p className="text-sm">{toastMessage}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Catalog;