import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { IEmployee } from '@core/interfaces/employee.interface';
import { MaybeMergeValue } from '@core/types/base.type';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ModalStore } from '@store/modal/modal.store';

interface EmployeeState {
  employeeData: IEmployee;
}

export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  withState<EmployeeState>(() => ({
    employeeData: {
      isDefault: false,
      idEmployee: 0,
      name: '',
      department: '',
      position: '',
      email: '',
      deskphone: '',
      cellphone: '',
      photoUrl: '',
    },
  })),

  withMethods(store => {
    const modalStore = inject(ModalStore);
    const employeeApi = inject(EmployeeApi);

    const isPlainObject = (v: unknown): v is Record<string, unknown> =>
      v !== null && typeof v == 'object' && !Array.isArray(v);

    const onSetSlicePropsToNewValue = <K extends keyof EmployeeState>(
      sliceKey: K,
      value: MaybeMergeValue<EmployeeState, K>
    ): void => {
      const current = store[sliceKey]();

      const next: EmployeeState[K] =
        isPlainObject(current) && isPlainObject(value)
          ? ({
              ...current,
              ...(value as Record<string, unknown>),
            } as EmployeeState[K])
          : (value as EmployeeState[K]);

      patchState(store, { [sliceKey]: next } as Partial<EmployeeState>);
    };

    const onClearData = (): void => {
      patchState(store, {
        employeeData: {
          isDefault: false,
          idEmployee: 0,
          name: '',
          department: '',
          position: '',
          email: '',
          deskphone: '',
          cellphone: '',
          photoUrl: '',
        },
      });
    };

    const onGetEmployeeInfo = async (idCompany: number): Promise<void> => {
      try {
        modalStore.onLoading(true);
        const employee = await employeeApi.onGetCompanyEmployee(idCompany);
        if (employee.data) {
          onSetSlicePropsToNewValue('employeeData', employee.data);
        } else {
          return;
        }
      } catch (e: unknown) {
        const error = e as HttpErrorResponse;
        console.log('Erro ao trazer as informações de contato' + error.error.message);
        modalStore.onShowInfoModal(
          'Formulário de cadastro',
          'Erro ao trazer as informações do contato.'
        );
      } finally {
        modalStore.onLoading(false);
      }
    };

    return { onSetSlicePropsToNewValue, onClearData, onGetEmployeeInfo };
  })
);
