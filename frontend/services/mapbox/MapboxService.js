import React from 'react';

export const searchLocationAutoComplete = (keyword) => {
  return new Promise((resolve, reject) => {
    var accessToken = 'pk.eyJ1IjoiZmFpc2FsbXVoNzg2IiwiYSI6ImNrODRucXg2YjBjMnAzbW1yNjZ3ZHNqd3oifQ.-BuJJq_CEkUXCMjeypdSdg'
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + keyword + '.json?'+ '&access_token=' + accessToken
          + '&autocomplete=true&limit=2&types=address&country=ca'
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      response.json().then((data)=>{
        resolve(data.features)
      })
    }).catch((error) => {
        console.error(error);
    });
  })
}
