<template>
  <div class="hello">
    <div :id="viewer" :key="buildId"></div>
    <div class="ThumbnailContent" v-if="ThumbnailBoolean">
      <swiper class="swiperClass" :options="swiperOption">
        <swiper-slide
          class="inline"
          v-for="(thumb, index) in thumbnailArray"
          :key="index"
          :class="{ turnInline: index == indexPano }"
          @click="turnPano(thumb, index)"
        >
          <img class="imgClass" :src="baseUrl + thumb.thumbUrl" />
          <el-tooltip effect="dark" :content="thumb.sourceName" placement="top">
            <div class="imgTitle">
              {{ thumb.sourceName }}
            </div>
          </el-tooltip>
        </swiper-slide>
      </swiper>
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
    <div class="raderMap" v-if="showMusicMap">
      <div class="mapContainer" @click="openMusic">
        <img class="imgMusic" :src="musicImg" />
        <audio
          id="audios"
          :src="SDUSong"
          autoplay="autoplay"
          loop="true"
        ></audio>
      </div>
      <div class="mapContainer" @click="openMap">
        <img class="imgMap" :src="mapImg" />
      </div>
      <transition name="slide-fade">
        <div v-if="showMap" class="softwareContainer">
          <img class="imgSoftware" :src="baseUrl + raderMap.sourceUrl" />
          <div
            v-for="(thumb, index) in thumbnailArray"
            :key="index"
            @click="turnPano(thumb, index)"
          >
            <el-tooltip
              effect="dark"
              :content="thumb.sourceName"
              placement="top"
            >
              <img
                class="blueSpot"
                :style="{ bottom: thumb.bottom + '%', left: thumb.left + '%' }"
                :src="index === indexPano ? redSpotSrc : blueSpotSrc"
              />
            </el-tooltip>
            <!-- <img
              class="raderImg"
              :class="'blueSpot' + index"
              :src="raderSrc"
              v-show="index === indexPano"
            /> -->
          </div>
          <!-- <div class="mapBottom">
            <div class="mapBottomContainerEnlarge">
              <img
                class="enlarge"
                @click="enlargeMap"
                src="../../static/img/enlarge.png"
              />
            </div>
            <div class="mapBottomContainerShrink">
              <img
                class="closeMap"
                @click="openMap"
                src="../../static/img/closeMap.png"
              />
            </div>
          </div> -->
        </div>
      </transition>
    </div>
    <div class="timeline" v-if="myswipe">
      <el-carousel :interval="4000" type="card" height="200px">

    <el-carousel-item v-for="(val,key,index) in timeImg" :label="timeImg[index+1].name" :key="index">
      <div class="timeImg" @click="turnTimeImg(timeImg[index+1],key)" 
      v-bind:style="{ 'background-image': 'url(' + timeImg[index+1].tlimg + ')',
      'background-repeat':'no-repeat','background-size':'cover' }" ></div>
      <!-- <h3 class="medium">{{ index+1 }}</h3> -->
    </el-carousel-item>
  </el-carousel>

    </div>
  </div>
</template>

<script>
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import Vue from "vue";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
Vue.use(ViewUI);
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
      myswipe: false,
      thumbnailArray: [], //获取除第一张之外，其它的缩略图图片地址信息和图片中热点信息
      changeSelectStyle: "", //设置样式
      sourceId: 0, //定义当前显示图片的sourceId
      indexPano: 0, //表示初始显示第一张图片
      buildId: 0, //0代表软件学院室外全景 9代表科研楼
      playMusic: true, //播放音乐
      showMap: false, //显示小地图
      blueSpotSrc: "../../static/img/blueSpot.png",
      redSpotSrc: "../../static/img/redSpot.png",
      raderSrc: "../../static/img/rader.png",
      musicImg: "../../static/img/music.png",
      stopMusicImg: "../../static/img/stopMusic.png",
      SDUSong: "../../static/mp3/SDUSong.mp3",
      mapImg: "../../static/img/map.png",
      showMusicMap: false,
      raderMap: [], //存放小地图相关信息
      raderMapSpot: [], //存放解析后的小地图标点位置信息
      swiperOption: {
        slidesPerView: 7,
        grabCursor: true,
      },
      timeImg:{},
    };
  },
  created() {
    this.initPhotoSphere(this.buildId);
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
      this.timeImg={};
      if(res.data.data[0].brief){
        this.timeImg = JSON.parse(res.data.data[0].brief);
        // console.log(this.timeImg)
      }
      for (let j = 0; j < res.data.data.length; j++) {
        if (res.data.data[j].thumbUrl) {
          this.thumbnailArray[j] = {};
          this.thumbnailArray[j].sourceName = res.data.data[j].sourceName;
          this.thumbnailArray[j].thumbUrl = res.data.data[j].thumbUrl;
          this.thumbnailArray[j].sourceUrl = res.data.data[j].sourceUrl;
          this.thumbnailArray[j].hotpots = res.data.data[j].hotpots;
          this.thumbnailArray[j].bottom = res.data.data[j].x * 100;
          this.thumbnailArray[j].left = res.data.data[j].y * 100;
        }
      }
      this.raderMap = res.data.data[res.data.data.length - 1]; //获取小地图数据
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
          duration: 0, // duration of transition in milliseconds
          loader: false, // should display the loader ?
        },
        size: {
          //全景容器的最终尺寸
          width: "100%",
          height: "104%",
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
                that.myswipe = false;
              }
            },
          },
          {
            id: "Timeline",
            title: "时间轴",
            className: "Thumbnail",
            content: "时间轴",
            onClick: function () {
              if (that.myswipe) {
                that.myswipe = false;
              } else {
                that.myswipe = true;
                that.ThumbnailBoolean = false;
              }
            },
          },
          "caption",
          {
            id: "caption",
          },
          "stereo",
          "markers",
          "fullscreen",
        ],
        markers: this.firstMakers,
      });
      this.showMusicMap = true;
      this.PSV.getNavbarButton("Thumbnail").container.style.width = "60px"; //设置自定义按钮样式
      this.PSV.getNavbarButton("Timeline").container.style.width = "60px"; //设置自定义按钮样式
      this.PSV.getNavbarButton("caption").container.style.width = "260px"; //设置自定义按钮样式
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
      // this.PSV.on("dblclick", function (e) {
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
      //       deletable: true,
      //     },
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
    turnTimeImg(value,index) {
      if (this.indexPano != index) {
        this.indexPano = index;
        let that = this;
        this.PSV.clearMarkers();
        this.PSV.setCaption(value.sourceName);
        this.PSV.setPanorama(this.baseUrl + value.sourceUrl, true)
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
        musicImg.src = this.musicImg;
      } else {
        audio.pause();
        this.playMusic = true;
        musicImg.src = this.stopMusicImg;
      }
    },
    openMap() {
      if (this.showMap) {
        this.showMap = false;
      } else {
        this.showMap = true;
      }
    },
    timenode() {
      alert("11");
    },
  },
};
</script>

<style scoped>
.hello {
  height: 100%;
  position: relative;
}
.ThumbnailContent {
  position: absolute;
  bottom: 5%;
  width: 100%;
  height: 150px;
  opacity: 0.9;
  text-align: center;
  z-index: 10;
}
.swiperClass {
  width: 44%;
}
.imgContainer {
  position: relative;
  display: inline-block;
  /* width: 90%; */
  height: 100%;
  margin: auto;
  overflow: hidden;
  align-content: center;
}
.turnLeft {
  position: absolute;
  left: 0%;
  width: 100px;
  height: 100%;
}
.turnImg {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 90%;
}
.turnRight {
  position: absolute;
  display: inline-block;
  right: 10%;
  width: 100px;
  height: 80%;
}

.inline {
  position: relative;
  display: inline-block;
  margin: 5px 10px;
  width: 100px !important;
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
  height: 100%;
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
.imgMap {
  display: inline-block;
  width: 60%;
  height: 60%;
  line-height: 60%;
  text-align: center;
}
.softwareContainer {
  position: relative;
  width: 200px;
  height: 200px;
}
.imgSoftware {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.blueSpot {
  position: absolute;
  display: inline-block;
  width: 10%;
  height: 10%;
}
.raderImgContainer {
  position: absolute;
  width: 60%;
  height: 60%;
}
.raderImg {
  position: absolute;
  display: inline-block;
  width: 30%;
  height: 30%;
}
.mapBottom {
  position: relative;
  width: 100%;
  height: 40px;
}
.mapBottomContainerEnlarge {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 40%;
  height: 100%;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  text-align: center;
}
.mapBottomContainerShrink {
  position: absolute;
  top: 0%;
  left: 50%;
  width: 40%;
  height: 100%;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  text-align: center;
}
.enlarge {
  display: inline-block;
  width: 45%;
  height: 80%;
}
.closeMap {
  display: inline-block;
  width: 40%;
  height: 70%;
}
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 1s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}
.slide-fade-leave {
  transform: translateX(200px);
}
.timeline {
  
 position: absolute;
  bottom: 1%;
  left: 10%;
  width: 80%;
  z-index: 10;
  text-align: center;
}
.timeImg{
  height: 100%;
  width: 100%;
}
.time {
  font-size: 14px;
  font-weight: bold;
  color: white;
  width: 25px;
  height: 25px;
}
.content {
  padding-left: 5px;
  color: white;
}
.node {
  color: #f6b64c;
  width: 50px;
  height: 50px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
