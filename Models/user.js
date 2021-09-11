const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  userId: { type: String, unique: true, required: [true, "Required fields"] },
  name: { type: String, required: [true, "Required fields"], minlength: 3 },
  address: { type: String },
  emailId: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          v
        );
      },
    },
  },
  phoneNo: {
    type: Number,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
    },
  },
  password: { type: String, required: true, minlength: 8, maxlength: 12 },
  userBookings: { type: Array },
});
