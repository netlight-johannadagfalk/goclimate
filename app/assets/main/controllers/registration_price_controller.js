import { Controller } from 'stimulus';
import { serializeQueryParams } from '../../util/submit_form';

export default class RegistrationPriceController extends Controller {
  update() {
    const people = this.peopleFormTarget.people.value;
    this.updateWithNumberOfPeople(people);
  }

  updateWithNumberOfPeople(people) {
    const formData = Array.from(new FormData(this.peopleFormTarget));
    const updatedFormData = formData.map(
      (param) => (param[0] === 'people' ? ['people', people] : param)
    );
    const url = `${this.peopleFormTarget.dataset.url}?${serializeQueryParams(updatedFormData)}`;
    fetch(url, {
      method: 'get',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
      .then((response) => response.json())
      .then((response) => {
        this.peopleFieldTarget.value = people;
        this.subscriptionTargets.forEach((subscriptionTarget) => {
          subscriptionTarget.innerText = response.subscription;
        });
        this.priceTargets.forEach((priceTarget) => {
          priceTarget.innerText = response.price;
        });
      });
  }
}

RegistrationPriceController.targets = ['peopleForm', 'subscription', 'price', 'peopleField'];
