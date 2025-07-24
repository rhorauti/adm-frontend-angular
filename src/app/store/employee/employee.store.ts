import { IEmployee } from '@core/interfaces/employee.interface';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

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
    const onSetInputNewValue = (property: string, value: string | number): void => {
      patchState(store, {
        employeeData: {
          ...store.employeeData(),
          [property]: value,
        },
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

    return { onSetInputNewValue, onClearData };
  })
);
