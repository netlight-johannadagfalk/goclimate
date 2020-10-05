import { Controller } from 'stimulus';

export default class TabsController extends Controller {
  initialize() {
    this.tablistTarget.classList.add('tablist');
    this.tablistTarget.setAttribute('role', 'tablist');
    this.setupTabs();
    this.setupPanels();

    this.tabTargets[0].setAttribute('aria-selected', 'true');
    this.panelTargets[0].classList.remove('panel-hidden');
  }

  setupTabs() {
    this.tabTargets.forEach((tab, index) => {
      tab.classList.add('tab');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', '-1');
      tab.dataset.index = index;
      tab.parentNode.classList.add('tab-container');
      tab.parentNode.setAttribute('role', 'presentation');

      tab.addEventListener('keydown', (e) => {
        const currentIndex = this.tabTargets.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        let direction = 0;
        switch (e.which) {
          case 37:
            direction = currentIndex - 1;
            break;
          case 39:
            direction = currentIndex + 1;
            break;
          case 40:
            direction = 'down';
            break;
          default:
            direction = null;
            break;
        }
        if (direction !== null) {
          e.preventDefault();
          if (direction === 'down') {
            this.panelTargets[currentIndex].setAttribute('tabindex', '-1');
            this.panelTargets[currentIndex].focus();
          } else if (this.tabTargets[direction]) {
            this.switchTabByIndex(currentIndex, direction);
          }
        }
      });

      tab.addEventListener('click', (e) => {
        e.preventDefault(); // Safety precaution if `<a>` tags were used as tabs
        const currentIndex = this.tabTargets.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        const newIndex = Number(e.target.dataset.index);
        if (newIndex !== currentIndex) {
          this.switchTabByIndex(currentIndex, newIndex);
        }
      });
    });

    // Stylistic element to make border continue past tabs in desktop
    const emptyTab = document.createElement('li');
    emptyTab.classList.add('tab-container-extra-border');
    emptyTab.setAttribute('role', 'decoration');
    this.tablistTarget.appendChild(emptyTab);
  }

  setupPanels() {
    this.panelTargets.forEach((panel, index) => {
      panel.classList.add('tabpanel');
      panel.setAttribute('aria-labelledby', this.tabTargets[index].id);
      panel.classList.add('panel-hidden');
      panel.addEventListener('click', () => {
        this.panelTargets[index].removeAttribute('tabindex');
      });
    });
  }

  switchTabByIndex(oldIndex, newIndex) {
    this.activateTabByIndex(newIndex);
    this.deactivateTabByIndex(oldIndex);
  }

  activateTabByIndex(index) {
    const tab = this.tabTargets[index];
    tab.focus();
    tab.removeAttribute('tabindex');
    tab.setAttribute('aria-selected', 'true');
    this.panelTargets[index].classList.remove('panel-hidden');
  }

  deactivateTabByIndex(index) {
    const tab = this.tabTargets[index];
    tab.removeAttribute('aria-selected');
    tab.setAttribute('tabindex', '-1');
    this.panelTargets[index].classList.add('panel-hidden');
    this.panelTargets[index].removeAttribute('tabindex');
  }
}

TabsController.targets = ['tablist', 'tab', 'panel'];
