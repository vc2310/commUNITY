import React from 'react';
import { AsyncStorage } from 'react-native';

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    var user = {
      email: email,
      password: password,
    }
    var body = JSON.stringify({user})
    console.log(body)
    fetch('http://localhost:3000/v1/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => {
      console.log(response.status)
      if (response.status === 200){
        //save token
        response.json().then((data)=>{
          try{
            AsyncStorage.setItem('email', data.user.email)
            AsyncStorage.setItem('firstName', data.user.firstName)
            AsyncStorage.setItem('lastName', data.user.lastName)
            AsyncStorage.setItem('token', data.user.token)
            AsyncStorage.setItem('id', data.user._id)
          } catch(error){
            console.log(error)
          }
          console.log(data.user)
        })
        resolve(true)
      }
      else{
        response.json().then((data)=>{
          reject(data.errors.message)
        })
      }
    }).catch((error) => {
        console.error(error);
    });
  })
}

export const signup = (email, password, firstname, lastname) => {
  return new Promise((resolve, reject) => {
    var user = {
      email: email,
      password: password,
      firstName: firstname,
      lastName: lastname,
      address: {}
    }
    console.log(user)
    var body = JSON.stringify({user})
    console.log(body)
    fetch('http://localhost:3000/v1/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => {
      console.log(response.status)
      if (response.status === 200){
        //save token
        response.json().then((data)=>{
          try{
            AsyncStorage.setItem('email', data.user.email)
            AsyncStorage.setItem('firstName', data.user.firstName)
            AsyncStorage.setItem('lastName', data.user.lastName)
            AsyncStorage.setItem('token', data.user.token)
            AsyncStorage.setItem('id', data.user._id)
          } catch(error){
            console.log(error)
          }
          console.log(data.user)
        })
        resolve(true)
      }
      else{
        response.json().then((data)=>{
          reject(data.errors.message)
        })
      }
    }).catch((error) => {
        console.error(error);
    });
  })
}

export const logout = async() => {
  return new Promise((resolve, reject) => {
    console.log('logging out')
    try{
      AsyncStorage.removeItem('email')
      AsyncStorage.removeItem('firstName')
      AsyncStorage.removeItem('lastName')
      AsyncStorage.removeItem('token')
      AsyncStorage.removeItem('id')
      resolve(true)
    } catch(error){
      reject(error)
    }
  })
}

export const getUser = async() => {
  return new Promise((resolve, reject) => {
    try{

      var user = {
        email: '',
        firstName: '',
        lastName: '',
        token: '',
        id: ''
      }
      AsyncStorage.getItem('email').then((email)=>{user.email = email})
      AsyncStorage.getItem('firstName').then((firstName)=>{user.firstName = firstName})
      AsyncStorage.getItem('lastName').then((lastName)=>{user.lastName = lastName})
      AsyncStorage.getItem('token').then((res)=>{user.token = res})
      AsyncStorage.getItem('id').then((res)=>{user.id = res})
      resolve({user: {
        email: AsyncStorage.getItem('email'),
        firstName: AsyncStorage.getItem('firstName'),
        lastName: AsyncStorage.getItem('lastName'),
        token: AsyncStorage.getItem('token'),
        id: AsyncStorage.getItem('id')
      }})
    } catch(error){
      reject(error)
    }
  })
}

export const isLoggedIn = async() => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('token').then((token)=>{
      if (token){
        resolve(true)
      }
      resolve(false)
    }).catch((error)=> reject(error))
  })
}
