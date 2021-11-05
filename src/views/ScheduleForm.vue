<template>
  <div class="schedule-agreement-container">
    <div class="card">
      <div class="card-content">
        <div class="header">
          <h1>Schedule with {{ user.name }}</h1>
          <h3>{{ timeString }}</h3>
        </div>
        <form class="form" action="" method="get">
          <div class="form-section">
            <div class="form-input">
              <label for="first-name">First Name</label>
              <input
                id="first-name"
                class="text-input"
                type="text"
                name="firstName"
                value=""
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
              />
            </div>
          </div>
          <div class="form-section">
            <div class="form-input">
              <label for="questions"
                >Let me know what you would like to chat about :) (e.g.
                questions, advice, suggestions, etc.)</label
              >
              <textarea id="questions" name="abstract"></textarea>
            </div>
          </div>
          <div class="form-button">
            <button type="submit" @click.stop.prevent="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleForm",
  props: {
    user: Object,
    timeSlot: Date
  },
  data: function() {
    return {};
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
        hour12: true
      };
      return this.timeSlot.toLocaleString("en-US", options);
    }
  },
  methods: {
    submit() {
      // this.$router.push("/confirmation");
      this.$router.push({
        name: "Confirmation",
        params: { user: this.user, timeSlot: this.timeSlot }
      });
    }
  }
};
</script>

<style scoped>
.schedule-agreement-container {
  /* width: 600px; */
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
</style>
