import { InjectionToken, Signal } from '@angular/core';
import { IBaseGroup } from '@core/interfaces/base.interface';

export const WINDOW = new InjectionToken<Window>('Global window object', {
  factory: () => window,
});

export const formatarData = (dataInformada: string) => {
  if (dataInformada != null) {
    return Intl.DateTimeFormat('pt-br').format(new Date(dataInformada));
  } else {
    return '-';
  }
};

/**
 * changeSelectPlaceHolder
 * Get select value from app-input-addons component and change placeholder
 * @param value string. Value received from app-input-addons component
 */
export const changeSelectPlaceHolder = (baseGroup: Signal<IBaseGroup>, value: string) => {
  baseGroup().placeholderFilter = `Digite um(a) ${value}`;
  baseGroup().selectValueFilter = value;
};
