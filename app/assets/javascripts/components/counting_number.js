import { CountUp } from 'countup.js';

class CountingNumber {
  constructor(numberElement) {
    if (typeof IntersectionObserver === 'undefined') { return; }

    this.numberElement = numberElement;
    this.intersectionObserver = new IntersectionObserver(this.countUp.bind(this));

    this.intersectionObserver.observe(this.numberElement);
    this.numberElement.innerText = '0';
  }

  countUp() {
    new CountUp(this.numberElement, this.numberElement.dataset.targetNumber, {
      separator: CountingNumber.separatorForLocale(),
      duration: 1
    }).start();
  }

  static separatorForLocale() {
    if (window.locale === 'en') { return ','; }

    return ' ';
  }
}

window.CountingNumber = CountingNumber;
