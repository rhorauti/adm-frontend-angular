import { Injectable, Signal } from '@angular/core';
import { ILoading } from '@core/interfaces/loading.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class LoadingContract {
  abstract readonly loading: Signal<ILoading>;
}
