export interface ICompany {
  idCompany: number;
  type: number;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface IModalCheck {
  isActive: boolean;
  isActionOk: boolean;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}
