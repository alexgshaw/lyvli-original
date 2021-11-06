<template>
  <div class="schedule-appointment">
    <div class="card">
      <div class="card-selection">
        <div class="card-info">
          <img
            class="profile-photo"
            :src="user.profilePhoto"
            :alt="user.name"
          />
          <h1>Call with {{ user.name }}</h1>
          <div class="card-info-details">
            <h3>Duration: {{ user.duration }} minutes</h3>
            <h3>Cost: ${{ user.cost }}.00</h3>
          </div>
          <div class="card-info-summary">
            <p>{{ user.message }}</p>
          </div>
        </div>
        <!-- <div class="vert-div"></div> -->
        <div class="card-calendar">
          <h2 id="date-time">Select a Date &#38; Time</h2>
          <h3 id="month-name">{{ monthName }} {{ year }}</h3>
          <div class="calendar-arrows">
            <div class="calendar-arrow" @click="iterateMonth(-1)">
              <i class="fas fa-chevron-left"></i>
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
                  currentDate.fullDate.getTime() === date.fullDate.getTime()
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

      <!-- <div class="vert-div"></div> -->
      <!-- <div class="horizontal-div"></div> -->
    </div>
    <div class="card">
      <div id="card-availability">
        <h2>Open Time Slots</h2>
        <h3 class="default-message" v-if="timeSlots.length === 0">
          Select a Date
        </h3>
        <div v-else class="buttons">
          <router-link
            class="button"
            v-for="timeSlot in timeSlots"
            :key="formatDateTime(timeSlot)"
            :to="{
              name: 'ScheduleForm',
              params: { user: user, timeSlot: timeSlot }
            }"
          >
            {{ formatDateTime(timeSlot) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Schedule",
  data: function() {
    return {
      days: moment.weekdaysShort(),
      // startDayIndex: undefined,
      user: {},
      currentDate: null,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
  },
  created: function() {
    this.user = this.$root.$data.users.find(
      user => user.name === this.$route.params.id
    );
  },
  computed: {
    monthName() {
      return moment.months()[this.month];
    },
    filteredAvailibility() {
      return this.user.availability.filter(
        availabilityDate =>
          availabilityDate.year === this.year &&
          availabilityDate.month == this.month
      );
    },
    dates() {
      var date = new Date(this.year, this.month, 1);
      var dates = [];

      while (date.getMonth() == this.month) {
        dates.push({
          fullDate: new Date(date.getTime()),
          day: this.days[date.getDay()],
          option: false
        });
        date.setDate(date.getDate() + 1);
      }

      for (let availabilityDate of this.filteredAvailibility) {
        dates[availabilityDate.day - 1].option = true;
      }

      // this.startDayIndex = dates[0].fullDate.getDay();

      return dates;
    },
    startDayIndex() {
      return this.dates[0].fullDate.getDay();
    },
    dateToTimeSlots() {
      let dateToTimeSlots = {};
      this.user.availability.forEach(availabilitySlot => {
        const {
          year,
          month,
          day,
          startHour,
          startMin,
          endHour,
          endMin
        } = availabilitySlot;
        dateToTimeSlots[availabilitySlot.day] = {
          startHour: availabilitySlot.startHour,
          endHour: availabilitySlot.endHour,
          startTime: new Date(year, month, day, startHour, startMin),
          endTime: new Date(year, month, day, endHour, endMin)
        };
      });
      return dateToTimeSlots;
    },
    timeSlots() {
      if (Object.keys(this.dateToTimeSlots).length && this.currentDate) {
        const { startTime, endTime } = this.dateToTimeSlots[
          this.currentDate.fullDate.getDate() // TODO do we need to check if this.currentDate has been set?
        ];
        let minutes = (endTime - startTime) / 60000;
        let numSlots = Math.floor(minutes / this.user.duration);
        let slots = [startTime];
        for (let i = 0; i < numSlots - 1; i++) {
          slots.push(new Date(slots[i].getTime() + this.user.duration * 60000));
        }
        return slots;
      } else {
        return [];
      }
    }
  },
  methods: {
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
        hour12: true
      });
    }
  },
  watch: {
    currentDate() {}
  }
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
  border-radius: 10px;

  flex-direction: column;
  align-items: center;

  margin: 20px 0;
  width: 100%;
}

.card-selection {
  display: flex;
  height: 590px;
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
  margin-top: 10px;
  display: flex;
  width: 100px;
  justify-content: space-between;
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
  margin-bottom: 20px;
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
  font-weight: bold;
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
  background-color: #e1f5fe;
  /* border: 1px solid #b3e5fc; */
}

.option:hover {
  background-color: #b3e5fc;
  cursor: pointer;
}

.selected {
  /* background-color: #b3e5fc; */
  background-color: #29b6f6;
  color: white;
  font-weight: bold;
}

.selected:hover {
  background-color: #29b6f6;
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
  background-color: #29b6f6;
  border-radius: 10px;
  width: 150px;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  margin: 5px;
  /* border: 2px solid #29b6f6; */
}
.button:hover {
  /* background-color: #29b6f6;
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
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: bold;
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
