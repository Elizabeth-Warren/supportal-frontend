const isTimeslotInFuture = start => {
  const currentDateInEpoch = new Date().getTime() / 1000;
  return start >= currentDateInEpoch;
};

export default isTimeslotInFuture;
