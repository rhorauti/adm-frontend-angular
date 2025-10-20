import { ModalType } from '@store/modal/modal.store';
import { ITableHeader } from './table.interface';
import { KeyOfData } from '@core/types/base.type';

export interface IModalInfo {
  isActive: boolean;
  title: string;
  description: string;
  type: ModalType;
  onActionOk: ActionCallback;
}

export interface IModalAsk {
  isActive: boolean;
  title: string;
  description: string;
  onActionOk: ActionCallback;
  onActionNok: ActionCallback;
}

export interface IModalCheck {
  isActive: boolean;
  isActionOk: boolean;
}

export interface IModalTable<T, R> {
  isModalActive: boolean;
  tableHeaders: ITableHeader<T>[];
  initialDataList: T[];
  breadcrumbList: string[];
  inputSearchFilterList: KeyOfData[];
  currentView: string;
  inputSearchPlaceholder: string;
  onShowDataList?: (...args: any[]) => Promise<R>;
}

export type ActionCallback = (() => void | Promise<void>) | null | undefined;
