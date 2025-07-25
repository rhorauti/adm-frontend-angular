export interface ITableHeader {
  id: number;
  isHeaderActive: boolean;
  sort: number;
  icon: string;
  headerName: string;
  databaseField: string;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}
