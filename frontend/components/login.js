import React from "react";
import { View, TextInput, Alert, StyleSheet } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import {login, signup} from "../services/auth/AuthService"
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from "./Home"
import LocationAutocomplete from '../components/LocationAutocomplete'

class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
    headerStyle: {
      backgroundColor: '#03A9F4',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },

  };
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        login: true,
        address: {city: '', province: '', country: ''}
    }
  }
  getSwitchLabel(type){
    if (type == 'main'){
      if (!this.state.login){
        return 'Sign Up'
      }
      return 'Login'
    }
    if (this.state.login){
      return 'Sign Up'
    }
    return 'Login'
  }
  submitDisabled(){
    if (this.state.login && this.state.email !== '' && this.state.password !== ''){
      return false
    }
    else if (!this.state.login && this.state.email !== ''
              && this.state.password !== '' && this.state.firstName !== ''
              && this.state.lastName !== '' && this.state.address.city !== ''
              && this.state.address.province !== '' && this.state.address.country !== ''){
        return false

    }
    return true
  }
  submit(){
    if (this.state.login){
      login(this.state.email, this.state.password)
      .then((res)=> {if (res){this.props.navigation.navigate("Home")}})
      .catch((error)=> {
        Alert.alert(error)
      })
    } else{
      signup(this.state.email, this.state.password, this.state.firstName, this.state.lastName, this.state.address)
      .then((res)=> {if (res){this.props.navigation.navigate("Home")}})
      .catch((error)=> {
        Alert.alert(error)
      })
    }
  }
  render () {

    return (
      <Container style={{ backgroundColor: "#1c2636" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <H1 style={{color: "white"}}>commUNITY</H1>
        </View>
        <View
          style={{
            height: "40%",
            alignItems: "center",
            flexDirection: "column",
            padding: "10%"
          }}
        >
          <View style={{width:'90%'}}>
            <TextInput style={styles.TextInputStyleClass}
            onChangeText={(email) => this.setState({email})}
            placeholder="Email" />
          </View>
          <View style={{width:'90%'}}>
            <TextInput style={styles.TextInputStyleClass}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              placeholder="Password"
            />
          </View>
          {!this.state.login &&
            <View style={{width:'90%'}}>
              <TextInput style={styles.TextInputStyleClass}
              onChangeText={(firstName) => this.setState({firstName})}
              placeholder="First Name" />

              <TextInput style={styles.TextInputStyleClass}
              onChangeText={(lastName) => this.setState({lastName})}
              placeholder="Last Name" />
              <LocationAutocomplete onSelect={(selected) => {
                var city = ''
                var province = ''
                var country = ''
                selected.context.map((item, index)=>{
                  if (item.id.includes('place')){
                    city = item.text
                  }
                  else if (item.id.includes('region')){
                    province = item.text
                  }
                  else if (item.id.includes('country')){
                    country = item.text
                  }

                })
                this.setState({address: {city: city, province: province, country: country}})
              }}/>
            </View>
          }
        </View>
        <View
          style={{
            height: "20%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
        <View>
          <Button disabled={this.submitDisabled()} onPress={()=> {this.submit()}}>
            <Text>{this.getSwitchLabel('main')}</Text>
          </Button>
        </View>
        <View>
          <Button danger onPress={()=> {this.setState({login: !this.state.login})}}>
            <Text>{this.getSwitchLabel('switch')}</Text>
          </Button>
        </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

  MainContainer :{
  // Setting up View inside content in Vertically center.
  justifyContent: 'center',
  flex:1,
  margin: 10
  },
  TextInputStyleClass:{
  textAlign: 'center',
  height: 50,
   borderWidth: 0,
   borderRadius: 10 ,
   backgroundColor : "#FFFFFF",
   fontWeight: "bold",

 },
 inputContainer: {
    paddingTop: '25%'
  },
 textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20
  }
});

export default Login;
