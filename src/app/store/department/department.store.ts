// import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
// import { computed, inject } from '@angular/core';
// import { ITableCheckbox, ITableHeader } from '@core/interfaces/table.interface';
// import { IPagination } from '@core/interfaces/pagination.interface';
// import { ModalStore } from '@store/modal/modal.store';
// import { HttpErrorResponse } from '@angular/common/http';
// import { saveStorage } from '@core/utils/misc';
// import { ActionCallback } from '@core/interfaces/modal.interface';
// import {
//   IDepartment,
//   IDepartmentStore,
//   IFilterBoxDepartment,
//   IFilterHelpDepartment,
// } from '@core/interfaces/department.interface';
// import { DepartmentApi } from '@core/http/department/department.api';

// type FilterMethod = 'input-search' | 'filter-box' | 'sort';
// const defaultTableHeaderIcon = 'unfold_more';

// export const DepartmentStore = signalStore(
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
//             databaseField: 'idDepartment',
//           },
//           {
//             id: 1,
//             isHeaderActive: true,
//             sort: 0,
//             icon: defaultTableHeaderIcon,
//             headerName: 'Departamento',
//             databaseField: 'name',
//           },
//         ] as ITableHeader<IDepartment>[],
//         tableCheckbox: {
//           header: false,
//           body: [],
//         } as ITableCheckbox,
//         tableItemsBox: [] as boolean[],
//         initialTableData: [] as IDepartment[],
//         departmentsData: [] as IDepartment[],
//         isDelBtnDisabled: false,
//         departmentData: {
//           idDepartment: 0,
//           name: '',
//         } as IDepartment,
//         isFilterBoxActive: false,
//         isFilterResultZeroRegister: false,
//         filterBox: {
//           idDepartment: '',
//           name: '',
//         } as IFilterBoxDepartment,
//         filterHelp: {
//           inputSearch: '',
//           idDepartment: '',
//           name: '',
//         } as IFilterHelpDepartment,
//         pagination: {
//           currentPage: 1,
//           totalPages: 1,
//           qtyPerPage: 10,
//           breakpointPage: 7,
//           pagesArray: [],
//         } as IPagination,
//       }) as IDepartmentStore
//   ),

//   withComputed(store => ({
//     itemSelected: computed(() => {
//       const indexArray: number[] = [];
//       store.tableCheckbox().body.forEach((value, index) => {
//         if (value == true) indexArray.push(index);
//       });
//       if (indexArray.length == 1) {
//         return store.departmentsData()[indexArray[0]];
//       } else {
//         return null;
//       }
//     }),

//     isAtLeastOneFilterBoxNotEmpty: computed(() => {
//       return store.filterBox().idDepartment.length > 0 || store.filterBox().name.length > 0;
//     }),

//     isAtLeastOneFilterHelpNotEmpty: computed(() => {
//       return (
//         store.filterHelp().inputSearch.length > 0 ||
//         store.filterHelp().idDepartment.length > 0 ||
//         store.filterHelp().name.length > 0
//       );
//     }),

//     isNameValid: computed(() => {
//       return store.departmentData().name.length > 2;
//     }),
//   })),

//   withMethods(store => {
//     const departmentApi = inject(DepartmentApi);
//     const modalStore = inject(ModalStore);

//     const onSetCheckboxArrayToDefault = (dataLength: number): void => {
//       patchState(store, {
//         tableCheckbox: {
//           ...store.tableCheckbox(),
//           body: Array.from({ length: dataLength }, () => false),
//         },
//       });
//     };

//     const onSetTableItemBoxArrayToDefault = (dataLength: number): void => {
//       patchState(store, {
//         tableItemsBox: Array.from({ length: dataLength }, () => false),
//       });
//     };

//     const onSetIsFilterResultZeroRegister = (isFilterResultZeroRegister: boolean): void => {
//       patchState(store, {
//         isFilterResultZeroRegister: isFilterResultZeroRegister,
//       });
//     };

//     const onSetisDelBtnDisabled = (isDelBtnDisabled: boolean): void => {
//       patchState(store, {
//         isDelBtnDisabled: isDelBtnDisabled,
//       });
//     };

//     const onSetTableCheckboxToDefault = (): void => {
//       patchState(store, {
//         tableCheckbox: {
//           header: false,
//           body: store.tableCheckbox().body.map(() => false),
//         },
//       });
//     };

//     /**
//      * Clear filter help
//      */
//     const onSetFilterHelpToDefault = (): void => {
//       Object.keys(store.filterHelp()).forEach(key => {
//         patchState(store, {
//           filterHelp: {
//             ...store.filterHelp(),
//             [key]: '',
//           },
//         });
//       });
//     };

//     const onSetFilterBoxToDefault = (): void => {
//       Object.keys(store.filterBox()).forEach(key => {
//         patchState(store, {
//           filterBox: {
//             ...store.filterBox(),
//             [key]: '',
//           },
//         });
//       });
//     };

//     const onSetDepartmentDataToDefault = (): void => {
//       Object.keys(store.departmentData()).forEach(key => {
//         patchState(store, {
//           departmentData: {
//             ...store.departmentData(),
//             [key]: '',
//           },
//         });
//       });
//     };

//     const onSetFilterHelpItemToDefault = (key: string, filterMethod: FilterMethod): void => {
//       if (filterMethod == 'input-search') {
//         onSetFilterBoxToDefault();
//         onSetFilterHelpToDefault();
//         const filterData = onFilterThroughSearchInput();
//         onSetDepartmentsData(filterData);
//         if (filterData.length == 0) {
//           onSetIsFilterResultZeroRegister(true);
//         } else {
//           onSetFilterHelpItem('inputSearch', store.inputSearchValue());
//         }
//       } else {
//         onSetFilterHelpItem('inputSearch', '');
//         onSetFilterBoxValue(key, '');
//         const filterData = onFilterThroughFilterBox();
//         if (filterData.length == 0) {
//           onSetIsFilterResultZeroRegister(true);
//         } else {
//           onApplyFilterHelpThroughFilterBox();
//         }
//         onSetDepartmentsData(filterData);
//         onSetSortStateToDefault();
//         onSetPaginationToDefault();
//         onSetInputSearchValue('');
//         onShowFilterBox(false);
//       }
//       onSetSortStateToDefault();
//       onSetPaginationToDefault();
//     };

//     const onSetDepartmentsData = (departmentsData: IDepartment[]): void => {
//       patchState(store, {
//         departmentsData: departmentsData,
//       });
//     };

//     const onSetTableHeaderCheckbox = (isChecked: boolean): void => {
//       patchState(store, {
//         tableCheckbox: {
//           ...store.tableCheckbox(),
//           header: isChecked,
//         },
//       });
//     };

//     const onSetInputSearchValue = (inputData: string): void => {
//       patchState(store, {
//         inputSearchValue: inputData,
//       });
//     };

//     const onSetdepartmentData = (departmentData: IDepartment): void => {
//       patchState(store, {
//         departmentData: departmentData,
//       });
//     };

//     const onShowTableHeaderBox = (isTableHeaderBoxActive: boolean): void => {
//       patchState(store, {
//         isTableHeaderBoxActive: isTableHeaderBoxActive,
//       });
//     };

//     const onShowFilterBox = (isFilterBoxActive: boolean): void => {
//       patchState(store, {
//         isFilterBoxActive: isFilterBoxActive,
//       });
//     };

//     const onSetFilterBoxValue = (key: string, value: string): void => {
//       patchState(store, {
//         filterBox: {
//           ...store.filterBox(),
//           [key]: value,
//         },
//       });
//     };

//     const onSetTableHeaders = (tableHeaders: ITableHeader<IDepartment>[]): void => {
//       patchState(store, {
//         tableHeaders: tableHeaders,
//       });
//     };

//     const onSetHeaderDisplay = (idx: number, tableHeadersLocalStorageId: string): void => {
//       patchState(store, {
//         tableHeaders: store.tableHeaders().map((header, index) => {
//           if (index == idx) {
//             return { ...header, isHeaderActive: !header.isHeaderActive };
//           } else {
//             return header;
//           }
//         }),
//       });
//       saveStorage(tableHeadersLocalStorageId, store.tableHeaders());
//     };

//     /**
//      * Change the sort icon according to sort status calculated on onSetTableHeaderSortMethod.
//      * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
//      */
//     const onSetTableHeaderIcon = (): void => {
//       patchState(store, {
//         tableHeaders: store.tableHeaders().map(header => {
//           if (header.sort == 0) {
//             return { ...header, icon: defaultTableHeaderIcon };
//           } else if (header.sort == 1) {
//             return { ...header, icon: 'expand_more' };
//           } else {
//             return { ...header, icon: 'expand_less' };
//           }
//         }),
//       });
//     };

//     /**
//      * Calculate the sorted order that will be used to sort departmentsData and also change sort icon.
//      * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
//      * @param idx The index of the clicked table column.
//      */
//     const onSetTableHeaderSortMethod = (idx: number): void => {
//       patchState(store, {
//         tableHeaders: store.tableHeaders().map((header, index) => {
//           if (idx == index) {
//             return { ...header, sort: (header.sort + 1) % 3 };
//           }
//           return { ...header, sort: 0 };
//         }),
//       });
//     };

//     const onSetSortFilterToDefault = (): void => {
//       onSetDepartmentsData([
//         ...store.departmentsData().sort((a, b) => {
//           return b.idDepartment - a.idDepartment;
//         }),
//       ]);
//       onSetSortStateToDefault();
//     };

//     /**
//      * Sort the departmentsData according to sort status defined on onSetTableHeaderSortMethod
//      * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
//      * @param idx The index of the clicked table column.
//      */
//     const onFilterThroughSort = (idx: number): IDepartment[] => {
//       if (store.tableHeaders()[idx].sort == 0) {
//         return [
//           ...store.departmentsData().sort((a, b) => {
//             return b.idDepartment - a.idDepartment;
//           }),
//         ];
//       } else {
//         const header = store.tableHeaders()[idx];
//         const key = header.databaseField as keyof IDepartment;
//         const sortDirection = header.sort;
//         return [
//           ...store.departmentsData().sort((a, b) => {
//             const valueA = a[key];
//             const valueB = b[key];
//             let comparison = 0;
//             if (typeof valueA === 'number' && typeof valueB === 'number') {
//               comparison = valueA - valueB;
//             } else if (typeof valueA === 'string' && typeof valueB === 'string') {
//               comparison = valueA.localeCompare(valueB);
//             }
//             return sortDirection == 2 ? comparison * -1 : comparison;
//           }),
//         ];
//       }
//     };

//     const onHeaderCheckboxChecked = (event: Event): void => {
//       const newValue = (event.target as HTMLInputElement).checked;
//       patchState(store, {
//         tableCheckbox: {
//           ...store.tableCheckbox(),
//           header: newValue,
//           body: store.tableCheckbox().body.map(() => newValue),
//         },
//       });
//       onCheckTableCheckboxStatus(store.tableCheckbox().body);
//     };

//     const onBodyCheckboxCheckChange = (index: number, event: Event) => {
//       const newValue = (event.target as HTMLInputElement).checked;
//       patchState(store, {
//         tableCheckbox: {
//           ...store.tableCheckbox(),
//           body: store
//             .tableCheckbox()
//             .body.map((element, idx) => (idx == index ? (element = newValue) : element)),
//         },
//       });
//       onCheckTableCheckboxStatus(store.tableCheckbox().body);
//     };

//     const onCheckTableCheckboxStatus = (array: boolean[]): void => {
//       const bodyCheckboxListUpdated = array.filter(element => element == true);
//       onSetisDelBtnDisabled(bodyCheckboxListUpdated.length != 1);
//       onSetTableHeaderCheckbox(bodyCheckboxListUpdated.length > 0);
//     };

//     const onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
//       if (event.key == 'Escape') {
//         onClearData();
//       }
//     };

//     const onClearData = (departmentsData: IDepartment[] = store.initialTableData()): void => {
//       onSetDepartmentsData(departmentsData);
//       onSetIsFilterResultZeroRegister(false);
//       onSetisDelBtnDisabled(true);
//       onSetTableHeaderCheckbox(false);
//       onSetInputSearchValue('');
//       onSetFilterBoxToDefault();
//       onSetFilterHelpToDefault();
//       onSetDepartmentDataToDefault();
//       onSetSortStateToDefault();
//       onSetCheckboxArrayToDefault(departmentsData.length);
//       onSetTableItemBoxArrayToDefault(departmentsData.length);
//       onSetPaginationToDefault();
//     };

//     const onSetSortStateToDefault = (): void => {
//       patchState(store, {
//         tableHeaders: store.tableHeaders().map(header => {
//           return { ...header, sort: 0, icon: defaultTableHeaderIcon };
//         }),
//       });
//     };

//     const onFilter = (filterType: FilterMethod, idx?: number): void => {
//       let filterData: IDepartment[] = [];
//       if (filterType == 'input-search') {
//         filterData = onFilterThroughSearchInput();
//         onSetDepartmentsData(filterData);
//         if (filterData.length == 0) {
//           onSetIsFilterResultZeroRegister(true);
//         } else {
//           onSetFilterHelpItem('inputSearch', store.inputSearchValue());
//           onSetFilterHelpItem('idDepartment', '');
//           onSetFilterHelpItem('name', '');
//           onSetFilterBoxToDefault();
//         }
//       } else if (filterType == 'filter-box') {
//         filterData = onFilterThroughFilterBox();
//         onSetDepartmentsData(filterData);
//         if (filterData.length == 0) {
//           onSetIsFilterResultZeroRegister(true);
//         } else {
//           onApplyFilterHelpThroughFilterBox();
//           onSetInputSearchValue('');
//           onSetFilterHelpItem('inputSearch', '');
//         }
//         onShowFilterBox(false);
//       } else {
//         onSetTableHeaderSortMethod(idx || 0);
//         onSetTableHeaderIcon();
//         const filterData = onFilterThroughSort(idx || 0);
//         onSetDepartmentsData(filterData);
//       }
//       onSetPaginationToDefault();
//     };

//     const onFilterThroughSearchInput = (): IDepartment[] => {
//       return store.initialTableData().filter(company => {
//         return ['idDepartment', 'nickname', 'name'].some(key => {
//           const propertyValue = company[key as keyof IDepartment];
//           return String(propertyValue)
//             .toLowerCase()
//             .trim()
//             .includes(store.inputSearchValue().toLowerCase().trim());
//         });
//       });
//     };

//     const onFilterThroughFilterBox = (): IDepartment[] => {
//       return store.initialTableData().filter(company => {
//         return (
//           String(company.idDepartment)
//             .toLowerCase()
//             .trim()
//             .includes(store.filterBox().idDepartment.trim()) &&
//           company.name.toLowerCase().trim().includes(store.filterBox().name.toLowerCase().trim())
//         );
//       });
//     };

//     const onKeyPressOnFilterBox = (event: KeyboardEvent): void => {
//       if (event.key == 'Enter') {
//         onFilter('filter-box');
//       }
//     };

//     const onKeyPressOnSearchInput = (event: KeyboardEvent): void => {
//       if (event.key == 'Enter') {
//         onFilter('input-search');
//       } else if (event.key == 'Escape') {
//         onClearData();
//       }
//     };

//     const onApplyFilterHelpThroughFilterBox = (): void => {
//       const keys = Object.keys(store.filterBox());
//       keys.forEach(key => {
//         patchState(store, {
//           filterHelp: {
//             ...store.filterHelp(),
//             [key]: store.filterBox()[key as keyof IFilterBoxDepartment],
//           },
//         });
//       });
//     };

//     const onSetFilterHelpItem = (
//       key: keyof IFilterHelpDepartment,
//       value: string | number
//     ): void => {
//       patchState(store, {
//         filterHelp: {
//           ...store.filterHelp(),
//           [key]: value,
//         },
//       });
//     };

//     const onRedirectToEditPage = (departmentData: IDepartment): void => {
//       onSetdepartmentData(departmentData);
//       modalStore.onRedirectPage(`/departments/edit/${store.departmentData().idDepartment}`);
//     };

//     const onSetPaginationArray = (): void => {
//       if (store.pagination().totalPages < 7) {
//         patchState(store, {
//           pagination: {
//             ...store.pagination(),
//             pagesArray: Array.from({ length: store.pagination().totalPages }, (_, i) => i + 1),
//           },
//         });
//       } else {
//         if (store.pagination().currentPage < 3) {
//           patchState(store, {
//             pagination: {
//               ...store.pagination(),
//               pagesArray: [
//                 1,
//                 2,
//                 3,
//                 '...',
//                 store.pagination().totalPages - 2,
//                 store.pagination().totalPages - 1,
//                 store.pagination().totalPages,
//               ] as string[],
//             },
//           });
//         } else if (
//           store.pagination().currentPage > 3 &&
//           store.pagination().currentPage < store.pagination().totalPages - 2
//         ) {
//           patchState(store, {
//             pagination: {
//               ...store.pagination(),
//               pagesArray: [
//                 1,
//                 2,
//                 '...',

//                 store.pagination().currentPage - 1,
//                 store.pagination().currentPage,
//                 store.pagination().currentPage + 1,
//                 '...',
//                 store.pagination().totalPages - 1,
//                 store.pagination().totalPages,
//               ] as string[],
//             },
//           });
//         } else {
//           patchState(store, {
//             pagination: {
//               ...store.pagination(),
//               pagesArray: [
//                 1,
//                 2,
//                 3,
//                 '...',
//                 store.pagination().totalPages - 2,
//                 store.pagination().totalPages - 1,
//                 store.pagination().totalPages,
//               ] as string[],
//             },
//           });
//         }
//       }
//     };

//     const onSetPaginationToDefault = (): void => {
//       patchState(store, {
//         pagination: {
//           ...store.pagination(),
//           currentPage: 1,
//           totalPages: Math.ceil(store.departmentsData().length / store.pagination().qtyPerPage),
//         },
//       });
//       onSetPaginationArray();
//     };

//     const onSetCurrentPagePagination = (currentPage: number): void => {
//       patchState(store, {
//         pagination: {
//           ...store.pagination(),
//           currentPage: currentPage,
//         },
//       });
//       onSetPaginationArray();
//     };

//     const onSetFormInputNewValue = (property: string, newValue: string): void => {
//       patchState(store, {
//         departmentData: {
//           ...store.departmentData(),
//           [property]: newValue,
//         },
//       });
//     };

//     const onCloseTableItemsBox = (): void => {
//       patchState(store, {
//         tableItemsBox: store.tableItemsBox().map(() => false),
//       });
//     };

//     const onShowTableItemBox = (event: MouseEvent | KeyboardEvent, idx: number): void => {
//       event.stopPropagation();
//       patchState(store, {
//         tableItemsBox: store.tableItemsBox().map((value, index) => {
//           if (!value && index == idx) {
//             return true;
//           } else {
//             return false;
//           }
//         }),
//       });
//     };

//     const onCloneRegister = async (departmentData: IDepartment): Promise<void> => {
//       patchState(store, {
//         departmentData: departmentData,
//       });
//       patchState(store, {
//         departmentData: {
//           ...store.departmentData(),
//           idDepartment: 0,
//         },
//       });
//       modalStore.onRedirectPage('/departments/new');
//     };

//     const formTitle = 'Cadastro de departamento';

//     const onGetDepartmentList = async (): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         const response = await departmentApi.onGetDepartmentList();
//         if (response.data) {
//           patchState(store, {
//             initialTableData: response.data,
//           });
//           onClearData(response.data);
//         } else {
//           return;
//         }
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         console.log('Erro ao trazer as informações de departamento' + error.message);
//         modalStore.onShowInfoModal(formTitle, 'Erro ao trazer as informações do departamento.');
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     const onGetDepartment = async (idEmployee: number): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         const response = await departmentApi.onGetDepartment(idEmployee);
//         if (response.data) {
//           patchState(store, {
//             departmentData: response.data,
//           });
//         } else {
//           return;
//         }
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         console.log('Erro ao trazer as informações de departamento' + error.message);
//         modalStore.onShowInfoModal(formTitle, 'Erro ao trazer as informações do departamento.');
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     const onSaveRegister = async (
//       departmentData: IDepartment,
//       onActionOk?: ActionCallback
//     ): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         const response = await departmentApi.onSaveDepartment(departmentData);
//         if (response.status) {
//           modalStore.onSetModalInfoType('success');
//           modalStore.onShowInfoModal(formTitle, response.message, onActionOk);
//         } else {
//           modalStore.onShowInfoModal(formTitle, response.error?.message || '');
//         }
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         modalStore.onShowInfoModal(formTitle, error.error.message);
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     const formTitleDelete = 'Excluir empresa';

//     const onDeleteRegister = async (
//       idDepartment: number,
//       onActionOk?: ActionCallback
//     ): Promise<void> => {
//       try {
//         modalStore.onLoading(true);
//         const response = await departmentApi.deleteDepartment(idDepartment);
//         if (response.status) {
//           onGetDepartmentList();
//           modalStore.onSetModalInfoType('success');
//           modalStore.onShowInfoModal(formTitleDelete, response.message, onActionOk);
//         } else {
//           modalStore.onShowInfoModal(formTitleDelete, response.error?.message || '');
//         }
//       } catch (e: unknown) {
//         const error = e as HttpErrorResponse;
//         modalStore.onShowInfoModal(formTitleDelete, error.error.message);
//       } finally {
//         modalStore.onLoading(false);
//       }
//     };

//     return {
//       onSetInputSearchValue,
//       onSetHeaderDisplay,
//       onSetCheckboxArrayToDefault,
//       onSetTableItemBoxArrayToDefault,
//       onHeaderCheckboxChecked,
//       onBodyCheckboxCheckChange,
//       onCheckTableCheckboxStatus,
//       onKeyPressOnSearchInput,
//       onClearData,
//       onFilterThroughSearchInput,
//       onKeyPressOnNotFoundFilterRegister,
//       onGetDepartmentList,
//       onKeyPressOnFilterBox,
//       onFilterThroughFilterBox,
//       onSetFilterHelpItemToDefault,
//       onSetFilterBoxValue,
//       onSetSortStateToDefault,
//       onSetSortFilterToDefault,
//       onSetTableCheckboxToDefault,
//       onGetDepartment,
//       onSaveRegister,
//       onDeleteRegister,
//       onSetTableHeaders,
//       onFilter,
//       onShowTableHeaderBox,
//       onShowFilterBox,
//       onSetPaginationToDefault,
//       onSetFormInputNewValue,
//       onSetCurrentPagePagination,
//       onRedirectToEditPage,
//       onSetDepartmentDataToDefault,
//       onShowTableItemBox,
//       onCloseTableItemsBox,
//       onCloneRegister,
//     };
//   })
// );
