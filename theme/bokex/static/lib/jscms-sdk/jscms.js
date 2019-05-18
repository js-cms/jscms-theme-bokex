;
(function (window) {
  /** 定义变量 */
  var vueComponents = {};

  /**
   * 动态加载css文件
   * @param {string} options.url -- css资源路径
   * @param {function} options.callback -- 加载后回调函数
   * @param {string} options.id -- link标签id
   */
  function loadCss(options) {
    var url = options.url,
      callback = typeof options.callback == "function" ? options.callback : function () {},
      id = options.id,
      node = document.createElement("link"),
      supportOnload = "onload" in node,
      isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536,
      // webkit旧内核做特殊处理
      protectNum = 300000; // 阈值10分钟，一秒钟执行pollCss 500次
    node.rel = "stylesheet";
    node.type = "text/css";
    node.href = url;
    if (typeof id !== "undefined") {
      node.id = id;
    }
    document.getElementsByTagName("head")[0].appendChild(node);

    // for Old WebKit and Old Firefox
    if (isOldWebKit || !supportOnload) {
      // Begin after node insertion
      setTimeout(function () {
          pollCss(node, callback, 0);
        },
        1);
      return;
    }

    if (supportOnload) {
      node.onload = onload;
      node.onerror = function () {
        // 加载失败(404)
        onload();
      }
    } else {
      node.onreadystatechange = function () {
        if (/loaded|complete/.test(node.readyState)) {
          onload();
        }
      }
    }

    function onload() {
      // 确保只跑一次下载操作
      node.onload = node.onerror = node.onreadystatechange = null;

      // 清空node引用，在低版本IE，不清除会造成内存泄露
      node = null;

      callback();
    }

    // 循环判断css是否已加载成功
    /*
     * @param node -- link节点
     * @param callback -- 回调函数
     * @param step -- 计步器，避免无限循环
     */
    function pollCss(node, callback, step) {
      var sheet = node.sheet,
        isLoaded;

      step += 1;

      // 保护，大于10分钟，则不再轮询
      if (step > protectNum) {
        isLoaded = true;

        // 清空node引用
        node = null;

        callback();
        return;
      }

      if (isOldWebKit) {
        // for WebKit < 536
        if (sheet) {
          isLoaded = true;
        }
      } else if (sheet) {
        // for Firefox < 9.0
        try {
          if (sheet.cssRules) {
            isLoaded = true;
          }
        } catch (ex) {
          // 火狐特殊版本，通过特定值获知是否下载成功
          // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
          // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
          // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
          if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
            isLoaded = true;
          }
        }
      }

      setTimeout(function () {
          if (isLoaded) {
            // 延迟20ms是为了给下载的样式留够渲染的时间
            callback();
          } else {
            pollCss(node, callback, step);
          }
        },
        20);
    }
  }

  /**
   * 动态加载JS
   * @param {string} url 脚本地址
   * @param {function} callback  回调函数
   */
  function loadJs(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (typeof (callback) == 'function') {
      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          callback();
          script.onload = script.onreadystatechange = null;
        }
      };
    }
    head.appendChild(script);
  }

  /**
   * 动态加载style标签
   */
  function loadStyle(styleString, id) {
    var style = document.createElement("style");
    style.type = "text/css";
    if (id) style.id = id;
    try {
　　  style.appendChild(document.createTextNode(styleString));
    } catch(ex) {
　　  style.styleSheet.cssText = styleString; //针对IE
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  }

  /**
   * 动态加载vue组件
   */
  function loadVueComponent(url, callback) {
    jQuery.ajax({
      url: url,
      type: 'get',
      dataType: 'text',
      success: function(res) {
        var templateReg = /<template>([\d\D]*)?<\/template>/gmi;
        var scriptReg = /<script>([\d\D]*)?<\/script>/gmi;
        var styleReg = /<style>([\d\D]*)?<\/style>/gmi;
        var template = templateReg.exec(res)[1];
        var script = scriptReg.exec(res)[1];
        var style = styleReg.exec(res)[1];
        var obj = eval('('+script.replace('export default {', 'function () { return {')+'})()');
        var component = Object.assign({
          style: style,
          template: template
        }, obj);
        vueComponents[component.name] = component;
        callback();
      }
    });
  }

  /**
   * 初始化vue
   */
  function initVue(options) {
    var el = options.el;
    var id = Math.random().toString(36).substr(2);
    var styleId = 'style_' + id;
    var vueId = 'vueApp_' + id;
    loadStyle(options.rootApp.style, styleId);
    appRoot.id = vueId;
    document.body.appendChild(appRoot);
    var vueApp = new Vue(
      Object.assign({
        el: '#' + appRoot.id
      }, options.rootApp)
    );
    return vueApp;
  }

  /**
   * 动态加载类库文件
   */
  function requireArray(array, callback) {
    var length = array.length;
    array.forEach(function (url) {
      var temp = url.split('.');
      var ext = temp[temp.length - 1];
      switch (ext) {
        case 'css':
          loadCss({
            url: url,
            callback: function (params) {
              length--;if (length <= 0) callback();
            }
          })
          break;
        case 'vue':
          loadVueComponent(url, function (params) {
            length--;if (length <= 0) callback();
          });
          break;
        default:
          loadJs(url, function (params) {
            length--;if (length <= 0) callback();
          });
          break;
      }
    });
  }

  requireArray([
    'https://cdn.jsdelivr.net/npm/heyui/themes/index.css',
    'https://cdn.jsdelivr.net/npm/vue',
    'https://cdn.jsdelivr.net/npm/heyui',
    '/theme-static/bokex/static/lib/jscms-sdk/component/qrcode.vue',
    '/theme-static/bokex/static/lib/jscms-sdk/component/comment.vue'
  ], main);

  function main() {
    var dialogQrcode = initVue({
      rootApp: vueComponents.Qrcode
    });
    var jscmssdk = {
      dialogQrcode: dialogQrcode
    }
    console.log(jscmssdk);
    window.jscmssdk = jscmssdk;
  }

})(window);