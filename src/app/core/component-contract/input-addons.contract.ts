import { Injectable, Signal } from '@angular/core';

export interface IInputAddons {
  placeholder: string;
  inputValue: string;
}

@Injectable({
  providedIn: 'root',
})
export abstract class InputAddonsContract {
  abstract readonly inputAddons: Signal<IInputAddons>;

  abstract onSetInputValue(inputData: Event): void;
  abstract onTableFilter(keyValue: string): void;
}
