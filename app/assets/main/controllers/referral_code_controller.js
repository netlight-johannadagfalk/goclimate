import { Controller } from 'stimulus';
import submitForm from '../../util/submit_form';
import { swapToActiveClassList, swapToInactiveClassList } from '../../util/swap_classes';

class ReferralCodeNotFoundError extends Error { }

export default class ReferralCodeController extends Controller {
  submit(event) {
    event.preventDefault();

    this.setErrorMessage('');

    if (this.formTarget.elements.code.value === '') {
      this.formPresentedCheckboxTarget.checked = false;
      this.deactivateCode();
      return;
    }

    submitForm(this.formTarget)
      .then((response) => {
        if (!response.ok) {
          throw new ReferralCodeNotFoundError();
        }

        return response.json();
      })
      .then((data) => {
        this.activateCode(data.code);
        this.formPresentedCheckboxTarget.checked = false;
      })
      .catch((error) => {
        if (error instanceof ReferralCodeNotFoundError) {
          this.setErrorMessage("That's not right, try again");
          return;
        }

        window.Sentry.captureException(error); // These errors are unexpected, so report them.
        this.setErrorMessage('An unexpected error occurred. Please start over and try again. If the issue remains, please contact us at hello@goclimate.com.');
      });
  }

  activateCode(code) {
    this.activeCodeTargets.forEach((target) => { target.innerText = code; });
    this.activeCodeFieldTargets.forEach((target) => { target.value = code; });
    this.codeActiveInfoTargets.forEach((target) => swapToActiveClassList(target));
    this.noCodeActiveInfoTargets.forEach((target) => swapToInactiveClassList(target));
  }

  deactivateCode() {
    this.activeCodeTargets.forEach((target) => { target.innerText = ''; });
    this.activeCodeFieldTargets.forEach((target) => { target.value = ''; });
    this.codeActiveInfoTargets.forEach((target) => swapToInactiveClassList(target));
    this.noCodeActiveInfoTargets.forEach((target) => swapToActiveClassList(target));
  }

  setErrorMessage(message) {
    this.errorMessageTarget.innerText = message;
  }
}

ReferralCodeController.targets = ['form', 'formPresentedCheckbox', 'activeCode', 'activeCodeField', 'codeActiveInfo', 'noCodeActiveInfo', 'errorMessage'];
