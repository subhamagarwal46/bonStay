const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      unique: true,
      required: [true, "Required fields"],
    },
    description: {
      type: String,
    },
    amenities: {
      type: String,
    },
    phoneNo: {
      type: Number,
      validator: {
        validated: function (v) {
          return /^\d{10}$/.test(v);
        },
      },
    },
    address: {
      type: String,
    },
    reviews: {
      type: Array,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
