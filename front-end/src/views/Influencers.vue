<template>
  <div class="influencers-container">
    <h1 class="title">Mentors</h1>
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
        v-for="mentor in filteredMentors"
        :key="mentor.instagram"
        :to="'/schedule/' + mentor.instagram"
      >
        <div class="person">
          <img :src="mentor.photo" :alt="mentor.name" />
          <div class="person-text">
            <h2>{{ mentor.name }}</h2>
            <h4>{{ mentor.maxAppointments }} Slots Left</h4>
          </div>
        </div>
        <div class="info">
          <h3>${{ mentor.price }}.00</h3>
          <h4>{{ mentor.duration }} minutes</h4>
        </div>
        <!-- </div> -->
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Influencers",
  data: function () {
    return {
      mentors: [],
      searchText: "",
    };
  },
  computed: {
    filteredMentors() {
      return this.mentors.filter((mentor) =>
        mentor.name
          .toLowerCase()
          .split(" ")
          .some((name) => name.startsWith(this.searchText.toLowerCase()))
      );
    },
  },
  created() {
    this.getMentors();
  },
  methods: {
    async getMentors() {
      try {
        const response = await axios.get("/api/mentors");
        this.mentors = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
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
}

.person img {
  width: 75px;
  border-radius: 50%;
  margin-right: 30px;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.info h3,
.info h4 {
  margin: 5px 0;
}

.info h3 {
  color: #00a896;
}

@media only screen and (max-width: 600px) {
  .influencers-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 90%;
  }

  .search-form {
    width: 100%;
  }

  .pure-form {
    display: flex;
    /* align-self: stretch; */
  }

  #search {
    margin: 0;
    width: auto;
    flex: 1;
    margin-bottom: 20px;
  }

  .influencers {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 250px;
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
    /* height: 250px; */
    flex-direction: column;
  }

  .person {
    display: flex;
    align-items: center;
    text-align: center;

    flex-direction: column;
  }

  .person img {
    width: 100px;
    border-radius: 50%;
    margin: 20px 0;
    margin-top: 5px;
  }

  .person-text {
    align-items: center;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    align-items: center;
  }
}
</style>
