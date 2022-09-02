import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};

  defaultFormData = {
    title: '',
    description: '',
    quantity: '',
    subcategory: '',
    status: 1,
    images: [],
    price: 100,
    discount: 0
  }

  onSubmit = event => {
    event.preventDefault();
    this.save();
  }

  initEventListeners() {

    const { productForm } = this.subElements;

    productForm.addEventListener('submit', this.onSubmit);
  }


  constructor (productId) {
    this.productId = productId;
  }

  async getContent() {
    
    let newUrl = new URL(BACKEND_URL);
    newUrl.pathname = '/api/rest/products';
    const param = newUrl.searchParams.set('id', this.productId);

    console.log(newUrl, param);
    return await fetchJson(newUrl, param);

  }

  async getCategories() {
    return await fetchJson('https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory');
  }

  getListCategories(categories) {
    return categories.map(item => {
      return item.subcategories.map(subitem => {
        return `<option value="${subitem.id}">${item.title} > ${subitem.title}</option>`;
      });
    });
  }

  async save() {
    const values = this.getFormData();
    
    try {
      const result = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      this.dispatchEvent(result.id);
    }
    catch (error) {
      console.error(error);
    }
  }

  dispatchEvent(id) {
    const event = this.productId ? 
      new CustomEvent('product-updated', {detail: id}) :
      new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }

  getFormData() {
    const { productForm, imageListContainer } = this.subElements;
    const execludedFields = ['images'];
    const formatToNumber = ['price', 'quantity', 'discount', 'status'];
    const fields = Object.keys(this.defaultFormData).filter(item => !execludedFields.includes(item));
    const getValue = field => productForm.querySelector(`[name=${field}]`).value;

    const values = {};

    for (const field of fields) {
      const value = getValue(field);
      
      values[field] = formatToNumber.includes(field)
        ? parseInt(value)
        : value;
    }

    const imagesHTMLCollection = imageListContainer.querySelectorAll('.sortable-table__cell-img');

    values.images = [];

    for (const img of imagesHTMLCollection) {
      values.images.push({
        url: img.src,
        source: img.alt
      });
    }

    return values;
  }

  setFormData() {
    const { productForm } = this.subElements; 
    const execludesFields = ['images'];
    const fields = Object.keys(this.defaultFormData).filter(item => !execludesFields.includes(item));

    for (const field of fields) {
      const element = productForm.querySelector(`#${field}`);

      element.value = this.formData[field] || this.defaultFormData[field];
    }
  }

  getListImages() {

    return `${this.formData.images.map(img => {
      return `<li class="products-edit__imagelist-item sortable-list__item" style="">
      <input type="hidden" name="url" value="${escapeHtml(img.url)}">
      <input type="hidden" name="source" value="${escapeHtml(img.source)}">
      <span>
    <img src="icon-grab.svg" data-grab-handle="" alt="grab">
    <img class="sortable-table__cell-img" alt="${escapeHtml(img.source)}" src="${escapeHtml(img.url)}">
    <span>${escapeHtml(img.source)}</span>
  </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
      </button></li>`;
    }).join('')}`;
  }

  getTemplate() {
    return `
    <form data-element="productForm" class="form-grid">
    <div class="form-group form-group__half_left">
      <fieldset>
        <label class="form-label">Название товара</label>
        <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
      </fieldset>
    </div>
    <div class="form-group form-group__wide">
      <label class="form-label">Описание</label>
      <textarea required id="description" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
    </div>
    <div class="form-group form-group__wide" data-element="sortable-list-container">
      <label class="form-label">Фото</label>
      <div data-element="imageListContainer"><ul class="sortable-list">
      ${this.getListImages()}
      
   </ul>
   </div>
      <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
    </div>
    <div class="form-group form-group__half_left">
      <label class="form-label">Категория</label>
      <select class="form-control" name="subcategory" id="subcategory">
        ${this.getListCategories(this.categories)}
      </select>
    </div>
    <div class="form-group form-group__half_left form-group__two-col">
      <fieldset>
        <label class="form-label">Цена ($)</label>
        <input required="" id="price" type="number" name="price" class="form-control" placeholder="100">
      </fieldset>
      <fieldset>
        <label class="form-label">Скидка ($)</label>
        <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
      </fieldset>
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Количество</label>
      <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Статус</label>
      <select id="status" class="form-control" name="status">
    
        <option value="1">Активен</option>
        <option value="0">Неактивен</option>
      </select>
    </div>
    <div class="form-buttons">
      <button type="submit" name="save" class="button-primary-outline">
        Сохранить товар
      </button>
    </div>
  </form>`;
  }

  async render () {
    const categoriesPromise = this.getCategories();
    const productPromise = this.productId ? this.getContent(this.productId) : Promise.resolve(this.defaultFormData);

    const [categoriesData, productResponce] = await Promise.all([categoriesPromise, productPromise]);
    const [productData] = productResponce;
    
    this.formData = productData;
    this.categories = categoriesData;

    this.renderForm();

    if (this.formData) {
      this.setFormData();
      this.initEventListeners();
    }

    return this.element;
   
  }

  getEmptyTemplate() {
    return `<div>
    <h1 class="page-title">Страница не найдена</h1>
        <p>Извините, данный товар не существует</p>
    </div>`;
  }

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElements[item.dataset.element] = item;
    }

    return subElements;
  }

  renderForm() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.formData ? this.getTemplate() : this.getEmptyTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(wrapper);
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
