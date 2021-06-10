import { Controller } from 'stimulus';
import createPsqlList from '../../util/create_psql_list';

export default class ItemOrderController extends Controller {
  initialize() {
    this.updateOrderField();
  }

  move(e) {
    const currentIndex = e.target.dataset.position;
    const targetIndex = e.target.value - 1;
    const elementToMove = this.itemTargets[currentIndex];
    const targetElement = this.itemTargets[targetIndex];

    if (targetIndex === this.itemTargets.length - 1) {
      targetElement.parentNode.insertBefore(elementToMove, targetElement);
      targetElement.parentNode.insertBefore(targetElement, elementToMove);
    } else {
      targetElement.parentNode.insertBefore(elementToMove, targetElement);
    }
    this.updatePositionData();
    this.updateOrderField();
  }

  updatePositionData() {
    this.selectTargets.forEach((select, index) => {
      select.dataset.position = index;
      Array.from(select.children).forEach((option, optionIndex) => {
        if (optionIndex === index) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      });
    });
  }

  updateOrderField() {
    this.orderTarget.value = createPsqlList(this.itemTargets.map((item) => item.dataset.id));
  }
}

ItemOrderController.targets = ['item', 'select', 'order'];
