<template>
  <div class="schedule-appointment">
    <div class="card">
      <div class="card-selection">
        <div class="card-info">
          <img class="profile-photo" :src="mentor.photo" :alt="mentor.name" />
          <h1>Call with {{ mentor.name }}</h1>
          <div class="card-info-details">
            <h3>Duration: {{ mentor.duration }} minutes</h3>
            <h3>Cost: ${{ mentor.price }}.00</h3>
          </div>
          <div class="card-info-summary">
            <p>{{ mentor.message }}</p>
          </div>
        </div>
        <div class="card-calendar">
          <h2 id="date-time">Select a Date</h2>
          <div class="calendar-arrows">
            <div
              class="calendar-arrow"
              :class="{ 'inactive-arrow': present }"
              v-on="present ? {} : { click: () => iterateMonth(-1) }"
            >
              <i class="fas fa-chevron-left"></i>
            </div>
            <div id="month-name">
              <h3>{{ monthName }} {{ year }}</h3>
            </div>
            <div
              class="calendar-arrow"
              :class="{ 'inactive-arrow': futureLimit }"
              v-on="futureLimit ? {} : { click: () => iterateMonth(1) }"
            >
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          <div id="calendar">
            <div class="calendar-day" v-for="day in days" :key="day">
              {{ day }}
            </div>
            <div
              class="calendar-day"
              v-for="(blank, i) in Array(startDayIndex)"
              :key="i"
            >
              {{ blank }}
            </div>
            <div
              class="calendar-date"
              :class="{
                option: date.option,
                selected:
                  currentDate &&
                  currentDate.fullDate.getTime() === date.fullDate.getTime(),
              }"
              v-on="date.option ? { click: () => setCurrentDate(date) } : {}"
              v-for="date in dates"
              :key="date.fullDate.getTime()"
            >
              {{ date.fullDate.getDate() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div id="card-availability">
        <h2 id="open-slots">Open Time Slots</h2>
        <h3 class="default-message" v-if="meetingSlots.length === 0">
          Select a Date
        </h3>
        <div v-else class="buttons">
          <router-link
            class="button"
            v-for="meetingSlot in meetingSlots"
            :key="formatDateTime(meetingSlot)"
            :to="{
              name: 'ScheduleForm',
              params: { mentor: mentor, meetingSlot: meetingSlot },
            }"
          >
            {{ formatDateTime(meetingSlot) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default {
  name: "Schedule",
  data: function () {
    return {
      days: DAY_NAMES,
      mentor: {},
      currentDate: null,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    };
  },
  created: function () {
    this.getMentor(this.$route.params.instagram);
  },
  computed: {
    monthName() {
      return MONTH_NAMES[this.month];
    },
    present() {
      let today = new Date();
      return (
        this.month === today.getMonth() && this.year === today.getFullYear()
      );
    },
    maxDate() {
      if (Object.keys(this.mentor).length != 0) {
        return this.mentor.timeSlots.reduce((maxDate, timeSlot) => {
          return timeSlot.start > maxDate ? timeSlot.start : maxDate;
        }, new Date());
      } else {
        return new Date();
      }
    },
    futureLimit() {
      return (
        this.month === this.maxDate.getMonth() &&
        this.year === this.maxDate.getFullYear()
      );
    },
    filteredTimeSlots() {
      if (Object.keys(this.mentor).length != 0) {
        return this.mentor.timeSlots.filter((timeSlot) => {
          return (
            timeSlot.start.getFullYear() === this.year &&
            timeSlot.start.getMonth() == this.month
          );
        });
      } else {
        return [];
      }
    },
    dates() {
      var date = new Date(this.year, this.month, 1);
      var dates = [];

      while (date.getMonth() == this.month) {
        dates.push({
          fullDate: new Date(date.getTime()),
          day: this.days[date.getDay()],
          option: false,
        });
        date.setDate(date.getDate() + 1);
      }

      this.filteredTimeSlots.forEach((timeSlot) => {
        dates[timeSlot.start.getDate() - 1].option = true;
      });

      return dates;
    },
    startDayIndex() {
      return this.dates[0].fullDate.getDay();
    },
    meetingSlots() {
      if (this.currentDate) {
        const currentTimeSlots = this.mentor.timeSlots.filter((timeSlot) => {
          return (
            timeSlot.start.getDate() === this.currentDate.fullDate.getDate()
          );
        });

        // TODO sort the meetingSlots list by date and make sure none of these overlap. Best to do the overlap on the back-end

        const totalMeetingDuration =
          this.mentor.duration + this.mentor.bufferPostAppointment;

        let meetingSlots = [];
        currentTimeSlots.forEach((timeSlot) => {
          let { start, end } = timeSlot;
          let timeSlotDuration = (end - start) / 60000;
          let numMeetingSlots = Math.floor(
            timeSlotDuration / totalMeetingDuration
          );
          meetingSlots.push(start);
          for (let i = 0; i < numMeetingSlots - 1; i++) {
            meetingSlots.push(
              new Date(
                meetingSlots[meetingSlots.length - 1].getTime() +
                  totalMeetingDuration * 60000
              )
            );
          }
        });

        return meetingSlots;
      } else {
        return [];
      }
    },
  },
  methods: {
    async getMentor(instagram) {
      try {
        const response = await axios.get("/api/mentors/" + instagram);
        this.mentor = response.data;

        // Set the date strings to be date objects
        this.mentor.timeSlots = this.mentor.timeSlots.map((timeSlot) => {
          return {
            start: new Date(timeSlot.start),
            end: new Date(timeSlot.end),
          };
        });

        return true;
      } catch (error) {
        console.log(error);
      }
    },
    setCurrentDate(date) {
      this.currentDate = date;

      // Scroll the next section into view
      let cardAvailability = document.querySelector("#card-availability");
      cardAvailability.scrollIntoView();
    },
    iterateMonth(direction) {
      this.month = this.month + direction;

      if (this.month > 11) {
        this.year++;
        this.month = 0;
      } else if (this.month < 0) {
        this.year--;
        this.month = 11;
      }

      this.currentDate = null;
    },
    formatDateTime(date) {
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
  },
  watch: {
    currentDate() {},
  },
};
</script>

<style scoped>
.schedule-appointment {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 900px;
}

.user-icons {
  display: flex;
  justify-content: center;
  margin: 50px 0 20px 0;
}

.user-icon {
  width: 50px;
  border-radius: 50%;
  border: 2px solid #d6dbdf;
  box-shadow: 0 1px 8px 0 #ebedef;
  margin: 0 10px;
}

.user-icon:hover {
  /* border: 2px solid #b3e5fc; */
  cursor: pointer;
}

.card {
  display: flex;
  width: auto;
  box-shadow: 0 1px 8px 0 #ebedef;
  border: 1px solid #d6dbdf;
  border-radius: 25px;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  width: 100%;
}

.card-selection {
  display: flex;
  height: 550px;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 20px 50px;
  width: 400px;
}

.card-info-details {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-photo {
  width: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 2px solid #d6dbdf;
  box-shadow: 0 1px 8px 0 #ebedef;
}

.card-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
}

.calendar-arrows {
  display: flex;
  align-items: center;
  /* width: 100px; */
  justify-content: space-between;
}

#month-name {
  display: flex;
  justify-content: center;
  width: 180px;
  margin: 0 30px;
}

.calendar-arrow {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.calendar-arrow:hover {
  background-color: #eeeeee;
}

.inactive-arrow {
  color: #d6dbdf;
}

.inactive-arrow:hover {
  background-color: inherit;
  cursor: auto;
}

#date-time {
  margin: 10px 0 20px 0;
  text-align: center;
}
#calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.calendar-day {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
}
.calendar-date {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.option {
  background-color: #02c3991a;
  color: #02c39a;
  font-weight: bold;
  /* border: 1px solid #b3e5fc; */
}

.option:hover {
  background-color: #02c39a33;
  cursor: pointer;
}

.selected {
  /* background-color: #b3e5fc; */
  background-color: #02c39a;
  color: white;
  font-weight: bold;
}

.selected:hover {
  background-color: #02c39a;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

#card-availability {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

#card-availability h2 {
  margin-bottom: 20px;
}

.button {
  text-decoration: none;
  color: white;
  background-color: #02c39a;
  border-radius: 25px;
  width: 150px;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  margin: 5px;
  /* border: 2px solid #02c39a; */
}
.button:hover {
  /* background-color: #02c39a;
  transition: 0.2s; */
  cursor: pointer;
}

@media only screen and (max-width: 960px) {
  .schedule-appointment {
    width: auto;
  }
  .card-info {
    padding: 20px;
    width: 100%;
  }

  .card-selection {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .card {
    box-shadow: none;
    border: none;
    border-radius: 0;
    height: auto;
  }

  #card-availability {
    width: auto;
    padding: 0 20px;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  #date-time {
    font-size: 2em;
    font-weight: 900;
  }

  #open-slots {
    font-size: 2em;
    font-weight: 900;
  }
}

@media only screen and (max-width: 500px) {
  .card-calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    padding: 20px 20px;
  }

  #calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .calendar-day {
    width: 40px;
    height: 40px;
  }

  .calendar-date {
    width: 40px;
    height: 40px;
  }
}
</style>
