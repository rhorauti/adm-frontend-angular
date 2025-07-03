import { Injectable, Signal } from '@angular/core';
import { ITab } from '@core/interfaces/tab.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class TabContract {
  abstract readonly tab: Signal<ITab>;

  abstract onChangeTabIdx(idx: number): void;
}
