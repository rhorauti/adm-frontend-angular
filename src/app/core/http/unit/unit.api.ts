import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import { IResponseUnit, IUnit } from '@core/interfaces/unit.interface';

@Injectable({
  providedIn: 'root',
})
export class UnitApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'units';

  async onGetDataList(): Promise<IResponseUnit> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetData(id: number): Promise<IResponseUnit> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: IUnit): Promise<IResponseUnit> {
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
