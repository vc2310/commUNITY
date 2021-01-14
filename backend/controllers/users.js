import User from '../models/user';

export const login = (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email || !user.password) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

  User.findOne({email: user.email}).then((user)=>{
    if (!user){
      return res.status(400).json({
        errors: {
          message: "User does not exist."
        },
      });
    }
    if (user.validatePassword(req.body.user.password)){
      return res.json({ user: user.toAuthJSON() });
    } else{
      return res.status(400).json({
        errors: {
          message: "Incorrect email or password."
        },
      });
    }
  }, (error)=>{
    return res.status(500).json({
      errors: {
        message: error,
      },
    });
  })

};

export const signup = (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email || !user.firstName || !user.lastName || !user.address) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

  User.find({email: user.email}).then((users)=>{
    if (users.length > 0){
        return res.status(400).json({
          errors: {
            message: 'Email is taken. Please try logging in.',
          },
        });
    }
    const finalUser = new User(user);

    finalUser.setPassword(user.password);
    return finalUser.save().then((user)=>{
      res.json({user: finalUser.toAuthJSON()})
    }, (error)=>{
      console.log(error)
    })
  }, (error)=>{
    console.log(error)
  })
};
