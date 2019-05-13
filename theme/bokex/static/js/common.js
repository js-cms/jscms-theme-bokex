(function ($) {
  //处理移动端导航
  $(document).ready(function () {
    "use strict";
    $('#primary-menu').slicknav({
      prependTo: '#slick-mobile-menu',
      allowParentLinks: true,
      label: '导航'
    });
  });

  //让右边栏固定
  $(document).ready(function () {
    "use strict";
    $(window).load(function () {
      var stickySidebar = new StickySidebar('#secondary', {
        topSpacing: 20,
        bottomSpacing: 20,
        containerSelector: '.site_container',
        innerWrapperSelector: '.sidebar__inner'
      });
    });
  });
})(jQuery);