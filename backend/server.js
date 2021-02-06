import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './router';
import bodyParser from 'body-parser';

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/commUNITYdev", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});

// Initialize http server
const app = express();

// Logger that outputs all requests into the console
app.use(morgan('combined'));

app.use(express.static(__dirname + '/public'));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

// Use v1 as prefix for all API endpoints
app.use('/v1', router);

const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
