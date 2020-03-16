import { Controller } from 'stimulus';

export default class FlightFootprintForm extends Controller {
  update() {
    if (this.element.origin_airport.value === '' || this.element.destination_airport.value === '') {
      this.clearResults();
      return;
    }
    if (this.element.num_persons.value < 1) {
      this.clearResults();
      this.personsFormGroupTarget.classList.add('has-error');
      this.personsMessageTarget.classList.remove('hidden');
      return;
    }
    this.personsFormGroupTarget.classList.remove('has-error');
    this.personsMessageTarget.classList.add('hidden');

    this.postForm()
      .then((response) => response.json())
      .then((data) => {
        this.footprintTarget.innerText = data.footprint;
        this.priceTarget.innerText = data.price;
        this.offsetLinkTarget.href = data.offset_path;
      });
  }

  clearResults() {
    this.footprintTarget.innerText = '-';
    this.priceTarget.innerText = '-';
    this.offsetLinkTarget.removeAttribute('href');
  }

  postForm() {
    return fetch(this.element.action, {
      method: this.element.method,
      body: new FormData(this.element),
      credentials: 'include'
    });
  }
}

FlightFootprintForm.targets = ['personsFormGroup', 'personsMessage', 'footprint', 'price', 'offsetLink'];
