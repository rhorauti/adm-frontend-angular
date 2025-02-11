import { IAddress } from './IAddress';
import { ICompany } from './ICompany';
import { IEmployee } from './IEmployee';
import { IProject } from './IProject';
import { ITableHeader } from './ITableHeader';

export interface IBaseResponse {
  date: string;
  status: boolean;
  message: string;
  data: TableItemType[];
}

export interface IBaseGroup {
  tabList: string[];
  arraySelectFilter: string[];
  inputValueFilter: string;
  selectValueFilter: string;
  placeholderFilter: string;
  tabIdx: number;
  isHeaderBoxActive: boolean;
  tableIdx: number;
  qtyPerPage: number;
  tableHeaderSelected: ITableHeader[];
  tableDataSelected: TableItemType[];
  tableItemSelected: TableItemType;
  isTableExpanded: boolean;
}

export interface ITableHeaderGroup {
  companyTableHeaders: ITableHeader[];
  adressTableHeaders: ITableHeader[];
  projectTableHeaders: ITableHeader[];
  employeeTableHeaders: ITableHeader[];
}

export interface TableTypeObject {
  company: ICompany;
  address: IAddress;
  project: IProject;
  employee: IEmployee;
}

export type TableDataTypeString = 'company' | 'address' | 'project' | 'employee';
export type TableTypeNumber = 0 | 1 | 2;
export type TableItemType = ICompany | IAddress | IProject | IEmployee;
