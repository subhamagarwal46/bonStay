const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  noOfPersons: { type: Number, required: true },
  noOfRooms: { type: Number, required: true },
  typeOfRoom: { type: String, required: true },
});
