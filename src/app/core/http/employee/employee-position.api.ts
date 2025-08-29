import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import {
  IEmployeePosition,
  IEmployeePositionListResponse,
  IEmployeePositionResponse,
} from '@core/interfaces/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeePositionApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'employee-positions';

  async onGetDataList(): Promise<IEmployeePositionListResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetData(id: number): Promise<IEmployeePositionResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: IEmployeePosition): Promise<IEmployeePositionResponse> {
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
