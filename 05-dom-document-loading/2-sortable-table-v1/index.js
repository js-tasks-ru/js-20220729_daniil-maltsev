export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.data = data;
    this.headerConfig = headerConfig;
    this.render();

  }

  sort(field, param = 'asc') {

    const directions = {
      asc: 1,
      desc: -1
    };

    const filterType = this.headerConfig.filter(
      function(el) {
        return el.id === field;
      }
    )[0].sortType;

    function customSort(a, b) {
      if (filterType === 'number') {
        return directions[param] * (b[field] - a[field]);
      } else if (filterType === 'string') {
        return directions[param] * a[field].localeCompare(b[field],
          ['ru', 'en'],
          {caseFirst: 'upper'});
      }
    }
    return this.data.sort(customSort);
  }

  get tableContainer() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getTableHeader()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getTableBody()}
          </div>
        </div>
      </div>
    `;
  }

  getTableHeader() {
    return this.headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}"   data-sortable="${item.sortable ? 'true' : 'false'}" data-order="">
          <span>${item.title}</span>
        </div>
      `;
    }).join('');
  }

  getSortableCell(item) {

    return this.headerConfig.map(itemData => {

      if (typeof item[itemData.id] === 'object') {
        return `
        <div class="sortable-table__cell">
        <img class="sortable-table-image" alt="Image" src="${item.images.length > 0 ? item[itemData.id][0].url : 'https://via.placeholder.com/32'}">
        </div>
      `;
      } else {
        return `<div class="sortable-table__cell">${item[itemData.id]}</div>`;
      }
    }).join('');  
  }

  getTableBody() {
    return this.data.map(item => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
      ${this.getSortableCell(item)}
    </a>
      `;
    }).join('');
  }

  getProductList() {
    return this.data.map(item => {
      return `<li>${item.title}</li>`;
    }).join('');
  }

  render(parent = document.body) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.tableContainer;
    this.element = wrapper.firstElementChild;
    parent.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
  destroy() {
    this.remove();
    this.element = null;
  }
}

