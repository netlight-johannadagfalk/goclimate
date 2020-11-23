import { Controller } from 'stimulus';

export default class BusinessOffsetCalculatorController extends Controller {
  connect() {
    this.update();
  }

  update() {
    let numberOfEmployees = parseInt(this.employeesFieldTarget.value, 10);
    if (Number.isNaN(numberOfEmployees)) { numberOfEmployees = 0; }
    const tonnesCO2 = 22 * numberOfEmployees;
    const price = (tonnesCO2 * this.costPerTonne) / 12;

    this.costLabelTarget.innerText = Math.round(price).toLocaleString(window.locale);
  }

  get costPerTonne() {
    return parseInt(this.element.dataset.costPerTonne, 10);
  }
}

BusinessOffsetCalculatorController.targets = ['costLabel', 'employeesField'];
