<template>
  <div class="home">
    <h1>Welcome to Lyvli</h1>
    <h4>Start scheduling live video calls with the influencers you love.</h4>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.home {
  text-align: center;
}

.home h1 {
  font-size: 6em;
  margin-bottom: 20px;
  color: #05668d;
}

.home h4 {
  font-size: 1.2em;
}

@media only screen and (max-width: 600px) {
  .home {
    width: 90%;
  }
  .home h1 {
    font-size: 2.5em;
  }

  .home h4 {
    font-size: 1em;
  }
}
</style>
