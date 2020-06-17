import { Controller } from 'stimulus';
import { CountUp } from 'countup.js';

export default class CountingNumberController extends Controller {
  initialize() {
    if (typeof IntersectionObserver === 'undefined') { return; }
    this.intersectionObserver = new IntersectionObserver(this.countUp.bind(this));
    this.intersectionObserver.observe(this.element);
    this.element.innerText = '0';
  }

  countUp() {
    new CountUp(this.element, this.element.dataset.targetNumber, {
      separator: CountingNumberController.separatorForLocale(),
      duration: 1
    }).start();
  }

  static separatorForLocale() {
    if (window.locale === 'en') { return ','; }

    return ' ';
  }
}
