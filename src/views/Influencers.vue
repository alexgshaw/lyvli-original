<template>
  <div class="influencers-container">
    <h1 class="title">Influencers</h1>
    <div class="search">
      <form class="pure-form">
        <!-- <i class="fas fa-search icon"></i> -->
        <input
          type="text"
          v-model="searchText"
          placeholder="Search for your influencer"
        />
      </form>
    </div>
    <div class="influencers">
      <router-link
        class="influencer"
        v-for="user in users"
        :key="user.name"
        :to="'/schedule/' + user.name"
      >
        <!-- <div class="influencer" v-for="user in users" :key="user.name"> -->
        <div class="person">
          <img :src="user.profilePhoto" :alt="user.name" />
          <h2>{{ user.name }}</h2>
        </div>
        <div class="info">
          <h4>${{ user.cost }}.00</h4>
          <h4>{{ user.duration }} minutes</h4>
        </div>
        <!-- </div> -->
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Influencers",
  data: function() {
    return {
      searchText: ""
    };
  },
  computed: {
    users() {
      return this.$root.$data.users.filter(
        user =>
          user.name.toLowerCase().search(this.searchText.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style scoped>
.influencers-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  margin-bottom: 20px;
}

input[type="text"] {
  width: 400px;
  height: 40px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #f5f5f5;
  font-size: 1em;
  margin-bottom: 20px;
}

input:focus-visible[type="text"] {
  outline: none;
}

input::placeholder {
  color: #9e9e9e;
}

.icon {
  position: absolute;
}

.influencers {
  /* display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.influencer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 8px 0 #ebedef;
  border: 1px solid #d6dbdf;
  border-radius: 10px;
  width: 600px;
  padding: 20px;
  margin: 10px 20px;
  text-decoration: none;
  color: black;

  /* width: 250px;
  height: 250px;
  flex-direction: column; */
}

.person {
  display: flex;
  align-items: center;
  text-align: center;

  /* flex-direction: column; */
}

.person img {
  width: 75px;
  border-radius: 50%;
  margin-right: 30px;

  /* margin-bottom: 20px; */
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  /* align-items: center; */
}

.info h4 {
  margin: 5px 0;
}
</style>
