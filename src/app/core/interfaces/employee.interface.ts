import { IPagination } from './pagination.interface';
import { IBaseResponse } from './response.interface';
import { ITableCheckbox, ITableHeader } from './table.interface';

export interface IEmployee {
  idEmployee: number;
  isDefault: boolean;
  name: string;
  cpf?: string;
  department?: string;
  position?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
}

export interface IResponseEmployee extends IBaseResponse {
  data?: IEmployee;
}

export interface IEmployeePosition {
  idEmployeePosition: number;
  name: string;
  comment: string;
}

export interface IResponseEmployeePosition extends IBaseResponse {
  data?: IEmployeePosition;
}

export interface IResponseEmployeePositionList extends IBaseResponse {
  data?: IEmployeePosition[];
}

export interface IFilterBoxDepartment {
  idEmployeePosition: string;
  name: string;
}

export interface IFilterHelpEmployeePosition {
  inputSearch: string;
  idEmployeePosition: string;
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
  tableHeaders: ITableHeader<IEmployeePosition>[];
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
  initialTableData: IEmployeePosition[];
  /**
   * A array of objects used to display data in the table.
   */
  departmentsData: IEmployeePosition[];
  /**
   * A flag used to toggle the delete button´s disabled property.
   */
  isDelBtnDisabled: boolean;
  /**
   * An object used to retrieve information from forms.
   */
  departmentData: IEmployeePosition;
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
  filterHelp: IFilterHelpEmployeePosition;
  /**
   * An object used to display the table´s pagination information.
   */
  pagination: IPagination;
}
