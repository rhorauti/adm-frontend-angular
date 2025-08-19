import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { AddressApi } from '@core/http/address/address.api';
import { ThirdPartApi } from '@core/http/third-part/third-part.api';
import { IAddress } from '@core/interfaces/address.interface';
import { MaybeMergeValue } from '@core/types/base.type';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ModalStore } from '@store/modal/modal.store';

interface AddressState {
  addressData: IAddress;
}

export const AddressStore = signalStore(
  { providedIn: 'root' },
  withState<AddressState>(() => ({
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

    const isPlainObject = (v: unknown): v is Record<string, unknown> =>
      v !== null && typeof v == 'object' && !Array.isArray(v);

    const onSetSlicePropsToNewValue = <K extends keyof AddressState>(
      sliceKey: K,
      value: MaybeMergeValue<AddressState, K>
    ): void => {
      const current = store[sliceKey]();

      const next: AddressState[K] =
        isPlainObject(current) && isPlainObject(value)
          ? ({
              ...current,
              ...(value as Record<string, unknown>),
            } as AddressState[K])
          : (value as AddressState[K]);

      patchState(store, { [sliceKey]: next } as Partial<AddressState>);
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
        modalStore.onLoading(true);
        const address = await addressApi.onGetCompanyAddress(idCompany);
        if (address.data) {
          onSetSlicePropsToNewValue('addressData', address.data);
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
      } finally {
        modalStore.onLoading(false);
      }
    };

    return {
      onSetSlicePropsToNewValue,
      onClearData,
      onSetAddressViaCEPValues,
      onGetAddressInfo,
    };
  })
);
