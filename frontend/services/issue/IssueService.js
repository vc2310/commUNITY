import React from 'react';
import { constants } from '../constants/constants'
export const createIssue = (formData) => {
  return new Promise((resolve, reject) => {
    fetch(constants.commUNITY_URI+'/v1/createIssue', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    }).then((response) => {
      console.log(response)
        if (response.status === 200){
          resolve(true)
        }
    }).catch((error) => {
        console.error(error);
    });

  })
}

export const upVoteIssue = (createdBy, issueID) => {
  var upvote = {createdBy: createdBy, issueID: issueID}
  return new Promise((resolve, reject) => {
    var body = JSON.stringify({upvote})
    fetch(constants.commUNITY_URI+'/v1/upVoteIssue', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => {
      console.log(response)
        if (response.status === 200){
          response.json().then((data)=>{
            resolve(data)
          })
        }
    }).catch((error) => {
        console.error(error);
    });

  })
}

export const downVoteIssue = (createdBy, issueID) => {
  var downvote = {createdBy: createdBy, issueID: issueID}
  return new Promise((resolve, reject) => {
    var body = JSON.stringify({downvote})
    fetch(constants.commUNITY_URI+'/v1/downVoteIssue', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => {
      console.log(response)
        if (response.status === 200){
          response.json().then((data)=>{
            resolve(data)
          })
        }
    }).catch((error) => {
        console.error(error);
    });

  })
}

export const commentIssue = (createdBy, issueID, text) => {
  var comment = {createdBy: createdBy, issueID: issueID, text: text}
  return new Promise((resolve, reject) => {
    var body = JSON.stringify({comment})
    fetch(constants.commUNITY_URI+'/v1/commentIssue', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => {
      console.log(response)
        if (response.status === 200){
          response.json().then((data)=>{
            resolve(data)
          })
        }
    }).catch((error) => {
        console.error(error);
    });

  })
}

export const changeStatus = (issueID, status) => {
  var issue = {issueID: issueID, status: status}
  return new Promise((resolve, reject) => {
    var body = JSON.stringify({issue})
    fetch(constants.commUNITY_URI+'/v1/statusIssue', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => {
      console.log(response)
        if (response.status === 200){
          response.json().then((data)=>{
            resolve(data)
          })
        }
    }).catch((error) => {
        console.error(error);
    });

  })
}

export const getIssues = (query) => {
  return new Promise((resolve, reject) => {
    var queryString = JSON.stringify({query: query})
    fetch(constants.commUNITY_URI+'/v1/getIssues/' + queryString, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((data)=>{
        resolve(data)
      })
    }).catch((error) => {
        console.error(error);
    });

  })
}

export const getIssue = (id) => {
  return new Promise((resolve, reject) => {
    fetch(constants.commUNITY_URI+'/v1/getIssue/'+id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((data)=>{
        resolve(data)
      })
    }).catch((error) => {
        console.error(error);
    });

  })
}
