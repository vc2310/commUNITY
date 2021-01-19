import React from "react";
import { View, TextInput, Alert } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { getUser, logout } from "../services/auth/AuthService"

class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor: '#03A9F4',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },

  };
  constructor(props) {
    super(props)
    this.state =  {
      email: 'my email',
      firstName: '',
      lastName: '',
      token: '',
      id: ''
    }
  }
  componentDidMount() {
    getUser().then((res)=> {
      res.user.email.then((email)=> {
        this.setState({email: email})})
      res.user.firstName.then((firstName)=> {
        this.setState({firstName: firstName})})
      res.user.lastName.then((lastName)=> {
        this.setState({lastName: lastName})})
      res.user.lastName.then((token)=> {
        this.setState({token: token})})

    })
  }
  render () {
    const profileText = (field) => {
      if (field == 'email'){
        getUser().then((res)=> {
          res.user.email.then((email)=> {
            console.log(email)
            return email
          })
        })
    }
    }
    return (
      <Container>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text>{this.state.firstName} {this.state.lastName}</Text>
      </View>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text>{this.state.email}</Text>
      </View>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Button danger onPress={()=> {logout().then(this.props.navigation.navigate("Login")).catch((error)=>{console.log(error)})}}>
            <Text>LogOut</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

export default Profile;
