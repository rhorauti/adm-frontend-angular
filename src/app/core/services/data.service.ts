import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  emitEvent = new EventEmitter<any>();

  emitData(data: any) {
    this.emitEvent.emit(data);
  }
}
