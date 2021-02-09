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
    upVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    downVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    status: {
      type: String,
      default: 'new'
    },
    comments: [
                [
                  {type: String},
                  {type: mongoose.Schema.Types.ObjectId,ref: 'Users'},
                  {type: Date}
                ]
              ]
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
        upVotes: this.upVotes,
        downVotes: this.downVotes,
        comments: this.comments,
        status: this.status
      };
};

export default mongoose.model('issue', issueSchema);
