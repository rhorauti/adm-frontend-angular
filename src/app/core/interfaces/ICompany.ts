export interface ICompany {
  idCompany: number;
  type: number;
  date: string;
  nickname: string;
  name: string;
  cnpj: string;
}

export interface IResponseCompany {
  date: string;
  status: boolean;
  message: string;
  data: ICompany[];
}
