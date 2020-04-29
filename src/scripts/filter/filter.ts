import { IFilter, IFilterView, IFilterModel } from "../interface/interface";
import { FilterProps, SelectedFilter, Filter as FilterType } from "../interface/types";

export default class Filter implements IFilter {
  tableElement: HTMLElement;
  filterSelector: string;
  view: IFilterView;
  model: IFilterModel;

  constructor(props: FilterProps) {
    this.tableElement = props.tableElement;
    this.filterSelector = props.filterSelector;
    this.view = props.filterView;
    this.model = props.filterModel;
    this.init();
  }

  get elements() {
    return {
      filter: this.tableElement.querySelector(`.${this.filterSelector}`),
      currentFilters: this.tableElement.querySelector(`.${this.view.currenFilterSelector}`),
      form: this.tableElement.querySelector(`.${this.view.filterFormSelector}`),
      buttonResetFilter: this.tableElement.querySelector(`.${this.view.filterResetSelector}`),
      filterInputs: this.tableElement.querySelectorAll(`.${this.view.filterInputSelector}`),
    };
  }

  bindEvents() {
    const form = this.elements.form as HTMLFormElement;
    const buttonResetFilter = this.elements.buttonResetFilter;
    const currentFilters = this.elements.currentFilters;

    currentFilters.addEventListener("click", (evt) => {
      const target = evt.target as HTMLElement;
      if (target.classList.contains(this.view.filterRemoveSelector)) {
        const name = target.dataset.filter;
        this.removeFilter(name);
        this.tableElement
          .querySelectorAll(`.${this.view.filterInputSelector}[name=${name}]`)
          .forEach((el: HTMLInputElement) => {
            if (el.classList.contains("min")) el.value = el.min;
            else el.value = el.max;
          });
      }
    });

    form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.filterSubmit();
    });

    form.addEventListener("change", (evt) => {
      evt.preventDefault();
      const input = evt.target as HTMLInputElement;
      if (input.classList.contains(this.view.filterInputSelector)) {
        this.validation(input);
      }
    });

    form.addEventListener("keyup", (evt) => {
      evt.preventDefault();
      const input = evt.target as HTMLInputElement;
      if (input.classList.contains(this.view.filterInputSelector)) {
        input.value = input.value.replace(/\D/g, "");
      }
    });

    buttonResetFilter.addEventListener("click", (evt) => {
      evt.preventDefault();
      form.reset();
      this.setFilter([]);
    });
  }

  filterSubmit() {
    const filterInputs = this.elements.filterInputs;
    let filter = [];
    filterInputs.forEach((input: HTMLInputElement) => {
      const name = input.getAttribute("name");
      const currentFilter = filter.find((el) => el.name === name);
      const filterTitle = this.getFilters().find((item: FilterType) => item.field === name).title;
      const value = input.value;
      const minValue = input.min;
      const maxValue = input.max;
      if (input.classList.contains("min") && value !== minValue) {
        if (currentFilter) {
          currentFilter.min = value;
        } else {
          filter.push({ name: name, title: filterTitle, min: value, max: maxValue });
        }
      }
      if (input.classList.contains("max") && value !== maxValue) {
        if (currentFilter) {
          currentFilter.max = value;
        } else {
          filter.push({ name: name, title: filterTitle, min: minValue, max: value });
        }
      }
    });
    this.setFilter(filter);
  }

  validation(input: HTMLInputElement) {
    const name = input.name;
    const value = +input.value;
    const filter = this.getFilters().find((f: FilterType) => f.field === input.name);

    if (value > +filter.max) {
      input.value = filter.max.toString();
    } else if (value < +filter.min) {
      input.value = filter.min.toString();
    } else {
      if (input.classList.contains("min")) {
        const maxValue = this.getMaxInputValue(name);
        if (value > +maxValue) {
          input.value = maxValue;
        }
      } else {
        const minValue = this.getMinInputValue(name);
        if (value < +minValue) {
          input.value = minValue;
        }
      }
    }
    if (input.value === "") {
      input.value = "0";
    }
  }

  getMinInputValue(name: string) {
    const input: HTMLInputElement = this.tableElement.querySelector(
      `.${this.view.filterInputSelector}.min[name=${name}]`
    );
    return input.value;
  }

  getMaxInputValue(name: string) {
    const input: HTMLInputElement = this.tableElement.querySelector(
      `.${this.view.filterInputSelector}.max[name=${name}]`
    );
    return input.value;
  }

  setFilter(filter: SelectedFilter[]) {
    if (JSON.stringify(filter) !== JSON.stringify(this.getFilter())) {
      this.model.setFilter(filter);
      this.tableElement.dispatchEvent(new CustomEvent("filterChange"));
      this.renderCurrentFilter();
    }
  }

  getFilter() {
    return this.model.filter;
  }

  getFilters() {
    return this.model.filters;
  }

  removeFilter(name) {
    this.model.removeFilter(name);
    this.tableElement.dispatchEvent(new CustomEvent("filterChange"));
    this.renderCurrentFilter();
  }

  renderCurrentFilter() {
    const filters = this.view.getCurrentFilterTemplate(this.getFilter());
    this.elements.currentFilters.innerHTML = filters;
  }

  renderFilters() {
    const filters = this.view.getTemplate(this.getFilters());
    this.elements.filter.innerHTML = filters;
  }

  init() {
    if (this.getFilters().length > 0) {
      this.renderFilters();
      this.bindEvents();
    }
  }
}