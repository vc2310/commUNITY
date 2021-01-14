import User from '../models/user';

export const getResult = (req, res, next) => {
    // Find all users and return json response
    User.find().lean().exec((err, users) => res.json(
        // Iterate through each user
        {
            users: users.map(user => ({
                ...user
            }))
        }
    ));
};

export const postResult = (req, res, next) => {
    const user = new User(req.body);

    // and save it into the database
    user.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted succussfully!");
    });
    res.sendStatus(200);
};