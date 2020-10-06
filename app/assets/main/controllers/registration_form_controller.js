import { Controller } from 'stimulus';
import submitForm from '../../util/submit_form';

export default class RegistrationFormController extends Controller {
  initialize() {
    this.loading = false;
    this.updateSubmitButton();
    // Set initial choice
    this.membership = 'single';
    const initialChoice = this.membershipChoiceTargets.find((t) => t.value === this.membership);
    initialChoice.checked = true;
  }

  handleMembershipChange(event) {
    const newMembership = event.target.value;
    this.changeMembership(newMembership);
  }

  chooseMembershipMulti() {
    this.changeMembership('multi');
  }

  changeMembership(membership) {
    this.membership = membership;
    if (!['free', 'single', 'multi'].includes(this.membership)) {
      return;
    }
    if (this.membership === 'free') {
      this.stripeCardElementTarget.classList.add('hidden');
      this.showNoSubscriptionInfo();
    } else if (this.membership === 'single') {
      this.registrationPriceController.updateWithNumberOfPeople(1);
      this.stripeCardElementTarget.classList.remove('hidden');
      this.showSubscriptionInfo();
    } else if (this.membership === 'multi') {
      this.registrationPriceController.update();
      this.stripeCardElementTarget.classList.remove('hidden');
      this.showSubscriptionInfo();
    }
    this.membershipChoiceTargets.forEach((target) => {
      if (target.value === this.membership) {
        RegistrationFormController.styleActiveChoice(target);
      } else {
        RegistrationFormController.styleInactiveChoice(target);
      }
    });
  }

  showSubscriptionInfo() {
    this.noSubscriptionInfoTargets.forEach((target) => {
      target.classList.add('hidden');
    });
    this.subscriptionInfoTargets.forEach((target) => {
      target.classList.remove('hidden');
    });
  }

  showNoSubscriptionInfo() {
    this.noSubscriptionInfoTargets.forEach((target) => {
      target.classList.remove('hidden');
    });
    this.subscriptionInfoTargets.forEach((target) => {
      target.classList.add('hidden');
    });
  }

  submit(event) {
    event.preventDefault();

    if (!this.formTarget.reportValidity()) { return; }

    if (!this.stripeCardElementController.complete) {
      this.setErrorMessage('Please complete your card details.');
      return;
    }

    this.enableLoadingState();
    this.setErrorMessage('');

    this.stripeCardElementController.populatePaymentMethodField()
      .then(() => submitForm(this.formTarget))
      .then((response) => response.json())
      .then((data) => this.resolveFormResponse(data))
      .catch((error) => {
        if (error.cardError) {
          this.setErrorMessage(error.message);
          return;
        }

        window.Sentry.captureException(error); // These errors are unexpected, so report them.
        this.setErrorMessage('An unexpected error occurred. Please start over and try again. If the issue remains, please contact us at hello@goclimate.com.');
      })
      .finally(() => {
        this.stripeCardElementController.invalidatePaymentMethodField();
        this.disableLoadingState();
      });
  }

  resolveFormResponse(data) {
    return new Promise((resolve) => {
      switch (data.next_step) {
        case 'redirect':
          window.location = data.success_url;
          resolve();
          break;
        case 'verification_required':
          window.stripe.confirmCardPayment(data.payment_intent_client_secret)
            .then((result) => {
              if (result.paymentIntent !== undefined) {
                window.location = data.success_url;
              } else {
                this.setErrorMessage(result.error.message);
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
    if (!this.loading && this.privacyPolicyAgreementTarget.checked) {
      this.submitButtonTarget.disabled = false;
    } else {
      this.submitButtonTarget.disabled = true;
    }
  }

  get stripeCardElementController() {
    return this.application.getControllerForElementAndIdentifier(this.stripeCardElementTarget, 'stripe-card-element');
  }

  get registrationPriceController() {
    return this.application.getControllerForElementAndIdentifier(this.priceControllerElementTarget, 'registration-price');
  }
}

RegistrationFormController.styleActiveChoice = function styleActiveChoice(target) {
  target.parentNode.classList.add('bg-green-tint-1');
  target.parentNode.classList.remove('bg-gray-pastel');
  if (!target.checked) {
    target.checked = true;
  }
};

RegistrationFormController.styleInactiveChoice = function styleInactiveChoice(target) {
  target.parentNode.classList.add('bg-gray-pastel');
  target.parentNode.classList.remove('bg-green-tint-1');
  if (target.checked) {
    target.checked = false;
  }
};

RegistrationFormController.targets = ['priceControllerElement', 'form', 'privacyPolicyAgreement', 'submitButton', 'stripeCardElement', 'errorMessage', 'loadingIndicator', 'membershipChoice', 'membershipField', 'subscriptionInfo', 'noSubscriptionInfo'];
