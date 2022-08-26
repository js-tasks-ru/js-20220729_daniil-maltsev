export default class SortableTable {
  element;
  subElements;

  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sorted).id,
      order: 'asc'
    },
    isSortLocally = true
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.render();
    this.initEventListeners();
  }

  getTableHeader() {
    // console.log(this.headersConfig);
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
  ${this.headersConfig.map(item => {
    return this.getHeaderCell(item);
  }).join('')}
    </div>`;
  }

  getHeaderCell({id, title, sortable} = item) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
    <span>${title}</span>
    ${this.getHeaderSortingArrow(id)}
  </div>`;
  }

  getTableBody(data) {
    // console.log(this.data);
    return `<div data-element="body" class="sortable-table__body">
    ${this.getTableRows(data)}
    </div>`;
  }

  getTableRows(data = []) {
    return data.map(item => {
      return `<a href="/products/${item.id}" class="sortable-table__row">
      ${this.getTableRow(item)}
    </a>`;
    }).join('');
  }


  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {id, template};
    });

    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTemplate(sortedData) {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(sortedData)}
      </div>
    </div>
    `;
  }
 
  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sortData(id, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1; 

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en']);
      case 'custom':
        return direction * customSorting(a, b);
      default:
        return direction * (a[id] - b[id]);
      }
    });
  }

  // sort(field, order) {
  //   const sortedData = this.sortData(field, order);
  //   const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
  //   const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

  //   allColumns.forEach(column => {
  //     column.dataset.order = '';
  //   });

  //   currentColumn.dataset.order = order;

  //   this.subElements.body.innerHTML = this.getTableRows(sortedData);
  // }data-order="asc"

  initEventListeners() {
    document.addEventListener('pointerdown', this.sortOnClick);
  }

  getHeaderSortingArrow (id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  sortOnClick = (event) => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      // console.log('before', this.subElements.body);
      const {id, order} = column.dataset;
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      // console.log('sorted', sortedData, id, order);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

       column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      console.log('after', this.subElements.body);

      this.subElements.body.innerHTML = this.getTableRows(sortedData);

      // console.log('onClick sub', this.subElements.body);
    }

    // const sortType = event.target.closest('div').dataset.sortable;
    // const fieldOrder = event.target.closest('div').dataset.order;
    // event.target.closest('div').dataset.order = 'ascdd';


    // console.log(id, order, 'dge');

    // if (sortType) {
    //   this.sort(id, order === undefined || order != 'desc' ? 'desc' : 'asc');
    // }

  }

  sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // console.log('a', allColumns)

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
    // console.log('sorting');
  }

  render() {
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');
    const sortedData = this.sortData(id, order);

    wrapper.innerHTML = this.getTemplate(sortedData);


    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
