import { Controller } from 'stimulus';

export default class AddAlternativesController extends Controller {
  initialize() {
    this.templateTarget.value = '';
  }

  handleKeyPress(event) {
    if (event.keyCode === 13) {
      event.stopPropagation();
      this.add(event);
    }
  }

  add(event) {
    event.preventDefault();
    const clone = this.templateTarget.cloneNode(true);
    clone.classList.remove('hidden');
    clone.dataset.target = clone.dataset.target.replace('add-alternatives.template', '');
    clone.childNodes.forEach((child) => {
      child.disabled = false;
    });
    clone.firstElementChild.value = '';
    this.destinationTarget.appendChild(clone);
    this.destinationTarget.lastChild.children[0].focus();
  }

  /* eslint-disable class-methods-use-this */
  remove(e) {
    if (e.target.dataset.target === 'add-alternatives.template') return;

    const parentNode = e.target.closest('div');
    if (window.confirm(`Do you really want to delete the alternative '${parentNode.firstElementChild.value}'?`)) { // eslint-disable-line no-alert
      if (parentNode.previousElementSibling) {
        parentNode.previousElementSibling.children[0].focus();
      } else if (parentNode.nextElementSibling) {
        parentNode.nextElementSibling.children[0].focus();
      } else {
        parentNode.closest('.alternatives-container').querySelector('.add-alternative-button').focus();
      }
      parentNode.remove();
    }
  }
  /* eslint-enable class-methods-use-this */
}

AddAlternativesController.targets = ['destination', 'template', 'hiddenList'];
