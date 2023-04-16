export interface SearchParams {
  categoryId?: string;
  searchTerm?: string;
}

export interface BuscapeSearchParams extends SearchParams {
  buscapeCategory?: string;
  storeId?: string;
}

export interface MeliSearchParams extends SearchParams {
  meliCategory?: string;
  storeId?: string;
}

export interface ProductSearchParams extends SearchParams {
  storeId?: string;
}
