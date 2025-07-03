export interface IAddress {
  idAddress: number;
  nickname: string;
  isDelivery: number;
  isBilling: number;
  postalCode: string;
  address: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  idCompany: number;
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
