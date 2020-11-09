import Mock from "mockjs";
//使用mock模拟数据
function initData() {
  return Mock.mock({
    code: "0",
    mes: "成功",
    initImg: {
      id: "1",
      url: "./../../static/img/1.jpg",
      desc: "第一张",
      target: {
        longitude: 0,
        latitude: 0
      }
    }
  });
}

function getMarkers() {
  return Mock.mock({
    code: "0",
    mes: "成功",
    markerArray: [{
        id: "hot1",
        image: require("../assets/pin-blue.png"),
        width: 30,
        height: 30,
        longitude: 0, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.25, //维度 上下移动
        anchor: "center center",
        tooltip: "下一张",
        data: {
          id: "3",
          url: require("../assets/3.jpg"),
          desc: "第一张",
          target: {
            longitude: 0,
            latitude: 0
          }
        }
      },
      {
        id: "hot2",
        image: require("../assets/pin-red.png"),
        width: 30,
        height: 30,
        longitude: 0.25, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.25, //维度 上下移动
        anchor: "center center",
        tooltip: "上一张",
        data: {
          id: "2",
          url: require("../assets/2.jpg"),
          desc: "第二张",
          target: {
            longitude: 0,
            latitude: 0
          }
        }
      },
      {
        id: "hot3",
        image: require("../assets/pin-blue.png"),
        width: 30,
        height: 30,
        longitude: 0.25, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.25, //维度 上下移动
        anchor: "center center",
        tooltip: "下一张",
        data: {
          url: require("../assets/1.jpg"),
          desc: "第一张",
          target: {
            longitude: 0,
            latitude: 0
          }
        }
      },
      {
        id: "hot2",
        image: require("../assets/pin-red.png"),
        width: 30,
        height: 30,
        longitude: 0.25, //经度  屏幕中心为（0，0）左右移动
        latitude: -0.5, //维度 上下移动
        anchor: "center center",
        tooltip: "上一张",
        data: {
          url: require("../assets/5.jpg"),
          desc: "第二张",
          target: {
            longitude: 0,
            latitude: 0
          }
        }
      }
    ]
  });
}
Mock.mock("http://localhost:8080/initData", "get", initData);
Mock.mock("http://localhost:8080/getMarkers", "get", getMarkers); //markers
export default Mock;
