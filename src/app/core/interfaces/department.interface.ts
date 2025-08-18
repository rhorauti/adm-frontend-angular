import { IPagination } from './pagination.interface';
import { IBaseResponse } from './response.interface';
import { ITableCheckbox, ITableHeader } from './table.interface';

export interface IDepartment {
  idDepartment: number;
  name: string;
}

export interface IResponseDepartment extends IBaseResponse {
  data?: IDepartment;
}

export interface IResponseDepartmentList extends IBaseResponse {
  data?: IDepartment[];
}

export interface IFilterBoxDepartment {
  idDepartment: string;
  name: string;
}

export interface IFilterHelpDepartment {
  inputSearch: string;
  idDepartment: string;
  name: string;
}

export interface IDepartmentStore {
  /**
   * An input search value used to filter the table.
   */
  inputSearchValue: string;
  /**
   * A flag used to toggle the table´s header filter box.
   */
  isTableHeaderBoxActive: boolean;
  /**
   * Table´s headers object
   */
  tableHeaders: ITableHeader<IDepartment>[];
  /**
   * Table´s header and body checkbox object.
   */
  tableCheckbox: ITableCheckbox;
  /**
   * An array of booleans used to toggle each table row´s context menu.
   */
  tableItemsBox: boolean[];
  /**
   * An initial companiesData that retrieve data from database.
   */
  initialTableData: IDepartment[];
  /**
   * A array of objects used to display data in the table.
   */
  departmentsData: IDepartment[];
  /**
   * A flag used to toggle the delete button´s disabled property.
   */
  isDelBtnDisabled: boolean;
  /**
   * An object used to retrieve information from forms.
   */
  departmentData: IDepartment;
  /**
   * A flag used to toggle the table´s data filter box.
   */
  isFilterBoxActive: boolean;
  /**
   * A flag used to display a message to the user when filter result has no match.
   */
  isFilterResultZeroRegister: boolean;
  /**
   * An object used to retrieve information from filter sidebar form.
   */
  filterBox: IFilterBoxDepartment;
  /**
   * An object used to display help information about what was searched in the filter side bar form.
   */
  filterHelp: IFilterHelpDepartment;
  /**
   * An object used to display the table´s pagination information.
   */
  pagination: IPagination;
}
