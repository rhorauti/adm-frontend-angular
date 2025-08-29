import { BaseType } from '@core/types/base.type';

export interface IBaseResponse {
  error?: {
    date: string;
    status: boolean;
    message: string;
  };
  date?: string;
  status?: boolean;
  message: string;
}

export interface IDefaultResponseWithData extends IBaseResponse {
  data: BaseType;
}

export interface IDefaultResponseWithDataList extends IBaseResponse {
  data: BaseType[];
}
