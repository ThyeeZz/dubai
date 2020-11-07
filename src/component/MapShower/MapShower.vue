<template>
  <div class="map_wrapper" @click.self="hideMapDialog" v-show="isShowMapDialog">
    <div id="map_shower"></div>
    <!-- <p v-else>No valid coordinates are obtained</p> -->
  </div>
</template>
<script>
export default {
  name: "MapShower",
  data() {
    return {
      isShowMapDialog: false,
      map: null,
      marker: null
    };
  },
  computed: {
    hasCoordinates() {
      const { lat, lng } = this.center;
      return lat && lng;
    }
  },
  methods: {
    initMap(center,text) {
      const mapOption = {
        zoom: 14,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      const map = new google.maps.Map(
        document.getElementById("map_shower"),
        mapOption
      );
      const marker = new google.maps.Marker({
        position: center,
        map: map,
        icon: require("../../assets/hicling/done2.png"),
        label: `${text}`
      });
      this.map = map;
      this.marker = marker;
    },
    update(center,text){
      this.map.setCenter(center);
      this.map.setZoom(14);
      this.marker.setLabel(text);
      this.marker.setPosition(center);
    },
    hideMapDialog() {
      this.isShowMapDialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.map_wrapper {
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  p{
    text-align: center;
  }
  #map_shower {
    height: 80%;
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate((-50%, -50%));
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>
