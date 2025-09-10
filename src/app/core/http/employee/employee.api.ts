import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { IResponseEmployee } from '@core/interfaces/employee.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'employees';

  async onGetData(idCompany: number, idEmployee: number): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idCompany}/${this.baseApiName}/${idEmployee}`,
      'GET'
    );
  }

  async onGetDataList(idCompany: number): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idCompany}/${this.baseApiName}`,
      'GET'
    );
  }

  async onSave(idCompany: number, data: FormData): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idCompany}/${this.baseApiName}`,
      'POST',
      data
    );
  }

  async onDelete(idCompany: number, idEmployee: number): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idCompany}/${this.baseApiName}/${idEmployee}`,
      'DELETE'
    );
  }
}
