<template>
  <div class="hello">
    <div :id="viewer"></div>
  </div>
</template>

<script>
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

export default {
  name: "vrPano",
  data() {
    return {
      viewer: "viewer",
      PSV: null,
      panos: {
        // url: "../../static/img/1.jpg",
        // desc: "第一张",
        // target: {
        //   //target设置图片的初始视角
        //   longitude: 3.848,
        //   latitude: -0.244
        // }
      },
      firstMakers: []
    };
  },
  created() {},
  mounted() {
    this.initPhotoSphere();
  },
  methods: {
    async initPhotoSphere() {
      var that = this;
      let res = await this.initData(9);
      that.panos = JSON.parse(res.data.data[1].hotpot[0].data).data; //第一张图片
      for (let i = 0; i < res.data.data[0].hotpot.length; i++) {
        that.firstMakers.push(JSON.parse(res.data.data[0].hotpot[i].data)); //第一张图片热点
      }
      this.PSV = new PhotoSphereViewer({
        container: this.viewer,
        panorama: that.panos.url,
        target: that.panos.target,
        caption: that.panos.desc, //导航栏中显示的文本。如果导航栏被禁用，它将不显示，但没有按钮
        // autoload: false, //可选，默认值为true，true为自动调用全景图，false为加载全景图(通过.load()方法)
        time_anim: false,
        default_long: 0, // 初始经度位置(初始角度)
        default_lat: 0, // 初始纬度位置(初始角度)
        plugins: [], //插件列表
        transition: {
          duration: 1000, // duration of transition in milliseconds
          loader: false // should display the loader ?
        },
        size: {
          //全景容器的最终尺寸
          width: "100%",
          height: "100%"
        },
        minFov: 30, //最小视野  默认：30
        maxFov: 90, //最大视场 默认： 90
        default_fov: 90,
        defaultZoomLvl: 30, //初始缩放级别，默认： 30
        navbar: ["autorotate", "zoom", "caption", "markers", "fullscreen"],
        // markers: (function() {
        //   return that.initMarkers();
        // })()
        markers: this.firstMakers
      });

      this.PSV.on("select-marker", function(marker) {
        if (marker.data) {
          that.PSV.clearMarkers();
          that.PSV.setPanorama(marker.data.url, marker.data.target, true);
          that.PSV.setCaption(marker.data.desc);
          var newDataMarkers = res.data.data.filter(function(obj) {
            return obj.sourceUrl == marker.data.url;
          });

          for (let i = 0; i < newDataMarkers[0].hotpot.length; i++) {
            that.PSV.addMarker(JSON.parse(newDataMarkers[0].hotpot[i].data));
            console.log(JSON.parse(newDataMarkers[0].hotpot[i].data));
          }
        }
      });
      // this.PSV.on("dblclick", function(e) {
      //   that.PSV.addMarker({
      //     id: "#" + Math.random(),
      //     tooltip: "Generated marker",
      //     longitude: e.longitude,
      //     latitude: e.latitude,
      //     image: require("../assets/pin-red.png"),
      //     width: 32,
      //     height: 32,
      //     anchor: "bottom center",
      //     data: {
      //       deletable: true
      //     }
      //   });
      //   console.log(e.longitude, e.latitude);
      // });
      // this.PSV.on("position-updated", function(e) {
      //   console.log(e);
      // });
    },
    //根据建筑id获取所有数据和初始化第一张图片
    initData(buildid) {
      let that = this;
      return new Promise((resolve, reject) => {
        this.axios({
          methods: "get",
          url: "http://10.27.217.163:8085/pano/getPano",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          },
          params: {
            buildId: buildid
          }
        }).then(res => {
          resolve(res);
        });
      });
    }
  }
};
</script>

<style scoped>
.hello {
  height: 100%;
}
.viewer {
  height: 100%;
}
</style>
