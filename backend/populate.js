import mongoose from 'mongoose';
// var mongoose = require("mongoose");
import User from './models/user';

const users = [
    {
        firstName: 'Pratyush',
        lastName: 'Bhandari',
        address: '138 Elbern Markell Dr',
        email: 'bhandarp@mcmaster.ca'
    },
    {
        firstName: 'Vaibhav',
        lastName: 'Chadha',
        address: '139 Elbern Markell Dr',
        email: 'vc2310@mcmaster.ca'
    },
    {
        firstName: 'Gazenfar',
        lastName: 'Syed',
        address: '140 Elbern Markell Dr',
        email: 'short@mcmaster.ca'
    },
    {
        firstName: 'Saad',
        lastName: 'Ali',
        address: '141 Elbern Markell Dr',
        email: 'saad@mcmaster.ca'
    },
    {
        firstName: 'Usman',
        lastName: 'Irfan',
        address: '142 Elbern Markell Dr',
        email: 'lover@mcmaster.ca'
    },
    {
        firstName: 'Faisal',
        lastName: 'Jaffer',
        address: '143 Elbern Markell Dr',
        email: 'expert@mcmaster.ca'
    },

];

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/user", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Connection Successful!");
});


// Go through each user
users.map(data => {
    // Initialize a model with user data
    const user = new User(data);
    // and save it into the database
    user.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted succussfully!");
    });
});