const express = require("express");
const users = require("./users.json");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/api/users", (req, res) => {
  res.send(users);
});

app.get("/api/users/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find((user) => user.name === name);
  res.send(user);
});

app.get("/api/available-dates/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find((user) => user.name === name);

  const today = new Date();
  let availabileDates = user.availability.filter((slot) => {
    let { year, month, day, startHour, startMin } = slot;
    return today < new Date(year, month, day, startHour, startMin);
  });

  res.send(availabileDates);
});

app.listen(3000, () => console.log("Server listening on port 3000..."));
