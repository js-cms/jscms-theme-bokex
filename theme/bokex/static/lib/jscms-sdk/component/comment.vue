<template>
  <div class="jscms-comment">
    <div class="comment-input-area">
      <div class="comment-top">
        <div class="comment-title">参与评论</div>
        <div class="comment-total">共0条</div>
      </div>
    </div>
    <div class="comment-list"></div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<style>
.jscms-comment {
  width: 100%;
}

.jscms-comment .comment-input-area {
  width: 100%;
}

.jscms-comment .comment-input-area .comment-top::after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.jscms-comment .comment-input-area .comment-top {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.jscms-comment .comment-input-area .comment-top .comment-title {
  float: left;
}

.jscms-comment .comment-input-area .comment-top .comment-total {
  float: right;
}
</style>