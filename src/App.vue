<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/influencers">Influencers</router-link>
      <!-- <router-link to="/schedule-appointment">Schedule Appointment</router-link> -->
    </div>
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

#nav {
  height: 70px;
  width: 100%;
  box-shadow: 0 1px 8px 0 #ebedef;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  /* border-bottom: 1px solid #d6dbdf; */
}

#nav a {
  font-weight: bold;
  color: black;
  margin: 0 20px;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #29b6f6;
}
</style>
