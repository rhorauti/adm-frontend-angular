export interface ITableHeader<T> {
  id: number;
  isHeaderActive: boolean;
  sortDirection: number;
  icon: string;
  headerName: string;
  databaseField: keyof T;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}
