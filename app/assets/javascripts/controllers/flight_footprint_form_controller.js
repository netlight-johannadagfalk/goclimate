import { Controller } from 'stimulus';

export default class FlightFootprintForm extends Controller {
  update() {
    if (this.element.origin_airport.value === '' || this.element.destination_airport.value === '') {
      this.footprintTarget.innerText = '-';
      this.priceTarget.innerText = '-';
      this.offsetLinkTarget.removeAttribute('href');
      return;
    }

    this.postForm()
      .then((response) => response.json())
      .then((data) => {
        this.footprintTarget.innerText = data.footprint;
        this.priceTarget.innerText = data.price;
        this.offsetLinkTarget.href = data.offset_path;
      });
  }

  postForm() {
    return fetch(this.element.action, {
      method: this.element.method,
      body: new FormData(this.element),
      credentials: 'include'
    });
  }
}

FlightFootprintForm.targets = ['footprint', 'price', 'offsetLink'];
