import mongoose from "mongoose";
mongoose
  .connect("mongodb+srv://abhijeettrivedi3064:WzSNqoKL8GH3mmzm@cluster0.gpigejf.mongodb.net/student")
  .then(() => {
    console.log("MongoDB connection Successful");
  })
  .catch(() => {
    console.log("no connection");
  });
  