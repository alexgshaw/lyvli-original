<template>
  <div class="influencers-container">
    <h1 class="title">Influencers</h1>
    <div class="search-form">
      <form class="pure-form">
        <!-- <i class="fas fa-search icon"></i> -->
        <input
          id="search"
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
          <div class="person-text">
            <h2>{{ user.name }}</h2>
            <h4>{{ userToNumTimeSlots[user.name] }} Slots Left</h4>
          </div>
        </div>
        <div class="info">
          <h3>${{ user.cost }}.00</h3>
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
    },
    userToNumTimeSlots() {
      let userToNumTimeSlots = {};
      this.users.forEach(user => {
        userToNumTimeSlots[user.name] = this.getUserTimeSlots(user);
      });
      return userToNumTimeSlots;
    }
  },
  methods: {
    getUserTimeSlots(user) {
      let numSlots = 0;

      user.availability.forEach(availabilityDate => {
        const {
          year,
          month,
          day,
          startHour,
          startMin,
          endHour,
          endMin
        } = availabilityDate;

        let startTime = new Date(year, month, day, startHour, startMin);
        let endTime = new Date(year, month, day, endHour, endMin);

        // TODO change this to update by hour not by day
        if (new Date(year, month, day) > new Date()) {
          let minutes = (endTime - startTime) / 60000;
          numSlots += Math.floor(minutes / user.duration);
        }
      });

      return numSlots;
    }
  }
};
</script>

<style scoped>
.influencers-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.title {
  margin-bottom: 20px;
}

.icon {
  position: absolute;
}

#search {
  width: 400px;
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
  border-radius: 25px;
  width: 600px;
  padding: 20px;
  margin: 10px 20px;
  text-decoration: none;
  color: black;

  /* width: 250px;
  height: 250px;
  flex-direction: column; */
}

.person-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

.info h3,
.info h4 {
  margin: 5px 0;
}

.info h3 {
  color: #2ecc71;
}

@media only screen and (max-width: 600px) {
  .influencers-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
  }

  .search-form {
    width: 100%;
  }

  .pure-form {
    display: flex;
    /* align-self: stretch; */
  }

  #search {
    margin: 0 10px;
    width: auto;
    flex: 1;
    margin-bottom: 20px;
  }

  .influencers {
    display: flex;
    /* width: 100%;
    padding: 0 20px; */
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
    border-radius: 25px;
    width: 600px;
    padding: 20px;
    margin: 10px 20px;
    text-decoration: none;
    color: black;

    /* width: 250px; */
    width: 100%;
    height: 250px;
    flex-direction: column;
  }

  .person {
    display: flex;
    align-items: center;
    text-align: center;

    flex-direction: column;
  }

  .person img {
    width: 75px;
    border-radius: 50%;
    margin-right: 30px;

    margin-right: 0;
    margin-bottom: 20px;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    align-items: center;
  }
}
</style>
