import Issue from '../models/issue';
import User from '../models/user';
import mongoose from 'mongoose';

export const createIssue = (req, res, next) => {
  const { body: { issue } } = req;
  console.log(issue)
  if(!issue.title || !issue.description || !issue.address || !issue.createdBy) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

  User.findById(issue.createdBy).then((users)=>{
    if (users.length == 0){
        return res.status(400).json({
          errors: {
            message: 'User not found',
          },
        });
    }
    const issueObj = {
      title: issue.title,
      description: issue.description,
      address: issue.address,
      createdBy: issue.createdBy
    }
    const finalIssue = new Issue(issueObj);
    finalIssue.setDate();
    return finalIssue.save().then((issue)=>{
      res.json({issue: finalIssue.toJSON()})
    }, (error)=>{
      return res.status(400).json({
        errors: {
          message: 'Something went wrong.',
        },
      });
    })
  }, (error)=>{
    return res.status(400).json({
      errors: {
        message: 'User not found',
      },
    });
  })
};

export const getIssues = (req, res, next) => {
  const { body: { issue } } = req;

  return Issue.find()
    .then((issues) => {
      var json = issues.filter(issues => issues.toJSON());
      res.json({issues: json})
    });
};
