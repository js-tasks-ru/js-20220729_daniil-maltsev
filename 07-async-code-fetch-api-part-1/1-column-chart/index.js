import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    chartHeight = 50;
  
    constructor({data, label, link, value, formatHeading, url, range} = {data: [], label: "", link: "", value: 0, formatHeading: data => data}) {
      this.url = url;
      this.range = range;
      this.data = [...(data || [])];
      this.label = label;
      this.link = link;
      this.value = value;
      this.formatHeading = formatHeading;
      this.loaded = false;
      this.render();
      this.getData();
    }

    
    getData = () => {
      console.log(this.url, this.range);
      let newUrl = new URL(BACKEND_URL);
      console.log('encode-data: ', encodeURIComponent(this.range.from.toISOString()));
      newUrl.pathname = this.url;
      newUrl.searchParams.set('')
      newUrl.searchParams.set(`from=${this.range.from.toISOString()}`, `to=${encodeURIComponent(this.range.to.toISOString())}`);
      //https://course-js.javascript.ru/api/dashboard/sales?from=2022-07-26T08%3A07%3A41.198Z&to=2022-08-25T08%3A07%3A41.198Z
      console.log(newUrl);
      async function getInfo() {
        try {
          let responce = await fetch(url);
          console.log('a: ');
          return await responce.json();
        } catch (err) {
          console.error(err);
        }
      }
      
      this.loaded = true;
      // console.log('b: ', this.loaded);

      // console.log('result', getInfo(), this.loaded);
    }
  
    formatChartItem(num, maxValue) {
      const scale = this.chartHeight / maxValue; 
  
      return {
        value: String(Math.floor(num * scale)),
        perc: (num / maxValue * 100).toFixed(0)
      };
    }
  
    getCharts() {
      const maxValue = Math.max(...this.data);
      return this.data.map(num => {
        const {value, perc} = this.formatChartItem(num, maxValue);
        return `<div style="--value: ${value}" data-tooltip="${perc}%"></div>`;
      }).join('');
    }
  
    render() {
      const div = document.createElement("div"); // (*)
      div.className = this.data.length ? `dashboard__chart_${this.label}` : 'column-chart_loading';
  
      div.innerHTML = `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        <a href=${this.link !== undefined ? this.link : null} class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading ? this.formatHeading(this.value) : this.value}</div>
        <div data-element="body" class="column-chart__chart">
           ${this.getCharts()}
        </div>
      </div>
    </div>
      `;
  
      this.element = div;
      document.body.append(div);
    }
  
    update(data) {
      this.data = [...(data || [])];
      this.remove();
      this.render();
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
    }
  }
  