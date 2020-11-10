<template>
  <div class="hello">
    <button @click="getPano">进入室外全景</button>
    <button @click="getTest">进入室内全景</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      initData: {}
    };
  },
  created() {},
  mounted() {},
  methods: {
    getPano() {
      this.$router.push({ path: "./vrPano" });
    },
    getTest() {
      this.$router.push({ path: "./test" });
    }
  }
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
