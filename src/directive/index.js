import FullyDisplayed from '@/component/FullyDisplay';

const fullyDisplayed = new FullyDisplayed();

export default (Vue) => {
  Vue.directive("fullyDisplay", {
    inserted: function (el) {
      el.addEventListener('mouseenter', (e) => {
        const {
          offsetWidth,
          scrollWidth,
          innerText
        } = e.target;
        scrollWidth > offsetWidth && fullyDisplayed.show(innerText);
      });

      el.addEventListener('mouseleave', () => {
        fullyDisplayed.hide();
      });

      el.addEventListener('mousemove', (e) => {
        const {
          pageX,
          pageY
        } = e;
        fullyDisplayed.update(pageX, pageY);
      })
    },
    unbind: function (el) {
      el.removeEventListener('mouseenter', (e) => {
        const {
          offsetWidth,
          scrollWidth,
          innerText
        } = e.target;
        scrollWidth > offsetWidth && fullyDisplayed.show(innerText);
      });

      el.removeEventListener('mouseleave', () => {
        fullyDisplayed.hide();
      });

      el.removeEventListener('mousemove', (e) => {
        const {
          pageX,
          pageY
        } = e;
        fullyDisplayed.update(pageX, pageY);
      })
    }
  })
}
