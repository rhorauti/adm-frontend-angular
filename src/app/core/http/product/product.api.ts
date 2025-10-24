import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IBaseResponse } from '@core/interfaces/response.interface';
import {
  IProductHome,
  IResponseProductForm,
  IResponseProductHome,
} from '@core/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'products';

  async onGetDataList(): Promise<IResponseProductHome> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}`,
      'GET'
    );
  }

  async onGetDataListByProductType<K extends keyof IProductHome>(
    key: K,
    value: IProductHome[K]
  ): Promise<IResponseProductHome> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}?${key}=${value}`,
      'GET'
    );
  }

  async onGetData(id: number): Promise<IResponseProductForm> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${id}`,
      'GET'
    );
  }

  async onSave(data: FormData): Promise<IResponseProductForm> {
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
