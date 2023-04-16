export interface SearchParams {
  categoryId?: string;
  searchTerm?: string;
}

export interface BuscapeSearchParams extends SearchParams {
  buscapeCategory?: string;
}

export interface MeliSearchParams extends SearchParams {
  meliCategory?: string;
}
