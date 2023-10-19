import mongoose from "mongoose";

export async function connect() {
  mongoose
    .connect(process.env.MONGODB_URL!)
    .then(() => {
      console.log("Connected To Database");
    })
    .catch((error) => {
      console.log("Db Erroe : ", error);
    });
}
