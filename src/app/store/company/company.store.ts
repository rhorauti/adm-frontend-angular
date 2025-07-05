import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { ICompany } from '@core/interfaces/company.interface';
import { computed, inject } from '@angular/core';
import { HttpRequestService } from '@core/api/http-request.service';
import { environment } from '@environments/environment';
import { ITableCheckbox } from '@core/interfaces/table.interface';
import { IPagination } from '@core/interfaces/pagination.interface';
import { IModalCheck, IModalForm, IModalInfo } from '@core/interfaces/modal.interface';
import { ILoading } from '@core/interfaces/loading.interface';

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
    filter: {
      isBoxActive: false,
      isResultZeroRegister: false,
      idCompany: '',
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
    pagination: {
      currentPage: 1,
      lastPage: 1,
      qtyPerPage: 10,
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
    loading: {
      isLoading: false,
    } as ILoading,
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
  })),

  withMethods(store => {
    const httpRequestService = inject(HttpRequestService);

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

    const onClearData = (): void => {
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
        filter: {
          ...store.filter(),
          isBoxActive: isFilterBoxActive,
        },
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
          loading: {
            ...store.loading(),
            isLoading: true,
          },
        });
        const response = await httpRequestService.sendHttpRequest(
          `${environment.apiUrl}/company`,
          'GET'
        );
        patchState(store, {
          initialTableData: response.data,
          companiesData: response.data,
        });
        fillNewCheckboxArray(store.companiesData().length);
      } catch (e: any) {
        onHandleModalInfo('failure', e?.error?.msg);
      } finally {
        patchState(store, {
          loading: {
            ...store.loading(),
            isLoading: false,
          },
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

    const clearCheckbox = (): void => {
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
        onResetCompaniesData();
      }
    };

    const onKeyPressOnSearchInput = (event: KeyboardEvent): void => {
      if (event.key == 'Enter') {
        onFilterTable();
      } else if (event.key == 'Escape') {
        onResetCompaniesData();
      }
    };

    const onResetCompaniesData = (): void => {
      patchState(store, {
        companiesData: store.initialTableData(),
        inputSearchValue: '',
      });
    };

    const onFilterTable = (): void => {
      const filterData = store.initialTableData().filter(company => {
        return ['idCompany', 'nickname', 'name'].some(key => {
          const filterResult = company[key as keyof ICompany];
          return String(filterResult)
            .toLowerCase()
            .trim()
            .includes(store.inputSearchValue().toLowerCase().trim());
        });
      });
      if (filterData.length == 0) {
        patchState(store, {
          filter: {
            ...store.filter(),
            isResultZeroRegister: true,
          },
        });
      }
      patchState(store, {
        companiesData: filterData,
      });
    };

    const onKeyPressOnFilterBox = (event: KeyboardEvent): void => {
      if (event.key == 'Enter') {
        onTableFilterThroughFilterBox();
      }
    };

    const onTableFilterThroughFilterBox = (): void => {
      const filter = store.initialTableData().filter(company => {
        return (
          String(company.idCompany)
            .toLowerCase()
            .trim()
            .includes(String(store.filter().idCompany).toLowerCase().trim()) &&
          company.nickname
            .toLowerCase()
            .trim()
            .includes(store.filter().nickname.toLowerCase().trim()) &&
          company.name.toLowerCase().trim().includes(store.filter().name.toLowerCase().trim()) &&
          (company.cnpj || '')
            .toLowerCase()
            .trim()
            .includes(store.filter().cnpj.toLowerCase().trim()) &&
          (company.ie || '')
            .toLowerCase()
            .trim()
            .includes(store.filter().ie.toLowerCase().trim()) &&
          (company.im || '').toLowerCase().trim().includes(store.filter().im.toLowerCase().trim())
        );
      });
      patchState(store, {
        companiesData: filter,
        filter: {
          ...store.filter(),
          isBoxActive: false,
        },
      });
    };

    const onInputValueChange = (key: string, value: string): void => {
      patchState(store, {
        filter: {
          ...store.filter(),
          [key]: value,
        },
      });
    };

    const onTableFilterBasedOnSearchInput = (): void => {
      if (store.inputSearchValue().length == 0) {
        onResetCompaniesData();
      } else {
        onFilterTable();
      }
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
        clearCheckbox();
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
      onClearData();
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
          loading: {
            ...store.loading(),
            isLoading: true,
          },
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
          loading: {
            ...store.loading(),
            isLoading: false,
          },
        });
      }
    };

    const deleteRegister = async (): Promise<void> => {
      try {
        patchState(store, {
          loading: {
            ...store.loading(),
            isLoading: true,
          },
        });
        const response = await httpRequestService.sendHttpRequest(
          `${environment.apiUrl}/company/delete`,
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
          loading: {
            ...store.loading(),
            isLoading: false,
          },
        });
      }
    };

    return {
      onSetInputSearchValue,
      onChangeTabIdx,
      onClearData,
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
      onResetCompaniesData,
      onKeyPressOnNotFoundFilterRegister,
      onKeyPressOnFilterBox,
      onTableFilterBasedOnSearchInput,
      onTableFilterThroughFilterBox,
      onInputValueChange,
      clearCheckbox,
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
    };
  })
);
