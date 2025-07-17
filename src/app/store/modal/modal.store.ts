import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalIconType } from '@components/modal/modal-info/modal-info.component';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const ModalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    info: {
      isActive: false,
      isActionOk: false,
      type: 'success' as ModalIconType,
      title: '',
      description: '',
    },
    ask: {
      isActive: false,
      isActionOk: false,
      type: '',
      title: '',
      description: '',
    },
  })),

  withMethods(store => {
    const router = inject(Router);
    const onShowInfoModal = (type: string, title: string, description: string): void => {
      patchState(store, {
        info: {
          ...store.info(),
          type: type as ModalIconType,
          isActive: true,
          title: title as string,
          description: description as string,
        },
      });
    };

    const onHideInfoModal = (path?: string): void => {
      patchState(store, {
        info: {
          ...store.info(),
          isActive: false,
        },
      });
      if (path) {
        router.navigate([path]);
      }
    };

    const onModalInfoActionOk = (isActionOk: boolean): void => {
      patchState(store, {
        info: {
          ...store.info(),
          isActionOk: isActionOk,
        },
      });
    };

    const onShowAskModal = (title?: string, description?: string): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActive: true,
          title: title as string,
          description: description as string,
        },
      });
    };

    const onHideAskModal = (): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActive: false,
        },
      });
    };

    const onModalAskActionOk = (isActionOk: boolean): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActionOk: isActionOk,
        },
      });
    };

    return {
      onShowInfoModal,
      onHideInfoModal,
      onModalInfoActionOk,
      onShowAskModal,
      onHideAskModal,
      onModalAskActionOk,
    };
  })
);
