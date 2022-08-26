class Tooltip {
  element;
  tooltipText = '';

  static activeTooltip;

  constructor() {
    if (Tooltip.activeTooltip) {
      return Tooltip.activeTooltip;
    }

    Tooltip.activeTooltip = this;

    this.initEventListeners();
  }

  getTemplate = () => {
    return `<div class="tooltip">${this.tooltipText}</div>`;
  }

  showTooltip = (event) => {
    
    const tolltipArea = event.target.dataset.tooltip;

    if (tolltipArea) {
      this.tooltipText = tolltipArea;
      this.render();
    }
  }

  getCoordinate(event) {
    document.querySelector('.tooltip').style.left = `${event.clientX + 10}px`;
    document.querySelector('.tooltip').style.top = `${event.clientY + 10}px`;
  }

  initialize() {
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.destroy);
    document.addEventListener('pointermove', this.getCoordinate);
  }

  render(text = '') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const element = wrapper.firstElementChild;

    this.element = element;
    document.body.append(this.element);
  }
  
  remove = () => {
    if (this.element) {
      this.element.remove();
    }
  }
  destroy = () => {
    this.remove();
    this.element = null;
    Tooltip.activeTooltip = null;
  }
}

export default Tooltip;
