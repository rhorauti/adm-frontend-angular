import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { ITableHeader } from '@core/interfaces/table.interface';
import { IPagination } from '@core/interfaces/pagination.interface';
import { saveStorage } from '@core/utils/misc';
import {
  IBaseRegisterStore as IBaseRegisterStore,
  FilterHelp,
} from '@core/interfaces/base.register.interface';
import { BaseType, MaybeMergeValue, StoreType, KeyOfData } from '@core/types/base.type';

export const defaultTableHeaderIcon = 'unfold_more';

export const BaseRegisterStore = signalStore(
  { providedIn: 'root' },

  withState<IBaseRegisterStore<BaseType>>(() => ({
    isCopiedData: false,
    inputSearchValue: '',
    isTableHeaderBoxActive: false,
    tableHeaders: [] as ITableHeader<BaseType>[],
    tableCheckbox: {
      header: false,
      body: [] as boolean[],
    },
    tableItemsBox: [] as boolean[],
    initialData: [] as BaseType[],
    isDelBtnDisabled: false,
    dataList: [] as BaseType[],
    data: {} as BaseType,
    isFilterBoxActive: false,
    isFilterResultZeroRegister: false,
    filterBox: {} as unknown as BaseType,
    filterHelp: { inputSearch: '' } as FilterHelp<BaseType>,
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

    isAtLeastOneFilterHelpNotEmpty: computed(() => {
      return Object.values(store.filterHelp()).some(v => v.trim().length > 0);
    }),
  })),

  withMethods(store => {
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

    const onSetFilterBoxValue = (key: string, value: string): void => {
      patchState(store, {
        filterBox: {
          ...store.filterBox(),
          [key]: value,
        },
      });
    };

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
          if (header.sortDirection == 0) {
            return { ...header, icon: defaultTableHeaderIcon };
          } else if (header.sortDirection == 1) {
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
            return { ...header, sortDirection: (header.sortDirection + 1) % 3 };
          }
          return { ...header, sortDirection: 0 };
        }),
      });
    };

    const onSetTableDataSortDirectionToDefault = <T extends keyof BaseType>(): void => {
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

    const onClearData = (data: BaseType[] = store.initialData()): void => {
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

    const onSetInputSearchFilterItemToDefault = (fieldList?: KeyOfData[]): void => {
      onSetSliceObjectToDefault('filterBox');
      onSetSliceObjectToDefault('filterHelp');
      onSetSlicePropsToNewValue('inputSearchValue', '');
      const fields = fieldList ?? store.tableHeaders().map(h => h.databaseField as KeyOfData);
      const filterData = onFilterThroughSearchInput(fields);
      onSetSlicePropsToNewValue('dataList', filterData);
      if (filterData.length == 0) {
        onSetSlicePropsToNewValue('isFilterResultZeroRegister', true);
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

    const onFilterThroughSearchInput = <K extends keyof BaseType>(
      fieldList?: KeyOfData[]
    ): BaseType[] => {
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

    const onFilterThroughFilterBox = <K extends keyof BaseType>(): BaseType[] => {
      return store.initialData().filter(data => {
        const stringObj = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, String(value || '')])
        ) as Record<string, string>;
        return Object.keys(stringObj).every(key => {
          const filterVal = store.filterBox()[key as keyof BaseType];
          if (filterVal == null || String(filterVal).trim() === '') return true;
          return stringObj[key]
            .toLowerCase()
            .trim()
            .includes(store.filterBox()[key as K]);
        });
      });
    };

    /**
     * Sort the companiesData according to sort status defined on onSetTableHeaderSortMethod
     * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
     * @param idx The index of the clicked table column.
     */
    const onFilterThroughSort = <K extends keyof BaseType>(idx: number): BaseType[] => {
      const keyId = Object.keys(store.dataList()[0])[0] as K;
      const header = store.tableHeaders()[idx];
      const key = header.databaseField as K;
      const sortDirection = header.sortDirection;
      if (store.tableHeaders()[idx].sortDirection == 0) {
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

    const onApplyFilterHelpThroughFilterBox = <K extends keyof BaseType>(): void => {
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
      onSetPaginationArray();
    };

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

    const onMaskNumericalField = (data: string): string => {
      return (data ?? '').replace(/[\D]/g, '');
    };

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
