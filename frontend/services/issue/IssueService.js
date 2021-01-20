import React from 'react';

export const createIssue = (issue) => {
  return new Promise((resolve, reject) => {
    var body = JSON.stringify({issue})
    fetch('http://localhost:3000/v1/createIssue', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
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
