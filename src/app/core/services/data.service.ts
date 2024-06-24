import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataService = new EventEmitter<any>();

  emitData(data: any) {
    this.dataService.emit(data);
  }
}
