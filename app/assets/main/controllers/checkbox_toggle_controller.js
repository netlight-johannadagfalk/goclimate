import { Controller } from 'stimulus';

export default class CheckboxToggleController extends Controller {
  initialize() {
    this.toggle();
  }

  toggle() {
    if (this.triggerTarget.checked) {
      this.contentTarget.classList.remove('hidden');
    } else {
      this.contentTarget.classList.add('hidden');
    }
  }
}

CheckboxToggleController.targets = ['trigger', 'content'];
