import { IAddress } from './IAddress';
import { ICompany } from './ICompany';
import { IEmployee } from './IEmployee';
import { IProject } from './IProject';
import { ITableHeader } from './ITableHeader';

export interface IBaseResponse {
  date: string;
  status: boolean;
  message: string;
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

export interface IModalForm {
  isActive: boolean;
  isInputClear: boolean;
  isEditForm: boolean;
}

export interface IModalCheck {
  isActive: boolean;
  isActionOk: boolean;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}

export interface IFilter {
  selectValue: string;
  input: string;
  placeholder: string;
}

export interface IPagination {
  currentPage: number;
  lastPage: number;
  qtyPerPage: number;
}

export interface IPaginationResponse extends IBaseResponse {
  data: IPagination;
}

export interface IBreadcrumb {
  label: string;
  href: string;
}

export type TableDataTypeString = 'company' | 'address' | 'project' | 'employee';
export type TableTypeNumber = 0 | 1 | 2;
export type TableItemType = ICompany | IAddress | IProject | IEmployee;
