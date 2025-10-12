import { ModalType } from '@store/modal/modal.store';

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

export type ActionCallback = (() => void | Promise<void>) | null | undefined;
