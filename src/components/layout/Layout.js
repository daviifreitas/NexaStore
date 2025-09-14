import React from 'react';
import Header from './Header';

const Layout = ({
  children,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartItemsCount,
  onCartClick
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        cartItemsCount={cartItemsCount}
        onCartClick={onCartClick}
      />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;