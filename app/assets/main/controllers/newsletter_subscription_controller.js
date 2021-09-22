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
        error.json()
          .then((data) => {
            if (data.status === 400 && data.errors.email.includes('duplicate')) {
              this.clearEmailField();
              this.enableSuccessState();
              return;
            }

            if (data.status === 400) {
              this.setErrorMessage('Please enter a valid email address.');
            } else {
              window.Sentry.captureException(data); // These errors are unexpected, so report them.
              this.setErrorMessage('An unexpected error occurred. Please start over and try again. If the issue remains, please contact us at hello@goclimate.com.');
            }
            this.enableIdleState();
          });
      });
  }

  clearEmailField() {
    this.emailFieldTarget.value = '';
  }

  handleSuccess() {
    this.enableSuccessState();
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
    swapToActiveClassList(this.successMessageTarget);
    swapToInactiveClassList(this.formWrapperTarget);
    swapToInactiveClassList(this.idleIndicatorTarget);
    swapToInactiveClassList(this.loadingIndicatorTarget);
  }

  enableIdleState() {
    swapToActiveClassList(this.idleIndicatorTarget);
    swapToInactiveClassList(this.successMessageTarget);
    swapToActiveClassList(this.formWrapperTarget);
    swapToInactiveClassList(this.loadingIndicatorTarget);
    swapToInactiveClassList(this.successIndicatorTarget);
  }
}

NewsletterSubscriptionController.targets = ['emailField', 'idleIndicator', 'loadingIndicator', 'successIndicator', 'errorMessage', 'formWrapper', 'successMessage'];
