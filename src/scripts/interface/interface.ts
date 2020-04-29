import { Filter, SelectedFilter, Column } from "./types";

export interface IData {
  getData(url: string): Promise<any>;
}

export interface IReport {
  tableElement: HTMLElement;
  columns: Column[];
  itemsPerPage: number;
  data: IData;
  view: IReportView;
  init(): void;
}

export interface IReportView {
  getTemplate(): string;
}

export interface ITable {
  tableElement: HTMLElement;
  pagination?: IPagination;
  filter?: IFilter;
  view: ITableView;
  model: ITableModel;
  init(): void;
}
export interface ITableView {
  tableHeadSelector: string;
  tableBodySelector: string;
  sortFieldSelector: string;
  getTemplate(): string;
  getHeaderTemplate(column: Column): string;
  getColumnTemplate(item: string): string;
  getRowTemplate(item: string): string;
}

export interface ITableModel {
  initialData: object[];
  data: object[];
  currentPage: number;
  itemsPerPage: number;
  getData(): object[];
  getNewSortOrder(order: string): string;
  setFilter(filter: SelectedFilter[]): void;
  setSort(field: string, orderBy: string): void;
}

export interface IPagination {
  view: IPaginationView;
  model: IPaginationModel;
  getCurrentPage(): number;
  getItemsPerPage(): number;
  init(): void;
}

export interface IPaginationView {
  paginationItemSelector: string;
  itemsPerPageSelectSelector: string;
  getTemplate(pages: (string | number)[], currentPage: number, pageCount: number): string;
  getItemsPerPageTemplate(options: number[], selected: number): string;
}
export interface IPaginationModel {
  itemsPerPage: number;
  dataLength: number;
  currentPage: number;
  pages: (string | number)[];
  pageCount: number;
  setPage(page: number): void;
  setItemsPerPage(itemsPerPage: number): void;
  setDataLength(value: number): void;
}

export interface IFilter {
  getFilter(): SelectedFilter[];
  init(): void;
}

export interface IFilterView {
  currenFilterSelector: string;
  filterFormSelector: string;
  filterResetSelector: string;
  filterInputSelector: string;
  filterRemoveSelector: string;
  getTemplate(data: Filter[]): string;
  getCurrentFilterTemplate(currentFilter: SelectedFilter[]): string;
}
export interface IFilterModel {
  data: object[];
  columns: Column[];
  filter: SelectedFilter[];
  filters: Filter[];
  setFilter(filter: SelectedFilter[]): void;
  removeFilter(name: string): void;
}