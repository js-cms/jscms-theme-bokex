<template>
  <div class="vue-qrcode">
    <Modal v-model="opened" className="">
      <div style="padding: 10px; text-align: center;">{{title}}</div>
      <div class="vue-qrcode-warp" :style="warpStyle">
        <div class="item" v-for="(item, index) in images" :key="index">
          <div><img class="vue-qrcode-image" v-show="item.url" :src="item.url" :alt="item.desc"></div>
          <span v-show="item.desc">{{item.desc}}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'Qrcode',
  data: function() {
    return {
      baseWidth: 240,
      warpStyle: {
        width: '230px',
      },
      title: '扫一扫',
      images: [],
      opened: false
    }
  },
  methods: {
    show: function(options) {
      this.title = options.title;
      this.images = options.images;
      this.warpStyle.width = (options.images.length * this.baseWidth) + 'px';
      console.log(this.warpStyle);
      this.opened = true;
    }
  }
}
</script>

<style>
img.vue-qrcode-image {
  width: 230px;
  height: 230px;
}

.vue-qrcode-warp {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  min-width: 350px;
}

.vue-qrcode-warp .item {
  display: inline-block;
}
</style>