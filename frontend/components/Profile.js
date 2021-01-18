import React from "react";
import { View, TextInput, Alert } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {getUser} from "../services/auth/AuthService"

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
    this.state =  {user: {}}
  }
  componentDidMount() {
    getUser().then((res)=> {
      console.log(res)
      this.setState({res})
    })
  }
  render () {
    return (
      <Container>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text>{this.state.user.firstName}</Text>
      </View>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text>{this.state.user.email}</Text>

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
