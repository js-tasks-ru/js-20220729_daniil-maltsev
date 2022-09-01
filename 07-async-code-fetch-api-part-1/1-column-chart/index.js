import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    subElements = {};
    chartHeight = 50;
  
    constructor(
      {
        label = '',
        link = '',
        value = '',
        formatHeading = data => data,
        url = '',
        range = {
          from: new Date(),
          to: new Date(),
        }
      } = {}) {
      this.url = url;
      this.range = range;
      this.label = label;
      this.link = link;
      this.value = value;
      this.formatHeading = formatHeading;

      this.render();
      this.update(this.range.from, this.range.to);
    }

    
    getData = async (searchFrom = this.range.from, searchTo = this.range.to) => {
      let newUrl = new URL(this.url, BACKEND_URL);
      console.log('getData URL', newUrl);
      const dataFrom = searchFrom.toISOString();
      const dataTo = searchTo.toISOString();
      newUrl.searchParams.set('from', dataFrom);
      newUrl.searchParams.set('to', dataTo);

      try {
        let responce = await fetch(newUrl);

        const newData = await responce.json();
        
        const newArr = Object.values(newData);

        this.element.classList.remove('column-chart_loading');

        this.value = newArr.reduce((a, b) => {
          return a + b;
        });
        return newData;
      } catch (err) {
        console.error(err);
      }
    }
  
    formatChartItem(num, maxValue) {
      const scale = this.chartHeight / maxValue; 
  
      return {
        value: String(Math.floor(num * scale)),
        perc: (num / maxValue * 100).toFixed(0)
      };
    }
  
    getCharts(data) {
      const newArr = Object.values(data);
      const maxValue = Math.max(...newArr);

      return newArr.map(num => {
        const {value, perc} = this.formatChartItem(num, maxValue);
        return `<div style="--value: ${value}" data-tooltip="${perc}%"></div>`;
      }).join('');
    }

    getHeader(value) {
      return `${this.formatHeading ? this.formatHeading(value) : value}`;
    }

    getSubElements(element) {

      const elements = element.querySelectorAll('[data-element]');

      return [...elements].reduce((accum, subElement) => {
        accum[subElement.dataset.element] = subElement;

        return accum;
      }, {});
    }

    getTemplate() {
      return `
      <div class="column-chart column-chart_loading  dashboard__chart_${this.label}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        <a href=${this.link !== undefined ? this.link : null} class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
        
        </div>
      <div data-element="body" class="column-chart__chart">

      </div>
      </div>
    </div>
      `;
    }
  
    render() {
      const wrapper = document.createElement('div');

      wrapper.innerHTML = this.getTemplate();
  
      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubElements(this.element);

      document.body.append(this.element);
    }
  
    async update(dataFrom, dataTo) {
      const newData = await this.getData(dataFrom, dataTo);
      const value = Object.values(newData).reduce((a, b) => { return a + b; });
      console.log('value', value);
     
      this.subElements.body.innerHTML = this.getCharts(newData);
      this.subElements.header.innerHTML = this.getHeader(value);
      console.log('els: ', this.subElements);
      const newArr = Object.values(newData);

      this.data = newData;
      return this.data;
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
    }
}
  