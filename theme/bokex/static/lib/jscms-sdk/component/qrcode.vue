<template>
  <div class="vue-qrcode">
    <Modal v-model="opened" className="">
      <div style="padding: 10px; text-align: center;">{{text}}</div>
      <div class="vue-qrcode-warp">
        <img class="vue-qrcode-image" v-show="imageUrl" :src="imageUrl" :alt="text">
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'Qrcode',
  data: function() {
    return {
      opened: false,
      imageUrl: '',
      text: '扫一扫'
    }
  },
  mounted: function() {
  },
  methods: {
    show: function(imageUrl, text) {
      this.imageUrl = imageUrl;
      this.text = text;
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
}
</style>