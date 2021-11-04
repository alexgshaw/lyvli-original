<template>
  <div class="schedule-appointment">
    <div class="card">
      <div class="card-info">
        <img class="profile-photo" :src="user.profilePhoto" :alt="user.name" />
        <h1>Call with {{ user.name }}</h1>
        <div class="card-info-details">
          <h3>Duration: {{ user.duration }} minutes</h3>
          <h3>Cost: ${{ user.cost }}.00</h3>
        </div>
        <div class="card-info-summary">
          <p>{{ user.message }}</p>
        </div>
      </div>
      <div class="vert-div"></div>
      <div class="card-calendar">
        <h2 id="date-time">Select a Date &#38; Time</h2>
        <h3 id="month-name">{{ month }}</h3>
        <div id="calendar">
          <div class="calendar-day" v-for="day in days">
            {{ day }}
          </div>
          <div class="calendar-day" v-for="blank in Array(startDayIndex)"></div>
          <div
            class="calendar-date"
            :class="{
              option: date.option,
              selected: currentDate === date
            }"
            v-on="date.option ? { click: () => setCurrentDate(date) } : {}"
            v-for="date in dates"
          >
            {{ date.date }}
          </div>
        </div>
      </div>
      <div class="vert-div"></div>
      <div id="card-availability">
        <h3 v-if="timeSlots.length === 0">Select a Date</h3>
        <a v-else class="button" v-for="timeSlot in timeSlots">
          {{ formatDateTime(timeSlot) }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ScheduleAppointment",
  props: {
    month: String,
    year: Number
  },
  data: function() {
    return {
      days: moment.weekdaysShort(),
      startDayIndex: undefined,
      user: {},
      currentDate: null
    };
  },
  created: function() {
    this.user = this.$root.$data.users.find(
      user => user.name === this.$route.params.id
    );
    for (let availabilityDate of this.user.availability) {
      this.dates[availabilityDate.day - 1].option = true;
    }
  },
  computed: {
    dayToColumn() {
      // TODO check if this can be replaced with this.days.indexOf(day)
      let dayToColumn = {};
      this.days.forEach((day, i) => {
        dayToColumn[day] = i;
      });
      return dayToColumn;
    },
    dates() {
      const monthIndex = moment.months().indexOf(this.month);
      var date = new Date(this.year, monthIndex, 1);
      var dates = [];

      while (date.getMonth() == monthIndex) {
        dates.push({
          date: date.getDate(),
          day: this.days[date.getDay()],
          option: false
        });
        date.setDate(date.getDate() + 1);
      }

      const startDay = dates[0].day;
      this.startDayIndex = this.dayToColumn[startDay];

      return dates;
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
          this.currentDate.date // TODO do we need to check if this.currentDate has been set?
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
    },
    log() {
      console.log("clicked");
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
    currentDate(newDate, oldDate) {}
  }
};
</script>

<style scoped>
.schedule-appointment {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  box-shadow: 0 1px 8px 0 #ebedef;
  border: 1px solid #d6dbdf;
  border-radius: 10px;
}

.vert-div {
  min-height: 100%;
  width: 1px;
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
/* .card-calendar #calendar .calendar-date:hover {
  background-color: #e1f5fe;
  border: 1px solid #b3e5fc;
  cursor: pointer;
} */

.option {
  background-color: #e1f5fe;
  border: 1px solid #b3e5fc;
}

.option:hover {
  background-color: #b3e5fc;
  cursor: pointer;
}

.selected {
  background-color: #b3e5fc;
}

#card-availability {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  width: 200px;
}

.button {
  text-decoration: none;
  color: white;
  background-color: #4fc3f7;
  border-radius: 10px;
  width: 150px;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  margin: 5px;
  border: 2px solid #29b6f6;
}
.button:hover {
  background-color: #29b6f6;
  transition: 0.2s;
  cursor: pointer;
}
</style>
