import { CountUp } from 'countup.js';

var CountingNumber = function(numberElement) {
  if (typeof IntersectionObserver == 'undefined') { return }

  this.numberElement = numberElement;
  this.intersectionObserver = new IntersectionObserver(this.countUp.bind(this));

  this.intersectionObserver.observe(this.numberElement);
  this.numberElement.innerText = '0';
};

CountingNumber.prototype.countUp = function() {
  new CountUp(this.numberElement, this.numberElement.dataset.targetNumber, {
    separator: this.separatorForLocale(),
    duration: 1
  }).start();
};

CountingNumber.prototype.separatorForLocale = function() {
  if (window.locale == 'en') {
    return ',';
  } else {
    return ' ';
  }
};

window.CountingNumber = CountingNumber;
