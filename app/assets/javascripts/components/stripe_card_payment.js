var StripeCardPayment = function(
  form,
  cardErrorsElement,
  submitButton,
  buttonSpinner,
  clientSecret,
  cardElementClass
) {
  this.form = form;
  this.cardErrorsElement = cardErrorsElement;
  this.submitButton = submitButton;
  this.buttonSpinner = buttonSpinner;
  this.clientSecret = clientSecret;
  this.cardElementClass = cardElementClass;

  this.elements = window.stripe.elements({ locale: window.locale });

  var style = {
    base: {
      fontSize: '16px',
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '35px',
      fontWeight: 300,
      '::placeholder': {
        color: '#CFD7E0',
      }
    }
  };

  this.card = this.elements.create('card', {style: style, hidePostalCode: true});
  this.card.mount(this.cardElementClass);
  this.card.addEventListener('change', this.onCardChange.bind(this));

  this.form.addEventListener('submit', this.onSubmit.bind(this));
}

StripeCardPayment.prototype.onCardChange = function(event) {
  if (event.error) {
    this.cardErrorsElement.textContent = event.error.message;
  } else {
    this.cardErrorsElement.textContent = '';
  }
}

StripeCardPayment.prototype.enableSubmit = function() {
  this.buttonSpinner.classList.add('hidden');
  this.submitButton.disabled = false;
}

StripeCardPayment.prototype.disableSubmit = function() {
  this.buttonSpinner.classList.remove('hidden');
  this.submitButton.disabled = true;
}


StripeCardPayment.prototype.onSubmit = function(event) {
  event.preventDefault();
  this.disableSubmit();

  window.stripe.handleCardPayment(this.clientSecret, this.card).then(function(result) {
    if (result.error) {
      this.enableSubmit();
      this.cardErrorsElement.textContent = result.error.message;
      return;
    }

    this.appendHiddenInput('paymentIntentId', result.paymentIntent.id);

    this.form.submit();
  }.bind(this));
}

StripeCardPayment.prototype.appendHiddenInput = function(name, value) {
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', name);
  input.setAttribute('value', value);

  this.form.appendChild(input);
}

window.StripeCardPayment = StripeCardPayment;
