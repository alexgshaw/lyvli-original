<template>
  <div class="schedule-agreement-container">
    <div v-if="!submitted" class="card">
      <div class="card-content">
        <div class="header">
          <h1>Schedule with {{ mentor.name }}</h1>
          <h3>{{ timeString }}</h3>
        </div>
        <form class="form" @submit.prevent="createAppointment">
          <div class="form-section">
            <div class="form-input">
              <label for="first-name">First Name</label>
              <input
                id="first-name"
                class="text-input"
                type="text"
                name="firstName"
                value=""
                v-model="firstName"
              />
            </div>
            <div class="form-input">
              <label for="last-name">Last Name</label>
              <input
                id="last-name"
                class="text-input"
                type="text"
                name="lastName"
                value=""
                v-model="lastName"
              />
            </div>
          </div>
          <div class="form-section">
            <div class="form-input">
              <label for="email">Email</label>
              <input
                id="email"
                class="text-input"
                type="email"
                name="email"
                value=""
                v-model="email"
              />
            </div>
          </div>
          <div class="form-section">
            <div class="form-input">
              <label for="phone">Phone</label>
              <input
                id="phone"
                class="text-input"
                type="text"
                name="phone"
                value=""
                v-model="phone"
              />
            </div>
          </div>
          <div class="form-section">
            <div class="form-input">
              <label for="age">Age</label>
              <input
                id="age"
                class="text-input"
                type="text"
                name="age"
                value=""
                v-model="age"
              />
            </div>
          </div>
          <div class="form-section">
            <div class="form-input">
              <label for="questions"
                >Let me know what you would like to chat about :) (e.g.
                questions, advice, suggestions, etc.)</label
              >
              <textarea
                id="questions"
                name="abstract"
                v-model="message"
              ></textarea>
            </div>
          </div>
          <div class="form-button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
    <div v-else class="confirmation">
      <h1>Thank you for booking with {{ mentor.name }}</h1>
      <h4>Your call will take place on {{ timeString }}</h4>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ScheduleForm",
  props: {
    mentor: Object,
    meetingSlot: Date,
  },
  data: function () {
    return {
      submitted: false,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
      message: "",
    };
  },
  computed: {
    timeString() {
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return this.meetingSlot.toLocaleString("en-US", options);
    },
  },
  methods: {
    async createAppointment() {
      try {
        await axios.post("/api/create-appointment", {
          mentorInstagram: this.mentor.instagram,
          menteeName: this.firstName + " " + this.lastName,
          menteeEmail: this.email,
          menteePhone: this.phone,
          menteeAge: this.age,
          menteeMessage: this.message,
          start: this.meetingSlot,
          end: new Date(
            this.meetingSlot.getTime() + this.mentor.duration * 60000
          ),
        });
        this.submitted = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.schedule-agreement-container {
  display: flex;
  justify-content: center;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  text-align: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  padding: 30px 70px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-section {
  display: flex;
  width: 100%;
}

.form-input {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 10px;
}

.text-input {
  flex: 1;
}

.form-button {
  margin-top: 20px;
}

button {
  width: 200px;
}

.confirmation {
  width: 90%;
}

.confirmation h1 {
  margin-bottom: 20px;
}

@media only screen and (max-width: 960px) {
  .card {
    box-shadow: none;
    border: none;
    border-radius: 0;
    flex-direction: column;
    align-items: center;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    padding: 20px 0;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .form-input {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0 10px;
    width: 100%;
  }

  .text-input {
    flex: 1;
  }

  .form-button {
    margin-top: 20px;
  }

  button {
    width: 200px;
  }
}

@media only screen and (max-width: 500px) {
  .form-button {
    width: 100%;
  }
  button {
    width: 100%;
    border-radius: 10px;
  }
}
</style>
