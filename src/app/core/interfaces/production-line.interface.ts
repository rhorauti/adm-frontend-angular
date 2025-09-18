import { IBaseResponse } from './response.interface';

export interface IProductionLine {
  idProductionLine: number | null;
  lineCode: string;
  lineName?: string;
  toolingList?: string[];
  comment?: string;
}

export interface IResponseProductionLine extends IBaseResponse {
  data?: IProductionLine | IProductionLine[];
}
