const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// const { adminAuth, userAuth } = require("./middleware/auth");
const bodyParser = require("body-parser"); 
const path = require('path');

const app = express();

const PORT = 8000;


app.use(express.json());
/*app.use(express.urlencoded({ extended: false }));*/

app.use(bodyParser.json());
// app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
// app.get("/basic", userAuth, (req, res) => res.send("User Route"));

const bookRoute = require('./routes/BookRoute');
const CategoryRoute = require('./routes/CategoryRoute');
const usersRoute = require('./routes/UserRoute');
const reviewRoute = require('./routes/ReviewRoute');
const cartRoute = require('./routes/CartRoute');
const orderRoute = require('./routes/OrderRoute');


mongoose.set('strictQuery', true);

const cors = require("cors");

app.use(cookieParser());

app.use(cors());

const dotenv = require("dotenv");

dotenv.config();

app.use(orderRoute);


mongoose
  .connect('mongodb://localhost:27017/cambookdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database ...");
  })
  .catch((err) => { 
    console.log(err);
  });

app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use( bookRoute);
app.use( CategoryRoute);
app.use('/api/users', usersRoute);
app.use( reviewRoute);
app.use( "/cart",cartRoute);
// app.use('/upload', uploadRoute);


 