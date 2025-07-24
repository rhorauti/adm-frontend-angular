import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { ThirdPartApi } from '@core/http/third-part/third-part.api';
import { IAddress } from '@core/interfaces/address.interface';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ModalStore } from '@store/modal/modal.store';

export const AddressStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    addressData: {
      idAddress: 0,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    } as IAddress,
  })),

  withComputed(store => {
    const isPostalCodeValid = computed(() => {
      return store.addressData().postalCode.length == 9;
    });

    return { isPostalCodeValid };
  }),

  withMethods(store => {
    const thirdPartApi = inject(ThirdPartApi);

    const onSetInputNewValue = (property: string, value: string | number): void => {
      patchState(store, {
        addressData: {
          ...store.addressData(),
          [property]: value,
        },
      });
    };

    const onSetAddressPropertiesValues = async (): Promise<void> => {
      const response = await thirdPartApi.getAddressFromCep(store.addressData().postalCode);
      if (response) {
        patchState(store, {
          addressData: {
            ...store.addressData(),
            address: response.logradouro,
            complement: response.complemento,
            district: response.bairro,
            city: response.localidade,
            state: response.uf,
          },
        });
      } else {
        return;
      }
    };

    const onClearData = (): void => {
      patchState(store, {
        addressData: {
          idAddress: 0,
          postalCode: '',
          address: '',
          number: '',
          complement: '',
          district: '',
          city: '',
          state: '',
        },
      });
    };

    return { onSetInputNewValue, onClearData, onSetAddressPropertiesValues };
  })
);
