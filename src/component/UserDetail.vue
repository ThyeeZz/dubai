<template>
  <li class="item__li">
    <p class="isHover"  ref="dispalyTool">{{ member[keyProp] }}</p>
    <div>
      <span>{{ keyProp }}</span>
      <span ref="display_overflow" class="detail">{{
        member[keyProp] || "--"
      }}</span>
    </div>
  </li>
</template>
<script>
export default {
  name: "UserDetail",
  props: {
    member: {
      type: Object,
      required: true
    },
    keyProp: {
      type: String,
      required: true
    }
  },
  computed: {
    // isShow() {
    //   const { dispalyTool, display_overflow } = this.$refs;
    //   console.log(dispalyTool);
    //   getComputedStyle(dispalyTool).width
    //   return (
    //     getComputedStyle(dispalyTool).width >
    //     getComputedStyle(display_overflow).width
    //   );
    // }
  }
};
</script>
<style lang="scss" scoped>
// .li-item{
//   position: relative;
//   .display-tool{
//     position: absolute;
//     max-width: 3rem;
//     white-space: normal;
//     word-wrap: break-all;
//     word-break: normal;
//     overflow: hidden;
//   }
// }
.item__li:hover {
  .isHover {
    display: block;
  }
}
</style>
