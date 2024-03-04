const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/registrationForm");
}

const port = process.env.PORT || 4000;

// registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });
  
  // model of registration schema
  const Registration = mongoose.model("Registration", registrationSchema);
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
  });
  
  app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await Registration.findOne({ email: email });
      // check for existing user
      if (!existingUser) {
        const registrationData = new Registration({
          name,
          email,
          password,
        });
        await registrationData.save();
        res.redirect("/success");
      }
      else{
          console.log("User already exist");
          res.redirect("/error");
      }
  
  
    } catch (error) {
      console.log(error);
      res.redirect("error");
    }
  });
  
  app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
  });
  app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
  });
  
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });

