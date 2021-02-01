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

    if (!users || users.length == 0){
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
      createdBy: issue.createdBy,
      geometry: {type: 'Point', coordinates: issue.geometry}
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

export const upVoteIssues = (req, res, next) => {
  const { body: { upvote } } = req;
  console.log(upvote)
  if(!upvote.createdBy || !upvote.issueID) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

  User.findById(upvote.createdBy).then((users)=>{

    if (!users || users.length == 0){
        return res.status(400).json({
          errors: {
            message: 'User not found',
          },
        });
    }
    Issue.findById(upvote.issueID).then((issue)=>{
      if (issue.upVotes.includes(upvote.createdBy)){
          Issue.updateOne({_id: upvote.issueID}, {$pull: {upVotes: upvote.createdBy}}).then((issue)=>{
            Issue.findById(upvote.issueID).then((issue)=>{
              return res.json({issue: issue})
            }, (error)=>{
              console.log(error)
            });
          }, (error)=>{
            console.log(error)
          });
      }
      else{
        Issue.updateOne({_id: upvote.issueID}, {$push: {upVotes: [upvote.createdBy]}}).then((issue)=>{
          Issue.findById(upvote.issueID).then((issue)=>{
            return res.json({issue: issue})
          }, (error)=>{
            console.log(error)
          });
        }, (error)=>{
          console.log(error)
              return res.status(400).json({
                errors: {
                  message: 'Something went wrong.',
                },
              });
        });
      }
    }, (error)=>{
        console.log(error)
        return res.status(400).json({
          errors: {
            message: 'Something went wrong.',
          },
        });
    });
  }, (error)=>{
    return res.status(400).json({
      errors: {
        message: 'User not found',
      },
    });
  })
};
