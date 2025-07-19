import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { ICompany } from '@core/interfaces/company.interface';
import { computed, inject } from '@angular/core';
import { HttpRequestService } from '@core/api/http-request.service';
import { environment } from '@environments/environment';
import { ITableCheckbox } from '@core/interfaces/table.interface';
import { IPagination } from '@core/interfaces/pagination.interface';
import { IModalCheck, IModalForm, IModalInfo } from '@core/interfaces/modal.interface';
import { IFilterBoxCompany, IFilterHelpCompany } from '@core/interfaces/filter.interface';

type FilterMethod = 'input-search' | 'filter-box';

export const CompanyStore = signalStore(
  { providedIn: 'root' },

  withState(() => ({
    tab: {
      tabList: ['Clientes', 'Fornecedores', 'MyCompany'],
      selectedTabIdx: 0,
    },
    inputSearchValue: '',
    isTableHeaderBoxActive: false,
    tableHeaders: [
      { id: 0, isHeaderActive: true, sort: 0, headerName: '', databaseField: '' },
      { id: 1, isHeaderActive: true, sort: 0, headerName: 'Id', databaseField: 'idCompany' },
      { id: 2, isHeaderActive: true, sort: 0, headerName: 'Apelido', databaseField: 'nickname' },
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
    ],
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
    modalForm: {
      isActive: false,
      isEditForm: false,
      isInputClear: false,
    } as IModalForm,
    modalInfo: {
      type: '',
      description: '',
      isActive: false,
      isActionOk: false,
    } as IModalInfo,
    modalAsk: {
      isActive: false,
      isActionOk: false,
    } as IModalCheck,
    isLoading: false,
  })),

  withComputed(store => ({
    arrayDatasChecked: computed(() => {
      const itemsChecked = store
        .tableCheckbox()
        .body.map((value, index) => (value == true ? index : null))
        .filter(index => index != null);
      const datasChecked = store
        .companiesData()
        .map((value, index) => (itemsChecked.includes(index) ? value : null));
      return datasChecked.filter(value => value != null);
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
  })),

  withMethods(store => {
    const httpRequestService = inject(HttpRequestService);

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

    const onClearCompanyData = (): void => {
      patchState(store, {
        companyData: {
          ...store.companyData(),
          idCompany: 0,
          nickname: '',
          name: '',
          cnpj: '',
          ie: '',
          im: '',
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

    const onShowDataList = async (): Promise<void> => {
      try {
        patchState(store, {
          isLoading: true,
        });
        const response = await httpRequestService.sendHttpRequest(
          `${environment.apiUrl}/companies`,
          'GET'
        );
        onClearAllDatas(response.data);
      } catch (e: any) {
        onHandleModalInfo('failure', e?.error?.msg);
      } finally {
        patchState(store, {
          isLoading: false,
        });
      }
    };

    const fillNewCheckboxArray = (dataLength: number): void => {
      patchState(store, {
        tableCheckbox: {
          ...store.tableCheckbox(),
          body: Array.from({ length: dataLength }, () => false),
        },
      });
    };

    const onCloseModalForm = (): void => {
      if (store.modalForm().isActive) {
        if (store.modalForm().isEditForm) {
          patchState(store, {
            modalForm: {
              ...store.modalForm(),
              isEditForm: false,
              isInputClear: true,
            },
          });
          patchState(store, {
            modalForm: {
              ...store.modalForm(),
              isActive: false,
            },
          });
        }
      }
    };

    const clearTableCheckbox = (): void => {
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
        onClearAllDatas(store.initialTableData());
      }
    };

    const onKeyPressOnSearchInput = (event: KeyboardEvent): void => {
      if (event.key == 'Enter') {
        onFilterTableThroughSearchInput();
      } else if (event.key == 'Escape') {
        onClearAllDatas(store.initialTableData());
      }
    };

    const onClearAllDatas = (companiesData: ICompany[]): void => {
      const companiesFilter = companiesData.filter(
        company => company.type == store.tab().selectedTabIdx
      );
      patchState(store, {
        initialTableData: companiesFilter,
        companiesData: companiesFilter,
        isFilterResultZeroRegister: false,
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
          inputSearch: '',
          idCompany: '',
          nickname: '',
          name: '',
          cnpj: '',
          ie: '',
          im: '',
        },
      });
      fillNewCheckboxArray(companiesFilter.length);
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
        onClearAllDatas(store.initialTableData());
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

    const onSetCompanyProperty = (property: string, newValue: string): void => {
      patchState(store, {
        companyData: {
          ...store.companyData(),
          [property]: newValue,
        },
      });
    };

    const onShowModalEditForm = (): void => {
      const selectedData = store.arrayDatasChecked()[0];
      if (selectedData) patchState(store, { companyData: structuredClone(selectedData) });
      patchState(store, {
        modalForm: {
          ...store.modalForm(),
          isActive: true,
          isEditForm: true,
        },
      });
    };

    const onHandleModalInfo = (type: string, description: string): void => {
      patchState(store, {
        modalInfo: {
          ...store.modalInfo(),
          type: type,
          description: description,
        },
      });
    };

    const onCloseModalAsk = (): void => {
      if (store.modalAsk().isActive) {
        patchState(store, {
          modalAsk: {
            ...store.modalAsk(),
            isActive: false,
          },
        });
      }
    };

    const onCloseModalInfo = (): void => {
      if (store.modalInfo().isActionOk) {
        onShowDataList();
        onCloseModalForm();
        onCloseModalAsk();
        patchState(store, {
          modalInfo: {
            ...store.modalInfo(),
            isActionOk: false,
            isActive: false,
          },
        });
        clearTableCheckbox();
      } else {
        patchState(store, {
          modalInfo: {
            ...store.modalInfo(),
            isActive: false,
          },
        });
      }
    };

    const onShowModalAskToDelete = (): void => {
      const selectedData = store.arrayDatasChecked()[0];
      if (selectedData) {
        onHandleModalInfo(
          'confirmation',
          `Deseja excluir ${store.arrayDatasChecked().length == 1 ? selectedData.name : 'os registros selecionados?'}`
        );
        patchState(store, {
          modalAsk: {
            ...store.modalAsk(),
            isActive: true,
          },
        });
      }
    };

    const onModalAskActionOk = (): void => {
      deleteRegister();
      onClearCompanyData();
      patchState(store, {
        modalInfo: {
          ...store.modalInfo(),
          isActive: true,
          isActionOk: true,
        },
      });
    };

    const changePage = (page: number): void => {
      patchState(store, {
        pagination: {
          ...store.pagination(),
          currentPage: page,
        },
        tableCheckbox: {
          ...store.tableCheckbox(),
          header: false,
        },
      });
      onShowDataList();
    };

    const finalData = {
      idCompany: 0,
      date: '',
      type: 0,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    } as ICompany;

    const removeMask = (data: string): string => {
      return (data ?? '').replace(/[\D]/g, '');
    };

    const setFinalData = (): void => {
      finalData.idCompany = store.companyData().idCompany;
      finalData.type = store.companyData().type;
      finalData.nickname = store.companyData().nickname;
      finalData.name = store.companyData().name;
      finalData.cnpj = removeMask(store.companyData()?.cnpj || '');
      finalData.ie = removeMask(store.companyData().ie || '');
      finalData.im = removeMask(store.companyData().im || '');
    };

    const saveRegister = async (): Promise<void> => {
      try {
        patchState(store, {
          isLoading: true,
        });
        setFinalData();
        const response = await httpRequestService.sendHttpRequest(
          `${environment.apiUrl}/company`,
          'POST',
          finalData
        );
        if (!store.modalForm().isEditForm) {
          patchState(store, {
            pagination: {
              ...store.pagination(),
              currentPage: 1,
            },
          });
        }
        onHandleModalInfo('success', response.msg);
        patchState(store, {
          modalInfo: {
            ...store.modalInfo(),
            isActionOk: true,
            isActive: true,
          },
        });
      } catch (e: any) {
        onHandleModalInfo('failure', e?.error?.msg);
        patchState(store, {
          modalInfo: {
            ...store.modalInfo(),
            isActive: true,
          },
        });
      } finally {
        patchState(store, {
          isLoading: false,
        });
      }
    };

    const deleteRegister = async (): Promise<void> => {
      try {
        patchState(store, {
          isLoading: true,
        });
        const response = await httpRequestService.sendHttpRequest(
          `${environment.apiUrl}/companies/delete`,
          'POST',
          store.arrayDatasChecked()
        );
        patchState(store, {
          pagination: {
            ...store.pagination(),
            currentPage: 1,
          },
          modalAsk: {
            ...store.modalAsk(),
            isActive: true,
          },
        });
        onHandleModalInfo('success', response.msg);
        patchState(store, {
          modalInfo: {
            ...store.modalInfo(),
            isActive: true,
          },
        });
      } catch (e: any) {
        onHandleModalInfo('failure', e?.error?.msg);
        patchState(store, {
          modalInfo: {
            ...store.modalInfo(),
            isActive: true,
          },
        });
      } finally {
        patchState(store, {
          isLoading: false,
        });
      }
    };

    return {
      onTabChange,
      onSetInputSearchValue,
      onChangeTabIdx,
      onClearCompanyData,
      onShowHeader,
      onShowDataList,
      fillNewCheckboxArray,
      onHandleModalInfo,
      onShowModalAskToDelete,
      onCloseModalForm,
      onShowModalEditForm,
      onHeaderCheckboxChecked,
      onBodyCheckboxChange,
      onCheckTableCheckboxStatus,
      onHeaderCheckboxDisabled,
      onKeyPressOnSearchInput,
      onClearAllDatas,
      onKeyPressOnNotFoundFilterRegister,
      onKeyPressOnFilterBox,
      onTableFilterBasedOnSearchInput,
      onFilterThroughFilterBox,
      onClearFilterItem,
      onInputValueChange,
      clearTableCheckbox,
      onCloseModalAsk,
      onCloseModalInfo,
      onModalAskActionOk,
      changePage,
      removeMask,
      setFinalData,
      saveRegister,
      deleteRegister,
      onSortTableHeader,
      onShowTableHeaderBox,
      onShowFilterBox,
      onGeneratePaginationPagesArray,
      onSetCompanyProperty,
    };
  })
);
