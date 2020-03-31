import { Controller } from 'stimulus';

export default class LifestyleCalculatorPreviewController extends Controller {
  calculate(event) {
    event.preventDefault();

    this.postForm()
      .then((response) => response.json())
      .then((data) => {
        if (data.error !== undefined) {
          this.errorTarget.innerText = data.error;
          this.clearResults();

          return;
        }

        this.errorTarget.innerText = '';
        this.setResults(data);
      });
  }

  postForm() {
    return fetch(this.element.action, {
      method: this.element.method,
      body: new FormData(this.element),
      credentials: 'include'
    });
  }

  setResults(data) {
    this.housingResultTarget.innerText = data.housing;
    this.foodResultTarget.innerText = data.food;
    this.carResultTarget.innerText = data.car;
    this.flightsResultTarget.innerText = data.flights;
    this.consumptionResultTarget.innerText = data.consumption;
    this.publicResultTarget.innerText = data.public;
    this.totalTarget.innerText = data.total;
    this.priceTarget.innerText = data.price;
  }

  clearResults() {
    this.housingResultTarget.innerText = '-';
    this.foodResultTarget.innerText = '-';
    this.carResultTarget.innerText = '-';
    this.flightsResultTarget.innerText = '-';
    this.consumptionResultTarget.innerText = '-';
    this.publicResultTarget.innerText = '-';
    this.totalTarget.innerText = '-';
    this.priceTarget.innerText = '-';
  }
}

LifestyleCalculatorPreviewController.targets = ['housingResult', 'foodResult', 'carResult', 'flightsResult', 'consumptionResult', 'publicResult', 'total', 'price', 'error'];
