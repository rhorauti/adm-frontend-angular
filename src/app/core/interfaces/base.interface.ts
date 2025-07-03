import { IAddress } from './address.interface';
import { ICompany } from './company.interface';
import { IEmployee } from './employee.interface';
import { IProject } from './project.interface';

export interface TableTypeObject {
  company: ICompany;
  address: IAddress;
  project: IProject;
  employee: IEmployee;
}

export type TableDataTypeString = 'company' | 'address' | 'project' | 'employee';
export type TableTypeNumber = 0 | 1 | 2;
export type TableItemType = ICompany | IAddress | IProject | IEmployee;
