import express from "express";

const app = express();

app.use("/", (req, res) => {
  res.json("Listing to Server");
});

app.listen(8080, () => {
  console.log("App is running");
});
