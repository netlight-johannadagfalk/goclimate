import { Controller } from 'stimulus';
import submitForm from '../../../util/submit_form';

export default class SubscriptionsPaymentSettingsController extends Controller {
  initialize() {
    this.loading = false;
    this.updateSubmitButton();
  }

  submit(event) {
    event.preventDefault();

    if (!this.formTarget.reportValidity()) { return; }

    if (!this.stripeCardElementTarget.classList.contains('hidden') && !this.stripeCardElementController.complete) {
      this.setErrorMessage('Please complete your card details.');
      return;
    }

    this.enableLoadingState();
    this.setErrorMessage('');

    if (!this.stripeCardElementTarget.classList.contains('hidden')) {
      this.stripeCardElementController.populatePaymentMethodField()
        .then(() => submitForm(this.formTarget))
        .then((response) => response.json())
        .then((data) => this.resolveFormResponse(data))
        .catch((error) => this.handleSubmittedFormError(error))
        .finally(() => {
          this.stripeCardElementController.invalidatePaymentMethodField();
          this.disableLoadingState();
        });
    } else {
      submitForm(this.formTarget)
        .then((response) => response.json())
        .then((data) => this.resolveFormResponse(data))
        .catch((error) => this.handleSubmittedFormError(error))
        .finally(() => {
          this.disableLoadingState();
        });
    }
  }

  resolveFormResponse(data) {
    return new Promise((resolve) => {
      switch (data.next_step) {
        case 'redirect':
          window.location = data.success_url;
          resolve();
          break;
        case 'confirmation_required':
          SubscriptionsPaymentSettingsController.confirmPromise(data.intent_type, data.intent_client_secret)
            .then((result) => {
              if (result.error !== undefined) {
                this.setErrorMessage(result.error.message);
              } else {
                window.location = data.success_url;
              }
              resolve();
            });
          break;
        default:
          this.setErrorMessage(data.error.message);
          resolve();
      }
    });
  }

  handleSubmittedFormError(error) {
    if (error.cardError) {
      this.setErrorMessage(error.message);
      return;
    }

    window.Sentry.captureException(error); // These errors are unexpected, so report them.
    this.setErrorMessage('An unexpected error occurred. Please start over and try again. If the issue remains, please contact us at hello@goclimate.com.');
  }

  setErrorMessage(errorMessage) {
    this.errorMessageTarget.innerText = errorMessage;
  }

  enableLoadingState() {
    this.loading = true;
    this.loadingIndicatorTarget.classList.remove('hidden');
    this.updateSubmitButton();
  }

  disableLoadingState() {
    this.loading = false;
    this.loadingIndicatorTarget.classList.add('hidden');
    this.updateSubmitButton();
  }

  updateSubmitButton() {
    if (!this.loading) {
      this.submitButtonTarget.disabled = false;
    } else {
      this.submitButtonTarget.disabled = true;
    }
  }

  showStripeCardField() {
    this.stripeCardElementTarget.classList.remove('hidden');
  }

  get stripeCardElementController() {
    return this.application.getControllerForElementAndIdentifier(this.stripeCardElementTarget, 'stripe-card-element');
  }
}

SubscriptionsPaymentSettingsController.confirmPromise = function confirmPromise(
  intentType, intentClientSecret
) {
  switch (intentType) {
    case 'payment_intent':
      return window.stripe.confirmCardPayment(intentClientSecret);
    case 'setup_intent':
      return window.stripe.confirmCardSetup(intentClientSecret);
    default:
      return null;
  }
};

SubscriptionsPaymentSettingsController.targets = ['form', 'submitButton', 'stripeCardElement', 'errorMessage', 'loadingIndicator'];
