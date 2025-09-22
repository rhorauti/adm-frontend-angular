import { IDepartment } from './department.interface';
import { IBaseResponse } from './response.interface';

export interface ITaskType {
  idTaskType: number | null;
  name: string;
  comment: string;
  department: IDepartment;
}

export interface ITask {
  idTask: number | null;
  startDate?: Date;
  finishDate?: Date;
  name: string;
  status: string | null;
  photoUrls?: string[];
  comment?: string;
}

export interface IResponseTaskType extends IBaseResponse {
  data?: ITaskType | ITaskType[];
}

export interface IResponseTask extends IBaseResponse {
  data?: ITask | ITask[];
}
