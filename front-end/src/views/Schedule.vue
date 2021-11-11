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
        <!-- <div class="vert-div"></div> -->
        <div class="card-calendar">
          <h2 id="date-time">Select a Date &#38; Time</h2>
          <div class="calendar-arrows">
            <div class="calendar-arrow" @click="iterateMonth(-1)">
              <i class="fas fa-chevron-left"></i>
            </div>
            <div id="month-name">
              <h3>{{ monthName }} {{ year }}</h3>
            </div>
            <div class="calendar-arrow" @click="iterateMonth(1)">
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
        <h2>Open Time Slots</h2>
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
// TODO allow multiple time slots on the same date

import moment from "moment";
import axios from "axios";

export default {
  name: "Schedule",
  data: function () {
    return {
      days: moment.weekdaysShort(),
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
      return moment.months()[this.month];
    },
    filteredTimeSlots() {
      if (Object.keys(this.mentor).length != 0) {
        return this.mentor.timeSlots.filter((timeSlot) => {
          let date = new Date(timeSlot.start);
          return (
            date.getFullYear() === this.year && date.getMonth() == this.month
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

      for (let timeSlot of this.filteredTimeSlots) {
        let date = new Date(timeSlot.start);
        dates[date.getDate() - 1].option = true;
      }

      return dates;
    },
    startDayIndex() {
      return this.dates[0].fullDate.getDay();
    },
    dateToTimeSlots() {
      let dateToTimeSlots = {};
      if (Object.keys(this.mentor).length != 0) {
        this.mentor.timeSlots.forEach((timeSlot) => {
          let date = new Date(timeSlot.start);
          dateToTimeSlots[date.getDate()] = timeSlot;
        });
      }
      return dateToTimeSlots;
    },
    meetingSlots() {
      if (Object.keys(this.dateToTimeSlots).length && this.currentDate) {
        // TODO do we need to check if this.currentDate has been set?
        let { start, end } =
          this.dateToTimeSlots[this.currentDate.fullDate.getDate()];
        start = new Date(start);
        end = new Date(end);
        const timeSlotDuration = (end - start) / 60000;
        const totalMeetingDuration =
          this.mentor.duration + this.mentor.bufferPostAppointment;
        const numMeetingSlots = Math.floor(
          timeSlotDuration / totalMeetingDuration
        );
        let slots = [start];
        for (let i = 0; i < numMeetingSlots - 1; i++) {
          slots.push(
            new Date(slots[i].getTime() + totalMeetingDuration * 60000)
          );
        }
        return slots;
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
  max-width: 900px;
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

.active {
  border: 2px solid #81d4fa;
}

/* .active:hover {
  border: 2px solid #81d4fa;
} */

.card {
  display: flex;
  width: auto;
  /* TODO figure out a better way to do this */
  /* height: 590px; */
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

.vert-div {
  min-height: 100%;
  width: 1px;
  background-color: #d6dbdf;
}

.horizontal-div {
  min-width: 100%;
  height: 1px;
  background-color: #d6dbdf;
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

.card-info .card-info-details {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-info .card-info-summary {
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
  width: 150px;
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

.card-calendar #date-time {
  margin: 10px 0 20px 0;
}
.card-calendar #calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.card-calendar #calendar .calendar-day {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
}
.card-calendar #calendar .calendar-date {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.option {
  background-color: #02c39933;
  /* border: 1px solid #b3e5fc; */
}

.option:hover {
  background-color: #02c39a80;
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

@media only screen and (min-width: 501px) and (max-width: 960px) {
  .card-selection {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .vert-div,
  .horizontal-div {
    display: none;
  }

  .card {
    box-shadow: none;
    border: none;
    border-radius: 0;
    flex-direction: column;
    align-items: center;
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
}

/* @media only screen and (max-width: 600px) { */
@media only screen and (max-width: 500px) {
  .card-selection {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .card {
    box-shadow: none;
    border: none;
    border-radius: 0;
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .vert-div,
  .horizontal-div {
    display: none;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 20px;
    width: 100%;
  }

  .card-calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    padding: 20px 20px;
  }

  .card-calendar #calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .card-calendar #calendar .calendar-day {
    width: 40px;
    height: 40px;
  }

  .card-calendar #calendar .calendar-date {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  #card-availability {
    padding: 0 20px;
    width: auto;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .default-message {
    display: none;
  }
}
</style>
