const getWeekday = ({ day, atMidnight }) => {
  const date = new Date();
  const weekday = date.getDay();
  const distance = day - weekday;

  date.setDate(date.getDate() + distance);

  if (atMidnight) {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};

module.exports = getWeekday;
