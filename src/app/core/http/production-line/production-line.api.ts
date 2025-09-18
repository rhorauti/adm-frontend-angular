import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import {
  IProductionLine,
  IResponseProductionLine,
} from '@core/interfaces/production-line.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductionLineApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'production-lines';

  async onGetDataList(): Promise<IResponseProductionLine> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetData(id: number): Promise<IResponseProductionLine> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: IProductionLine): Promise<IResponseProductionLine> {
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
