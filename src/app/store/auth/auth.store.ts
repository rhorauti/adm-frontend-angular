import { computed } from '@angular/core';
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
    errors: {
      showNameError: false,
      showEmailError: false,
      showPasswordError: false,
      showConfirmPasswordError: false,
    },
    isMenuBarActive: true,
    token: '',
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
        store.user().password.length > 0 &&
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

    const onSetErrorProperty = (property: string, value: boolean): void => {
      const computedErrorProperty = `show${property.charAt(0).toUpperCase() + property.slice(1)}Error`;
      patchState(store, {
        errors: {
          ...store.errors(),
          [computedErrorProperty]: value,
        },
      });
    };

    const onGetToken = (token: string): void => {
      patchState(store, {
        token: token,
      });
    };

    const onClearAllData = (): void => {
      patchState(store, {
        user: {
          ...store.user(),
          id: 0,
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          photoUrl: '',
        },
        errors: {
          ...store.errors(),
          showNameError: false,
          showEmailError: false,
          showPasswordError: false,
          showConfirmPasswordError: false,
        },
      });
    };

    type ValidationKey = `is${Capitalize<UserField>}Ok`;
    type ErrorKey = `show${Capitalize<UserField>}Error`;

    const helpAndBorderColor = (property: string) => {
      return computed(() => {
        const computedValidationName = `is${property.charAt(0).toUpperCase() + property.slice(1)}Ok`;
        const computedErrorName = `show${property.charAt(0).toUpperCase() + property.slice(1)}Error`;
        const propertyField = store.user()[property as UserField];
        const isInputValidationOk = store[computedValidationName as ValidationKey]();
        const isInputErrorTrue = store.errors()[computedErrorName as ErrorKey];
        return !isInputErrorTrue && propertyField.length == 0
          ? 'initial'
          : !isInputValidationOk
            ? 'failure'
            : 'success';
      });
    };

    const passwordHelpColor = (validationName: string) => {
      return computed(() => {
        const isValidationNameOk = store[validationName as keyof typeof store]();
        return !store.errors().showPasswordError && store.user().password.length == 0
          ? 'initial'
          : !isValidationNameOk
            ? 'failure'
            : 'success';
      });
    };

    return {
      onShowMenuBar,
      onGetToken,
      onClearAllData,
      onSetUserProperty,
      helpAndBorderColor,
      passwordHelpColor,
      onSetErrorProperty,
    };
  })
);
