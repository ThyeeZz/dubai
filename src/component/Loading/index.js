import Loading from './src';
import Vue from 'vue';

const _Loading = Vue.extend(Loading);
let instance = undefined;

function LoadingConstructor(){
  Vue.prototype.$_loading = {
    show(title){
      if(!instance){
        const odiv = document.createElement('div');
        const oapp = document.getElementById('app')
        oapp.appendChild(odiv);

        instance = new _Loading();
        instance = instance.$mount(odiv);
        instance.show(title)
      }else{
        instance.show(title)
      }
    },
    hide(){
      if(!instance){
        return
      }
      instance.hide();
    }
  }
}
export default LoadingConstructor;