import { Controller } from 'stimulus';
import { swapToActiveClassList, swapToInactiveClassList } from '../../util/swap_classes';

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
    swapToActiveClassList(this.containerTarget);
  }

  showAlternatives() {
    this.alternativesTarget.classList.remove('hidden');
    this.unitsTarget.classList.add('hidden');
    swapToInactiveClassList(this.containerTarget);
  }
}

UnitsAndQuestionTypesController.targets = ['units', 'alternatives', 'fieldType', 'container'];
