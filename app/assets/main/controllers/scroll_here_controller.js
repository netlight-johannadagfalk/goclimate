import { Controller } from 'stimulus';

export default class ScrollHereController extends Controller {
  initialize() {
    this.element.scrollIntoView({ block: 'center' });
  }
}
