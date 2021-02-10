import React from 'react';
import { AsyncStorage } from 'react-native';
import { constants } from '../constants/constants'

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    var user = {
      email: email,
      password: password,
    }
    var body = JSON.stringify({user})
    console.log(body)
    fetch(constants.commUNITY_URI+'/v1/login', {
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
          console.log(data)
          try{
            AsyncStorage.setItem('email', data.user.email)
            AsyncStorage.setItem('firstName', data.user.firstName)
            AsyncStorage.setItem('lastName', data.user.lastName)
            AsyncStorage.setItem('token', data.user.token)
            AsyncStorage.setItem('city', data.user.address.city)
            AsyncStorage.setItem('province', data.user.address.province)
            AsyncStorage.setItem('country', data.user.address.country)
            AsyncStorage.setItem('id', data.user._id)
            if (data.user.isCM){
              AsyncStorage.setItem('isCM', '1')
            }else{
              AsyncStorage.setItem('isCM', '0')
            }
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

export const signup = (email, password, firstname, lastname, address, isCM) => {
  return new Promise((resolve, reject) => {
    var user = {
      email: email,
      password: password,
      firstName: firstname,
      lastName: lastname,
      address: address,
      isCM: isCM
    }
    console.log(user)
    var body = JSON.stringify({user})
    console.log(body)
    console.log(constants.commUNITY_URI);
    fetch(constants.commUNITY_URI+'/v1/signup', {
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
            AsyncStorage.setItem('city', data.user.address.city)
            AsyncStorage.setItem('province', data.user.address.province)
            AsyncStorage.setItem('country', data.user.address.country)
            AsyncStorage.setItem('id', data.user._id)
            if (data.user.isCM){
              AsyncStorage.setItem('isCM', '1')
            }else{
              AsyncStorage.setItem('isCM', '0')
            }
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
      AsyncStorage.removeItem('city')
      AsyncStorage.removeItem('province')
      AsyncStorage.removeItem('country')
      AsyncStorage.removeItem('id')
      AsyncStorage.removeItem('isCM')
      resolve(true)
    } catch(error){
      reject(error)
    }
  })
}

export const getUser = async() => {
  return new Promise((resolve, reject) => {
    try{
      resolve({user: {
        email: AsyncStorage.getItem('email'),
        firstName: AsyncStorage.getItem('firstName'),
        lastName: AsyncStorage.getItem('lastName'),
        token: AsyncStorage.getItem('token'),
        address: {
          city: AsyncStorage.getItem('city'),
          province: AsyncStorage.getItem('province'),
          country: AsyncStorage.getItem('country')
        },
        id: AsyncStorage.getItem('id'),
        isCM: AsyncStorage.getItem('isCM'),
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
