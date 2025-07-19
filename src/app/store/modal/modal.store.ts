import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthStore } from '@store/auth/auth.store';

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
    const authStore = inject(AuthStore);
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

    const onHideInfoModal = (path?: string): void => {
      patchState(store, {
        info: {
          ...store.info(),
          isActive: false,
        },
      });
      if (path && store.info().isActionOk) {
        if (authStore.isAuthPage()) {
          authStore.onShowAuthPage(false);
          authStore.onShowMenuBar(true);
          router.navigate([path]);
        } else {
          router.navigate([path]);
        }
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

    const onRedirectPage = (path: string): void => {
      authStore.onClearAllData();
      router.navigate([path]);
    };

    return {
      onShowInfoModal,
      onHideInfoModal,
      onModalInfoActionOk,
      onShowAskModal,
      onHideAskModal,
      onModalAskActionOk,
      onRedirectPage,
    };
  })
);
