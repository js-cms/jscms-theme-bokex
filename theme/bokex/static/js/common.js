(function ($) {
  // 处理移动端导航
  $(document).ready(function () {
    "use strict";
    $('#primary-menu').slicknav({
      prependTo: '#slick-mobile-menu',
      allowParentLinks: true,
      label: '导航'
    });
  });

  // 让右边栏固定
  $(document).ready(function () {
    "use strict";
    $(window).load(function () {
      if (document.querySelector('#secondary')) {
        var stickySidebar = new StickySidebar('#secondary', {
          topSpacing: 20,
          bottomSpacing: 20,
          containerSelector: '.site_container',
          innerWrapperSelector: '.sidebar__inner'
        });
      }
    });
  });

  // 点赞事件
  $(".like-btn").on("click", function (e) {
    if ($(this).hasClass('liked')) return;
    var that = this;
    $.post("/api/front/article/like", {
      numberId: this.dataset.numberId
    }, function (res) {
      if (res.code === 0) {
        $(that).addClass('liked');
        $(that).find("#likeTotal").text(res.data.count);
      } else {
        alert(res.msg);
      }
    });
  });
})(jQuery);