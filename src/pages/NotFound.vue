<template>
  <div class="main">
    <p>It is detected that you are not logged in</p>
    <p>
      About to jump to the landing page in
      <span style="color:#409eff;font-size: 20px">{{ time }}s...</span>
    </p>
    <p style="display: inline-block">
      <el-button type="default" @click='goback'
        >Or you can click here to return to the previous page</el-button
      >
    </p>
  </div>
</template>
<script>
export default {
  name: "NotFound",
  data() {
    return {
      time: 5
    };
  },
  mounted() {
    this.count();
  },
  methods: {
    count() {
      if (this.timeId) {
        clearInterval(this.timeId);
        this.timeId = null;
      }
      const vm = this;
      this.timeId = setInterval(function() {
        vm.time -= 1;
        if (vm.time === 0) {
          clearInterval(vm.timeId);
          vm.$router.push({ path: "/" });
        }
      }, 1000);
    },
    goback(){
      this.$router.go(-1)
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  background: url("http://94.201.123.152:8091/pictures/sys/background/login-bg.jpg");
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    text-align: center;
    padding: 5px 0;
  }
}
</style>
