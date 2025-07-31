import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { AddressApi } from '@core/http/address/address.api';
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
    const modalStore = inject(ModalStore);
    const addressApi = inject(AddressApi);

    const onSetInputNewValue = (property: keyof IAddress, value: string | number): void => {
      patchState(store, {
        addressData: {
          ...store.addressData(),
          [property]: value,
        },
      });
    };

    const onSetAddressValue = (address: IAddress): void => {
      patchState(store, {
        addressData: address,
      });
    };

    const onSetAddressViaCEPValues = async (): Promise<void> => {
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

    const onGetAddressInfo = async (idCompany: number): Promise<void> => {
      try {
        const address = await addressApi.onGetCompanyAddress(idCompany);
        if (address.data) {
          onSetAddressValue(address.data);
        } else {
          return;
        }
      } catch (e: unknown) {
        const error = e as HttpErrorResponse;
        console.log('Erro ao trazer as informações de endereço' + error.message);
        modalStore.onShowInfoModal(
          'Formulário de cadastro',
          'Erro ao trazer as informações de endereço.'
        );
      }
    };

    return {
      onSetInputNewValue,
      onClearData,
      onSetAddressViaCEPValues,
      onSetAddressValue,
      onGetAddressInfo,
    };
  })
);
