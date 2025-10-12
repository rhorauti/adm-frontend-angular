import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import { IResponseTaskForm, IResponseTaskHome } from '@core/interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'tasks';

  async onGetDataList(department: string): Promise<IResponseTaskHome> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${department}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetDataById(department: string, idTask: number): Promise<IResponseTaskForm> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${department}/${this.baseApiName}/${idTask}`,
      'GET'
    );
  }

  async onSave(department: string, data: FormData): Promise<IResponseTaskForm> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${department}/${this.baseApiName}`,
      'POST',
      data
    );
  }

  async onDelete(department: string, idTask: number): Promise<IBaseResponse> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${department}/${this.baseApiName}/${idTask}`,
      'DELETE'
    );
  }
}
