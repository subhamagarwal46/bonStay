exports.passwordValidator = (value) => {
  if (value.length < 13 && value.length > 4) {
    return true;
  }
  return false;
};

exports.startDateChecker = (value) => {
  if (new Date(value) >= new Date()) return true;
  return false;
};

exports.endDateChecker = (startDate, endDate) => {
  if (new Date(endDate) >= new Date(startDate)) return true;
  return false;
};

exports.noOfPersorChecker = (value) => {
  if (value > 0 && value < 6) return true;
  return false;
};

exports.noOfRoomsChecker = (value) => {
  if (value > 0 && value < 4) return true;
  return false;
};
