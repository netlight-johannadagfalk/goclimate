var BusinessOffsetCalculator = function(costPerTonne, numberOfEmployeesElement, bigNumberElement) {
  this.costPerTonne = costPerTonne;
  this.numberOfEmployeesElement = numberOfEmployeesElement;
  this.bigNumberElement = bigNumberElement;

  this.numberOfEmployeesElement.addEventListener('input', this.updateNumber.bind(this));
  this.updateNumber();
}

BusinessOffsetCalculator.prototype.updateNumber = function() {
  var numberOfEmployees = parseInt(this.numberOfEmployeesElement.value);
  if (isNaN(numberOfEmployees)) { numberOfEmployees = 0 }
  var tonnesCO2 = 22 * numberOfEmployees;
  var price = tonnesCO2 * this.costPerTonne / 12;

  this.bigNumberElement.innerHTML = Math.round(price).toLocaleString(window.locale)
}
