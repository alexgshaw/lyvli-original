const express = require("express");
const mentors = require("./mentors.json");

function splitTimeSlot(appointment, timeSlot, mentor) {
  /**
   * This function assumes the appointment will always fall within the given timeSlot
   */

  newTimeSlots = [
    {
      start: timeSlot.start,
      end: appointment.start,
    },
    {
      start: new Date(
        appointment.end.getTime() + mentor.bufferPostAppointment * 60000
      ),
      end: timeSlot.end,
    },
  ];

  const totalMeetingDuration = mentor.duration + mentor.bufferPostAppointment;

  // TODO rework this filter to account for  the appointment being the last in the time slot
  // (don't need to worry about buffer in that case)
  return newTimeSlots.filter((timeSlot) => {
    let start = new Date(timeSlot.start);
    let end = new Date(timeSlot.end);
    return (end - start) / 60000 >= totalMeetingDuration;
  });
}

function updateTimeSlots(appointment) {
  const mentor = mentors.find((mentor) => {
    return mentor.instagram === appointment.mentorInstagram;
  });

  let { start, end } = appointment;
  start = new Date(start);
  end = new Date(end);

  const timeSlot = mentor.timeSlots.find((timeSlot) => {
    return new Date(timeSlot.start) <= start && new Date(timeSlot.end) >= end;
  });

  newTimeSlots = splitTimeSlot(appointment, timeSlot, mentor);

  let oldIndex = mentor.timeSlots.findIndex(
    (oldTimeSlot) =>
      new Date(oldTimeSlot.start).getTime() ===
      new Date(timeSlot.start).getTime()
  );

  mentor.timeSlots.splice(oldIndex, 1, ...newTimeSlots);
}

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

let appointments = [];
let id = 0;

app.get("/api/mentors", (req, res) => {
  let getProperties = function ({
    email,
    name,
    photo,
    instagram,
    price,
    duration,
    maxAppointments,
  }) {
    return {
      email,
      name,
      photo,
      instagram,
      price,
      duration,
      maxAppointments,
    };
  };

  const mappedMentors = mentors.map(getProperties);

  res.send(mappedMentors);
});

app.get("/api/mentors/:instagram", (req, res) => {
  const instagram = req.params.instagram;
  let mentor = Object.assign(
    {},
    mentors.find((mentor) => mentor.instagram === instagram)
  );

  const today = new Date();
  mentor.timeSlots = mentor.timeSlots.filter((timeSlot) => {
    return today < new Date(timeSlot.start);
  });

  res.send(mentor);
});

app.get("/api/available-dates/:instagram", (req, res) => {
  const instagram = req.params.instagram;
  const mentor = mentors.find((mentor) => mentor.instagram === instagram);

  const today = new Date();
  let availabileDates = mentor.timeSlots.filter((timeSlot) => {
    return today < new Date(timeSlot.start);
  });

  res.send(availabileDates);
});

app.post("/api/create-appointment", (req, res) => {
  let appointment = {
    id: id,
    mentorInstagram: req.body.mentorInstagram,
    mentee: {
      name: req.body.menteeName,
      email: req.body.menteeEmail,
      phone: req.body.menteePhone,
      age: req.body.menteeAge,
      message: req.body.menteeMessage,
    },
    start: new Date(req.body.start),
    end: new Date(req.body.end),
  };

  appointments.push(appointment);

  updateTimeSlots(appointment);

  id++;

  console.log(appointments);

  res.send(appointment);
});

app.listen(3000, () => console.log("Server listening on port 3000..."));
