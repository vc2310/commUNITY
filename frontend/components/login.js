import React from "react";
import { View, TextInput, Alert } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import {login, signup} from "../services/auth/AuthService"
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from "./Home"

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
        login: true
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
    if (this.state.email !== '' && this.state.password !== ''){
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
      signup(this.state.email, this.state.password, this.state.firstName, this.state.lastName)
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
            height: "20%",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <View>
            <TextInput style={{color: "white"}}
            onChangeText={(email) => this.setState({email})}
            placeholder="Email" />
          </View>
          {!this.state.login &&
            <View>
              <TextInput style={{color: "white"}}
              onChangeText={(firstName) => this.setState({firstName})}
              placeholder="First Name" />

              <TextInput style={{color: "white"}}
              onChangeText={(lastName) => this.setState({lastName})}
              placeholder="Last Name" />
            </View>
          }
          <View>
            <TextInput style={{color: "white"}}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              placeholder="Password"
            />
          </View>
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

export default Login;
