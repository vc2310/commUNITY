import React from 'react';

export const createIssue = (formData) => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/v1/createIssue', {
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
    fetch('http://localhost:3000/v1/upVoteIssue', {
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

export const getIssues = () => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/v1/getIssues', {
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
    fetch('http://localhost:3000/v1/getIssue/'+id, {
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
