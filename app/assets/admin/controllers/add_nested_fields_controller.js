import { Controller } from 'stimulus';

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
        .incrementFirstIntegerOfArray(labelElement.htmlFor.split('_')).join('_');
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
        .incrementLastIntegerOfArray(labelElement.htmlFor.split('_')).join('_');
      labelElement.htmlFor = newForValue;
    });
  }

  static incrementFirstNumberOnInputElement(element) {
    const newId = AddNestedFieldsController
      .incrementFirstIntegerOfArray(element.id.split('_')).join('_');
    element.id = newId;

    const newName = AddNestedFieldsController
      .incrementFirstIntegerOfArray(element.name.split('][')).join('][');
    element.name = newName;
  }

  static incrementLastNumberOnInputElement(element) {
    const newId = AddNestedFieldsController
      .incrementLastIntegerOfArray(element.id.split('_')).join('_');
    element.id = newId;

    const newName = AddNestedFieldsController
      .incrementLastIntegerOfArray(element.name.split('][')).join('][');
    element.name = newName;
  }

  static incrementFirstIntegerOfArray(array) {
    const indexToIncrement = array.findIndex((a) => Number.isInteger(Number(a)));
    array[indexToIncrement] = String(Number(array[indexToIncrement]) + 1);
    return array;
  }

  static incrementLastIntegerOfArray(array) {
    const newArray = AddNestedFieldsController
      .incrementFirstIntegerOfArray(array.reverse()).reverse();
    return newArray;
  }
}

AddNestedFieldsController.targets = ['template', 'destination'];
