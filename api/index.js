const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const User = require("./models/User");
const Place = require("./models/Place");

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173/",
    // origin: true,
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("Test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json("not found");
    }

    const checkPasswordCorrect = bcrypt.compare(password, user.password);

    if (!checkPasswordCorrect) {
      res.status(422).json("Incorrect password or email");
    }

    jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY, {}, (err, token) => {
      if (err) {
        throw err;
      } else {
        res.cookie("token", token).json(user);
      }
    });
  } catch (err) {
    res.status(422).json(err);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  // console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, userData) => {
      if (err) {
        throw err;
      } else {
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      }
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;

  const newName = "photo" + Date.now() + ".jpg";
  await download.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  // console.log(data);

  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;

    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photo: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    const places = await Place.find({ owner: id });

    res.json(places);
  });
});

app.get(`/places/:id`, async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.json(place);
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;

  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photo: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json(placeDoc);
    }
  });
});

app.get("/places", async (req, res) => {
  const place = await Place.find();
  res.json(place);
});

app.get("/place/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.json(place);
});

app.listen(4000, () => {
  console.log(`Listening on port 4000`);
});
