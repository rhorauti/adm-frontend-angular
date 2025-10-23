import { IBaseResponse } from './response.interface';

export interface IDepartment {
  idDepartment: number | null;
  name: string;
  comment: string;
}

export type PartialDept = Pick<IDepartment, 'idDepartment' | 'name'>;

export interface IResponseDepartment extends IBaseResponse {
  data?: IDepartment | IDepartment[];
}
