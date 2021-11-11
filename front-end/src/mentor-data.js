const mentors = [
  {
    email: "alexgshaw64@gmail.com",
    name: "Alex Shaw",
    photo: "/images/alex.jpg",
    instagram: "alexshaw8",
    phoneNumber: "(906) 281-8938",
    birthday: new Date(1997, 0, 16),
    price: 25,
    duration: 15,
    maxAppointments: 4,
    bufferPostAppointment: 5,
    reminderPreAppoinement: 5,
    timeSlots: [
      {
        start: new Date(2021, 10, 1, 10, 0),
        end: new Date(2021, 10, 1, 11, 30),
      },
      {
        start: new Date(2021, 10, 10, 17, 0),
        end: new Date(2021, 10, 10, 21, 0),
      },
      {
        start: new Date(2021, 10, 17, 18, 0),
        end: new Date(2021, 10, 17, 20, 0),
      },
    ],
  },
  {
    email: "kenzieeaston@gmail.com",
    name: "Kenzie Easton",
    photo: "/images/kenz.jpg",
    instagram: "kenz_east",
    phoneNumber: "(801) 913-7660",
    birthday: new Date(1999, 9, 15),
    price: 50,
    duration: 10,
    maxAppointments: 10,
    bufferPostAppointment: 5,
    reminderPreAppoinement: 15,
    timeSlots: [
      {
        start: new Date(2021, 10, 16, 16, 0),
        end: new Date(2021, 10, 16, 17, 0),
      },
      {
        start: new Date(2021, 10, 19, 14, 0),
        end: new Date(2021, 10, 19, 15, 15),
      },
      {
        start: new Date(2021, 10, 24, 10, 0),
        end: new Date(2021, 10, 24, 11, 30),
      },
      {
        start: new Date(2021, 10, 30, 11, 0),
        end: new Date(2021, 10, 30, 11, 30),
      },
    ],
  },
];

export default mentors;
