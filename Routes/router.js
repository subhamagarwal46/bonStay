const express = require("express");
const router = express.Router();
const controller = require("../Controller/bonStay");

router.post("/register", controller.registerController);
router.post("/login", controller.loginController);
router.get("/hotels", controller.getAllHotels);
router.post("/bookings/:userId/:hotelName", controller.addBookingByUser);
router.put("/bookings/:userId", controller.updateBookingByUser);
router.delete("/bookings/:userId/:bookingId", controller.deleteBooking);
router.get("/bookings/:userId", controller.getBookingsByUser);
router.put("/reviews/:userId", controller.addReviews);
router.get("/reviews/:hotelName", controller.getReviewsByHotel);
router.get("/logout", controller.logoutController);
router.all("*", controller.defaultController);

module.exports = router;
