import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import {
  IEmployeePosition,
  IResponseEmployeePosition,
  IResponseEmployeePositionList,
} from '@core/interfaces/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeePositionApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'employee-positions';

  async onGetDataList(): Promise<IResponseEmployeePositionList> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetDataInfo(idEmployee: number): Promise<IResponseEmployeePosition> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${idEmployee}`,
      'GET'
    );
  }

  async onSave(data: IEmployeePosition): Promise<IResponseEmployeePosition> {
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
