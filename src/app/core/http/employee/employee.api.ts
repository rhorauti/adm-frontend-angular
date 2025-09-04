import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { IEmployee, IResponseEmployee } from '@core/interfaces/employee.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'employees';

  async onGetData(idCompany: number): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${idCompany}`,
      'GET'
    );
  }

  async onGetDataList(): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onSave(data: IEmployee): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'POST',
      data
    );
  }

  async onDelete(id: number): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'DELETE'
    );
  }
}
