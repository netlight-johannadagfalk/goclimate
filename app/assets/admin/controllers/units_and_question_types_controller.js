import { Controller } from 'stimulus';

export default class UnitsAndQuestionTypesController extends Controller {
  initialize() {
    this.handleValue(this.fieldTypeTarget.value);
  }

  toggle(e) {
    this.handleValue(e.target.value);
  }

  handleValue(value) {
    if (value === 'open_ended') {
      this.showUnits();
    } else {
      this.showAlternatives();
    }
  }

  showUnits() {
    this.alternativesTarget.classList.add('hidden');
    this.unitsTarget.classList.remove('hidden');
  }

  showAlternatives() {
    this.alternativesTarget.classList.remove('hidden');
    this.unitsTarget.classList.add('hidden');
  }
}

UnitsAndQuestionTypesController.targets = ['units', 'alternatives', 'fieldType'];
