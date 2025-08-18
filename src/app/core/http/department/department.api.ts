import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import {
  IDepartment,
  IResponseDepartment,
  IResponseDepartmentList,
} from '@core/interfaces/department.interface';
import { IBaseResponse } from '@core/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentApi {
  private httpRequestService = inject(HttpRequestService);

  async onGetDepartmentList(): Promise<IResponseDepartmentList> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/departments`,
      'GET'
    );
  }

  async onGetDepartment(idEmployee: number): Promise<IResponseDepartment> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/departments/${idEmployee}`,
      'GET'
    );
  }

  async onSaveDepartment(departmentData: IDepartment): Promise<IResponseDepartment> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/departments`,
      'POST',
      departmentData
    );
  }

  async deleteDepartment(idDepartment: number): Promise<IBaseResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/departments/${idDepartment}`,
      'DELETE'
    );
  }
}
