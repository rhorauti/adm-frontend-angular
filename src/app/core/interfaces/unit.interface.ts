import { IBaseResponse } from './response.interface';

export interface IUnit {
  idUnit: number | null;
  name: string;
  comment: string;
}

export interface IResponseUnit extends IBaseResponse {
  data?: IUnit | IUnit[];
}
