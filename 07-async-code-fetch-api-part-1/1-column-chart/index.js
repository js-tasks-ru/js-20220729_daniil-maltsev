import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    subElements;
    chartHeight = 50;

    constructor({
      label = '',
      link = '',
      formatHeading = data => data,
      url = '',
      range = {
        from: new Date(),
        to: new Date(),
      }
    } = {}) {
      this.url = new URL(url, BACKEND_URL);
  
      this.range = range;
      this.label = label;
      this.link = link;
      this.formatHeading = formatHeading;
  
      this.render();
      this.update(this.range.from, this.range.to);
    }

    async loadData(from, to) {
      this.url.searchParams.set('from', from.toISOString());
      this.url.searchParams.set('to', to.toISOString());

      return await fetchJson(this.url);
    }

    getHeaderTable(data) {
      return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
    }

    setNewRange(from, to) {
      this.data.range.from = from;
      this.data.range.to = to;
    }

    getTableBody(data) {

      const maxItem = Math.max(...Object.values(data));
      const scale = this.chartHeight / maxItem;
      console.log('Max: ', maxItem);

      return Object.values(data).map(item => {
        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="6%"></div>`
      }).join('');
    }

    getLink() { 
      return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
    }

    async update(from, to) {
      this.element.classList.add('column-chart_loading');
      const data = await this.loadData(from, to);

      if (data && Object.values(data).length) {
        console.log('data if', data);
        this.subElements.header.textContent = this.getHeaderTable(data);
        this.subElements.body.innerHTML = this.getTableBody(data);
      }
      
      

      await this.element.classList.remove('column-chart_loading');

      this.data = data;
      return this.data;
    }

    getTemplate() {
      return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.getLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header"></div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>
      `;
    }

    getSubElements(element) {
      const elements = element.querySelectorAll('[data-element]');
      const subElements = {};

      for (const element of elements) {
        subElements[element.dataset.element] = element;
      }

      return subElements;
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTemplate();

      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubElements(wrapper);

      console.log('test', this.element.querySelector('.column-chart__link'));
      console.log(this.subElements);

      document.body.append(this.element);
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
    }
}
  