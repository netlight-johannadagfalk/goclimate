var OffsetPaymentForm = function(form, cardErrorsElement, submitButton) {
  this.form = form;
  this.cardErrorsElement = cardErrorsElement;
  this.submitButton = submitButton;

  // TODO: Extract this
  this.stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
  this.elements = this.stripe.elements();

  var style = {
    base: {
      fontSize: '16px',
      color: '#000',
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '35px',
      fontWeight: 300,
      '::placeholder': {
        color: '#CFD7E0',
      },
    }
  };

  this.card = this.elements.create('card', {style: style, hidePostalCode: true});
  this.card.mount('#card-element');

  this.card.addEventListener('change', this.onCardChange.bind(this));
  this.form.addEventListener('submit', this.onSubmit.bind(this));
}

OffsetPaymentForm.prototype.onCardChange = function(event) {
  if (event.error) {
    this.cardErrorsElement.textContent = event.error.message;
  } else {
    this.cardErrorsElement.textContent = '';
  }
}

OffsetPaymentForm.prototype.onSubmit = function(event) {
  event.preventDefault();
  this.submitButton.disabled = true;

  this.stripe.createSource(this.card).then(function(result) {
    this.submitButton.disabled = false;

    if (result.error) {
      this.cardErrorsElement.textContent = result.error.message;
      return;
    }

    this.appendHiddenInput('stripeSource', result.source.id);
    this.appendHiddenInput('threeDSecure', result.source.card.three_d_secure);

    this.form.submit();
  }.bind(this));
}

OffsetPaymentForm.prototype.appendHiddenInput = function(name, value) {
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', name);
  input.setAttribute('value', value);

  this.form.appendChild(input);
}
