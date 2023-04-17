export interface SearchParams {
  categoryId?: string;
  searchTerm?: string;
  storeId?: string;
}

export interface BuscapeSearchParams extends SearchParams {
  buscapeCategory?: string;
  storeId?: string;
}

export interface MercadoLivreSearchParams extends SearchParams {
  mercadoLivreCategory?: string;
  storeId?: string;
}

export interface ProductSearchParams extends SearchParams {
  storeId?: string;
}
