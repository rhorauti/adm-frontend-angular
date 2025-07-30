import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const ModalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    info: {
      isActive: false,
      isActionOk: false,
      title: '',
      description: '',
    },
    ask: {
      isActive: false,
      isActionOk: false,
      title: '',
      description: '',
    },
  })),

  withMethods(store => {
    const router = inject(Router);
    const onShowInfoModal = (title: string, description: string): void => {
      patchState(store, {
        info: {
          ...store.info(),
          isActive: true,
          title: title as string,
          description: description as string,
        },
      });
    };

    const onCloseInfoModal = (onActionOk?: () => void, onActionNok?: () => void): void => {
      patchState(store, {
        info: {
          ...store.info(),
          isActive: false,
        },
      });
      if (store.info().isActionOk) {
        if (onActionOk) onActionOk();
      } else {
        if (onActionNok) onActionNok();
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

    const onCloseAskModalActionOk = (onActionOk?: () => void): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActionOk: true,
          isActive: false,
        },
      });
      if (store.ask().isActionOk) {
        if (onActionOk) onActionOk();
      }
    };

    const onCloseAskModalActionNok = (onActionNok?: () => void): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActive: false,
        },
      });
      if (!store.ask().isActionOk) {
        if (onActionNok) onActionNok();
      }
    };

    const onModalAskActionOk = (isActionOk: boolean): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActionOk: isActionOk,
        },
      });
    };

    const onRedirectPage = (path: string): void => {
      router.navigate([path]);
    };

    return {
      onShowInfoModal,
      onCloseInfoModal,
      onModalInfoActionOk,
      onShowAskModal,
      onCloseAskModalActionOk,
      onCloseAskModalActionNok,
      onModalAskActionOk,
      onRedirectPage,
    };
  })
);
