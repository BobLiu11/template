<template>
  <div class="hello">
    <button @click="getPano">进入室外全景</button>
    <button @click="getSearchBuilding">进入科研楼</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    getPano() {
      this.$router.push({ path: "./vrPano" });
    },
    getSearchBuilding() {
      this.$router.push({ path: "./searchBuild" });
    },
  },
};
</script>

<style scoped>
.hello {
  /* background-color: red; */
  height: 100%;
}
.viewer {
  height: 100%;
}
</style>
