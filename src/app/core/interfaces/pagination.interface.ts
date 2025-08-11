export interface IPagination {
  currentPage: number;
  totalPages: number;
  qtyPerPage: number;
  breakpointPage: number;
  pagesArray: string[] | number[];
}
