import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { ICompanyRequest, IResponseCompany } from '@core/interfaces/company.interface';
import { IBaseResponse } from '@core/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyApi {
  private httpRequestService = inject(HttpRequestService);

  /**
   * Retrieve companies data list from database
   * @returns {Promise<IResponseCompany>} Promise of type IResponseCompany that contains companies data.
   */
  async getCompaniesList(): Promise<IResponseCompany> {
    return await this.httpRequestService.sendHttpRequest(`${environment.apiUrl}/companies`, 'GET');
  }

  /**
   * addNewCompany
   * Adiciona um novo registro no banco de dados.
   * @returns Promise com o status e mensagem.
   */
  async saveCompany(companyData: ICompanyRequest): Promise<IResponseCompany> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/companies`,
      'POST',
      companyData
    );
  }

  /**
   * deleteCompany
   * Delete one or more companies at once.
   * @param companiesData array of companies
   * @returns Promise with success or failure status and message.
   */
  async deleteCompany(idCompany: number): Promise<IBaseResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/companies/${idCompany}`,
      'DELETE'
    );
  }
}
