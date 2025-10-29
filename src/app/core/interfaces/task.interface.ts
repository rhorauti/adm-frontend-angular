import { IBaseRegisterStore } from './base.register.interface';
import { IDepartment } from './department.interface';
import { PartialEmployee } from './employee.interface';
import { IPhoto } from './photo.interface';
import { PartialProduct } from './product.interface';
import { PartialProductionLine } from './production-line.interface';
import { IBaseResponse } from './response.interface';

export interface ITaskType {
  idTaskType: number | null;
  name: string;
  comment: string;
  department: IDepartment;
}

export type PartialTaskType = Pick<ITaskType, 'idTaskType' | 'name'>;

export interface IUsedSpareParts {
  idProduct: number;
  internalPartNumber: string;
  name: string;
  qty: number;
  index?: number;
}

export interface ITaskForm {
  idTask: number;
  startDate?: string | null;
  finishDate?: string | null;
  name?: string;
  status?: number | string;
  comment?: string;
  imgPreviewList?: IPhoto[] | null;
  productList?: PartialProduct[];
  product?: PartialProduct | null;
  usedSpareParts?: IUsedSpareParts[];
  productionLineList?: PartialProductionLine[];
  productionLine?: PartialProductionLine | null;
  taskTypeList?: PartialTaskType[];
  taskType?: PartialTaskType | null;
  employeeList?: PartialEmployee[];
  employee?: PartialEmployee | null;
  deptName?: string;
}

export interface ITaskFilterHelp extends ITaskHomeData {
  inputSearch: string;
}

export interface ITaskHomeData {
  idTask: number | null;
  employee: string;
  startDate: string;
  finishDate: string;
  name: string;
  deptName: string;
  status: number | string | null;
  taskType: string;
  product: string;
  productionLine: string;
}

export type TaskHome = Omit<IBaseRegisterStore<ITaskHomeData>, 'filterHelp'> & {
  filterHelp: ITaskFilterHelp;
};

export interface IResponseTaskType extends IBaseResponse {
  data?: ITaskType | ITaskType[];
}

export interface IResponseTaskHome extends IBaseResponse {
  data?: ITaskHomeData | ITaskHomeData[];
}

export interface IResponseTaskForm extends IBaseResponse {
  data?: ITaskForm | ITaskForm[];
}
