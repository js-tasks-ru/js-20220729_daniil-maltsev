import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    element;
    subElemnets = {};
    components = {};
    url = new URL(`api/dashboard/bestsellers`, BACKEND_URL);
    now = new Date();

    constructor({ 
      range = {
        from: new Date(this.now.setMonth(this.now.getMonth() - 1)),
        to: new Date()
      }
    } = {}) {
      this.range = range;
      this.render();
      this.initEventListeners();
      this.listenEvents();
    }

    listenEvents() {
      document.addEventListener('date-select', (event) => {
        this.range = event.detail;
        this.updateComponents(this.range.from, this.range.to);
      });
    }

    initEventListeners() {
      // const { rangePicker } = this.components;

      // rangePicker.element.addEventListener('date-select', (event) => {
      //   console.log(event);
      //   // const 
      //   // this.updateComponents(this.range.from, this.range.to);
      // });
    }

    getTemplate() {
      return `
      <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <!-- RangePicker component -->
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <!-- column-chart components -->
        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>
      `;
    }
    

    getSubElements(element) {
      const subElements = {};
      const elements = element.querySelectorAll('[data-element]');

      for (const item of elements) {
        subElements[item.dataset.element] = item;
      }

      return this.subElements = subElements;
    }

    showComponents() {
      const rangePicker = new RangePicker(this.range);
      const sortableTable = new SortableTable(header, {
        url: 'api/dashboard/bestsellers',
        range: this.range,
      });
      const customersChart = new ColumnChart({
        url: 'api/dashboard/customers',
        range: this.range,
        label: 'customers',
      });
      const salesChart = new ColumnChart({
        url: 'api/dashboard/sales',
        range: this.range,
        label: 'sales',
        formatHeading: data => `$${data}`
      });
      const ordersChart = new ColumnChart({
        url: 'api/dashboard/orders',
        range: this.range,
        label: 'orders',
        link: '#'
      });

      this.subElements.sortableTable.append(sortableTable.element);
      this.subElements.rangePicker.append(rangePicker.element);
      this.subElements.customersChart.append(customersChart.element);
      this.subElements.salesChart.append(salesChart.element);
      this.subElements.ordersChart.append(ordersChart.element);

      return this.components = {rangePicker, customersChart, salesChart, ordersChart};
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTemplate();

      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubElements(wrapper);
      this.showComponents();

      return this.element;
    }

    async updateComponents (from, to) {
      const { customersChart, salesChart, ordersChart } = this.components;
      customersChart.update(from, to);
      salesChart.update(from, to);
      ordersChart.update(from, to);
    }

    destroy () {
      this.remove();
      this.element = null;
      this.subElements = null;
    }

    remove () {
      if (this.element) {
        this.element.remove();
      }
    }
}
