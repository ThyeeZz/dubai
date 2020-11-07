<template>
  <div class="loading_wrapper" v-show="isShowLoading">
    <div class="content">
      <p>{{ title }}</p>
      <br />
      <i class="el-icon-loading"></i>
      <!--
        <img :src="require('../../../assets/hicling/tits.gif')" alt="loading">
      -->
    </div>
  </div>
</template>
<script>
export default {
  name: "Loading",
  data() {
    return {
      title: "loading...",
      isShowLoading: false
    };
  },
  methods: {
    show(title) {
      this.isShowLoading = true;
      if(title){
        this.title = title;
      }
    },
    hide() {
      this.isShowLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.loading_wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 0.18rem;
  color: #fff;
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    
      font-size: .28rem;
      color: rgb(83, 83, 196);
    
  }
}
</style>
