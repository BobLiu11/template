<template>
  <div class="hello">
    <button @click="getPano">进入全景</button>
    <button @click="getTest">进入tets</button>
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
