import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type ActionCallback = (() => void | Promise<void>) | null | undefined;
export type ModalType = 'success' | 'failure';

export const ModalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    info: {
      isActive: false,
      title: '',
      description: '',
      type: 'failure' as ModalType,
      onActionOk: null as ActionCallback,
    },
    ask: {
      isActive: false,
      title: '',
      description: '',
      onActionOk: null as ActionCallback,
      onActionNok: null as ActionCallback,
    },
    isLoading: false,
  })),

  withMethods(store => {
    const router = inject(Router);

    const onSetModalInfoType = (type: ModalType): void => {
      patchState(store, {
        info: {
          ...store.info(),
          type: type,
        },
      });
    };

    const onShowInfoModal = (
      title: string,
      description: string,
      onActionOk?: ActionCallback
    ): void => {
      patchState(store, {
        info: {
          ...store.info(),
          isActive: true,
          title: title,
          description: description,
          onActionOk: onActionOk,
        },
      });
    };

    const onCloseInfoModal = async (): Promise<void> => {
      const callback = store.info().onActionOk;
      if (callback) await Promise.resolve(callback());
      patchState(store, {
        info: {
          ...store.info(),
          isActive: false,
          onActionOk: null,
          type: 'failure',
        },
      });
      console.log('onCloseModalInfo', store.info());
    };

    const onShowAskModal = (
      title: string,
      description: string,
      onActionOk?: ActionCallback,
      onActionNok?: ActionCallback
    ): void => {
      patchState(store, {
        ask: {
          ...store.ask(),
          isActive: true,
          title: title,
          description: description,
          onActionOk: onActionOk,
          onActionNok: onActionNok,
        },
      });
    };

    const onCloseAskModalAction = async (isConfirmed: boolean): Promise<void> => {
      const callback = isConfirmed ? store.ask().onActionOk : store.ask().onActionNok;
      if (callback) {
        await Promise.resolve(callback());
        patchState(store, {
          info: {
            ...store.info(),
            type: 'success',
          },
        });
      }
      patchState(store, {
        ask: {
          ...store.ask(),
          isActive: false,
          onActionOk: null,
          onActionNok: null,
        },
      });
    };

    const onRedirectPage = (path: string): void => {
      router.navigate([path]);
    };

    const onLoading = (isLoading: boolean): void => {
      patchState(store, {
        isLoading: isLoading,
      });
    };

    return {
      onShowInfoModal,
      onCloseInfoModal,
      onShowAskModal,
      onSetModalInfoType,
      onCloseAskModalAction,
      onRedirectPage,
      onLoading,
    };
  })
);
