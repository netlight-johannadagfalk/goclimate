import { Controller } from 'stimulus';
import submitForm from '../../util/submit_form';
import { swapToActiveClassList } from '../../util/swap_classes';

export default class DataCollectionFormController extends Controller {
  submit(event) {
    event.preventDefault();

    submitForm(this.element)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        response.json()
          .then((data) => {
            window.location = data.success_url;
          });
      })
      .catch((error) => {
        swapToActiveClassList(this.errorMessageTarget);
        this.errorMessageTarget.innerHTML = `Sorry, something on our side didn't go as planned. ${error}`;
      });
  }
}

DataCollectionFormController.targets = ['errorMessage'];
