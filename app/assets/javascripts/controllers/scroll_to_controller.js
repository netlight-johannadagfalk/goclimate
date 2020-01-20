import { Controller } from 'stimulus';

export default class ScrollToController extends Controller {
  initialize() {
    this.scrollToElement = document.querySelector(this.element.hash);
    this.scrollBlock = this.element.dataset.scrollBlock || 'start';
  }

  scroll(event) {
    event.preventDefault();

    this.scrollToElement.scrollIntoView({ behavior: 'smooth', block: this.scrollBlock });
  }
}
