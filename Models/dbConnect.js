const mongoose = require("mongoose");
const hotelSchema = require("./hotel");
const userSchema = require("./user");
const bookingSchema = require("./booking");

mongoose
  .connect("mongodb://localhost:27017/bonStay", {
    useNewUrlParser: "true",
  })
  .then(() => console.log("Db is connected"));

const hotelModel = mongoose.model("hotel", hotelSchema);
const userModel = mongoose.model("user", userSchema);
const bookingModel = mongoose.model("booking", bookingSchema);

module.exports = { hotelModel, userModel, bookingModel };
