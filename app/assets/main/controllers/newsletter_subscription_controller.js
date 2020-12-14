import { Controller } from 'stimulus';
import submitForm from '../../util/submit_form';
import { swapToActiveClassList, swapToInactiveClassList } from '../../util/swap_classes';

export default class NewsletterSubscriptionController extends Controller {
  submit(event) {
    event.preventDefault();
    if (this.emailFieldTarget.value === '') {
      this.setErrorMessage('Please enter a valid email address.');
      return;
    }
    this.setErrorMessage('');
    this.enableLoadingState();

    submitForm(this.element)
      .then((response) => {
        if (response.ok) {
          this.clearEmailField();
          this.handleSuccess();
        } else {
          throw response;
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          this.setErrorMessage('Please enter a valid email address.');
        } else {
          window.Sentry.captureException(error); // These errors are unexpected, so report them.
          this.setErrorMessage('An unexpected error occurred. Please start over and try again. If the issue remains, please contact us at hello@goclimate.com.');
        }
        this.enableIdleState();
      });
  }

  clearEmailField() {
    this.emailFieldTarget.value = '';
  }

  handleSuccess() {
    this.enableSuccessState();
    setTimeout(() => { this.enableIdleState(); }, 2000);
  }

  setErrorMessage(errorMessage) {
    this.errorMessageTarget.innerText = errorMessage;
  }

  enableLoadingState() {
    swapToActiveClassList(this.loadingIndicatorTarget);
    swapToInactiveClassList(this.successIndicatorTarget);
    swapToInactiveClassList(this.idleIndicatorTarget);
  }

  enableSuccessState() {
    swapToActiveClassList(this.successIndicatorTarget);
    swapToInactiveClassList(this.idleIndicatorTarget);
    swapToInactiveClassList(this.loadingIndicatorTarget);
  }

  enableIdleState() {
    swapToActiveClassList(this.idleIndicatorTarget);
    swapToInactiveClassList(this.loadingIndicatorTarget);
    swapToInactiveClassList(this.successIndicatorTarget);
  }
}

NewsletterSubscriptionController.targets = ['emailField', 'idleIndicator', 'loadingIndicator', 'successIndicator', 'errorMessage'];
