import { IAddress } from '@core/interfaces/address.interface';
import { IBaseRegisterStore } from '@core/interfaces/base.register.interface';
import { ICompany, ICompanyDetail } from '@core/interfaces/company.interface';
import { IDepartment } from '@core/interfaces/department.interface';
import { IEmployee, IEmployeePosition } from '@core/interfaces/employee.interface';
import { ITaskType } from '@core/interfaces/task.interface';

export type StoreType = IBaseRegisterStore<BaseType>;

/**
 * Types of data used in register pages.
 */
export type BaseType =
  | ICompany
  | ICompanyDetail
  | IAddress
  | IEmployee
  | IEmployeePosition
  | ITaskType
  | IDepartment;

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I
) => void
  ? I
  : never;

export type MergedDataType = UnionToIntersection<BaseType>;

export type BaseApiName =
  | 'companies'
  | 'addresses'
  | 'departments'
  | 'employees'
  | 'employee-positions'
  | 'task-types';

/**
 * Type to be used in value inside a method patch() provided by NgRx.
 */
export type MaybeMergeValue<S, K extends keyof S> = S[K] extends object
  ? S[K] extends readonly any[]
    ? S[K]
    : Partial<S[K]> | S[K]
  : S[K];

/**
 * Type to be used to choose some fields for inputSearchFilter.
 */
export type KeyOfData = Extract<keyof MergedDataType, string>;
