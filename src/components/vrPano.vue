<template>
  <div class="hello">
    <div :id="viewer"></div>
    <div class="Thumbnail" v-if="ThumbnailBoolean">
      <div class="inline" v-for="fit in fits" :key="fit" @click="turnPano()">
        <img class="imgClass" :src="url" />
        <span class="imgTitle">{{ fit }}</span>
      </div>
      <div class="academyName">山东大学软件学院</div>
    </div>
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
      baseUrl: "http://10.27.217.163:8085",
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
      firstMakers: [],
      ThumbnailBoolean: false,
      fits: ["软件学院正门", "教学楼六区", "食堂", "宿舍2号楼", "篮球场"],
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
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
        panorama: that.baseUrl + that.panos.url,
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
        navbar: [
          "autorotate",
          "zoom",
          {
            title: "Thumbnail",
            className: "Thumbnail",
            content: "Thumbnail",
            onClick: function() {
              if (that.ThumbnailBoolean) {
                that.ThumbnailBoolean = false;
                console.log(that.ThumbnailBoolean);
              } else {
                that.ThumbnailBoolean = true;
                console.log(that.ThumbnailBoolean);
              }
              // console.log(document.getElementsByClassName("Thumbnail"));
              // alert("222");
            }
          },
          "caption",
          "stereo",
          "markers",
          "fullscreen"
        ],
        // markers: (function() {
        //   return that.initMarkers();
        // })()
        markers: this.firstMakers
      });

      this.PSV.on("select-marker", function(marker) {
        if (marker.data) {
          that.PSV.clearMarkers();
          that.PSV.setPanorama(
            that.baseUrl + marker.data.url,
            marker.data.target,
            true
          );
          that.PSV.setCaption(marker.data.desc);
          var newDataMarkers = res.data.data.filter(function(obj) {
            return obj.sourceUrl == marker.data.url;
          });

          for (let i = 0; i < newDataMarkers[0].hotpot.length; i++) {
            that.PSV.addMarker(JSON.parse(newDataMarkers[0].hotpot[i].data));
            //console.log(JSON.parse(newDataMarkers[0].hotpot[i].data));
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
          url: that.baseUrl + "/pano/getPano",
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
  position: relative;
}
.Thumbnail {
  position: absolute;
  bottom: 5%;
  width: 100%;
  height: 150px;
  background-color: #a7a09a;
  opacity: 0.9;
  text-align: center;
}
/* .Container {
  position: relative;
  height: 100%;
  text-align: center;
  background-color: red;
} */
.inline {
  position: relative;
  display: inline-block;
  margin: 5px 10px;
  width: 100px;
  height: 100px;
  align-content: center;
}
.academyName {
  position: absolute;
  bottom: 5%;
  width: 100%;
  text-align: center;
}
.imgClass {
  position: absolute;
  left: 2%;
  display: inline-block;
  width: 100%;
  height: 100px;
  text-align: center;
}
.imgTitle {
  position: absolute;
  bottom: 0%;
  left: 2%;
  width: 100%;
  text-align: center;
  background-color: #4c4d4f;
}
</style>
