<template>
  <div class="hello">
    <div :id="viewer" :key="buildId"></div>
    <div class="imgContent" v-if="ThumbnailBoolean">
      <div
        class="inline"
        :class="{ turnInline: index == indexPano }"
        v-for="(thumb, index) in thumbnailArray"
        :key="index"
        @click="turnPano(thumb, index)"
      >
        <img class="imgClass" :src="baseUrl + thumb.thumbUrl" />
        <el-tooltip effect="dark" :content="thumb.sourceName" placement="top">
          <div class="imgTitle">
            {{ thumb.sourceName }}
          </div>
        </el-tooltip>
      </div>
      <div class="academyName">
        <div
          class="selectArea"
          :class="{ selectItem: 0 == buildId }"
          @click="turnSoft"
        >
          山东大学软件学院
        </div>
        <div
          class="selectArea"
          :class="{ selectItem: 9 == buildId }"
          @click="turnSearch"
        >
          科研楼
        </div>
      </div>
    </div>
    <div class="raderMap">
      <div class="mapContainer" @click="openMusic">
        <img class="imgMusic" src="../../static/img/music.png" />
        <audio
          id="audios"
          src="../../static/mp3/szovo.mp3"
          autoplay="autoplay"
          loop="true"
        ></audio>
      </div>
      <div class="mapContainer" @click="openMap">
        <img class="imgMusic" src="../../static/img/map.png" />
      </div>
      <div class="softwareContainer">
        <img class="imgSoftware" src="../../static/img/software.png" />
      </div>
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
      baseUrl: "http://211.87.231.41:8089",
      PSV: null,
      panos: {}, //第一张照片数据
      firstMakers: [], //第一张图片热点
      ThumbnailBoolean: false, //缩略图的显示与隐藏
      thumbnailArray: [], //获取除第一张之外，其它的缩略图图片地址信息和图片中热点信息
      changeSelectStyle: "", //设置样式
      sourceId: 0, //定义当前显示图片的sourceId
      indexPano: 0, //表示初始显示第一张图片
      buildId: 0, //0代表软件学院室外全景 9代表科研楼
      playMusic: true, //播放音乐
    };
  },
  created() {
    this.initPhotoSphere(this.buildId);
    // this.openMusic();
  },
  watch: {
    buildId: function (newData, oldData) {
      this.initPhotoSphere(newData);
    },
  },
  mounted() {},
  methods: {
    async initPhotoSphere(buildId) {
      var that = this;
      let res = await this.initData(buildId);
      //获取缩略图图片地址信息和图片中热点信息
      this.thumbnailArray = [];
      for (let j = 0; j < res.data.data.length; j++) {
        if (res.data.data[j].thumbUrl) {
          this.thumbnailArray[j] = {};
          this.thumbnailArray[j].sourceName = res.data.data[j].sourceName;
          this.thumbnailArray[j].thumbUrl = res.data.data[j].thumbUrl;
          this.thumbnailArray[j].sourceUrl = res.data.data[j].sourceUrl;
          this.thumbnailArray[j].hotpots = res.data.data[j].hotpots;
        }
      }
      //初始化第一张图片
      that.panos = JSON.parse(res.data.data[1].hotpots[0].data).data; //第一张图片
      that.firstMakers = [];
      for (let i = 0; i < res.data.data[0].hotpots.length; i++) {
        that.firstMakers.push(JSON.parse(res.data.data[0].hotpots[i].data)); //第一张图片热点
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
          loader: false, // should display the loader ?
        },
        size: {
          //全景容器的最终尺寸
          width: "100%",
          height: "100%",
        },
        minFov: 30, //最小视野  默认：30
        maxFov: 90, //最大视场 默认： 90
        default_fov: 90,
        defaultZoomLvl: 30, //初始缩放级别，默认： 30
        navbar: [
          "autorotate",
          "zoom",
          {
            id: "Thumbnail",
            title: "场景选择",
            className: "Thumbnail",
            content: "场景选择",
            onClick: function () {
              if (that.ThumbnailBoolean) {
                that.ThumbnailBoolean = false;
              } else {
                that.ThumbnailBoolean = true;
              }
            },
          },
          "caption",
          "stereo",
          "markers",
          "fullscreen",
        ],
        markers: this.firstMakers,
      });

      this.PSV.getNavbarButton("Thumbnail").container.style.width = "70px"; //设置自定义按钮样式
      this.PSV.on("select-marker", function (marker) {
        //在场景内不同接口的全景图跳转 1代表跳转到科研楼
        if (marker.id == 1) {
          that.buildId = 9;
          that.ThumbnailBoolean = false;
          that.indexPano = 0;
        }
        if (marker.data) {
          that.PSV.clearMarkers();
          var newDataMarkers = res.data.data.filter(function (obj) {
            return obj.sourceUrl == marker.data.url;
          });
          for (let i = 0; i < res.data.data.length; i++) {
            if (newDataMarkers[0].sourceId == res.data.data[i].sourceId) {
              that.indexPano = i;
            }
          }
          that.PSV.setPanorama(
            that.baseUrl + marker.data.url,
            marker.data.target,
            true
          ).then(function () {
            that.PSV.setCaption(marker.data.desc);
            for (var i = 0; i < newDataMarkers[0].hotpots.length; i++) {
              that.PSV.addMarker(JSON.parse(newDataMarkers[0].hotpots[i].data));
            }
            that.PSV.setCaption(marker.data.desc);
          });
        }
      });
      this.PSV.on("dblclick", function (e) {
        that.PSV.addMarker({
          id: "#" + Math.random(),
          tooltip: "Generated marker",
          longitude: e.longitude,
          latitude: e.latitude,
          image: require("../assets/pin-red.png"),
          width: 32,
          height: 32,
          anchor: "bottom center",
          data: {
            deletable: true,
          },
        });
        console.log(e.longitude, e.latitude);
      });
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
            "Content-type": "application/x-www-form-urlencoded",
          },
          params: {
            buildId: buildid,
          },
        })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    //缩略图转换
    turnPano(value, index) {
      if (this.indexPano != index) {
        this.indexPano = index;
        let that = this;
        this.PSV.clearMarkers();
        this.PSV.setCaption(value.sourceName);
        this.PSV.setPanorama(this.baseUrl + value.sourceUrl, true).then(
          function () {
            for (let k = 0; k < value.hotpots.length; k++) {
              that.PSV.addMarker(JSON.parse(value.hotpots[k].data));
            }
          }
        );
      }
    },
    //场景转换
    turnSoft() {
      //转换到软件学院全景
      if (this.buildId != 0) {
        this.buildId = 0;
        this.ThumbnailBoolean = false;
        this.indexPano = 0;
      }
    },
    turnSearch() {
      //转换到科研楼全景
      if (this.buildId != 9) {
        this.buildId = 9;
        this.ThumbnailBoolean = false;
        this.indexPano = 0;
      }
    },
    /**实现音乐和小地图方法 */
    openMusic() {
      let audio = document.querySelector("#audios");
      let musicImg = document.querySelector(".imgMusic");
      if (this.playMusic) {
        audio.play();
        this.playMusic = false;
        musicImg.src = "../../static/img/music.png";
      } else {
        audio.pause();
        this.playMusic = true;
        musicImg.src = "../../static/img/stopMusic.png";
      }
    },
    openMap() {},
  },
};
</script>

<style scoped>
.hello {
  height: 100%;
  position: relative;
}
.imgContent {
  position: absolute;
  bottom: 5%;
  width: 100%;
  height: 150px;
  opacity: 0.9;
  text-align: center;
  z-index: 10;
}
.inline {
  position: relative;
  display: inline-block;
  margin: 5px 10px;
  width: 100px;
  height: 100px;
  border: 3px solid #fff;
  align-content: center;
}
.turnInline {
  border: 3px solid #f6b64c;
}
.imgClass {
  position: absolute;
  left: 0%;
  display: inline-block;
  width: 100%;
  height: 100px;
  text-align: center;
}
.imgTitle {
  position: absolute;
  bottom: 0%;
  left: 1%;
  width: 99%;
  height: 20%;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}
.academyName {
  position: absolute;
  bottom: 5%;
  width: 100%;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.selectArea {
  display: inline-block;
  margin: 0px 15px;
}
.selectItem {
  border-bottom: 3px solid #f6b64c;
}
.raderMap {
  position: absolute;
  top: 1%;
  left: 0%;
  z-index: 10;
}
.mapContainer {
  margin: 15px 10px;
  padding: 0;
  width: 35px;
  height: 35px;
  line-height: 40px;
  background-color: rgb(139, 138, 138);
  text-align: center;
  border-radius: 50%;
  opacity: 0.8;
}
.imgMusic {
  display: inline-block;
  width: 60%;
  height: 60%;
  line-height: 60%;
  text-align: center;
}
.softwareContainer {
  width: 200px;
  height: 200px;
}
.imgSoftware {
  display: inline-block;
  width: 100%;
  height: 100%;
}
</style>
