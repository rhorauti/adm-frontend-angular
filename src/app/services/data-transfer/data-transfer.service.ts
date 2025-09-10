import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataTransferService<T> {
  data: T | undefined;

  getData = () => {
    return this.data;
  };

  setData = (newData: T) => {
    this.data = newData;
  };

  /**
   * Pushes a new item into the data property, but only if data is an array.
   * The type of the item must match the element type of the array.
   */
  pushItemToArray = (item: T extends (infer E)[] ? E : never): void => {
    if (Array.isArray(this.data)) {
      this.data.push(item as unknown);
    }
  };

  clearData = (): void => {
    this.data = undefined;
  };
}
