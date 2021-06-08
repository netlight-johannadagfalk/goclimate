import { Controller } from 'stimulus';

const numberPattern = /\d+/g;

export default class AddNestedFieldsController extends Controller {
  cloneToDestination() {
    const clone = this.templateTarget.cloneNode(true);
    clone.classList.remove('hidden');
    this.destinationTarget.appendChild(clone);

    clone.dataset.target = clone.dataset.target.replace('add-nested-fields.template', '');
  }

  cloneToDestinationWithFirstNumberIncremented() {
    this.cloneToDestination();

    this.templateTarget.querySelectorAll('.add-nested-fields-input-field').forEach((inputElement) => {
      AddNestedFieldsController
        .incrementFirstNumberOnInputElement(inputElement);
    });

    this.templateTarget.querySelectorAll('.add-nested-fields-label-field').forEach((labelElement) => {
      const newForValue = AddNestedFieldsController
        .incrementNumberOfString(labelElement.htmlFor, 0);
      labelElement.htmlFor = newForValue;
    });
  }

  cloneToDestinationWithSecondNumberIncremented() {
    this.cloneToDestination();

    this.templateTarget.querySelectorAll('.add-nested-fields-input-field').forEach((inputElement) => {
      AddNestedFieldsController
        .incrementLastNumberOnInputElement(inputElement);
    });

    this.templateTarget.querySelectorAll('.add-nested-fields-label-field').forEach((labelElement) => {
      const newForValue = AddNestedFieldsController
        .incrementNumberOfString(labelElement.htmlFor);
      labelElement.htmlFor = newForValue;
    });
  }

  static incrementFirstNumberOnInputElement(element) {
    const newId = AddNestedFieldsController
      .incrementNumberOfString(element.id, 0);
    element.id = newId;

    const newName = AddNestedFieldsController
      .incrementNumberOfString(element.name, 0);
    element.name = newName;
  }

  static incrementLastNumberOnInputElement(element) {
    const newId = AddNestedFieldsController
      .incrementNumberOfString(element.id);
    element.id = newId;

    const newName = AddNestedFieldsController
      .incrementNumberOfString(element.name);
    element.name = newName;
  }

  static incrementNumberOfString(string, indexOfNumber = undefined) {
    const arrayOfNumbers = string.match(numberPattern);
    if (!arrayOfNumbers) return string;

    const index = indexOfNumber === undefined ? arrayOfNumbers.length - 1 : indexOfNumber;
    const originalNumber = arrayOfNumbers[index];
    const newNumber = Number(originalNumber) + 1;
    const newArrayOfNumbers = arrayOfNumbers.slice();
    newArrayOfNumbers[index] = newNumber;

    const splittedString = string.split(originalNumber);
    if (splittedString.length === 2) {
      return string.replace(originalNumber, Number(newNumber));
    }
    if (splittedString.length > 2) {
      let joinedString = splittedString.join();
      newArrayOfNumbers.forEach((num) => {
        joinedString = joinedString.replace(',', num);
      });
      return joinedString;
    }
    return string;
  }
}

AddNestedFieldsController.targets = ['template', 'destination'];
