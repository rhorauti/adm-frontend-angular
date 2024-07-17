import { InjectionToken } from '@angular/core';

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
