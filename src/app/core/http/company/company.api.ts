import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import {
  ICompanyDetailedDataResponse,
  ICompanyDetail,
  ICompanyResponse,
} from '@core/interfaces/company.interface';
import { IBaseResponse } from '@core/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'companies';

  async onGetDataList(): Promise<ICompanyResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetDataDetailedInfo(id: number): Promise<ICompanyDetailedDataResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/detail/${id}`,
      'GET'
    );
  }

  async onGetDataInfo(id: number): Promise<ICompanyResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: ICompanyDetail): Promise<ICompanyResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'POST',
      data
    );
  }

  async onDelete(id: number): Promise<IBaseResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'DELETE'
    );
  }
}
