export default class NotificationMessage {
  element;
  timer;

  constructor(msg, {duration = 2000, type = "success"} = {}) {
    this.msg = msg;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  getTemplate() {
    return `
    <div class="notification ${this.type === 'success' ? 'success' : 'error'}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type === 'success' ? 'success' : 'error'}</div>
      <div class="notification-body">
        ${this.msg}
      </div>
    </div>
  </div>
    `;
  }

  render() {
    const div = document.createElement("div"); // (*)
    div.innerHTML = this.getTemplate();
    this.element = div.firstElementChild;
  }

  show(parent = document.body) {
    parent.append(this.element);
    this.timer = setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    clearTimeout(this.timer);
    if (this.element) {
      this.element.remove();
    }
  }
  destroy() {
    this.remove();
    this.element = null;
  }
}
