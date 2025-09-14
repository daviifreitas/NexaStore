import productsData from './products.json';
import { getFavoritesFromStorage } from '../utils/favoriteStorage';

export const getProductsWithFavorites = () => {
  const savedFavorites = getFavoritesFromStorage();

  return productsData.products.map(product => ({
    ...product,
    isFavorite: savedFavorites.includes(product.id)
  }));
};

export const mockProducts = productsData.products;
export const categories = productsData.categories;