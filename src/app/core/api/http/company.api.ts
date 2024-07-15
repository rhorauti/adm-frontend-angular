import { inject } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IResponseCommonMessage } from '@core/interfaces/ICommonMessage';
import { ICompany, IResponseCompany } from '@core/interfaces/ICompany';

export class RegisterCompanyApi {
  private httpRequestService = inject(HttpRequestService);

  /**
   * getRegisterCompanyList
   * Solicita uma lista de empresas para o backend
   * @returns Promise com o status, mensagem, e os dados de id, nome, email, cadastro, telefone, cnpj, e dados cadastrais.
   */
  async getCompaniesList(type: number): Promise<IResponseCompany> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/company/${type}`,
      'GET'
    );
  }

  /**
   * addNewCompany
   * Adiciona um novo registro no banco de dados.
   * @returns Promise com o status e mensagem.
   */
  async addNewCompany(companyData: ICompany): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/company`,
      'POST',
      companyData
    );
  }

  /**
   * updateCompany
   * Atualiza os dados da empresa.
   * @returns Promise com o status e mensagem.
   */
  async updateCompany(companyData: ICompany, companyId: number): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/company/${companyId.toString()}`,
      'PUT',
      companyData
    );
  }

  /**
   * deleteCompany
   * Deleta um registro do banco de dados.
   * @returns Promise com o status e mensagem.
   */
  async deleteRegister(companyId: number): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/company/${companyId}`,
      'DELETE'
    );
  }
}
