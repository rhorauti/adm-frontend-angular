export interface ITableHeader {
  id: number;
  isHeaderActive: boolean;
  name: string;
  value: string;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}
