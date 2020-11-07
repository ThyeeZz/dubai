import FullyDisplay from './src';
import Vue from 'vue';

let instance = undefined;

const FullyDisplayComp = Vue.extend(FullyDisplay);

function FullyDisplayed() {
  this.show = function (content) {
    if (!instance) {
      const odiv = document.createElement('div');
      const oapp = document.getElementById('app')
      oapp.appendChild(odiv);

      instance = new FullyDisplayComp();
      instance = instance.$mount(odiv);
      instance.show(content);

    } else {
      instance.show(content);
    }
  };
  this.update = function (x, y) {
    if (!instance) return;
    instance.update(x, y)
  };
  this.hide = function () {
    if (!instance) return;
    instance.hide();
  }

}

export default FullyDisplayed;
