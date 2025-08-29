import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import {
  IDepartment,
  IResponseDepartment,
  IResponseDepartmentList,
} from '@core/interfaces/department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'departments';

  async onGetDataList(): Promise<IResponseDepartmentList> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetData(id: number): Promise<IResponseDepartment> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: IDepartment): Promise<IResponseDepartment> {
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
