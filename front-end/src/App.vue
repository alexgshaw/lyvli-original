<template>
  <div id="app">
    <!-- <div class="non-footer"> -->
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/influencers">Influencers</router-link>
      <!-- <router-link to="/schedule-appointment">Schedule Appointment</router-link> -->
    </div>
    <router-view />
    <!-- </div> -->
    <div id="footer">
      <img src="/images/github.png" alt="github" />
      <a href="https://github.com/alexgshaw/lyvli" target="_blank"
        >Click here for code</a
      >
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: "Poppins", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
}

h1,
h2 {
  font-weight: 900;
}

h3 {
  font-weight: 600;
}

h4,
h5,
h6 {
  font-weight: 500;
}

/* .non-footer {
  width: 100%;
} */

.card {
  display: flex;
  width: auto;
  box-shadow: 0 1px 8px 0 #ebedef;
  border: 1px solid #d6dbdf;
  border-radius: 25px;
}

#nav {
  height: 70px;
  width: 100%;
  box-shadow: 0 1px 8px 0 #ebedef;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  position: sticky;
  top: 0;
  background-color: white;
  /* border-bottom: 1px solid #d6dbdf; */
}

#nav a {
  font-weight: bold;
  color: black;
  margin: 0 20px;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #02c39a;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="email"],
textarea {
  font-family: "Poppins", Avenir, Helvetica, Arial, sans-serif;
  height: 40px;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background-color: #f5f5f5;
  font-size: 1em;
  margin-top: 5px;
  margin-bottom: 20px;
}

input:focus-visible[type="text"],
input:focus-visible[type="email"],
textarea:focus-visible {
  /* outline: none; */
  outline: 2px solid black;
}

textarea {
  resize: none;
  min-height: 200px;
}

input::placeholder {
  color: #9e9e9e;
}

button {
  text-decoration: none;
  font-size: 1em;
  color: white;
  background-color: #02c39a;
  border-radius: 25px;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  border: none;
}

button:hover {
  cursor: pointer;
}

#footer {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  /* border-bottom: 1px solid #d6dbdf; */
}

#footer img {
  height: 30px;
  margin-right: 10px;
}

#footer a {
  text-decoration: none;
  font-weight: bold;
  color: black;
}

@media only screen and (max-width: 960px) {
  #nav {
    position: static;
    margin-bottom: 20px;
  }
}
</style>
