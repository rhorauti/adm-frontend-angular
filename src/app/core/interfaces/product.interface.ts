import { IBaseResponse } from './response.interface';
import { IUnit } from './unit.interface';

export interface IProductType {
  idProductType: number | null;
  name: string;
  comment: string;
}

export interface IProduct {
  idProduct: number | null;
  internalPartNumber?: string;
  customerPartNumber?: string;
  name: string;
  nameTranslated?: string;
  origin: number;
  ncm?: string;
  icms?: number;
  pis?: number;
  cofins?: number;
  ipi?: number;
  purchasingCurrency?: string;
  purchasingUnitPrice?: number;
  salesCurrency?: string;
  salesUnitPrice?: number;
  materialSpec: string;
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  qrcode?: string;
  photoUrl?: string;
  comment?: string;
  unit: IUnit;
  productType: IProductType;
}

export interface IResponseProductType extends IBaseResponse {
  data?: IProductType | IProductType[];
}

export interface IResponseProduct extends IBaseResponse {
  data?: IProduct | IProduct[];
}
