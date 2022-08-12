export default class ColumnChart {
  chartHeight = 50;

  constructor({data, label, link, value, formatHeading} = {data: [], label: "", link: "", value: 0, formatHeading: data => data}) {
    this.data = [...(data || [])];
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.render();
    this.initEventListeners();
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
  //   return `
  //   ${ this.data.length === 0 ? null : this.data.map(item => {
  //   return `<div style="--value: ${item / 2}" data-tooltip="6%"></div>`;
  // }).join('')}
  // `;
  }

  getTemplate() {
    console.log(this.data);
    return `
    <div class="column-chart ${ this.data.length === 0 ? 'column-chart_loading' : null}" style="--chart-height: ${this.chartHeight}">
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

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
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
    // NOTE: удаляем обработчики событий, если они есть
  }
}
