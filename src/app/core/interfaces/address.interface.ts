import { IBaseResponse } from './response.interface';

export interface IAddress {
  idAddress: number | null;
  postalCode: string;
  address: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
}

export interface IResponseAddress extends IBaseResponse {
  data: IAddress;
}

export interface IResponseViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
