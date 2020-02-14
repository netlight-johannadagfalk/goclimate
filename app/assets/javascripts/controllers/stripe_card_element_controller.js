import { Controller } from 'stimulus';

export default class StripeCardElementController extends Controller {
  initialize() {
    this.complete = false;
    this.stripeElements = window.stripe.elements({ locale: window.locale });
    this.cardElement = this.stripeElements.create(
      'card',
      { style: StripeCardElementController.elementStyle, hidePostalCode: true }
    );
    this.cardElement.addEventListener('change', this.cardElementChange.bind(this));
    this.cardElement.mount(this.containerTarget);
  }

  cardElementChange(event) {
    this.complete = event.complete;

    this.invalidatePaymentMethodField();

    if (event.error !== undefined) {
      this.errorsTarget.innerText = event.error.message;
    } else {
      this.errorsTarget.innerText = '';
    }
  }

  invalidatePaymentMethodField() {
    if (this.hasPaymentMethodFieldTarget) {
      this.paymentMethodFieldTarget.value = '';
    }
  }

  populatePaymentMethodField() {
    return new Promise((resolve, reject) => {
      if (this.paymentMethodFieldTarget.value !== '') {
        resolve();
        return;
      }

      window.stripe
        .createPaymentMethod({ type: 'card', card: this.cardElement })
        .then((result) => {
          if (result.paymentMethod !== undefined) {
            this.paymentMethodFieldTarget.value = result.paymentMethod.id;
            resolve();
          } else {
            reject(new Error(result.error.message));
          }
        });
    });
  }
}

StripeCardElementController.targets = ['container', 'paymentMethodField', 'errors'];

StripeCardElementController.elementStyle = {
  base: {
    fontSize: '16px',
    color: '#777',
    lineHeight: '22px',
    fontWeight: 300
  }
};
