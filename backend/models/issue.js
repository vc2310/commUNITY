import mongoose, { Schema } from 'mongoose';

const issueSchema = new Schema({
    title: String,
    description: String,
    address: {
      city: String,
      province: String,
      country: String
    },
    geometry: {type: {type: String}, coordinates:[]},
    images: [{type: String}],
    createdBy: { // required
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    created: Date,
    upVotes: [{ // required
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
});

issueSchema.methods.setDate = function() {
    const today = new Date();
    this.created = today;
};

issueSchema.methods.toJSON = function() {
    return {
        id: this._id,
        title: this.title,
        description: this.description,
        address: this.address,
        geometry: this.geometry,
        images: this.images,
        createdBy: this.createdBy,
        created: this.created,
        upVotes: this.upVotes
      };
};

export default mongoose.model('issue', issueSchema);
