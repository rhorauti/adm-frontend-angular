import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { IEmployee } from '@core/interfaces/employee.interface';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ModalStore } from '@store/modal/modal.store';

export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    employeeData: {
      isDefault: false,
      idEmployee: 0,
      name: '',
      department: '',
      position: '',
      email: '',
      deskphone: '',
      cellphone: '',
    } as IEmployee,
  })),

  withMethods(store => {
    const modalStore = inject(ModalStore);
    const employeeApi = inject(EmployeeApi);

    const onSetFormInputNewValue = (property: keyof IEmployee, value: string | number): void => {
      patchState(store, {
        employeeData: {
          ...store.employeeData(),
          [property]: value,
        },
      });
    };

    const onSetEmployeeValue = (employee: IEmployee): void => {
      patchState(store, {
        employeeData: { ...employee },
      });
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
        },
      });
    };

    const onGetEmployeeInfo = async (idCompany: number): Promise<void> => {
      try {
        modalStore.onLoading(true);
        const employee = await employeeApi.onGetCompanyEmployee(idCompany);
        if (employee.data) {
          onSetEmployeeValue(employee.data);
        } else {
          return;
        }
      } catch (e: unknown) {
        const error = e as HttpErrorResponse;
        console.log('Erro ao trazer as informações de contato' + error.message);
        modalStore.onShowInfoModal(
          'Formulário de cadastro',
          'Erro ao trazer as informações do contato.'
        );
      } finally {
        modalStore.onLoading(false);
      }
    };

    return { onSetFormInputNewValue, onClearData, onSetEmployeeValue, onGetEmployeeInfo };
  })
);
