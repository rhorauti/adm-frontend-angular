import { IBaseResponse } from './response.interface';
import { PartialUnit } from './unit.interface';

export interface IProductType {
  idProductType: number | null;
  name?: string;
  comment?: string;
}

export interface IProductHome {
  idProduct: number | null;
  internalPartNumber?: string;
  customerPartNumber?: string;
  name?: string;
  nameTranslated?: string;
  origin?: string;
  unit?: string;
  stock?: number;
}

export interface IProductForm {
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
  unitList?: PartialUnit[];
  unit: PartialUnit;
  productTypeList?: PartialProductType[];
  productType: PartialProductType;
}

export interface IResponseProductType extends IBaseResponse {
  data?: IProductType | IProductType[];
}

export interface IResponseProductHome extends IBaseResponse {
  data?: IProductHome | IProductHome[];
}

export interface IResponseProductForm extends IBaseResponse {
  data?: IProductForm | IProductForm[];
}

export type PartialProduct = Pick<
  IProductForm,
  'idProduct' | 'internalPartNumber' | 'name' | 'productType'
>;

export type PartialProductType = Pick<IProductType, 'idProductType' | 'name'>;
