const FAVORITES_KEY = 'nexastore_favorites';

export const getFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Erro ao ler favoritos do localStorage:', error);
    return [];
  }
};

export const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar favoritos no localStorage:', error);
  }
};

export const addToFavorites = (productId) => {
  const favorites = getFavoritesFromStorage();
  if (!favorites.includes(productId)) {
    const newFavorites = [...favorites, productId];
    saveFavoritesToStorage(newFavorites);
    return newFavorites;
  }
  return favorites;
};

export const removeFromFavorites = (productId) => {
  const favorites = getFavoritesFromStorage();
  const newFavorites = favorites.filter(id => id !== productId);
  saveFavoritesToStorage(newFavorites);
  return newFavorites;
};

export const toggleFavorite = (productId) => {
  const favorites = getFavoritesFromStorage();
  const isFavorite = favorites.includes(productId);

  if (isFavorite) {
    return removeFromFavorites(productId);
  } else {
    return addToFavorites(productId);
  }
};