export interface ICompany {
  id: number;
  cadastro: Date;
  nome: string;
  email: string;
  telefone: string;
  isCnpj: boolean;
  cnpj: string;
  logradouro: string;
  numero: number;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface IResponseCompany {
  date: string;
  status: boolean;
  message: string;
  data: ICompany[];
}

export interface IProduct {
  id: number;
  cadastro: string;
  nome: string;
  cc: string;
  ncm: string;
  unidade: string;
  preco: string;
  fileName: string;
  comentario: string;
}

export interface IResponseProduct {
  date: string;
  status: boolean;
  message: string;
  data: IProduct[];
}
