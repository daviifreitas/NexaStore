import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import useTheme from '../../hooks/useTheme';

const Header = ({
  searchQuery,
  onSearchChange,
  cartItemsCount = 0,
  onCartClick,
  onSearchSubmit
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState(searchQuery || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit?.(searchValue);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const SearchIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const SunIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const MoonIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  const CartIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M9 19.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM20 19.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur dark:bg-neutral-900/80 border-b border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-brand">NexaStore</h1>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={searchValue}
                onChange={handleSearchChange}
                icon={<SearchIcon />}
                className="w-full"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
              className="p-2"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              aria-label={`Carrinho com ${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'itens'}`}
              className="p-2 relative"
            >
              <CartIcon />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-brand text-white border-brand">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchValue}
              onChange={handleSearchChange}
              icon={<SearchIcon />}
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;