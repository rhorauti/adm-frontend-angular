import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

type UserField = 'name' | 'email' | 'password' | 'confirmPassword';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    user: {
      id: 0,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      photoUrl: '',
    },
    isMenuBarActive: false,
    token: '',
    isLoading: false,
  })),

  withComputed(store => {
    const isPasswordLetterQtyOk = computed(() => {
      return store.user().password.length > 5;
    });

    const isPasswordUpperCaseLetterOk = computed(() => {
      return /[A-Z]/g.test(store.user().password);
    });

    const isPasswordSymbolOk = computed(() => {
      return /[^0-9A-Za-z]/g.test(store.user().password);
    });

    const isPasswordNumberOk = computed(() => {
      return /[0-9]/g.test(store.user().password);
    });

    const isNameOk = computed(() => {
      return store.user().name.length > 2;
    });

    const isEmailOk = computed(() => {
      return (
        store.user().email.length > 0 &&
        /\.com/gi.test(store.user().email) &&
        /@/gi.test(store.user().email)
      );
    });

    const isConfirmPasswordOk = computed(() => {
      return (
        store.user().confirmPassword.length > 0 &&
        store.user().password == store.user().confirmPassword
      );
    });

    const isPasswordOk = computed(() => {
      return (
        isPasswordLetterQtyOk() &&
        isPasswordUpperCaseLetterOk() &&
        isPasswordSymbolOk() &&
        isPasswordNumberOk()
      );
    });

    const isFormOk = computed(() => {
      return isNameOk() && isEmailOk() && isPasswordOk() && isConfirmPasswordOk();
    });

    return {
      isPasswordLetterQtyOk,
      isPasswordUpperCaseLetterOk,
      isPasswordSymbolOk,
      isPasswordNumberOk,
      isNameOk,
      isEmailOk,
      isConfirmPasswordOk,
      isPasswordOk,
      isFormOk,
    };
  }),

  withMethods(store => {
    const router = inject(Router);

    const onShowMenuBar = (isMenuBarActive: boolean): void => {
      patchState(store, {
        isMenuBarActive: isMenuBarActive,
      });
    };

    const onSetUserProperty = (property: string, value: string | number): void => {
      patchState(store, {
        user: {
          ...store.user(),
          [property]: value,
        },
      });
    };

    const onGetToken = (token: string): void => {
      patchState(store, {
        token: token,
      });
    };

    const onClearLoginData = (): void => {
      patchState(store, {
        user: {
          ...store.user(),
          id: 0,
          email: '',
          password: '',
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

    const helpAndBorderColor = (property: string, isInput = true) => {
      return computed(() => {
        const isInputLengthOk = store.user()[property as UserField].length > 0;
        const computedPropName = `is${property.charAt(0).toUpperCase() + property.slice(1)}Ok`;
        const isInputValidationOk = store[computedPropName as keyof typeof store]();
        console.log('isInputValidationOk', computedPropName, isInputValidationOk);
        if (isInput) {
          return isInputLengthOk && !isInputValidationOk ? 'failure' : 'success';
        } else {
          return isInputLengthOk && !isInputValidationOk ? 'failure' : 'success';
        }
      });
    };

    const passwordHelpColor = (validationName: string) => {
      return computed(() => {
        const isInputLengthOk = store.user().password.length > 0;
        const isValidationNameOk = store[validationName as keyof typeof store]();
        return isInputLengthOk && !isValidationNameOk ? 'failure' : 'success';
      });
    };

    return {
      onShowMenuBar,
      onGetToken,
      onClearLoginData,
      onRedirectPage,
      onLoading,
      onSetUserProperty,
      helpAndBorderColor,
      passwordHelpColor,
    };
  })
);
