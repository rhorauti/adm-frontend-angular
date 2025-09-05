import { IBaseResponse } from './response.interface';

export interface IDepartment {
  idDepartment: number | null;
  name: string;
  comment: string;
}

export interface IResponseDepartment extends IBaseResponse {
  data?: IDepartment | IDepartment[];
}
