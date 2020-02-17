import { Controller } from 'stimulus';

export default class TemplateElementController extends Controller {
  cloneToDestination() {
    const clone = this.templateTarget.cloneNode(true);
    clone.classList.remove('hidden');
    clone.dataset.target = clone.dataset.target.replace('template-element.template', '');
    this.destinationTarget.appendChild(clone);
  }
}

TemplateElementController.targets = ['template', 'destination'];
