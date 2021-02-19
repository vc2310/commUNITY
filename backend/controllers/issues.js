import Issue from '../models/issue';
import User from '../models/user';
import mongoose from 'mongoose';
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export const getImage = (req, res, next) => {
  let filepath = path.join(__dirname + `/../images/${req.params.id}`);
  res.sendFile(filepath);
}
export const createIssueWithImage = (req, res, next) => {
  let upload = multer({storage: storage, fileFilter: imageFilter}).array('multiple_images', 10);

    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        // else if (...) // The same as when uploading single images

        var issue = JSON.parse(req.body.issue)
        var images = []
        req.files.map((img, index) => {
          images.push(img.filename)
        })
        issue.images = images
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
            images: issue.images,
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
    });
}

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
  var query = JSON.parse(req.params.query)
  query = query.query
  console.log(query)
  var finalQuery = {}
  if (query.createdBy){
    finalQuery["createdBy"] = query.createdBy
  }
  if (query.near){
    finalQuery["geometry"] = { $geoWithin:
       { $centerSphere: [ query.near.center, query.near.radius/ 3963.2 ] }
     }
  }
  if (query.address){
    finalQuery["address"] = query.address
  }
  console.log(finalQuery)
  return Issue.find(finalQuery)
    .then((issues) => {
      var json = issues.filter(issues => issues.toJSON());
      res.json({issues: json})
    }, (error)=>{
      return res.status(400).json({
        errors: {
          message: 'Issues not found',
        },
      });
    });
};

export const getIssue = (req, res, next) => {
  console.log(req.params.id)

  return Issue.findById(req.params.id)
    .then((issue) => {
      var comments = []
      if (issue.comments.length > 0){
        issue.comments.forEach((comment, index, array) => {
          User.findById(comment[1]).then((user)=>{
            var temp = comment
            temp[1] = user.firstName + " " + user.lastName
            comments.push(temp)
            if(index === array.length-1) {
              issue.comments = comments
              var json = issue.toJSON();
              res.json({issue: json})
            }
          })
        })
      }else{
        var json = issue.toJSON();
        res.json({issue: json})
      }
    }, (error)=>{
      return res.status(400).json({
        errors: {
          message: 'Issue not found',
        },
      });
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
      else if (issue.downVotes.includes(upvote.createdBy)){
          Issue.updateOne({_id: upvote.issueID}, {$pull: {downVotes: upvote.createdBy}}).then((issue)=>{
            Issue.findById(upvote.issueID).then((issue)=>{
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

export const downVoteIssue = (req, res, next) => {
  const { body: { downvote } } = req;
  console.log(downvote)
  if(!downvote.createdBy || !downvote.issueID) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

  User.findById(downvote.createdBy).then((users)=>{

    if (!users || users.length == 0){
        return res.status(400).json({
          errors: {
            message: 'User not found',
          },
        });
    }
    Issue.findById(downvote.issueID).then((issue)=>{
      if (issue.downVotes.includes(downvote.createdBy)){
          Issue.updateOne({_id: downvote.issueID}, {$pull: {downVotes: downvote.createdBy}}).then((issue)=>{
            Issue.findById(downvote.issueID).then((issue)=>{
              return res.json({issue: issue})
            }, (error)=>{
              console.log(error)
            });
          }, (error)=>{
            console.log(error)
          });
      }
      else if (issue.upVotes.includes(downvote.createdBy)){
          Issue.updateOne({_id: downvote.issueID}, {$pull: {upVotes: downvote.createdBy}}).then((issue)=>{
            Issue.findById(downvote.issueID).then((issue)=>{
              Issue.updateOne({_id: downvote.issueID}, {$push: {downVotes: [downvote.createdBy]}}).then((issue)=>{
                Issue.findById(downvote.issueID).then((issue)=>{
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
            }, (error)=>{
              console.log(error)
            });
          }, (error)=>{
            console.log(error)
          });
      }
      else{
        Issue.updateOne({_id: downvote.issueID}, {$push: {downVotes: [downvote.createdBy]}}).then((issue)=>{
          Issue.findById(downvote.issueID).then((issue)=>{
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

export const commentIssue = (req, res, next) => {
  const { body: { comment } } = req;
  console.log(comment)
  if(!comment.text || !comment.createdBy || !comment.issueID) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

  User.findById(comment.createdBy).then((users)=>{

    if (!users || users.length == 0){
        return res.status(400).json({
          errors: {
            message: 'User not found',
          },
        });
    }
    Issue.findById(comment.issueID).then((issue)=>{
      if (issue){
        const today = new Date();
        Issue.updateOne({_id: comment.issueID}, {$push: {comments: { $each: [[comment.text, comment.createdBy, today]], $position: 0}}}).then((issue)=>{
          Issue.findById(comment.issueID).then((issue)=>{
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
    });
  });
};

export const statusIssue = (req, res, next) => {
  const { body: { issue } } = req;
  console.log(issue)
  if(!issue.status || !issue.issueID) {
    return res.status(400).json({
      errors: {
        message: 'Missing fields.',
      },
    });
  }

    Issue.findById(issue.issueID).then((issueR)=>{
      if (issueR){
        console.log(issue.status)
        Issue.updateOne({_id: issue.issueID}, {$set: {status: issue.status}}).then((issueR)=>{
          Issue.findById(issue.issueID).then((issueR)=>{
            return res.json({issue: issueR})
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
    })
};
