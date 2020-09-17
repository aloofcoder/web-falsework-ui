<template>
  <iframe
    name="container_ifranme"
    id="iframeId"
    scrolling="no"
    frameborder="no"
    border="0"
    width="100%"
    src="http://localhost"
    onload="iFrameHeight()"
  ></iframe>
</template>
<script>
export default {
  title: "Code",
  data() {
    return {};
  },
  mounted() {
    var ifm = document.getElementById("iframeId");
    let iframe = document.querySelector("#iframe");
    iframe.onload = () => {
      console.log("加载完成"); // 这里偶尔不会触发
    };
  },
  methods: {
    iFrameHeight() {
      console.log(ifm, "ifm");

      // var subWeb = document.frames
      //   ? document.frames["iframeId"].document
      //   : ifm.contentDocument;

      // if (ifm != null && subWeb != null) {
      //   ifm.style.height = "auto"; //关键这一句，先取消掉之前iframe设置的高度

      //   ifm.style.height = subWeb.body.scrollHeight + "px";
      // }
    }
  }
};
</script>