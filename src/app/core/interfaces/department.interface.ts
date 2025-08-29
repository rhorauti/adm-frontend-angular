import { IBaseResponse } from './response.interface';

export interface IDepartment {
  idDepartment: number;
  name: string;
  comment: string;
}

export interface IResponseDepartment extends IBaseResponse {
  data?: IDepartment;
}

export interface IResponseDepartmentList extends IBaseResponse {
  data?: IDepartment[];
}
