import { Controller } from 'stimulus';

export default class FieldOrderController extends Controller {
  move(e) {
    const currentIndex = e.target.dataset.position;
    const targetIndex = e.target.value - 1;
    const elementToMove = this.fieldTargets[currentIndex];
    const targetElement = this.fieldTargets[targetIndex];

    if (targetIndex === this.fieldTargets.length - 1) {
      targetElement.parentNode.insertBefore(elementToMove, targetElement);
      targetElement.parentNode.insertBefore(targetElement, elementToMove);
    } else {
      targetElement.parentNode.insertBefore(elementToMove, targetElement);
    }
    this.updatePositionData();
    let order = '{';
    this.fieldTargets.forEach((field, index) => {
      order += `${index === 0 ? '' : ', '}${field.dataset.id}`;
    });
    order += '}';
    this.orderTarget.value = order;
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
}

FieldOrderController.targets = ['field', 'select', 'order'];
