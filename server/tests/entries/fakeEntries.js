const getWeekday = require("../../utils/getWeekday");

const entries = [
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 9, 1),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 9, 2),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 9, 3),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 9, 4),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 9, 31),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 8, 25),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 8, 27),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 9, 10),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 8, 20),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2019, 8, 21),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2018, 5, 20),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2018, 5, 21),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2018, 5, 1),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2018, 5, 30),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2018, 7, 10),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: new Date(2018, 7, 11),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: 0, atMidnight: true }),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: 3, atMidnight: true }),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: 6, atMidnight: true }),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: -7, atMidnight: true }),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: -10, atMidnight: true }),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: 7, atMidnight: true }),
  },
  {
    emotions: ["happy", "sad", "glad"],
    date: getWeekday({ day: 10, atMidnight: true }),
  },
];

module.exports = entries;
