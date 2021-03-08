const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
const PORT = 4000;
const fairyTalesRoutes = require('./routes/fairyTales');
const employeesRoutes = require('./routes/employees');
const teamsRoutes = require('./routes/teams');
const venuesRoutes = require('./routes/venues');
const eventsRoutes = require('./routes/events');
const db = require("./keys").mongoURI;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  db, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }
);
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// root endpoints
app.use('/fairyTales', fairyTalesRoutes);

app.use('/employees', employeesRoutes);

app.use('/teams', teamsRoutes);

app.use('/venues', venuesRoutes);

app.use('/events', eventsRoutes);

// listen
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});