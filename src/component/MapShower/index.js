import MapShower from './MapShower';
import Vue from 'vue';

const Map = Vue.extend(MapShower);
let instance = null;

function Mapping(Vue) {
  Vue.prototype.$mapping = {
    async show (center,text) {
      center = center || {
        lat: 0,
        lng: 0
      }
      text = text || "Unknown";
      if (!instance) {
        const odiv = document.createElement('div');
        const oapp = document.getElementById('app')
        oapp.appendChild(odiv);

        instance = new Map();
        instance = instance.$mount(odiv);
        await instance.initMap(center,text);
        instance.isShowMapDialog = true;
        
      } else {
        instance.isShowMapDialog = true;
        instance.update(center,text)
      }
    },
    hide () {
      if (!instance) return
      instance.isShowMapDialog = false;
    }
  }
}

export default Mapping;
