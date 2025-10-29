import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import { IResponseTaskType, ITaskType } from '@core/interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskTypeApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'task-types';

  async onGetDataList(idDepartment: number): Promise<IResponseTaskType> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idDepartment}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetDataById(idDepartment: number, idTask: number): Promise<IResponseTaskType> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idDepartment}/${this.baseApiName}/${idTask}`,
      'GET'
    );
  }

  async onSave(idDepartment: number, data: ITaskType): Promise<IResponseTaskType> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idDepartment}/${this.baseApiName}`,
      'POST',
      data
    );
  }

  async onDelete(idDepartment: number, idTask: number): Promise<IBaseResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${idDepartment}/${this.baseApiName}/${idTask}`,
      'DELETE'
    );
  }
}
