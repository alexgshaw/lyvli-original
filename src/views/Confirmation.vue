<template>
  <div class="confirmation-container">
    <h1>Thank you for booking with {{ user.name }}</h1>
    <h4>Your call will take place on {{ timeString }}</h4>
  </div>
</template>

<script>
export default {
  name: "Confirmation",
  props: {
    user: Object,
    timeSlot: Date,
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
      return this.timeSlot.toLocaleString("en-US", options);
    },
  },
};
</script>

<style scoped>
.confirmation-container {
  text-align: center;
}

.confirmation-container h1 {
  margin-bottom: 20px;
}
</style>
