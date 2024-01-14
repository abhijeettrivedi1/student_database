import mongoose from "mongoose";
mongoose
  .connect("mongodb+srv://abhijeettrivedi3064:pWwoEdyqvUCdvfeR@cluster0.gpigejf.mongodb.net/student")
  .then(() => {
    console.log("MongoDB connection Successful");
  })
  .catch(() => {
    console.log("no connection");
  });
  