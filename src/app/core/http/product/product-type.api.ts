import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import { IProductType, IResponseProductType } from '@core/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'product-types';

  async onGetDataList(): Promise<IResponseProductType> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetData(id: number): Promise<IResponseProductType> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: IProductType): Promise<IResponseProductType> {
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
