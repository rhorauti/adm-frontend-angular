export interface IPagination {
  currentPage: number;
  totalPages: number;
  qtyPerPage: number;
  pagesArray: string[] | number[];
}
