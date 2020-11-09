<template>
  <div class="hello">
    <div :id="viewer"></div>
  </div>
</template>

<script>
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

export default {
  name: "test",
  data() {
    return {
      viewer: "viewer",
      PSV: null,
      panos: {
        id: "1",
        url: require("../assets/1.jpg"),
        desc: "第一张",
        target: {
          //target设置图片的初始视角
          longitude: 3.848,
          latitude: -0.244
        },
        markers: [
          {
            id: "hot1",
            image: require("../assets/pin-blue.png"),
            width: 30,
            height: 30,
            longitude: 0, //经度  屏幕中心为（0，0）左右移动
            latitude: -0.25, //维度 上下移动
            anchor: "center center",
            tooltip: "第二张",
            data: {
              id: "2",
              url: require("../assets/2.jpg"),
              desc: "第二张",
              target: {
                longitude: 0,
                latitude: -0.35
              }
            }
          },
          {
            id: "text",
            html: "This <b>is</b> text ",
            anchor: "bottom right",
            style: {
              color: "white",
              fontSize: "20px",
              fontFamily: "Helvetica, sans-serif",
              textAlign: "center"
            },
            longitude: 0.45,
            latitude: -0.4
          }
        ]
      }
    };
  },
  created() {},
  beforeMount() {},
  mounted() {
    // this.initData();
    this.initPhotoSphere();
    //this.getData(9);
  },
  methods: {
    // initData() {
    //   this.axios.get("http://localhost:8080/initData").then(response => {
    //     //console.log(response.data);
    //     this.panos = response.data.initImg;
    //     console.log(this.panos.url);
    //   });
    // },
    initPhotoSphere() {
      var that = this;
      //console.log(this.panos.url);
      this.PSV = new PhotoSphereViewer({
        container: this.viewer,
        panorama: this.panos.url,
        target: this.panos.target,
        caption: this.panos.desc, //导航栏中显示的文本。如果导航栏被禁用，它将不显示，但没有按钮
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
        markers: this.panos.markers
      });

      this.PSV.on("select-marker", function(marker) {
        if (marker.data) {
          that.PSV.clearMarkers();
          that.PSV.setPanorama(marker.data.url, marker.data.target, true);
          that.PSV.setCaption(marker.data.desc);

          let markers = that.getData(9);
          console.log("markers=" + markers);
          for (var i = 0; i < markers.length; i++) {
            that.PSV.addMarker(markers[i]);
          }
          //   that.getData(9);
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
    getData(buildid) {
      let that = this;
      this.axios({
        methods: "get",
        url: "http://10.27.217.163:8088/pano/getPano",
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        params: {
          buildId: buildid
        }
      }).then(res => {
        console.log(res.data.data);
        let a = [];
        for (let i = 0; i < res.data.data.length; i++) {
          a.push(res.data.data[i].data);
        }
        console.log("a=" + a);
        let markers = a;
        console.log("markers=" + markers);
        for (var i = 0; i < markers.length; i++) {
          that.PSV.addMarker(markers[i]);
        }
      });
    },
    initMarkers() {
      //第一张图片中的热点信息
      let a = [];
      a.push({
        id: "hot1",
        image: require("../assets/pin-blue.png"),
        width: 30,
        height: 30,
        longitude: 0, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.25, //维度 上下移动
        anchor: "center center",
        tooltip: "第二张",
        data: {
          id: "2",
          url: require("../assets/2.jpg"),
          desc: "第二张",
          target: {
            longitude: 0,
            latitude: -0.35
          }
        }
      });
      a.push({
        id: "text",
        html: "This <b>is</b> text ",
        anchor: "bottom right",
        style: {
          color: "white",
          fontSize: "20px",
          fontFamily: "Helvetica, sans-serif",
          textAlign: "center"
        },
        longitude: 0.45,
        latitude: -0.4
      });
      return a;
    },

    nextMarkers() {
      //第2张图片中的热点信息
      let a = [];
      a.push({
        id: "hot1",
        image: require("../assets/pin-blue.png"),
        width: 30,
        height: 30,
        longitude: 3.17, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.55, //维度 上下移动
        anchor: "center center",
        tooltip: "第1张",
        data: {
          url: require("../assets/1.jpg"),
          desc: "第1张",
          target: {
            longitude: 0,
            latitude: 0
          }
        }
      });
      a.push({
        id: "hot3",
        image: require("../assets/pin-blue.png"),
        width: 30,
        height: 30,
        longitude: 1.3, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.39, //维度 上下移动
        anchor: "center center",
        tooltip: "第3张",
        data: {
          url: require("../assets/3.jpg"),
          desc: "第3张",
          target: {
            longitude: 1.22,
            latitude: -0.63
          }
        }
      });
      return a;
    }
    // threeImgMarkers() {
    //   //第3张图片中的热点信息
    //   let a = [];
    //   a.push({
    //     id: "hot2",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 5.94, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.31, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第2张",
    //     data: {
    //       url: require("../assets/2.jpg"),
    //       desc: "第2张",
    //       target: {
    //         longitude: 1.22,
    //         latitude: -0.63
    //       }
    //     }
    //   });
    //   a.push({
    //     id: "hot4",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 1.19, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.43, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第4张",
    //     data: {
    //       url: require("../assets/4.jpg"),
    //       desc: "第4张",
    //       target: {
    //         longitude: 0.63,
    //         latitude: -0.28
    //       }
    //     }
    //   });
    //   return a;
    // },
    // fourImgMarkers() {
    //   //第4张图片中的热点信息
    //   let a = [];
    //   a.push({
    //     id: "hot3",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 3.88, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.5, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第3张",
    //     data: {
    //       url: require("../assets/3.jpg"),
    //       desc: "第3张",
    //       target: {
    //         longitude: 1.22,
    //         latitude: -0.63
    //       }
    //     }
    //   });
    //   a.push({
    //     id: "hot5",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 6.22, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.28, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第5张",
    //     data: {
    //       url: require("../assets/5.jpg"),
    //       desc: "第5张",
    //       target: {
    //         longitude: 5.41,
    //         latitude: -0.4
    //       }
    //     }
    //   });
    //   a.push({
    //     id: "hot6",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 1.52, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.34, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第6张",
    //     data: {
    //       url: require("../assets/6.jpg"),
    //       desc: "第6张",
    //       target: {
    //         longitude: 5.43,
    //         latitude: -0.19
    //       }
    //     }
    //   });
    //   return a;
    // },
    // fiveImgMarkers() {
    //   //第5张图片中的热点信息
    //   let a = [];
    //   a.push({
    //     id: "hot4",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 5.14, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.37, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第4张",
    //     data: {
    //       url: require("../assets/3.jpg"),
    //       desc: "第4张",
    //       target: {
    //         longitude: 0.63,
    //         latitude: -0.28
    //       }
    //     }
    //   });
    //   a.push({
    //     id: "hot6",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 4.23, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.23, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第6张",
    //     data: {
    //       url: require("../assets/6.jpg"),
    //       desc: "第6张",
    //       target: {
    //         longitude: 5.43,
    //         latitude: -0.19
    //       }
    //     }
    //   });
    //   return a;
    // },
    // sixImgMarkers() {
    //   //第6张图片中的热点信息
    //   let a = [];
    //   a.push({
    //     id: "hot4",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 5.3, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.29, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第4张",
    //     data: {
    //       url: require("../assets/3.jpg"),
    //       desc: "第4张",
    //       target: {
    //         longitude: 0.63,
    //         latitude: -0.28
    //       }
    //     }
    //   });
    //   a.push({
    //     id: "hot7",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 1.89, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.25, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第7张",
    //     data: {
    //       url: require("../assets/7.jpg"),
    //       desc: "第7张",
    //       target: {
    //         longitude: 0.47,
    //         latitude: -0.41
    //       }
    //     }
    //   });
    //   return a;
    // },
    // sevenImgMarkers() {
    //   //第7张图片中的热点信息
    //   let a = [];
    //   a.push({
    //     id: "hot7",
    //     image: require("../assets/pin-blue.png"),
    //     width: 30,
    //     height: 30,
    //     longitude: 0.19, //经度  屏幕中心为（0，0）左右移动
    //     latitude: -0.26, //维度 上下移动
    //     anchor: "center center",
    //     tooltip: "第7张",
    //     data: {
    //       url: require("../assets/7.jpg"),
    //       desc: "第7张",
    //       target: {
    //         longitude: 0.08,
    //         latitude: -0.51
    //       }
    //     }
    //   });
    //   return a;
    // }
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
