import { IAddress } from '@core/interfaces/address.interface';
import { IBaseRegisterStore } from '@core/interfaces/base.register.interface';
import { ICompany, ICompanyDetail } from '@core/interfaces/company.interface';
import { IDepartment } from '@core/interfaces/department.interface';
import { IEmployee, IEmployeePosition } from '@core/interfaces/employee.interface';

export type StoreType = IBaseRegisterStore<DataType>;

/**
 * Types of data used in register pages.
 */
export type DataType =
  | ICompany
  | ICompanyDetail
  | IAddress
  | IEmployee
  | IEmployeePosition
  | IDepartment;
export type MergedDataType = ICompany & IAddress & IEmployee & IEmployeePosition & IDepartment;

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
