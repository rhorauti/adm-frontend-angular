import { inject } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import {
  ICompany,
  IProduct,
  IResponseCompany,
  IResponseProduct,
} from '../interfaces/IRegister';
import { IResponseCommonMessage } from '../interfaces/ICommon';
import { environment } from '../../../../environments/environment';

export class RegisterCompanyApi {
  private httpRequestService = inject(HttpRequestService);

  /**
   * getRegisterCompanyList
   * Solicita uma lista de empresas para o backend
   * @returns Promise com o status, mensagem, e os dados de id, nome, email, cadastro, telefone, cnpj, e dados cadastrais.
   */
  async getRegisterCompanyList(
    registerType: string
  ): Promise<IResponseCompany> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${registerType}`
    );
  }

  /**
   * getRegisterProductsList
   * Solicita uma lista de empresas para o backend
   * @returns Promise com o status, mensagem, e os dados de id, nome, email, cadastro, telefone, cnpj, e dados cadastrais.
   */
  async getRegisterProductsList(
    registerType: string
  ): Promise<IResponseProduct> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${registerType}`
    );
  }

  /**
   * addNewCompany
   * Adiciona um novo registro no banco de dados.
   * @returns Promise com o status e mensagem.
   */
  async addNewCompany(
    companyData: ICompany,
    registerType: string
  ): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${registerType}`,
      'POST',
      companyData
    );
  }

  /**
   * updateCompany
   * Atualiza os dados da empresa.
   * @returns Promise com o status e mensagem.
   */
  async updateCompany(
    companyData: ICompany,
    registerType: string,
    companyId: number
  ): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${registerType}/${companyId.toString()}`,
      'PUT',
      companyData
    );
  }

  /**
   * updateProduct
   * Atualiza os dados do produto
   * @returns Promise com o status e mensagem.
   */
  async updateProduct(
    productData: IProduct,
    registerType: string,
    productId: number
  ): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${registerType}/${productId}`,
      'PUT',
      productData
    );
  }

  /**
   * deleteCompany
   * Deleta um registro do banco de dados.
   * @returns Promise com o status e mensagem.
   */
  async deleteRegister(
    registerType: string,
    registerTypeId: string
  ): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${registerType}/${registerTypeId}`,
      'DELETE'
    );
  }
}
