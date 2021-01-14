import mongoose, { Schema } from 'mongoose';

// Define user schema
var userSchema = new Schema({
    firstName: String,
    lastName: String,
    address: String,
    email: String
});

// Export Mongoose model
export default mongoose.model('user', userSchema, "myCollection");