const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const fairyTalesRoutes = require('./routes/fairyTales');
const employeesRoutes = require('./routes/employees');
const teamsRoutes = require('./routes/teams');
const venuesRoutes = require('./routes/venues');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/skrzat-app-db', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// root endpoints
app.use('/fairyTales', fairyTalesRoutes);

app.use('/employees', employeesRoutes);

app.use('/teams', teamsRoutes);

app.use('/venues', venuesRoutes);

// listen
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});