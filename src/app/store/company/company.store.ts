// import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
// import {
//   ICompany,
//   ICompanyStore,
//   IFilterBoxCompany,
//   IFilterHelpCompany,
// } from '@core/interfaces/company.interface';
// import { computed, inject } from '@angular/core';
// import { ITableCheckbox, ITableHeader } from '@core/interfaces/table.interface';
// import { IPagination } from '@core/interfaces/pagination.interface';
// import { ModalStore } from '@store/modal/modal.store';
// import { CompanyApi } from '@core/http/company/company.api';
// import { HttpErrorResponse } from '@angular/common/http';
// import { AddressStore } from '@store/address/address.store';
// import { EmployeeStore } from '@store/employee/employee.store';
// import { IAddress } from '@core/interfaces/address.interface';
// import { IEmployee } from '@core/interfaces/employee.interface';
// import { ActionCallback } from '@core/interfaces/modal.interface';
// import { BaseRegisterStore } from '@store/base/base.register.store';

// const defaultTableHeaderIcon = 'unfold_more';

// export const CompanyStore = signalStore(
//   { providedIn: 'root' },

//   withState(
//     () =>
//       ({
//         inputSearchValue: '',
//         isTableHeaderBoxActive: false,
//         tableHeaders: [
//           {
//             id: 0,
//             isHeaderActive: true,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'Id',
//             databaseField: 'idCompany',
//           },
//           {
//             id: 1,
//             isHeaderActive: true,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'Nome Fantasia',
//             databaseField: 'nickname',
//           },
//           {
//             id: 2,
//             isHeaderActive: true,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'Razão Social',
//             databaseField: 'name',
//           },
//           {
//             id: 3,
//             isHeaderActive: true,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'CNPJ/CPF',
//             databaseField: 'cnpj',
//           },
//           {
//             id: 4,
//             isHeaderActive: false,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'Inscr. Estadual',
//             databaseField: 'ie',
//           },
//           {
//             id: 5,
//             isHeaderActive: false,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'Inscr. Municipal',
//             databaseField: 'im',
//           },
//         ] as ITableHeader<ICompany>[],
//         tableCheckbox: {
//           header: false,
//           body: [],
//         } as ITableCheckbox,
//         tableItemsBox: [] as boolean[],
//         initialTableData: [] as ICompany[],
//         companiesData: [] as ICompany[],
//         isDelBtnDisabled: false,
//         companyData: {
//           idCompany: 0,
//           nickname: '',
//           name: '',
//           cnpj: '',
//           ie: '',
//           im: '',
//         } as ICompany,
//         isFilterBoxActive: false,
//         isFilterResultZeroRegister: false,
//         filterBox: {
//           idCompany: '',
//           nickname: '',
//           name: '',
//           cnpj: '',
//           ie: '',
//           im: '',
//         } as IFilterBoxCompany,
//         filterHelp: {
//           inputSearch: '',
//           idCompany: '',
//           nickname: '',
//           name: '',
//           cnpj: '',
//           ie: '',
//           im: '',
//         } as IFilterHelpCompany,
//         pagination: {
//           currentPage: 1,
//           totalPages: 1,
//           qtyPerPage: 10,
//           breakpointPage: 7,
//           pagesArray: [],
//         } as IPagination,
//       }) as ICompanyStore
//   ),

//   withComputed(store => ({
//     isNicknameValid: computed(() => {
//       return store.companyData().nickname.length > 2;
//     }),

//     isNameValid: computed(() => {
//       return store.companyData().name.length > 2;
//     }),

//     isCnpjValid: computed(() => {
//       return store.companyData().cnpj?.length == 14 || store.companyData().cnpj?.length == 18;
//     }),
//   })),

//   withMethods(store => {
//     const companyApi = inject(CompanyApi);
//     const addressStore = inject(AddressStore);
//     const employeeStore = inject(EmployeeStore);
//     const modalStore = inject(ModalStore);
//     const baseRegisterStore = inject(BaseRegisterStore);
//     const onRedirectToEditPage = (companyData: ICompany): void => {
//       baseRegisterStore.onSetSlicePropsToNewValue('dataList', companyData);
//       modalStore.onRedirectPage(`/companies/edit/${store.companyData().idCompany}`);
//     };

//     const onCloneRegister = async (companyData: ICompany): Promise<void> => {
//       patchState(store, {
//         companyData: companyData,
//       });
//       await addressStore.onGetAddressInfo(companyData.idCompany);
//       await employeeStore.onGetEmployeeInfo(companyData.idCompany);
//       baseRegisterStore.onSetSlicePropsToNewValue('data', { idCompany: 0 });
//       addressStore.onSetFormInputNewValue('idAddress', 0);
//       employeeStore.onSetFormInputNewValue('idEmployee', 0);
//       modalStore.onRedirectPage('/companies/new');
//     };

//     const onShowDataList = async (): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         const response = await companyApi.getCompaniesList();
//         baseRegisterStore.onSetSlicePropsToNewValue('dataList', response.data);
//         baseRegisterStore.onClearData(response.data);
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         modalStore.onShowInfoModal('Listar empresas', error.error?.message);
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     const finalData = {
//       company: {
//         idCompany: 0,
//         nickname: '',
//         name: '',
//         cnpj: '',
//         ie: '',
//         im: '',
//       } as ICompany,
//       address: {
//         idAddress: 0,
//         postalCode: '',
//         address: '',
//         number: '',
//         complement: '',
//         district: '',
//         city: '',
//         state: '',
//       } as IAddress,
//       employee: {
//         idEmployee: 0,
//         name: '',
//         cpf: '',
//         department: '',
//         position: '',
//         email: '',
//         deskphone: '',
//         cellphone: '',
//         photoUrl: '',
//       } as IEmployee,
//     };

//     const onSetFinalData = (): void => {
//       finalData.company.idCompany = store.companyData().idCompany;
//       finalData.company.nickname = store.companyData().nickname;
//       finalData.company.name = store.companyData().name;
//       finalData.company.cnpj = baseRegisterStore.onMaskNumericalField(
//         store.companyData()?.cnpj || ''
//       );
//       finalData.company.ie = baseRegisterStore.onMaskNumericalField(store.companyData().ie || '');
//       finalData.company.im = baseRegisterStore.onMaskNumericalField(store.companyData().im || '');
//       finalData.address.idAddress = addressStore.addressData().idAddress;
//       finalData.address.postalCode = baseRegisterStore.onMaskNumericalField(
//         addressStore.addressData().postalCode
//       );
//       finalData.address.address = addressStore.addressData().address;
//       finalData.address.number = addressStore.addressData().number;
//       finalData.address.complement = addressStore.addressData().complement;
//       finalData.address.district = addressStore.addressData().district;
//       finalData.address.city = addressStore.addressData().city;
//       finalData.address.state = addressStore.addressData().state;
//       finalData.employee.isDefault = employeeStore.employeeData().isDefault;
//       finalData.employee.idEmployee = employeeStore.employeeData().idEmployee;
//       finalData.employee.name = employeeStore.employeeData().name;
//       finalData.employee.department = employeeStore.employeeData().department;
//       finalData.employee.position = employeeStore.employeeData().position;
//       finalData.employee.photoUrl = employeeStore.employeeData().photoUrl;
//       finalData.employee.email = employeeStore.employeeData().email;
//       finalData.employee.deskphone = baseRegisterStore.onMaskNumericalField(
//         employeeStore.employeeData().deskphone || ''
//       );
//       finalData.employee.cellphone = baseRegisterStore.onMaskNumericalField(
//         employeeStore.employeeData().cellphone || ''
//       );
//     };

//     const onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         onSetFinalData();
//         const response = await companyApi.saveCompany(finalData);
//         if (response.status) {
//           modalStore.onSetModalInfoType('success');
//           modalStore.onShowInfoModal('Cadastro de empresa', response.message, onActionOk);
//         } else {
//           modalStore.onShowInfoModal('Cadastro de empresa', response.error?.message || '');
//         }
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         modalStore.onShowInfoModal('Cadastro de empresa', error.error.message);
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     const onDeleteRegister = async (
//       idCompany: number,
//       onActionOk?: ActionCallback
//     ): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         const response = await companyApi.deleteCompany(idCompany);
//         if (response.status) {
//           onShowDataList();
//           modalStore.onSetModalInfoType('success');
//           modalStore.onShowInfoModal('Excluir empresa', response.message, onActionOk);
//         } else {
//           modalStore.onShowInfoModal('Excluir empresa', response.error?.message || '');
//         }
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         modalStore.onShowInfoModal('Excluir empresa', error.error.message);
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     return {
//       onShowDataList,
//       onSetFinalData,
//       onSaveRegister,
//       onDeleteRegister,
//       onRedirectToEditPage,
//       onCloneRegister,
//     };
//   })
// );
