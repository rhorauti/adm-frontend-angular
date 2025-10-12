import { IProduct } from './product.interface';
import { IBaseResponse } from './response.interface';

export interface IProductionLine {
  idProductionLine: number | null;
  lineCode: string;
  lineName?: string;
  toolingList?: Partial<IProduct>[] | null;
  comment?: string;
}

export interface IResponseProductionLine extends IBaseResponse {
  data?: IProductionLine | IProductionLine[];
}

export type PartialProductionLine = Pick<
  IProductionLine,
  'idProductionLine' | 'lineCode' | 'toolingList'
>;
