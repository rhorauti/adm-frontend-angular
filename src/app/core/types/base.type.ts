import { IAddress } from '@core/interfaces/address.interface';
import { IBaseRegisterStore } from '@core/interfaces/base.register.interface';
import { ICompany } from '@core/interfaces/company.interface';
import { IDepartment } from '@core/interfaces/department.interface';
import { IEmployee } from '@core/interfaces/employee.interface';
import { WritableStateSource } from '@ngrx/signals';

export type StoreType = IBaseRegisterStore<DataType>;

/**
 * Types of data used in register pages.
 */
export type DataType = ICompany | IAddress | IEmployee | IDepartment;
export type MergedDataType = ICompany & IAddress & IEmployee & IDepartment;

/**
 * Type of properties in WithState.
 */
export type StoreRead<S extends object> = { [K in keyof S]: () => S[K] };

/**
 * Type of properties in WithMethods.
 */
export type StoreSlice<S extends object> = WritableStateSource<S>;

/**
 * Type of both WithState & WithMethods.
 */
export type StoreApi<S extends object> = StoreRead<S> & StoreSlice<S>;

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
