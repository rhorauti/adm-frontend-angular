export interface ITableHeader {
  id: number;
  isHeaderActive: boolean;
  sort: number;
  headerName: string;
  databaseField: string;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}
