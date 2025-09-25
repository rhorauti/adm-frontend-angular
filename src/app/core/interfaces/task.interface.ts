import { IDepartment } from './department.interface';
import { IEmployee } from './employee.interface';
import { IProduct } from './product.interface';
import { IProductionLine } from './production-line.interface';
import { IBaseResponse } from './response.interface';

export interface ITaskType {
  idTaskType: number | null;
  name: string;
  comment: string;
  department: IDepartment;
}

export type PartialEmployee = Pick<IEmployee, 'idEmployee' | 'name'>;
export type PartialTaskType = Pick<ITaskType, 'idTaskType' | 'name'>;
export type PartialProductionLine = Pick<
  IProductionLine,
  'idProductionLine' | 'lineCode' | 'toolingList'
>;
export type PartialProduct = Pick<IProduct, 'idProduct' | 'internalPartNumber' | 'name'>;
export interface UsedSpareParts {
  idProduct: number;
  name: string;
  qty: number;
}

export interface ITask {
  idTask: number;
  startDate?: Date | null;
  finishDate?: Date | null;
  name?: string;
  status?: number;
  comment?: string;
  imgPreviewList?: string[];
  productList?: PartialProduct[];
  product?: PartialProduct;
  isSparePartsChanged?: boolean;
  usedSpareParts?: UsedSpareParts[];
  productionLineList?: PartialProductionLine[];
  productionLine?: PartialProductionLine;
  taskTypeList?: PartialTaskType[];
  taskType?: PartialTaskType;
  employeeList?: PartialEmployee[];
  employee?: PartialEmployee;
}

export interface IResponseTaskType extends IBaseResponse {
  data?: ITaskType | ITaskType[];
}

export interface IResponseTask extends IBaseResponse {
  data?: ITask | ITask[];
}
