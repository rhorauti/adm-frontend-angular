import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { ICompany } from '@core/interfaces/company.interface';
import { computed, inject } from '@angular/core';
import { ITableCheckbox, ITableHeader } from '@core/interfaces/table.interface';
import { IPagination } from '@core/interfaces/pagination.interface';
import { IFilterBoxCompany, IFilterHelpCompany } from '@core/interfaces/filter.interface';
import { ModalStore } from '@store/modal/modal.store';
import { CompanyApi } from '@core/http/company/company.api';
import { HttpErrorResponse } from '@angular/common/http';
import { ITab } from '@core/interfaces/tab.interface';
import { AddressStore } from '@store/address/address.store';
import { EmployeeStore } from '@store/employee/employee.store';
import { IAddress } from '@core/interfaces/address.interface';
import { IEmployee } from '@core/interfaces/employee.interface';

type FilterMethod = 'input-search' | 'filter-box';

export const CompanyStore = signalStore(
  { providedIn: 'root' },

  withState(() => ({
    tab: {
      tabList: ['Clientes', 'Fornecedores', 'MyCompany'],
      selectedTabIdx: 0,
    } as ITab,
    inputSearchValue: '',
    isTableHeaderBoxActive: false,
    tableHeaders: [
      { id: 0, isHeaderActive: true, sort: 0, headerName: '', databaseField: '' },
      { id: 1, isHeaderActive: true, sort: 0, headerName: 'Id', databaseField: 'idCompany' },
      {
        id: 2,
        isHeaderActive: true,
        sort: 0,
        headerName: 'Nome Fantasia',
        databaseField: 'nickname',
      },
      { id: 3, isHeaderActive: true, sort: 0, headerName: 'Razão Social', databaseField: 'name' },
      { id: 4, isHeaderActive: true, sort: 0, headerName: 'CNPJ/CPF', databaseField: 'cnpj' },
      { id: 5, isHeaderActive: false, sort: 0, headerName: 'Inscr. Estadual', databaseField: 'ie' },
      {
        id: 6,
        isHeaderActive: false,
        sort: 0,
        headerName: 'Inscr. Municipal',
        databaseField: 'im',
      },
    ] as ITableHeader[],
    tableHeaderSortList: ['normal', 'asc', 'desc'],
    tableCheckbox: {
      header: false,
      body: [],
    } as ITableCheckbox,
    initialTableData: [] as ICompany[],
    companiesData: [] as ICompany[],
    isDelBtnDisabled: false,
    companyData: {
      idCompany: 0,
      type: 0,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    } as ICompany,
    isFilterBoxActive: false,
    isFilterResultZeroRegister: false,
    filterBox: {
      idCompany: '',
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    } as IFilterBoxCompany,
    filterHelp: {
      inputSearch: '',
      idCompany: '',
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    } as IFilterHelpCompany,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      qtyPerPage: 10,
      pagesArray: [],
    } as IPagination,
    isEditRegister: false,
    isLoading: false,
  })),

  withComputed(store => ({
    itemSelected: computed(() => {
      const indexArray: number[] = [];
      store.tableCheckbox().body.forEach((value, index) => {
        if (value == true) indexArray.push(index);
      });
      if (indexArray.length == 1) {
        return store.companiesData()[indexArray[0]];
      } else {
        return null;
      }
    }),

    isAtLeastOneFilterBoxNotEmpty: computed(() => {
      return (
        store.filterBox().idCompany.length > 0 ||
        store.filterBox().nickname.length > 0 ||
        store.filterBox().name.length > 0 ||
        store.filterBox().cnpj.length > 0 ||
        store.filterBox().ie.length > 0 ||
        store.filterBox().im.length > 0
      );
    }),

    isAtLeastOneFilterHelpNotEmpty: computed(() => {
      return (
        store.filterHelp().inputSearch.length > 0 ||
        store.filterHelp().idCompany.length > 0 ||
        store.filterHelp().nickname.length > 0 ||
        store.filterHelp().name.length > 0 ||
        store.filterHelp().cnpj.length > 0 ||
        store.filterHelp().ie.length > 0 ||
        store.filterHelp().im.length > 0
      );
    }),

    isNicknameValid: computed(() => {
      return store.companyData().nickname.length > 2;
    }),

    isNameValid: computed(() => {
      return store.companyData().name.length > 2;
    }),

    isCnpjValid: computed(() => {
      return store.companyData().cnpj?.length == 14 || store.companyData().cnpj?.length == 18;
    }),
  })),

  withMethods(store => {
    const companyApi = inject(CompanyApi);
    const addressStore = inject(AddressStore);
    const employeeStore = inject(EmployeeStore);
    const modalStore = inject(ModalStore);

    const onLoading = (isLoading: boolean): void => {
      patchState(store, {
        isLoading: isLoading,
      });
    };

    const onTabChange = (tabIdx: number): void => {
      patchState(store, {
        tab: {
          ...store.tab(),
          selectedTabIdx: tabIdx,
        },
      });
      onShowDataList();
    };

    const onSetInputSearchValue = (inputData: string): void => {
      patchState(store, {
        inputSearchValue: inputData,
      });
    };

    const onChangeTabIdx = (idx: number): void => {
      patchState(store, {
        tab: {
          ...store.tab(),
          selectedTabIdx: idx,
        },
      });
    };

    const onShowTableHeaderBox = (isTableHeaderBoxActive: boolean): void => {
      patchState(store, {
        isTableHeaderBoxActive: isTableHeaderBoxActive,
      });
    };

    const onShowFilterBox = (isFilterBoxActive: boolean): void => {
      patchState(store, {
        isFilterBoxActive: isFilterBoxActive,
      });
    };

    const onShowHeader = (idx: number): void => {
      patchState(store, {
        tableHeaders: store.tableHeaders().map((header, index) => {
          if (index == idx) {
            return { ...header, isHeaderActive: !header.isHeaderActive };
          } else {
            return header;
          }
        }),
      });
    };

    const onFillNewCheckboxArray = (dataLength: number): void => {
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          body: Array.from({ length: dataLength }, () => false),
        },
      });
    };

    const onClearTableCheckbox = (): void => {
      patchState(store, {
        tableCheckbox: {
          header: false,
          body: store.tableCheckbox().body.map(() => false),
        },
      });
    };

    const onSetTableHeaderSortMethod = (idx: number) => {
      if (idx != store.tableHeaders().length - 1) {
        patchState(store, {
          tableHeaders: store.tableHeaders().map((header, index) => {
            if (idx == index) {
              return { ...header, sort: (header.sort + 1) % 3 };
            }
            return { ...header, sort: 0 };
          }),
        });
      }
    };

    const onSortTableHeader = (idx: number) => {
      onSetTableHeaderSortMethod(idx);
    };

    const onHeaderCheckboxChecked = (isChecked: boolean): void => {
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          header: isChecked,
          body: store.tableCheckbox().body.map(() => isChecked),
        },
      });
      onCheckTableCheckboxStatus(store.tableCheckbox().body);
    };

    const onBodyCheckboxChange = (index: number, event: Event) => {
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
      patchState(store, {
        isDelBtnDisabled: bodyCheckboxListUpdated.length != 1,
        tableCheckbox: {
          ...store.tableCheckbox(),
          header: bodyCheckboxListUpdated.length > 0,
        },
      });
    };

    const onHeaderCheckboxDisabled = (): void => {
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          header: false,
        },
      });
    };

    const onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
      if (event.key == 'Escape') {
        onClearData();
      }
    };

    const onKeyPressOnSearchInput = (event: KeyboardEvent): void => {
      if (event.key == 'Enter') {
        onFilterTableThroughSearchInput();
      } else if (event.key == 'Escape') {
        onClearData();
      }
    };

    const onClearData = (companiesData: ICompany[] = store.initialTableData()): void => {
      const companiesFilter = companiesData.filter(
        company => company.type == store.tab().selectedTabIdx
      );
      patchState(store, {
        initialTableData: companiesFilter,
        companiesData: companiesFilter,
        isFilterResultZeroRegister: false,
        inputSearchValue: '',
        companyData: {
          idCompany: 0,
          type: 0,
          nickname: '',
          name: '',
          cnpj: '',
          ie: '',
          im: '',
        },
        filterBox: {
          idCompany: '',
          nickname: '',
          name: '',
          cnpj: '',
          ie: '',
          im: '',
        },
        filterHelp: {
          inputSearch: '',
          idCompany: '',
          nickname: '',
          name: '',
          cnpj: '',
          ie: '',
          im: '',
        },
        tableCheckbox: {
          ...store.tableCheckbox(),
          header: false,
        },
        pagination: {
          ...store.pagination(),
          currentPage: 1,
          totalPages: 1,
          pagesArray: [],
        },
      });
      onFillNewCheckboxArray(companiesFilter.length);
      onGeneratePaginationPagesArray();
    };

    const onFilterTableThroughSearchInput = (): void => {
      const filterData = store.initialTableData().filter(company => {
        return ['idCompany', 'nickname', 'name'].some(key => {
          const filterResult = company[key as keyof ICompany];
          return (
            company.type == store.tab().selectedTabIdx &&
            String(filterResult)
              .toLowerCase()
              .trim()
              .includes(store.inputSearchValue().toLowerCase().trim())
          );
        });
      });
      if (filterData.length == 0) {
        patchState(store, {
          companiesData: filterData,
          isFilterResultZeroRegister: true,
        });
      } else {
        patchState(store, {
          companiesData: filterData,
          inputSearchValue: '',
          filterBox: {
            idCompany: '',
            nickname: '',
            name: '',
            cnpj: '',
            ie: '',
            im: '',
          },
          filterHelp: {
            inputSearch: store.inputSearchValue(),
            idCompany: '',
            nickname: '',
            name: '',
            cnpj: '',
            ie: '',
            im: '',
          },
        });
      }
    };

    const onKeyPressOnFilterBox = (event: KeyboardEvent): void => {
      if (event.key == 'Enter') {
        onFilterThroughFilterBox();
      }
    };

    const onApplyFilterHelp = (): void => {
      const keys = Object.keys(store.filterBox());
      keys.forEach(key => {
        patchState(store, {
          filterHelp: {
            ...store.filterHelp(),
            [key]: store.filterBox()[key as keyof IFilterBoxCompany],
          },
        });
      });
    };

    const onFilterThroughFilterBox = (): void => {
      const filter = store.initialTableData().filter(company => {
        return (
          company.type == store.tab().selectedTabIdx &&
          String(company.idCompany)
            .toLowerCase()
            .trim()
            .includes(store.filterBox().idCompany.trim()) &&
          company.nickname
            .toLowerCase()
            .trim()
            .includes(store.filterBox().nickname.toLowerCase().trim()) &&
          company.name.toLowerCase().trim().includes(store.filterBox().name.toLowerCase().trim()) &&
          (company.cnpj || '')
            .toLowerCase()
            .trim()
            .includes(store.filterBox().cnpj.toLowerCase().trim()) &&
          (company.ie || '')
            .toLowerCase()
            .trim()
            .includes(store.filterBox().ie.toLowerCase().trim()) &&
          (company.im || '')
            .toLowerCase()
            .trim()
            .includes(store.filterBox().im.toLowerCase().trim())
        );
      });
      if (filter.length == 0) {
        patchState(store, {
          companiesData: filter,
          isFilterResultZeroRegister: true,
          isFilterBoxActive: false,
        });
      } else {
        onApplyFilterHelp();
        patchState(store, {
          companiesData: filter,
          isFilterBoxActive: false,
          inputSearchValue: '',
          filterHelp: {
            ...store.filterHelp(),
            inputSearch: '',
          },
          filterBox: {
            idCompany: '',
            nickname: '',
            name: '',
            cnpj: '',
            ie: '',
            im: '',
          },
        });
      }
    };

    const onClearFilterItem = (key: string, filterMethod: FilterMethod): void => {
      if (filterMethod == 'input-search') {
        onFilterTableThroughSearchInput();
      } else {
        patchState(store, {
          filterBox: {
            ...store.filterHelp(),
            [key]: '',
          },
        });
        onFilterThroughFilterBox();
      }
    };

    const onInputValueChange = (key: string, value: string): void => {
      patchState(store, {
        filterBox: {
          ...store.filterBox(),
          [key]: value,
        },
      });
    };

    const onTableFilterBasedOnSearchInput = (): void => {
      if (store.inputSearchValue().length == 0) {
        onClearData();
      } else {
        onFilterTableThroughSearchInput();
      }
    };

    const onGeneratePaginationPagesArray = (): void => {
      patchState(store, {
        pagination: {
          ...store.pagination(),
          totalPages: Math.ceil(store.companiesData().length / store.pagination().qtyPerPage),
        },
      });
      if (store.pagination().totalPages < 7) {
        patchState(store, {
          pagination: {
            ...store.pagination(),
            pagesArray: Array.from({ length: store.pagination().totalPages }, (_, i) => i + 1),
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
    };

    const onSetNewCurrentPagePagination = (currentPage: number): void => {
      patchState(store, {
        pagination: {
          ...store.pagination(),
          currentPage: currentPage,
        },
      });
    };

    const onSetInputNewValue = (property: string, newValue: string): void => {
      patchState(store, {
        companyData: {
          ...store.companyData(),
          [property]: newValue,
        },
      });
    };

    const onShowDataList = async (): Promise<void> => {
      try {
        onLoading(true);
        const response = await companyApi.getCompaniesList();
        onClearData(response.data);
      } catch (e: unknown) {
        const error = e as HttpErrorResponse;
        modalStore.onShowInfoModal('failure', error?.message);
      } finally {
        onLoading(false);
      }
    };

    const finalData = {
      company: {
        idCompany: 0,
        type: 0,
        nickname: '',
        name: '',
        cnpj: '',
        ie: '',
        im: '',
      } as ICompany,
      address: {
        idAddress: 0,
        postalCode: '',
        address: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
      } as IAddress,
      employee: {
        idEmployee: 0,
        name: '',
        cpf: '',
        department: '',
        position: '',
        email: '',
        deskphone: '',
        cellphone: '',
      } as IEmployee,
    };

    const onMaskNumericalField = (data: string): string => {
      return (data ?? '').replace(/[\D]/g, '');
    };

    const onSetFinalData = (): void => {
      finalData.company.idCompany = store.companyData().idCompany;
      finalData.company.type = store.companyData().type;
      finalData.company.nickname = store.companyData().nickname;
      finalData.company.name = store.companyData().name;
      finalData.company.cnpj = onMaskNumericalField(store.companyData()?.cnpj || '');
      finalData.company.ie = onMaskNumericalField(store.companyData().ie || '');
      finalData.company.im = onMaskNumericalField(store.companyData().im || '');
      finalData.address.idAddress = addressStore.addressData().idAddress;
      finalData.address.postalCode = onMaskNumericalField(addressStore.addressData().postalCode);
      finalData.address.address = addressStore.addressData().address;
      finalData.address.number = addressStore.addressData().number;
      finalData.address.complement = addressStore.addressData().complement;
      finalData.address.district = addressStore.addressData().district;
      finalData.address.city = addressStore.addressData().city;
      finalData.address.state = addressStore.addressData().state;
      finalData.employee.isDefault = employeeStore.employeeData().isDefault;
      finalData.employee.idEmployee = employeeStore.employeeData().idEmployee;
      finalData.employee.name = employeeStore.employeeData().name;
      finalData.employee.department = employeeStore.employeeData().department;
      finalData.employee.position = employeeStore.employeeData().position;
      finalData.employee.email = employeeStore.employeeData().email;
      finalData.employee.deskphone = onMaskNumericalField(
        employeeStore.employeeData().deskphone || ''
      );
      finalData.employee.cellphone = onMaskNumericalField(
        employeeStore.employeeData().cellphone || ''
      );
    };

    const onSaveRegister = async (): Promise<void> => {
      try {
        onLoading(true);
        onSetFinalData();
        const response = await companyApi.saveCompany(finalData);
        if (response.status) {
          modalStore.onModalInfoActionOk(true);
          modalStore.onShowInfoModal('success', response.message);
          onShowDataList();
        } else {
          modalStore.onShowInfoModal('failure', response.message);
        }
      } catch (e: unknown) {
        const error = e as HttpErrorResponse;
        modalStore.onShowInfoModal('failure', error?.message);
      } finally {
        onLoading(false);
      }
    };

    const onDeleteRegister = async (idCompany: number): Promise<void> => {
      try {
        onLoading(true);
        const response = await companyApi.deleteCompany(idCompany);
        if (response.status) {
          modalStore.onModalInfoActionOk(true);
          modalStore.onShowInfoModal('success', response.message);
          onShowDataList();
        } else {
          modalStore.onShowInfoModal('failure', response.message);
        }
      } catch (e: unknown) {
        const error = e as HttpErrorResponse;
        modalStore.onShowInfoModal('failure', error?.message);
      } finally {
        onLoading(false);
      }
    };

    return {
      onTabChange,
      onSetInputSearchValue,
      onChangeTabIdx,
      onShowHeader,
      onShowDataList,
      onFillNewCheckboxArray,
      onHeaderCheckboxChecked,
      onBodyCheckboxChange,
      onCheckTableCheckboxStatus,
      onHeaderCheckboxDisabled,
      onKeyPressOnSearchInput,
      onClearData,
      onKeyPressOnNotFoundFilterRegister,
      onKeyPressOnFilterBox,
      onTableFilterBasedOnSearchInput,
      onFilterThroughFilterBox,
      onClearFilterItem,
      onInputValueChange,
      onClearTableCheckbox,
      onRemoveNumericalMask: onMaskNumericalField,
      onSetFinalData,
      onSaveRegister,
      onDeleteRegister,
      onSortTableHeader,
      onShowTableHeaderBox,
      onShowFilterBox,
      onGeneratePaginationPagesArray,
      onSetInputNewValue,
      onSetNewCurrentPagePagination,
      onLoading,
    };
  })
);
