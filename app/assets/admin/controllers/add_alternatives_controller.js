import { Controller } from 'stimulus';

export default class AddAlternativesController extends Controller {
  initialize() {
    this.templateTarget.value = '';
  }

  add() {
    const clone = this.templateTarget.cloneNode(true);
    clone.classList.remove('hidden');
    clone.dataset.target = clone.dataset.target.replace('add-alternatives.template', '');
    clone.value = this.inputTarget.value;
    clone.disabled = false;
    this.destinationTarget.appendChild(clone);
    this.inputTarget.value = '';
  }

  /* eslint-disable class-methods-use-this */
  remove(e) {
    if (e.target.dataset.target !== 'add-alternatives.template') {
      if (window.confirm(`Do you really want to delete the alternative '${e.target.value}'?`)) { // eslint-disable-line no-alert
        e.target.remove();
      }
    }
  }
  /* eslint-enable class-methods-use-this */
}

AddAlternativesController.targets = ['input', 'destination', 'template', 'hiddenList'];
