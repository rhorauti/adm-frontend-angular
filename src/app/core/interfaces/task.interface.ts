import { IDepartment } from './department.interface';
import { IBaseResponse } from './response.interface';

export interface ITaskType {
  idTaskType: number | null;
  name: string;
  comment: string;
  department: IDepartment;
}

export interface IResponseTaskType extends IBaseResponse {
  data?: ITaskType;
}

export interface IResponseTypeTaskList extends IBaseResponse {
  data?: ITaskType[];
}
