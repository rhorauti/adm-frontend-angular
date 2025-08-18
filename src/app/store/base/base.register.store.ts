import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { ITableHeader } from '@core/interfaces/table.interface';
import { IPagination } from '@core/interfaces/pagination.interface';
import { saveStorage } from '@core/utils/misc';
import {
  IBaseRegisterStore as IBaseRegisterStore,
  FilterHelp,
} from '@core/interfaces/base.register.interface';
import { DataType, MaybeMergeValue, StoreType, KeyOfData } from '@core/types/base.type';

const defaultTableHeaderIcon = 'unfold_more';

export const BaseRegisterStore = signalStore(
  { providedIn: 'root' },

  withState<IBaseRegisterStore<DataType>>(() => ({
    inputSearchValue: '',
    isTableHeaderBoxActive: false,
    tableHeaders: [] as ITableHeader<DataType>[],
    tableCheckbox: {
      header: false,
      body: [] as boolean[],
    },
    tableItemsBox: [] as boolean[],
    initialData: [] as DataType[],
    isDelBtnDisabled: false,
    dataList: [] as DataType[],
    data: {} as DataType,
    isFilterBoxActive: false,
    isFilterResultZeroRegister: false,
    filterBox: {} as unknown as DataType,
    filterHelp: { inputSearch: '' } as FilterHelp<DataType>,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      qtyPerPage: 10,
      breakpointPage: 7,
      pagesArray: [],
    } as IPagination,
  })),

  withComputed(store => ({
    itemSelected: computed(() => {
      const indexArray: number[] = [];
      store.tableCheckbox().body.forEach((value, index) => {
        if (value == true) indexArray.push(index);
      });
      if (indexArray.length == 1) {
        return store.dataList()[indexArray[0]];
      } else {
        return null;
      }
    }),

    isAtLeastOneFilterBoxNotEmpty: computed(() => {
      return Object.values(store.filterBox()).some(v => v?.trim().length > 0);
    }),

    // isAtLeastOneFilterBoxNotEmpty: computed(() => {
    //   return (
    //     store.filterBox().idCompany.length > 0 ||
    //     store.filterBox().nickname.length > 0 ||
    //     store.filterBox().name.length > 0 ||
    //     store.filterBox().cnpj.length > 0 ||
    //     store.filterBox().ie.length > 0 ||
    //     store.filterBox().im.length > 0
    //   );
    // }),

    isAtLeastOneFilterHelpNotEmpty: computed(() => {
      return Object.values(store.filterHelp()).some(v => v.trim().length > 0);
    }),

    // isAtLeastOneFilterHelpNotEmpty: computed(() => {
    //   return (
    //     store.filterHelp().inputSearch.length > 0 ||
    //     store.filterHelp().idCompany.length > 0 ||
    //     store.filterHelp().nickname.length > 0 ||
    //     store.filterHelp().name.length > 0 ||
    //     store.filterHelp().cnpj.length > 0 ||
    //     store.filterHelp().ie.length > 0 ||
    //     store.filterHelp().im.length > 0
    //   );
    // }),
  })),

  withMethods(store => {
    // const companyApi = inject(CompanyApi);
    // const addressStore = inject(AddressStore);
    // const employeeStore = inject(EmployeeStore);
    // const modalStore = inject(ModalStore);

    const onSetCheckboxArrayToDefault = (dataLength: number): void => {
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          body: Array.from({ length: dataLength }, () => false),
        },
      });
    };

    const isPlainObject = (v: unknown): v is Record<string, unknown> =>
      v !== null && typeof v == 'object' && !Array.isArray(v);

    const onSetSlicePropsToNewValue = <K extends keyof StoreType>(
      sliceKey: K,
      value: MaybeMergeValue<StoreType, K>
    ): void => {
      const current = store[sliceKey]();

      const next: StoreType[K] =
        isPlainObject(current) && isPlainObject(value)
          ? ({
              ...current,
              ...(value as Record<string, unknown>),
            } as StoreType[K])
          : (value as StoreType[K]);

      patchState(store, { [sliceKey]: next } as Partial<StoreType>);
    };

    // const onSetSlicePropsToNewValue = (sliceKey: string, value: any): void => {
    //   const s = store as any;
    //   const current = s[sliceKey]();

    //   let next: any;
    //   if (Array.isArray(current) || current == null || typeof current !== 'object') {
    //     next = value;
    //   } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    //     next = { ...current, ...value };
    //   } else {
    //     next = value;
    //   }

    //   (patchState as any)(store, { [sliceKey]: next });
    // };

    // const onSetTableItemBoxArrayToDefault = (dataLength: number): void => {
    //   patchState(store, {
    //     tableItemsBox: Array.from({ length: dataLength }, () => false),
    //   });
    // };

    // const onSetIsFilterResultZeroRegister = (isFilterResultZeroRegister: boolean): void => {
    //   patchState(store, {
    //     isFilterResultZeroRegister: isFilterResultZeroRegister,
    //   });
    // };

    // const onSetisDelBtnDisabled = (isDelBtnDisabled: boolean): void => {
    //   patchState(store, {
    //     isDelBtnDisabled: isDelBtnDisabled,
    //   });
    // };

    // const onSetTableCheckboxToDefault = (): void => {
    //   patchState(store, {
    //     tableCheckbox: {
    //       header: false,
    //       body: store.tableCheckbox().body.map(() => false),
    //     },
    //   });
    // };

    const onSetSliceObjectToDefault = <K extends keyof StoreType>(
      sliceKey: K,
      defaultValue: string | number = ''
    ): void => {
      const current = store[sliceKey]();
      if (!isPlainObject(current)) return;
      const next = Object.keys(current).reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = defaultValue;
        return acc;
      }, {}) as StoreType[K];

      patchState(store, { [sliceKey]: next } as Partial<StoreType>);
    };

    /**
     * Clear filter help
     */
    // const onSetFilterHelpToDefault = (): void => {
    //   Object.keys(store.filterHelp()).forEach(key => {
    //     patchState(store, {
    //       filterHelp: {
    //         ...store.filterHelp(),
    //         [key]: '',
    //       },
    //     });
    //   });
    // };

    // const onSetFilterBoxToDefault = (): void => {
    //   Object.keys(store.filterBox()).forEach(key => {
    //     patchState(store, {
    //       filterBox: {
    //         ...store.filterBox(),
    //         [key]: '',
    //       },
    //     });
    //   });
    // };

    // const onSetCompanyDataToDefault = (): void => {
    //   Object.keys(store.companyData()).forEach(key => {
    //     patchState(store, {
    //       companyData: {
    //         ...store.companyData(),
    //         [key]: '',
    //       },
    //     });
    //   });
    // };

    // const onSetFilterItemToDefault = (
    //   key: string,
    //   filterMethod: FilterMethod,
    //   fieldList?: FieldKey[]
    // ): void => {
    //   if (filterMethod == 'input-search') {
    //     onSetSliceObjectToDefault('filterBox');
    //     onSetSliceObjectToDefault('filterHelp');
    //     const filterData = onFilterThroughSearchInput(fieldList);
    //     onSetSlicePropsToNewValue('data', filterData);
    //     if (filterData.length == 0) {
    //       onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
    //     } else {
    //       onSetSlicePropsToNewValue('filterHelp', { inputSearch: store.inputSearchValue() });
    //     }
    //   } else {
    //     onSetSlicePropsToNewValue('filterHelp', { inputSearch: '' });
    //     onSetSlicePropsToNewValue('filterBox', { [key]: '' });
    //     const filterData = onFilterThroughFilterBox();
    //     if (filterData.length == 0) {
    //       onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
    //     } else {
    //       onApplyFilterHelpThroughFilterBox();
    //     }
    //     onSetSlicePropsToNewValue('dataList', filterData);
    //     onSetPaginationToDefault();
    //     onSetSlicePropsToNewValue('inputSearchValue', '');
    //     onSetSlicePropsToNewValue('isFilterBoxActive', false);
    //   }
    //   onSetSortStateToDefault();
    //   onSetPaginationToDefault();
    // };

    // const onSetCompaniesData = (companiesData: ICompany[]): void => {
    //   patchState(store, {
    //     companiesData: companiesData,
    //   });
    // };

    // const onSetTableHeaderCheckbox = (isChecked: boolean): void => {
    //   patchState(store, {
    //     tableCheckbox: {
    //       ...store.tableCheckbox(),
    //       header: isChecked,
    //     },
    //   });
    // };

    // const onSetInputSearchValue = (inputData: string): void => {
    //   patchState(store, {
    //     inputSearchValue: inputData,
    //   });
    // };

    // const onSetCompanyData = (companyData: ICompany): void => {
    //   patchState(store, {
    //     companyData: companyData,
    //   });
    // };

    // const onShowTableHeaderBox = (isTableHeaderBoxActive: boolean): void => {
    //   patchState(store, {
    //     isTableHeaderBoxActive: isTableHeaderBoxActive,
    //   });
    // };

    // const onShowFilterBox = (isFilterBoxActive: boolean): void => {
    //   patchState(store, {
    //     isFilterBoxActive: isFilterBoxActive,
    //   });
    // };

    const onSetFilterBoxValue = (key: string, value: string): void => {
      patchState(store, {
        filterBox: {
          ...store.filterBox(),
          [key]: value,
        },
      });
    };

    // const onSetTableHeaders = (tableHeaders: ITableHeader<ICompany>[]): void => {
    //   patchState(store, {
    //     tableHeaders: tableHeaders,
    //   });
    // };

    const onSetHeaderDisplay = (idx: number, tableHeadersLocalStorageId: string): void => {
      patchState(store, {
        tableHeaders: store.tableHeaders().map((header, index) => {
          if (index == idx) {
            return { ...header, isHeaderActive: !header.isHeaderActive };
          } else {
            return header;
          }
        }),
      });
      saveStorage(tableHeadersLocalStorageId, store.tableHeaders());
    };

    /**
     * Change the sort icon according to sort status calculated on onSetTableHeaderSortMethod.
     * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
     */
    const onSetTableHeaderIcon = (): void => {
      patchState(store, {
        tableHeaders: store.tableHeaders().map(header => {
          if (header.sort == 0) {
            return { ...header, icon: defaultTableHeaderIcon };
          } else if (header.sort == 1) {
            return { ...header, icon: 'expand_more' };
          } else {
            return { ...header, icon: 'expand_less' };
          }
        }),
      });
    };

    /**
     * Calculate the sorted order that will be used to sort companiesData and also change sort icon.
     * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
     * @param idx The index of the clicked table column.
     */
    const onSetTableHeaderSortMethod = (idx: number): void => {
      patchState(store, {
        tableHeaders: store.tableHeaders().map((header, index) => {
          if (idx == index) {
            return { ...header, sort: (header.sort + 1) % 3 };
          }
          return { ...header, sort: 0 };
        }),
      });
    };

    const onSetTableDataSortDirectionToDefault = <T extends keyof DataType>(): void => {
      const keyId = Object.keys(store.data())[0] as T;
      if (!keyId) return;
      onSetSlicePropsToNewValue('dataList', [
        ...store.dataList().sort((a, b) => {
          return b[keyId] - a[keyId];
        }),
      ]);
    };

    const onSetSortFilterToDefault = (): void => {
      onSetTableDataSortDirectionToDefault();
      onSetSortStateToDefault();
    };

    // const onSetSortFilterToDefault = (): void => {
    //   onSetSlicePropsToNewValue('companiesData', [
    //     ...store.companiesData().sort((a, b) => {
    //       return b.idCompany - a.idCompany;
    //     }),
    //   ]);
    //   onSetSortStateToDefault();
    // };

    // const onFilterThroughSort = (idx: number): ICompany[] => {
    //   if (store.tableHeaders()[idx].sort == 0) {
    //     return [
    //       ...store.companiesData().sort((a, b) => {
    //         return b.idCompany - a.idCompany;
    //       }),
    //     ];
    //   } else {
    //     const header = store.tableHeaders()[idx];
    //     const key = header.databaseField as keyof ICompany;
    //     const sortDirection = header.sort;
    //     return [
    //       ...store.companiesData().sort((a, b) => {
    //         const valueA = a[key];
    //         const valueB = b[key];
    //         let comparison = 0;
    //         if (typeof valueA === 'number' && typeof valueB === 'number') {
    //           comparison = valueA - valueB;
    //         } else if (typeof valueA === 'string' && typeof valueB === 'string') {
    //           comparison = valueA.localeCompare(valueB);
    //         }
    //         return sortDirection == 2 ? comparison * -1 : comparison;
    //       }),
    //     ];
    //   }
    // };

    const onHeaderCheckboxChecked = (event: Event): void => {
      const newValue = (event.target as HTMLInputElement).checked;
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          header: newValue,
          body: store.tableCheckbox().body.map(() => newValue),
        },
      });
      onCheckTableCheckboxStatus(store.tableCheckbox().body);
    };

    const onBodyCheckboxCheckChange = (index: number, event: Event) => {
      const newValue = (event.target as HTMLInputElement).checked;
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          body: store
            .tableCheckbox()
            .body.map((element, idx) => (idx == index ? (element = newValue) : element)),
        },
      });
      onCheckTableCheckboxStatus(store.tableCheckbox().body);
    };

    const onCheckTableCheckboxStatus = (array: boolean[]): void => {
      const bodyCheckboxListUpdated = array.filter(element => element == true);
      onSetSlicePropsToNewValue('isDelBtnDisabled', bodyCheckboxListUpdated.length != 1);
      onSetSlicePropsToNewValue('tableCheckbox', { header: bodyCheckboxListUpdated.length > 0 });
    };

    const onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
      if (event.key == 'Escape') {
        onClearData();
      }
    };

    const onClearData = (data: DataType[] = store.initialData()): void => {
      onSetSliceObjectToDefault('filterBox');
      onSetSliceObjectToDefault('filterHelp');
      onSetSliceObjectToDefault('data');
      onSetSortStateToDefault();
      onSetSlicePropsToNewValue('dataList', data);
      onSetSlicePropsToNewValue('isFilterResultZeroRegister', false);
      onSetSlicePropsToNewValue('isDelBtnDisabled', true);
      onSetSlicePropsToNewValue('tableCheckbox', { header: false });
      onSetSlicePropsToNewValue('inputSearchValue', '');
      onSetSlicePropsToNewValue('tableCheckbox', {
        body: Array.from({ length: data.length }, () => false),
      });
      onSetSlicePropsToNewValue(
        'tableItemsBox',
        Array.from({ length: data.length }, () => false)
      );
      onSetPaginationToDefault();
    };

    const onSetSortStateToDefault = (): void => {
      patchState(store, {
        tableHeaders: store.tableHeaders().map(header => {
          return { ...header, sort: 0, icon: defaultTableHeaderIcon };
        }),
      });
    };

    const onSetInputSearchFilterItemToDefault = (fieldList: KeyOfData[]): void => {
      onSetSliceObjectToDefault('filterBox');
      onSetSliceObjectToDefault('filterHelp');
      const filterData = onFilterThroughSearchInput(fieldList);
      onSetSlicePropsToNewValue('dataList', filterData);
      if (filterData.length == 0) {
        onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
      } else {
        onSetSlicePropsToNewValue('filterHelp', { inputSearch: store.inputSearchValue() });
      }
      onSetPaginationToDefault();
      onSetSortStateToDefault();
    };

    const onSetFilterBoxItemToDefault = (key: string): void => {
      onSetSlicePropsToNewValue('filterHelp', { inputSearch: '' });
      onSetSlicePropsToNewValue('filterBox', { [key]: '' });
      const filterData = onFilterThroughFilterBox();
      onSetSlicePropsToNewValue('dataList', filterData);
      if (filterData.length == 0) {
        onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
      } else {
        onApplyFilterHelpThroughFilterBox();
      }
      onSetPaginationToDefault();
      onSetSlicePropsToNewValue('inputSearchValue', '');
      onSetSortStateToDefault();
      onSetPaginationToDefault();
      onSetSlicePropsToNewValue('isFilterBoxActive', false);
    };

    const onClickOnFilterBtnThroughSearchInput = (fieldList: KeyOfData[]): void => {
      onSetSliceObjectToDefault('filterBox');
      onSetSliceObjectToDefault('filterHelp');
      const fields = fieldList ?? store.tableHeaders().map(h => h.databaseField as KeyOfData);
      const filterData = onFilterThroughSearchInput(fields);
      onSetSlicePropsToNewValue('dataList', filterData);
      if (filterData.length == 0) {
        onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
      } else {
        onSetSlicePropsToNewValue('filterHelp', { inputSearch: store.inputSearchValue() });
      }
      onSetPaginationToDefault();
    };

    const onClickOnFilterBtnThroughFilterBox = (): void => {
      const filterData = onFilterThroughFilterBox();
      onSetSlicePropsToNewValue('dataList', filterData);
      if (filterData.length == 0) {
        onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
      } else {
        onApplyFilterHelpThroughFilterBox();
        onSetSlicePropsToNewValue('dataList', filterData);
        onSetSlicePropsToNewValue('inputSearchValue', '');
      }
      onSetSlicePropsToNewValue('isFilterBoxActive', false);
      onSetPaginationToDefault();
    };

    const onClickOnFilterBtnThroughSort = (idx: number): void => {
      onSetTableHeaderSortMethod(idx || 0);
      onSetTableHeaderIcon();
      const filterData = onFilterThroughSort(idx || 0);
      onSetSlicePropsToNewValue('dataList', filterData);
      onSetPaginationToDefault();
    };

    // const onFilter = (filterType: FilterMethod, fieldList?: KeyOfData[], idx?: number): void => {
    //   let filterData: DataType[] = [];
    //   if (filterType == 'input-search') {
    //     const fields = fieldList ?? store.tableHeaders().map(h => h.databaseField as KeyOfData);
    //     onSetSliceObjectToDefault('filterBox');
    //     onSetSliceObjectToDefault('filterHelp');
    //     filterData = onFilterThroughSearchInput(fields);
    //     onSetSlicePropsToNewValue('dataList', filterData);
    //     if (filterData.length == 0) {
    //       onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
    //     } else {
    //       onSetSlicePropsToNewValue('filterHelp', { inputSearch: store.inputSearchValue() });
    //     }
    //   } else if (filterType == 'filter-box') {
    //     filterData = onFilterThroughFilterBox();
    //     onSetSlicePropsToNewValue('dataList', filterData);
    //     if (filterData.length == 0) {
    //       onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
    //     } else {
    //       onApplyFilterHelpThroughFilterBox();
    //       onSetSlicePropsToNewValue('dataList', filterData);
    //       onSetSlicePropsToNewValue('inputSearchValue', '');
    //     }
    //     onSetSlicePropsToNewValue('isFilterBoxActive', false);
    //   } else {
    //     onSetTableHeaderSortMethod(idx || 0);
    //     onSetTableHeaderIcon();
    //     const filterData = onFilterThroughSort(idx || 0);
    //     onSetSlicePropsToNewValue('dataList', filterData);
    //   }
    //   onSetPaginationToDefault();
    // };

    const onFilterThroughSearchInput = <K extends keyof DataType>(
      fieldList?: KeyOfData[]
    ): DataType[] => {
      const fields = fieldList ?? store.tableHeaders().map(h => h.databaseField as KeyOfData);
      return store.initialData().filter(company => {
        return fields.some(key => {
          const propertyValue = company[key as K];
          return String(propertyValue)
            .toLowerCase()
            .trim()
            .includes(store.inputSearchValue().toLowerCase().trim());
        });
      });
    };

    const onFilterThroughFilterBox = <K extends keyof DataType>(): DataType[] => {
      return store.initialData().filter(data => {
        const stringObj = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, String(value)])
        );
        return Object.keys(stringObj).every(key =>
          (data[key as K] as string)
            .toLowerCase()
            .trim()
            .includes(store.filterBox()[key as K])
        );
      });
    };

    /**
     * Sort the companiesData according to sort status defined on onSetTableHeaderSortMethod
     * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
     * @param idx The index of the clicked table column.
     */
    const onFilterThroughSort = <K extends keyof DataType>(idx: number): DataType[] => {
      const keyId = Object.keys(store.data())[0] as K;
      const header = store.tableHeaders()[idx];
      const key = header.databaseField as K;
      const sortDirection = header.sort;
      if (store.tableHeaders()[idx].sort == 0) {
        return [
          ...store.dataList().sort((a, b) => {
            const valueA = a[keyId];
            const valueB = b[keyId];
            if (typeof valueA === 'number' && typeof valueB === 'number') {
              return valueB - valueA;
            }
            return 0;
          }),
        ];
      } else {
        return [
          ...store.dataList().sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];
            let comparison = 0;
            if (typeof valueA === 'number' && typeof valueB === 'number') {
              comparison = ((valueA as number) - valueB) as number;
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
              comparison = (valueA as string).localeCompare(valueB as string);
            }
            return sortDirection == 2 ? comparison * -1 : comparison;
          }),
        ];
      }
    };

    // const onFilterThroughFilterBox = (): ICompany[] => {
    //   return store.initialData().filter(company => {
    //     return (
    //       String(company.idCompany)
    //         .toLowerCase()
    //         .trim()
    //         .includes(store.filterBox().idCompany.trim()) &&
    //       company.nickname
    //         .toLowerCase()
    //         .trim()
    //         .includes(store.filterBox().nickname.toLowerCase().trim()) &&
    //       company.name.toLowerCase().trim().includes(store.filterBox().name.toLowerCase().trim()) &&
    //       (company.cnpj || '')
    //         .toLowerCase()
    //         .trim()
    //         .includes(store.filterBox().cnpj.toLowerCase().trim()) &&
    //       (company.ie || '')
    //         .toLowerCase()
    //         .trim()
    //         .includes(store.filterBox().ie.toLowerCase().trim()) &&
    //       (company.im || '')
    //         .toLowerCase()
    //         .trim()
    //         .includes(store.filterBox().im.toLowerCase().trim())
    //     );
    //   });
    // };

    const onKeyPressOnFilterBox = (event: KeyboardEvent): void => {
      if (event.key == 'Enter') {
        onClickOnFilterBtnThroughFilterBox();
      }
    };

    const onKeyPressOnSearchInput = (event: KeyboardEvent, fieldList: KeyOfData[]): void => {
      const fields = fieldList ?? store.tableHeaders().map(h => h.databaseField as KeyOfData);
      if (event.key == 'Enter') {
        onClickOnFilterBtnThroughSearchInput(fields);
      } else if (event.key == 'Escape') {
        onClearData();
      }
    };

    const onApplyFilterHelpThroughFilterBox = <K extends keyof DataType>(): void => {
      const keys = Object.keys(store.filterBox());
      keys.forEach(key => {
        patchState(store, {
          filterHelp: {
            ...store.filterHelp(),
            [key]: store.filterBox()[key as K],
          },
        });
      });
    };

    // const onSetFilterHelpItem = (key: keyof IFilterHelpCompany, value: string | number): void => {
    //   patchState(store, {
    //     filterHelp: {
    //       ...store.filterHelp(),
    //       [key]: value,
    //     },
    //   });
    // };

    // const onRedirectToEditPage = (data: DataType): void => {
    //   onSetSlicePropsToNewValue('companiesData', data);
    //   modalStore.onRedirectPage(`/companies/edit/${store.data().idCompany}`);
    // };

    const onSetPaginationArray = (): void => {
      if (store.pagination().totalPages < 7) {
        patchState(store, {
          pagination: {
            ...store.pagination(),
            pagesArray: Array.from({ length: store.pagination().totalPages }, (_, i) => i + 1),
          },
        });
      } else {
        if (store.pagination().currentPage < 3) {
          patchState(store, {
            pagination: {
              ...store.pagination(),
              pagesArray: [
                1,
                2,
                3,
                '...',
                store.pagination().totalPages - 2,
                store.pagination().totalPages - 1,
                store.pagination().totalPages,
              ] as string[],
            },
          });
        } else if (
          store.pagination().currentPage > 3 &&
          store.pagination().currentPage < store.pagination().totalPages - 2
        ) {
          patchState(store, {
            pagination: {
              ...store.pagination(),
              pagesArray: [
                1,
                2,
                '...',

                store.pagination().currentPage - 1,
                store.pagination().currentPage,
                store.pagination().currentPage + 1,
                '...',
                store.pagination().totalPages - 1,
                store.pagination().totalPages,
              ] as string[],
            },
          });
        } else {
          patchState(store, {
            pagination: {
              ...store.pagination(),
              pagesArray: [
                1,
                2,
                3,
                '...',
                store.pagination().totalPages - 2,
                store.pagination().totalPages - 1,
                store.pagination().totalPages,
              ] as string[],
            },
          });
        }
      }
    };

    const onSetPaginationToDefault = (): void => {
      patchState(store, {
        pagination: {
          ...store.pagination(),
          currentPage: 1,
          totalPages: Math.ceil(store.dataList().length / store.pagination().qtyPerPage),
        },
      });
      onSetPaginationArray();
    };

    const onSetCurrentPagePagination = (currentPage: number): void => {
      onSetSlicePropsToNewValue('pagination', { currentPage: currentPage });
      // patchState(store, {
      //   pagination: {
      //     ...store.pagination(),
      //     currentPage: currentPage,
      //   },
      // });
      onSetPaginationArray();
    };

    // const onSetFormInputNewValue = (property: string, newValue: string): void => {
    //   patchState(store, {
    //     companyData: {
    //       ...store.companyData(),
    //       [property]: newValue,
    //     },
    //   });
    // };

    // const onCloseTableItemsBox = (): void => {
    //   patchState(store, {
    //     tableItemsBox: store.tableItemsBox().map(() => false),
    //   });
    // };

    const onShowTableItemBox = (event: MouseEvent | KeyboardEvent, idx: number): void => {
      event.stopPropagation();
      patchState(store, {
        tableItemsBox: store.tableItemsBox().map((value, index) => {
          if (!value && index == idx) {
            return true;
          } else {
            return false;
          }
        }),
      });
    };

    // const onCloneRegister = async (companyData: ICompany): Promise<void> => {
    //   patchState(store, {
    //     companyData: companyData,
    //   });
    //   await addressStore.onGetAddressInfo(companyData.idCompany);
    //   await employeeStore.onGetEmployeeInfo(companyData.idCompany);
    //   onSetSlicePropsToNewValue('companyData', { idCompany: 0 });
    //   addressStore.onSetFormInputNewValue('idAddress', 0);
    //   employeeStore.onSetFormInputNewValue('idEmployee', 0);
    //   modalStore.onRedirectPage('/companies/new');
    // };

    // const onShowDataList = async (): Promise<void> => {
    //   try {
    //     modalStore.onLoading(true);
    //     const response = await companyApi.getCompaniesList();
    //     patchState(store, {
    //       initialData: response.data,
    //     });
    //     onClearData(response.data);
    //   } catch (e: unknown) {
    //     const error = e as HttpErrorResponse;
    //     modalStore.onShowInfoModal('Listar empresas', error.error?.message);
    //   } finally {
    //     modalStore.onLoading(false);
    //   }
    // };

    // const finalData = {
    //   company: {
    //     idCompany: 0,
    //     nickname: '',
    //     name: '',
    //     cnpj: '',
    //     ie: '',
    //     im: '',
    //   } as ICompany,
    //   address: {
    //     idAddress: 0,
    //     postalCode: '',
    //     address: '',
    //     number: '',
    //     complement: '',
    //     district: '',
    //     city: '',
    //     state: '',
    //   } as IAddress,
    //   employee: {
    //     idEmployee: 0,
    //     name: '',
    //     cpf: '',
    //     department: '',
    //     position: '',
    //     email: '',
    //     deskphone: '',
    //     cellphone: '',
    //     photoUrl: '',
    //   } as IEmployee,
    // };

    const onMaskNumericalField = (data: string): string => {
      return (data ?? '').replace(/[\D]/g, '');
    };

    // const onSetFinalData = (): void => {
    //   finalData.company.idCompany = store.companyData().idCompany;
    //   finalData.company.nickname = store.companyData().nickname;
    //   finalData.company.name = store.companyData().name;
    //   finalData.company.cnpj = onMaskNumericalField(store.companyData()?.cnpj || '');
    //   finalData.company.ie = onMaskNumericalField(store.companyData().ie || '');
    //   finalData.company.im = onMaskNumericalField(store.companyData().im || '');
    //   finalData.address.idAddress = addressStore.addressData().idAddress;
    //   finalData.address.postalCode = onMaskNumericalField(addressStore.addressData().postalCode);
    //   finalData.address.address = addressStore.addressData().address;
    //   finalData.address.number = addressStore.addressData().number;
    //   finalData.address.complement = addressStore.addressData().complement;
    //   finalData.address.district = addressStore.addressData().district;
    //   finalData.address.city = addressStore.addressData().city;
    //   finalData.address.state = addressStore.addressData().state;
    //   finalData.employee.isDefault = employeeStore.employeeData().isDefault;
    //   finalData.employee.idEmployee = employeeStore.employeeData().idEmployee;
    //   finalData.employee.name = employeeStore.employeeData().name;
    //   finalData.employee.department = employeeStore.employeeData().department;
    //   finalData.employee.position = employeeStore.employeeData().position;
    //   finalData.employee.photoUrl = employeeStore.employeeData().photoUrl;
    //   finalData.employee.email = employeeStore.employeeData().email;
    //   finalData.employee.deskphone = onMaskNumericalField(
    //     employeeStore.employeeData().deskphone || ''
    //   );
    //   finalData.employee.cellphone = onMaskNumericalField(
    //     employeeStore.employeeData().cellphone || ''
    //   );
    // };

    // const onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    //   try {
    //     modalStore.onLoading(true);
    //     onSetFinalData();
    //     const response = await companyApi.saveCompany(finalData);
    //     if (response.status) {
    //       modalStore.onSetModalInfoType('success');
    //       modalStore.onShowInfoModal('Cadastro de empresa', response.message, onActionOk);
    //     } else {
    //       modalStore.onShowInfoModal('Cadastro de empresa', response.error?.message || '');
    //     }
    //   } catch (e: unknown) {
    //     const error = e as HttpErrorResponse;
    //     modalStore.onShowInfoModal('Cadastro de empresa', error.error.message);
    //   } finally {
    //     modalStore.onLoading(false);
    //   }
    // };

    // const onDeleteRegister = async (
    //   idCompany: number,
    //   onActionOk?: ActionCallback
    // ): Promise<void> => {
    //   try {
    //     modalStore.onLoading(true);
    //     const response = await companyApi.deleteCompany(idCompany);
    //     if (response.status) {
    //       onShowDataList();
    //       modalStore.onSetModalInfoType('success');
    //       modalStore.onShowInfoModal('Excluir empresa', response.message, onActionOk);
    //     } else {
    //       modalStore.onShowInfoModal('Excluir empresa', response.error?.message || '');
    //     }
    //   } catch (e: unknown) {
    //     const error = e as HttpErrorResponse;
    //     modalStore.onShowInfoModal('Excluir empresa', error.error.message);
    //   } finally {
    //     modalStore.onLoading(false);
    //   }
    // };

    return {
      onSetHeaderDisplay,
      onSetCheckboxArrayToDefault,
      onHeaderCheckboxChecked,
      onBodyCheckboxCheckChange,
      onCheckTableCheckboxStatus,
      onKeyPressOnSearchInput,
      onClearData,
      onFilterThroughSearchInput,
      onKeyPressOnNotFoundFilterRegister,
      onKeyPressOnFilterBox,
      onFilterThroughFilterBox,
      onSetFilterBoxItemToDefault,
      onSetInputSearchFilterItemToDefault,
      onSetSortStateToDefault,
      onSetSortFilterToDefault,
      onMaskNumericalField,
      onSetFilterBoxValue,
      onClickOnFilterBtnThroughSearchInput,
      onClickOnFilterBtnThroughFilterBox,
      onClickOnFilterBtnThroughSort,
      onSetSlicePropsToNewValue,
      onSetSliceObjectToDefault,
      onSetPaginationToDefault,
      onSetCurrentPagePagination,
      onShowTableItemBox,
    };
  })
);
