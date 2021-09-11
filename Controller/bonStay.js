const { hotelModel, userModel, bookingModel } = require("../Models/dbConnect");
const validator = require("../Utils/validator");

exports.registerController = async function (req, res) {
  try {
    const trackUser = await userModel.find({ emailId: req.body.emailId });
    if (trackUser.length == 0) {
      const maxIndexUser = await userModel.find().sort({ userId: -1 });
      const newIndex =
        maxIndexUser.length == 0
          ? 1
          : Number(maxIndexUser[0].userId.split("-")[1]) + 1;
      req.body["userId"] =
        "U-" + "000".substring(0, 3 - ("" + newIndex).length) + newIndex;
      const newUser = await userModel.create(req.body);
      res.status(200).json({
        status: "success",
        data: {
          message: `Successfully registered with user id ${newUser.userId}`,
        },
      });
    } else {
      res.status(400).json({
        status: "error",
        data: {
          message: `User exists with this email id`,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: {
        message: error.message,
      },
    });
  }
};

exports.loginController = async function (req, res) {
  try {
    if (validator.passwordValidator(req.body.password)) {
      const currentUser = await userModel.findOne({
        userId: req.body.userId,
        password: req.body.password,
      });
      if (currentUser != null) {
        res.cookie("username", currentUser.name, {
          expires: new Date(),
          maxAge: 10000,
        });
        res.status(200).json({
          status: "success",
          data: {
            message: "Successfully logged in",
          },
        });
      } else {
        res.status(500).json({
          status: "success",
          data: {
            message: "Incorrect user id or password",
          },
        });
      }
    } else {
      res.status(400).json({
        status: "success",
        data: {
          message:
            "Enter a valid password with at least 8 and not more than 12 characters",
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: {
        message: error.message,
      },
    });
  }
};

exports.getAllHotels = async function (req, res) {
  try {
    const hotels = await hotelModel.find();
    res.status(200).json({
      status: "success",
      data: {
        hotels,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.addBookingByUser = async function (req, res) {
  try {
    if (validator.startDateChecker(req.body.startDate)) {
      if (validator.endDateChecker(req.body.startDate, req.body.endDate)) {
        if (validator.noOfPersorChecker(req.body.noOfPersons)) {
          if (validator.noOfRoomsChecker(req.body.noOfRooms)) {
            const isUserIdValid = await userModel.findOne({
              userId: req.params.userId,
            });

            if (isUserIdValid != null) {
              const isHotelNameValid = await hotelModel.findOne({
                hotelName: req.params.hotelName,
              });
              if (isHotelNameValid != null) {
                if (isUserIdValid.userBookings.length == 0) {
                  const maxIndexBooking = await bookingModel
                    .find()
                    .sort({ bookingId: -1 });
                  const currentIndex =
                    maxIndexBooking.length == 0
                      ? 1
                      : Number(maxIndexBooking[0].bookingId.split("-")[1]) + 1;
                  const currentBookingId =
                    maxIndexBooking.length == 0
                      ? "B-001"
                      : "B-" +
                        "000".substring(0, 3 - ("" + currentIndex).length) +
                        currentIndex;
                  req.body["bookingId"] = currentBookingId;
                  const booking = await bookingModel.create(req.body);
                  const updateData = {
                    hotelName: req.params.hotelName,
                    bookingId: booking.bookingId,
                  };
                  const updatedUserBookings = await userModel.findOneAndUpdate(
                    { userId: req.params.userId },
                    {
                      userBookings: [...isUserIdValid.userBookings, updateData],
                    },
                    {
                      new: true, //to return new doc back
                      runValidators: true, //to run the validators which specified in the model
                    }
                  );
                  res.status(201).json({
                    status: "success",
                    data: {
                      message: `Successfully made a booking with booking id ${booking.bookingId}`,
                    },
                  });
                } else {
                  let dateMatch = false;
                  for (let ele of isUserIdValid.userBookings) {
                    let bookHotel = await bookingModel.find({
                      bookingId: ele.bookingId,
                    });
                    if (
                      (new Date(req.body.startDate) >= bookHotel[0].startDate &&
                        new Date(req.body.startDate) <= bookHotel[0].endDate) ||
                      (new Date(req.body.endDate) >= bookHotel[0].startDate &&
                        new Date(req.body.endDate) <= bookHotel[0].endDate)
                    ) {
                      dateMatch = true;
                      break;
                    }
                  }
                  if (!dateMatch) {
                    const maxIndexBooking = await bookingModel
                      .find()
                      .sort({ bookingId: -1 });
                    const currentIndex =
                      maxIndexBooking.length == 0
                        ? 1
                        : Number(maxIndexBooking[0].bookingId.split("-")[1]) +
                          1;
                    const currentBookingId =
                      maxIndexBooking.length == 0
                        ? "B-001"
                        : "B-" +
                          "000".substring(0, 3 - ("" + currentIndex).length) +
                          currentIndex;
                    req.body["bookingId"] = currentBookingId;
                    const booking = await bookingModel.create(req.body);
                    const updateData = {
                      hotelName: req.params.hotelName,
                      bookingId: booking.bookingId,
                    };
                    const updatedUserBookings =
                      await userModel.findOneAndUpdate(
                        { userId: req.params.userId },
                        {
                          userBookings: [
                            ...isUserIdValid.userBookings,
                            updateData,
                          ],
                        },
                        {
                          new: true, //to return new doc back
                          runValidators: true, //to run the validators which specified in the model
                        }
                      );
                    res.status(201).json({
                      status: "success",
                      data: {
                        message: `Successfully made a booking with booking id ${booking.bookingId}`,
                      },
                    });
                  } else {
                    res.status(400).json({
                      status: "error",
                      data: {
                        message: `You have a booking on the same date`,
                      },
                    });
                  }
                }
              } else {
                res.status(400).json({
                  status: "error",
                  data: {
                    message: `Not a valid Hotel Name`,
                  },
                });
              }
            } else {
              res.status(400).json({
                status: "error",
                data: {
                  message: `Not a valid User Id`,
                },
              });
            }
          } else {
            res.status(400).json({
              status: "error",
              data: {
                message: `Number of rooms should be a valid number greater than 0 and less than or equal to 3`,
              },
            });
          }
        } else {
          res.status(400).json({
            status: "error",
            data: {
              message: `Number of Persons should be a valid number greater than 0 and less than or equal to 5`,
            },
          });
        }
      } else {
        res.status(400).json({
          status: "error",
          data: {
            message: `End Date should be a date greater than or equal to start date`,
          },
        });
      }
    } else {
      res.status(400).json({
        status: "error",
        data: {
          message: `Start Date should be a date greater than or equal to today`,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      data: {
        message: error.message,
      },
    });
  }
};

exports.updateBookingByUser = async function (req, res) {
  try {
    if (validator.startDateChecker(req.body.startDate)) {
      if (validator.endDateChecker(req.body.startDate, req.body.endDate)) {
        const user = await userModel.findOne({ userId: req.params.userId });
        if (user != null) {
          if (user.userBookings.length == 0) {
            res.status(500).json({
              status: "error",
              message: "No booking for this user id",
            });
          } else {
            const validBooking = user.userBookings.filter((ele) => {
              return ele.bookingId == req.body.bookingId;
            });
            if (validBooking.length == 0) {
              res.status(500).json({
                status: "error",
                message: "This booking id is invalid for this user",
              });
            } else {
              const bookingDetails = await bookingModel.findOneAndUpdate(
                { bookingId: req.body.bookingId },
                req.body,
                {
                  new: true, //to return new doc back
                  runValidators: true, //to run the validators which specified in the model
                }
              );
              if (bookingDetails != null) {
                res.status(200).json({
                  status: "success",
                  data: {
                    message: `Successfully rescheduled the booking with booking id ${req.body.bookingId}`,
                  },
                });
              } else {
                res.status(500).json({
                  status: "fail",
                  data: {
                    message: `Unkonown Error`,
                  },
                });
              }
            }
          }
        } else {
          res.status(500).json({
            status: "error",
            message: "User Id not vaid",
          });
        }
      } else {
        res.status(500).json({
          status: "error",
          data: {
            message: `End date should be a date greater than or equal to start date`,
          },
        });
      }
    } else {
      res.status(500).json({
        status: "error",
        data: {
          message: `Start date should be a date greater than or equal to today`,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteBooking = async function (req, res) {
  try {
    const user = await userModel.findOne({ userId: req.params.userId });
    if (user != null) {
      if (user.userBookings.length == 0) {
        res.status(400).json({
          status: "fail",
          data: { message: "No bookings corresponds to this user id" },
        });
      } else {
        const isValidBooking = user.userBookings.filter((ele) => {
          return ele.bookingId == req.params.bookingId;
        });
        if (isValidBooking.length != 0) {
          const deletedBooking = await bookingModel.deleteOne({
            bookingId: req.params.bookingId,
          });
          if (deletedBooking.deletedCount == 1) {
            let updatedUserBooking = [...user.userBookings];
            for (let u = 0; u < user.userBookings.length; u++) {
              if (user.userBookings[u].bookingId == req.params.bookingId) {
                updatedUserBooking.splice(u, 1);
                const updateduser = await userModel.findOneAndUpdate(
                  { userId: req.params.userId },
                  { userBookings: updatedUserBooking },
                  {
                    new: true, //to return new doc back
                    runValidators: true, //to run the validators which specified in the model
                  }
                );
                if (updateduser != null) {
                  res.status(200).json({
                    status: "success",
                    data: {
                      message: `Successfully deleted the booking with booking id ${req.params.bookingId}`,
                    },
                  });
                  break;
                } else {
                  res.status(400).json({
                    status: "fail",
                    data: { message: "Could not delete the booking" },
                  });
                }
              }
            }
          } else {
            res.status(400).json({
              status: "fail",
              data: { message: "Could not delete the booking" },
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            data: {
              message: "This booking id doesnot corresponds to this user id",
            },
          });
        }
      }
    } else {
      res.status(400).json({
        status: "fail",
        data: {
          message: "Invalid user Id",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getBookingsByUser = async function (req, res) {
  try {
    const user = await userModel.findOne({ userId: req.params.userId });
    if (user != null) {
      let bookingDetails = [];
      if (user.userBookings.length == 0) {
        res.status(200).json({
          status: "success",
          data: {
            message: "No Bookings done yet",
          },
        });
      } else {
        for (let i = 0; i < user.userBookings.length; i++) {
          const booking = await bookingModel.find({
            bookingId: user.userBookings[i].bookingId,
          });
          bookingDetails.push(booking);
        }
        res.status(200).json({
          status: "success",
          results: bookingDetails.length,
          data: {
            userBookings: bookingDetails,
          },
        });
      }
    } else {
      res.status(400).json({
        status: "error",
        data: {
          message: "Invalid user id",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.addReviews = async function (req, res) {
  try {
    const user = await userModel.findOne({ userId: req.params.userId });
    if (user != null) {
      const filteredBooking = user.userBookings.filter((ele) => {
        return ele.hotelName == req.body.hotelName;
      });
      debugger;
      if (filteredBooking.length > 0) {
        let isStayedComplete = false;
        for (let book of filteredBooking) {
          let bookDetail = await bookingModel.findOne({
            bookingId: book.bookingId,
          });
          if (bookDetail.endDate <= new Date()) {
            isStayedComplete = true;
            break;
          }
        }
        debugger;
        if (isStayedComplete) {
          const hotelDetail = await hotelModel.findOne({
            hotelName: req.body.hotelName,
          });
          const updatedReview = [...hotelDetail.reviews, req.body.review];
          let updatedHotelDetail = await hotelModel.create(
            { hotelName: req.body.hotelName },
            { reviews: updatedReview },
            { new: true, runValidators: true }
          );
          if (updatedHotelDetail != null) {
            res.status(200).json({
              status: "success",
              data: {
                message: `Successfully added the review for ${req.body.hotelName}`,
              },
            });
          } else {
            res.status(400).json({
              status: "fail",
              message: "Unknown Error",
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            message: "Cannot add a review until you stay at this hotel",
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          message: "Cannot add a review until you stay at this hotel",
        });
      }
    } else {
      res.status(400).json({
        status: "fail",
        message: "Invalid user id",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getReviewsByHotel = async function (req, res) {
  try {
    const reviews = await hotelModel.findOne(
      { hotelName: req.params.hotelName },
      { _id: 0, reviews: 1 }
    );
    if (reviews != null) {
      if (reviews.reviews.length == 0) {
        res.status(200).json({
          status: "success",
          data: { message: `No reviews added yet for ${req.params.hotelName}` },
        });
      } else {
        res.status(200).json({
          status: "success",
          result: reviews.reviews.length,
          data: { reviews },
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        data: { message: `${req.params.hotelName} is not a valid hotel` },
      });
    }
  } catch (error) {}
};

exports.logoutController = function (req, res) {
  res.clearCookie("username");
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

exports.defaultController = (req, res) => {
  res.json({ message: "No such path is present" });
};
