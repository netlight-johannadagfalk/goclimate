import { Controller } from 'stimulus';

export default class AddBusinessCalculatorFieldController extends Controller {
  cloneToDestination() {
    const clone = this.templateTarget.cloneNode(true);
    clone.classList.remove('hidden');
    this.destinationTarget.appendChild(clone);

    clone.dataset.target = clone.dataset.target.replace('add-business-calculator-field.template', '');
  }

  cloneToDestinationWithFirstNumberIncremented() {
    this.cloneToDestination();

    this.templateTarget.querySelectorAll('.add-business-calculator-field-input-field').forEach((inputElement) => {
      AddBusinessCalculatorFieldController
        .incrementFirstNumberOnInputElement(inputElement);
    });

    this.templateTarget.querySelectorAll('.add-business-calculator-field-label-field').forEach((labelElement) => {
      const newForValue = AddBusinessCalculatorFieldController
        .incrementFirstIntegerOfArray(labelElement.htmlFor.split('_')).join('_');
      labelElement.htmlFor = newForValue;
    });
  }

  cloneToDestinationWithSecondNumberIncremented() {
    this.cloneToDestination();

    this.templateTarget.querySelectorAll('.add-business-calculator-field-input-field').forEach((inputElement) => {
      AddBusinessCalculatorFieldController
        .incrementLastNumberOnInputElement(inputElement);
    });

    this.templateTarget.querySelectorAll('.add-business-calculator-field-label-field').forEach((labelElement) => {
      const newForValue = AddBusinessCalculatorFieldController
        .incrementLastIntegerOfArray(labelElement.htmlFor.split('_')).join('_');
      labelElement.htmlFor = newForValue;
    });
  }

  static incrementFirstNumberOnInputElement(element) {
    const newId = AddBusinessCalculatorFieldController
      .incrementFirstIntegerOfArray(element.id.split('_')).join('_');
    element.id = newId;

    const newName = AddBusinessCalculatorFieldController
      .incrementFirstIntegerOfArray(element.name.split('][')).join('][');
    element.name = newName;
  }

  static incrementLastNumberOnInputElement(element) {
    const newId = AddBusinessCalculatorFieldController
      .incrementLastIntegerOfArray(element.id.split('_')).join('_');
    element.id = newId;

    const newName = AddBusinessCalculatorFieldController
      .incrementLastIntegerOfArray(element.name.split('][')).join('][');
    element.name = newName;
  }

  static incrementFirstIntegerOfArray(array) {
    const indexToIncrement = array.findIndex((a) => Number.isInteger(Number(a)));
    array[indexToIncrement] = String(Number(array[indexToIncrement]) + 1);
    return array;
  }

  static incrementLastIntegerOfArray(array) {
    const newArray = AddBusinessCalculatorFieldController
      .incrementFirstIntegerOfArray(array.reverse()).reverse();
    return newArray;
  }
}

AddBusinessCalculatorFieldController.targets = ['template', 'destination'];
